---
slug: challenges-of-building-multi-cloud
title: Challenges of building multi cloud
authors: [jcoelho]
tags: [multi-cloud, aws, azure, gpc, terraform, pulumi]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Why Multi-Cloud

Multi cloud has long been a contentious topic when you talk about cloud infrastructure. 
Tools such as Terraform have made deploying to any cloud much easier - you can now use a single interface to deploy infrastructure to virtually any cloud environment. 
However, the effort of creating infrastructure for each cloud provider requires significant expertise and time to get right. 

In this blog post, we'll go over the current options companies have when deploying cloud infrastructure and the common pitfalls.

<!--truncate-->

## Building in a single cloud provider

While running on a single cloud is a popular choice, it brings its own sets of challenges. 

**Cost:** As your application grows, so does cost. The decisions that were made years ago about picking cloud providers and services might not the best fit for the requirements now. Pricing increases can happen at any time leaving you without many options. **In the span of 3 months, two major providers make pricing announcements: [GCP pricing increases up 50%](https://techcrunch.com/2022/03/14/inflation-is-real-google-cloud-raises-its-storage-prices) and [DigitalOcean 20% price increase](https://www.fool.com/investing/2022/05/16/digitalocean-first-price-increase-20-percent/)**.

**Customer Requirements:** Your initial customer base is likely to grow in ways you're not expecting, which will present a different set of challenges. Say you are running on AWS and want to expand into Switzerland (where AWS currently does not have a region). Data privacy laws mean you would not be able to support those customers. Same goes for other requirements, such as a business only being compliant to partner with companies running on Azure. **Early decisions can prevent you from expanding into future markets/customers**. **ADD DORA**

**Resilience:** When AWS has an outage (or [three](https://www.zdnet.com/article/aws-suffers-third-outage-of-the-month/)...), the world notices. Another recent infamous example was when Heroku blocked you from deploying from GitHub for [several weeks](https://www.theregister.com/2022/05/04/heroku_security_communication_dubbed_complete/). **When you depend on a single provider, you don't have much say when services will be back to normal**. 


## Current Options

There are a few options to consider when building out your infrastructure. These decisions are made early on and are very costly to change later down the road. 

### Build in Native Cloud

There are two main choices when building out infrastructure in a single provider: use managed services, or run the infrastructure yourself. As an example, let's focus on the database layer.

You can easily create a virtual machine in any cloud provider, install your database engine of choice and start storing data. While getting started is easy, soon you'll start running into other challenges. How will the database scale? How can I do cheap backups? How do I set up some read replicas? By building this yourself, most of the responsibility lands on you to manage and maintain the infrastructure. The upside is that you can customise that infrastructure as you wish and are not tied to that cloud provider. 

When looking at managed services, in a matter of minutes you can spin up an enterprise grade database with most features developers and devops engineers need without having to re-invent the wheel. You can instantly leverage features out of the box and focus on building the application. While this allows you to get up and running quickly, you are now stuck with that cloud provider and will not be able to easily move off of it.

### Build on Open Source

Open source tools have been increasing significantly in popularity because of their developer focus, portability and infrastructure freedom. Kubernetes has become the *de facto* container orchestration system that is supported by all the major cloud providers. 

Cloud providers offer managed kubernetes clusters, so you can let them do a lot of the heavy-lifting when it comes to scalability and management. You have some degree of lock-in, but by using Kubernetes, the price of migration decreases when compared to other managed compute solutions offered by cloud providers. 

The challenge that remains then is where you choose to run the rest of the infrastructure. While you can choose to run your database, storage, caching within the cluster, you will find that option to be more expensive and painful to maintain. If instead you opt to use managed services, you increase your lock-in through the infrastructure setup and coding layer. 

### Build with Multy

[Multy](https://multy.dev) takes a different approach to this issue. It gives you the flexibility to use managed services within each cloud, allowing you to build faster, but it also allows your infrastructure to remain flexible and move from one provider to another. With Multy, you create a multy resource, specify the input parameters as well as a `cloud` parameter. Multy will then deploy that resource into the selected cloud. 

Here is an example of a `virtual_network` resource with Terraform (infrastructure as code tool):

<Tabs>
   <TabItem value="multy" label="Multy" default>

```hcl
resource "multy_virtual_network" "example_vn" {
  name       = "test_vm"
  cidr_block = "10.0.0.0/16"
  location   = "eu_west_1"
  cloud      = "aws"
}
resource "multy_subnet" "example_subnet" {
  name               = "test_vm"
  cidr_block         = "10.0.10.0/24"
  virtual_network_id = multy_virtual_network.vn.id
}
``` 

 </TabItem>

  <TabItem value="aws" label="AWS">

If building a `virtual_network` on AWS

```hcl
resource "aws_vpc" "example_vn" {
  tags              = { "Name" = "example_vn" }
  cidr_block        = "10.0.0.0/16"
}
resource "aws_subnet" "example_subnet" {
  tags              = { "Name" = "example_subnet" }
  cidr_block        = "10.0.2.0/24"
  vpc_id            = aws_vpc.example_vn.id
}
```

  </TabItem>
  <TabItem value="azure" label="Azure">

If building a `virtual_network` on Azure

```hcl
resource "azurerm_resource_group" "example_rg" {
  name     = "example-rg"
  location = "northeurope"
}
resource "azurerm_virtual_network" "example_vn" {
  resource_group_name = azurerm_resource_group.vn-rg.name
  name                = "example_vn"
  location            = "ukwest"
  address_space       = ["10.0.0.0/16"]
}
resource "azurerm_subnet" "example_subnet" {
  resource_group_name  = azurerm_resource_group.example_rg.name
  name                 = "example_subnet"
  address_prefixes     = ["10.0.2.0/24"]
  virtual_network_name = azurerm_virtual_network.example_vn.name
}
``` 

 </TabItem>
</Tabs>

In this example, if you wanted to move these two resources to `azure` instead, only the `cloud` parameter needs to be changed and the infrastructure will be recreated. 

There are several benefits to this approach: 

**Portability:** Infrastructure will now be easily movable without having to be re-written. 

**Barrier to entry:** Move faster by not having to go through documentation from several providers and hiring specialists for each cloud. Let Multy abstract the nuances and complexities between providers. 

**Easy cross cloud:** Integrate multiple clouds easily by letting Multy handle the cross-cloud coomplexities.

:::note

To learn more about Multy:<br/>
Multy website - [https://multy.dev](https://multy.dev?ref=multi-cloud-blog)<br/>
Open-source GitHub - [https://github.com/multycloud/multy](https://github.com/multycloud/multy).

Join the discussion on our [discord channel](https://discord.gg/rgaKXY4tCZ)!

:::

<details open className="clean">
<summary className="cleanHeader">More about Multy</summary>
<div>

Multy website - [https://multy.dev](https://multy.dev?ref=multi-cloud-blog)<br/>
Open-source GitHub - [https://github.com/multycloud/multy](https://github.com/multycloud/multy).

Join the discussion on our [discord channel](https://discord.gg/rgaKXY4tCZ)!

</div>
</details>

Learn more about Multy by visiting the [website](https://multy.dev?ref=multi-cloud-blog). The engine is open-source and available on [GitHub](https://github.com/multycloud/multy). For any question, join the conversation on [discord](https://discord.gg/rgaKXY4tCZ).

## Summary

Multi-cloud is hard. When you're starting out, often times the most important thing is speed, but the decisions you make when getting started can become prohibitively expensive to reverse in the future. Whether because of costs increasing, new customer requirements, incoming legislation or need for a robust disaster recovery plan, the ability to run on any cloud has seen a significant interest. 

At Multy, we are solving these challenges by offering an **open-source tool that makes it easy to run on any cloud**. To learn more about [Multy](https://multy.dev), join the waitlist to be kept informed. Continue the discussion in our [discord channel](https://discord.gg/rgaKXY4tCZ)

---
slug: iac-comparison
title: Terraform vs Pulumi vs CloudFormation
authors: [jcoelho]
tags: [iac, aws, terraform, pulumi, cloudformation]
---

## Overview

When getting started, using an Infrastructure as Code (Iac) tool might seem overkill, and something that will slow down development. Building and deploying manually is often the way to go early stage - infrastructure changes constantly and having to re-write your configuration can be a pointless exercise until you have a better understanding of the fundamental pieces of your infrastructure.

However, most infrastructures get to a point where manual deployments and resource definition start actually slowing you down. Manual deployments, having to create copies for each environment or having dozens of developers deploying changes to code/infrastructure - these are all things that can lead to mistakes, downtime or even loss of data.

In this blog post, we'll take a look at the current IaC landscape, current tools and how they compare against each other.

## IaC landscape

There are a lot of different IaC tools out there, solving different sets of challenges. Let's take a look at some of the most popular alternatives and what makes them stand out.

### Terraform

[Terraform](https://www.terraform.io/) is one of the most popular IaC tools out there. From small startups to enterprises, it's used to deploy into nearly every cloud provider out there. This includes not just the major cloud providers (Amazon Web Services, Microsoft Azure or Google Cloud Platform), but also other cloud providers such as Cloudflare, Auth0 and MongoDB.

By maintaining the infrastructure state, it's also able to destroy environments and detect changes that happen outside the standard Terraform deployments. There are countless add-on tools to Terraform to complement your infrastructure definition. From tools such as [Terragrunt](https://terragrunt.gruntwork.io/) that help you maintain your code and [Checkov](https://www.checkov.io/) for security analysis.

Terraform uses a declarative language, Hashicorp Configuration Language (HCL), which is straightforward to learn and use. It's a very readable language that makes configuring new resources simple. They offer easy ways to get started through [Modules](https://registry.terraform.io/browse/modules), encapsulating a common set of resources into a single module. With Terraform, it is also easy to manage larger projects, allowing you to easily reuse files for different environments and purposes.

Here is an example of deploying an AWS virtual network using Terraform:

```hcl
resource "aws_vpc" "example_vn" {
  tags              = { "Name" = "example_vn" }
  cidr_block        = "10.0.0.0/16"
}
```

### Pulumi

Similar to Terraform, [Pulumi](https://www.pulumi.com/) also allows you to build and deploy infrastructure into any cloud. Instead of HCL, Pulumi allows you to use common programming languages like Python, Javascript or Golang. This means a lower barrier to entry if you are familiar with those coding languages and the ability to use it alongside the rest of your code base. It also means that you can use common testing and other frameworks as you develop your coding infrastructure. When compared to HCL, operations such as for loops and resource references are much more straightforward.

In terms of community, Pulumi is not quite as popular as Terraform, which also benefits from more extensive documentation. It's also important to note that Terraform is also working on a new product that is very similar to Pulumi's offering called [Cloud Development Kit](https://www.terraform.io/cdktf) (CDK). Though this is still in early days, it'll eventually become a strong competitor to Pulumi.

Here is an example of deploying an AWS virtual network using Pulumi:

```js
import * as awsx from "@pulumi/awsx";

const vpc = new awsx.ec2.Vpc("custom", {
  cidrBlock: "10.0.0.0/16",
  tags: { Name: "example_vn" },
});
```

### AWS CloudFormation

CloudFormation is the odd one out compared to Terraform and Pulumi. Out of the three, it's the only one that's built for a single provider, AWS. That comes with its pros and cons.

The obvious downside is that, with CloudFormation, you can mostly only deploy AWS resources. While with [CloudFormation Registry](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html) you can now deploy third-party resources, the options are severely limited when compared to the other infrastructure tools. Other disadvantages with CloudFormation are the fact that it's written in YAML, making it very hard to read and often times leads to having configuration files with thousands of lines. It also means simple functions and resource references becomes hard to easily implement.

The benefits of CloudFormation are mostly its extensive set of examples and its common use throughout the AWS ecosystem such as [SAM](https://aws.amazon.com/serverless/sam/) and [Landing Zone](https://aws.amazon.com/solutions/implementations/aws-landing-zone/)

Here is an example of deploying an AWS virtual network using CloudFormation:

```yaml
Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: "10.0.0.0/16"
      Tags:
        - Key: Name
          Value: example_vn
```

## Comparison

|                  | Terraform                                          | Pulumi                                                  | CloudFormation                                                   |
|------------------|----------------------------------------------------|---------------------------------------------------------|------------------------------------------------------------------|
| Organisation     | Hashicorp                                          | Pulumi                                                  | Amazon Web Services                                              |
| Open Source      | Yes                                                | Yes                                                     | No                                                               |
| Pricing          | Free up to 5 users                                 | Free for 1 user                                         | Free                                                             |
| Language         | HCL                                                | [Several](https://www.pulumi.com/docs/intro/languages/) | YAML / JSON                                                      |
| Pros             | Market leader; Deploy to any cloud; Scalable code; | Familiar coding languages; Deploy to any cloud;         | AWS integration                                                  |
| Cons             | HCL can be limiting                                | Smaller community; Documentation is lacking             | Mostly only supports AWS                                         |
| Usability        | Must learn HCL but small barrier to entry          | Familiar programming tools                              | Familiar YAML/JSON but quickly becomes hard to read and maintain |
| State management | Stored locally (free) or via Terraform Cloud       | Stored in cloud account                                 | Stored in AWS Account                                            | 

## Summary

There is no shortage of options nowadays to deploy your infrastructure. While we covered Terraform, Pulumi and CloudFormation, there are many others such as Puppet, Chef and Ansible to automate infrastructure. While there isn't a one-size-fits-all, and each use case will require different tools, there are some that stand out.

CloudFormation can't really compete with the current available IaC offerings in the market. Even when only using AWS, the alternatives are more powerful and allow you to more easily build your infrastructure. Between Terraform and Pulumi, it ultimately comes down to personal preference. While Pulumi allows you to bring IaC into your backend code, Terraform offers an extensive set of features that make infrastructure easy to manage from day 1 to enterprise.

At [Multy](https://multy.dev) we are building a cloud-agnostic infrastructure tool that allows you to build your infrastructure on any cloud. We use Terraform both to deploy our own infrastructure, but also to deploy infrastructure on our customers behalves. You can use it via the Multy Terraform Provider, where you can deploy cloud-agnostic resources into any cloud without having to re-write your configuration.

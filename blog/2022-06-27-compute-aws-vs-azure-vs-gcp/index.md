---
slug: compute-aws-vs-azure-vs-gcp
title: "AWS vs Azure vs GCP Virtual Machine comparison (2022)"
description: "AWS, Azure and GCP all offer similar services for virtualized compute instances. However, there's quite a few surprising differences that are important to be aware when choosing your provider and building your infrastructure."
image: ./compute-clouds.png
authors: [goncalo]
tags: [iac, terraform, compute, cloud, infrastructure, aws, gcp, azure, devops]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AWS vs GCP vs Azure - Computing resources - Virtual Machines

In this blog post series, we will be comparing different services in AWS, GCP and Azure. We'll go into detail in each of the resources and understand the differences between providers, something you need to be aware if you are looking into switching clouds. 

Some examples will be given using Terraform, the Infrastructure as Code (IaC) market leader. If you want to know more about different IaC tools and how they compare, check our other blog post - [Terraform vs Pulumi vs CloudFormation](https://docs.multy.dev/blog/iac-comparison).

There are many computing resources available across all clouds which usually fall into one of these categories:

- Containers (managed container services, kubernetes)
- Instances (virtual machines, spot instances)
- Serverless

In this article, we're specifically focusing on Virtual Machine instances. If you are interested in other resources, join our [mailing list](https://multy.dev/#beta?ref=compute-aws-vs-azure-vs-gcp-blog) as we will be comparing other resources later on.

![virtual_machine_clouds](./compute-clouds.png)

<!--truncate-->

## Overview

Amazon is the market leader on cloud computing resources with Elastic Compute Cloud (EC2). Google Cloud offers a similar service called Compute Engine and Azure also has Virtual Machines. 

These services provide a virtualized environment where you can easily launch your applications in a few seconds without having to buy and manage hardware yourself. Since it's so easy to create or destroy new instances, you can add more or remove on-demand depending on your usage, allowing you to scale effortlessly.

Cloud providers all have similar offerings, but they have a lot of unique advantages and caveats. These range from different regions, sizes, default network access and operating systems. We'll go in more detail into each one of these categories in the following sections.


## Regions and availability zones

All cloud providers have data centers in certain locations across the globe, grouped in regions. Usually within a region, for the purpose of redundancy, there's a set of data centers that live close together. Each data center is called an availability zone and there's around 3 per region for most regions. Having your infrastructure in multiple zones mitigates the risk of a single data center failure, as they have different power sources, networking and cooling.

One of the differences between AWS, Azure and GCP are the regions that are available and what resources are considered global (i.e. span across all regions), regional (i.e. span across all zones in a region) or zonal (i.e. tied to a single data center).


### AWS
In AWS, the big majority of resources are regional or zonal. In case of virtual machines, you need to specify a subnet where they will be deployed in, and the virtual machine will be deployed in the same region and availability zone as the subnet.

<div style={{display: 'block',marginLeft: 'auto',marginRight: 'auto',width: '50%'}}>
<img src="/img/aws-vm-diagram.png" alt="drawing" width="300" />
</div>
<div  class="text--center">
<small><b>Figure 1.</b> Diagram showing a simple structure of 2 connected virtual machines with zone redundancy in AWS.</small>
</div>


### Azure
In Azure, each virtual machine can have a different availability zone, even if they are in the same subnet. Additionally, Azure has the concept of availability sets. Availability sets are a set of 2 or more VMs within a single zone, but using different hardware, meant to protect from single hardware failures. VMs deployed across availability sets have 99.95% SLA and 99.99% if across multiple availability zones.

<div style={{display: 'block',marginLeft: 'auto',marginRight: 'auto',width: '50%'}}>
<img src="/img/azure-vm-diagram.png" alt="drawing" width="400"/>
</div>
<div  class="text--center">
<small><b>Figure 2.</b> Diagram showing a simple structure of 2 connected virtual machines with zone redundancy in Azure.</small>
</div>


### GCP
In GCP, a number of few resources are [global](https://cloud.google.com/compute/docs/regions-zones/global-regional-zonal-resources), meaning they can be used by other resources in any location across the world. For the case of virtual machines, they are zonal resources, so you need to specify which availability zone you want to deploy your virtual machines in. The underlying virtual network is global, meaning you can have virtual machines in different regions communicating with each other out of the box.

<div style={{display: 'block',marginLeft: 'auto',marginRight: 'auto',width: '50%'}}>
<img src="/img/gcp-vm-diagram.png" alt="drawing" width="400"/>
</div>
<div  class="text--center">
<small><b>Figure 3.</b> Diagram showing a simple structure of 2 connected virtual machines with zone redundancy in GCP.</small>
</div>

### Region availability

Oftentimes you need a specific region, either for data residency laws, latency or customer requirements. That's when you need to be careful about the clouds you choose - as not all regions are available everywhere. For example, these are some of the regions that are not available in one of the three major cloud providers (as of 06/2022):

| Location       | AWS region           | Azure region                                                | GCP region         | 
|----------------|----------------------|-------------------------------------------------------------|--------------------|
| Hong Kong      | ap-east-1            | -                                                           | asia-east2         |
| Ireland        | eu-west-1            | northeurope                                                 | -                  |
| Mainland China | cn-north-1           | chinanorth3, chinaeast, chinaeast2, chinanorth, chinanorth2 | -                  |
| Middle East    | me-south-1 (Bahrain) | uaenorth (Dubai)                                            | -                  |
| Spain          | -                    | -                                                           | europe-southwest-1 |
| Switzerland    | -                    | switzerlandwest, switzerlandnorth                           | europe-west6       |
| Texas          | -                    | southcentralus                                              | us-south1          |


When picking a region, you also need to take into account that not all regions offer all services. Some of them don't have certain CPUs, GPUs or more than 1 availability zone (happens often in Azure regions) or they can be differently priced.

## Virtual Machine types

Cloud providers have a very diverse catalog of machines available for use. These have different computing resources, that can be optimized for CPU-intensive, memory-intensive or GPU-intensive workloads. Google Cloud, for example, is known for its GPU offering, ideal for machine learning and AI workloads. AWS, on the other hand, has Arm-based custom chips that deliver the best multi-core CPU performance. 

At the end of the day, for most applications, the available virtual machine types are very similar, but pricing can be quite different for more specialized CPUs or GPUs. We've built a table that compares AWS and Azure resources [here](https://docs.multy.dev/vm_sizes). 

## SSH access (and other access methods)

SSH keys are the most common way to set up access to a given virtual machine instance. They can be configured in all clouds, although in different ways. In this section we focus on Linux-based VMs as different restrictions might apply to Windows VMs.

:::note
If you use a custom image, then you can build them with the users and SSH keys you wish and don't have to differentiate between the cloud providers.
:::

### AWS

AWS supports SSH access by specifying a public SSH key directly in their console or in a Terraform configuration, but it doesn't let you set the associated username. Most of the AWS AMIs have a default user, depending on the operating system distribution. The following table shows most of them:


| AMI          | Default username   | 
|--------------|--------------------|
| Amazon Linux | ec2-user           |
| CentOS       | centos or ec2-user |
| Debian       | admin              |
| Fedora       | fedora or ec2-user |
| RHEL         | ec2-user or root   |
| Suse         | ec2-user or root   |
| Ubuntu       | ubuntu             |
| Oracle       | ec2-user           | 




### Azure

Azure supports SSH access to their virtual machines by setting the public SSH key directly in the Azure portal or through Terraform. It asks for the username associated with that key in the UI or through the `admin_username` field in Terraform.

### GCP

In GCP, you can access your instance by using [SSH-in-browser](https://cloud.google.com/compute/docs/ssh-in-browser) - that creates ephemeral SSH key pairs when you use it.
You can also specify a permanent public SSH key similarly to other clouds. This is done through a metadata field called `ssh_keys` where value has the format `username:public-ssh-key`. For example:
```hcl
resource google_compute_instance "vm" {
  ...
  metadata = {
    ssh-keys = "cloudysanfrancisco:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDAu5kKQCPF...baklavainthebalkans:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDQDx3FNVC8... google-ssh"
  }
}
```

### Password access

Password access is disabled on newly created GCP's Compute Engines and on AWS's EC2 instances. Azure, on the other hand, lets you set up a username and password SSH access directly from their initial configuration. If you need to set up password access in GCP or AWS, you can still do it through the following steps:
1. Log in into the machine and edit the  `/etc/ssh/sshd_config` file
2. Change the line `PasswordAuthentication no` to `PasswordAuthentication yes`
3. Reload the service by running `sudo service ssh restart` or `sudo service sshd restart`
4. Set a password for the current user by running `sudo passwd $USER`

### Other access methods

Aside from direct SSH access, different cloud providers provide different access methods that integrate directly with their Access Management users and policies. 

AWS offers EC2 Instance Connect that  uses AWS Identity and Access Management (IAM) policies and principals to control SSH access to your instances, removing the need to share and manage SSH keys.

In Azure, you can use Azure Active Directory (AD) as a core authentication platform and a certificate authority, to SSH into a Linux VM using Azure AD and openSSH certificate-based authentication.

GCP has OSLogin to  manage SSH access to your instances using IAM without having to create and manage individual SSH keys. 

## Images

AWS, Azure and GCP have a wide catalog of pre-built images, either their own, or provided by the different Linux distribution publishers. However, not all versions are available in all clouds out-of-the-box and some of them might require a license. Also, if you want to run Windows, Azure lets you bring on-prem Windows Server license which can cut your licensing cost by 40% or more.

You can also create your own image from a disk snapshot and store it on each cloud's custom image storage. This is quite convenient if you have a lot of initial setup and destroy/recreate machines often.

### Specifying user-data

All cloud providers let you configure and run a startup script using a standard called [cloud-init](https://cloudinit.readthedocs.io/en/latest/). This lets you run a script to set up users, ssh keys, mount points and run custom commands to initialize your virtual machine. The easiest way to get started is to just run a custom script. Here's an example on how to do it in each cloud using Terraform:


<Tabs>

  <TabItem value="aws" label="AWS" default>

```hcl
resource "aws_instance" "example_vm" {
  ...
  user_data_base64  = base64encode("#!/bin/bash\necho 'Hello world' > /logs.txt")
}
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```hcl
resource "azurerm_linux_virtual_machine" "example_vn" {
  ...
  custom_data  = base64encode("#!/bin/bash\necho 'Hello world' > /logs.txt")
}
``` 

 </TabItem>

  <TabItem value="gcp" label="GCP">

```hcl
resource "google_compute_instance" "example_vn" {
  ...
  metadata  = {
    "user-data" = "#!/bin/bash\necho 'Hello world' > /logs.txt" 
  }
}
``` 

 </TabItem>

   <TabItem value="multy" label="Multy">

```hcl
# with multy, we abstract the cloud specific parameters away
# write your user data and chose the destination cloud, multy does the rest
resource "multy_virtual_machine" "example_vm" {
  ...
  cloud             = "aws"
  user_data_base64  = base64encode("#!/bin/bash\necho 'Hello world' > /logs.txt")
}
``` 

<small>For more examples, check the <a href="https://docs.multy.dev/examples/" target="_blank"> Multy documentation</a>.</small>

 </TabItem>
</Tabs>



## Block Storage / Disk

Disk storage is critical to a lot of applications and different cloud providers have different offerings depending on your performance and resillience requirements. AWS, Azure and GCP offer similar products regarding block storage and they are also similarly priced. 

Common features include redundancy, snapshotting, encryption and attaching volumes to multiple instances. The following table summarizes the differences between the three major cloud providers:




| Feature                     | AWS                                                                                    | Azure                                                       | GCP                                           | 
|-----------------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------|
| Disk types                  | EBS Provisioned IOPS SSD, EBS General Purpose SSD, Throughput Optimized HDD, Cold HDD  | Ultra disks, premium SSD, standard SSD, standard HDD        | Persistent disks (HDD), SSD persistent disks  |
| Redundancy                  | Single zone                                                                            | Single zone or multi zone                                   | Single zone or multi zone                     |
| Encryption at rest          | Supported                                                                              | Supported                                                   | Supported                                     |
| Snapshots                   | Supported                                                                              | Supported                                                   | Supported                                     |
| Snapshot locality           | Regional                                                                               | Regional                                                    | Global                                        |
| Disk attachment             | Attached up to 16 instances in read-write mode                                         | Attached up to 10 instances in read-only mode for SSDs only | Attached up to 10 instances in read-only mode |
| Attached disks per instance | Up to 40                                                                               | Up to 64                                                    | Up to 128                                     |


Aside from those, all clouds also offer a local storage which is usually cheaper, smaller and considered ephemeral.

## What we're doing at Multy

As we've seen so far, while most of the features in each cloud are similar, there's a lot of differences that make it hard to build for multiple clouds. This increases your degree of lock-in to your cloud provider. That's why we are building Multy - an open source tool that enables developers to deploy cloud-agnostic infrastructure.

With Multy, you specify your resource configuration and what cloud you want to deploy in, and Multy handles the nuances of each cloud for you. It's currently available as a [Terraform provider](https://registry.terraform.io/providers/multycloud/multy/latest/docs). 

Let's say we want to deploy a virtual machine with the following configuration:

- Ubuntu 20.04 LTS
- 1 CPU core, 1 GB Ram
- Ephemeral public IP
- SSH configured with public key `./ssh_key.pub`
- Located in London
- Starts an HTTP server with a static webpage

Here's how a Terraform configuration looks like in Multy and in the different cloud providers:


<Tabs>

   <TabItem value="multy" label="Multy" default>

```hcl
resource "multy_virtual_machine" "vm" {
  cloud    = "aws"
  location = "eu_west_2"

  name               = "multy-vm"
  size               = "general_micro"
  image_reference    = {
    os      = "ubuntu"
    version = "20.04"
  }
  subnet_id          = multy_subnet.subnet.id
  generate_public_ip = true
  public_ssh_key     = file("./ssh_key.pub")
  user_data_base64   = base64encode(<<-EOF
      #!/bin/bash -xe
      sudo su
      apt update -y && apt install -y apache2
      systemctl enable apache2
      touch /var/www/html/index.html
      echo "<h1>Hello from Multy on aws</h1>" > /var/www/html/index.html
    EOF
  )
  network_security_group_ids = [multy_network_security_group.nsg.id]
}
``` 

<small>For a full example, check the <a href="https://docs.multy.dev/examples/public-virtual-machine" target="_blank"> Multy documentation</a>.</small>

 </TabItem>

  <TabItem value="aws" label="AWS">

```hcl
resource "aws_instance" "vm" {
  tags     = {
    "Name" = "test-vm"
  }

  ami                         = data.aws_ami.ami.id
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  subnet_id                   = aws_subnet.subnet_aws.id
  user_data_base64           = base64encode(<<-EOF
      #!/bin/bash -xe
      sudo su
      apt update -y && apt install -y apache2
      systemctl enable apache2
      touch /var/www/html/index.html
      echo "<h1>Hello from Multy on aws</h1>" > /var/www/html/index.html
    EOF
  )
  key_name                    = aws_key_pair.key.key_name
  iam_instance_profile        = aws_iam_instance_profile.profile.id
  vpc_security_group_ids      = [aws_security_group.nsg.id]
}
resource "aws_key_pair" "key" {
  tags     = {
    "Name" = "test-key"
  }

  key_name   = "multy_vm_key"
  public_key = file("./ssh_key.pub")
}
data "aws_ami" "ami" {
  owners      = ["099720109477"]
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu*-20.04-amd64-server-*"]
  }
  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

  </TabItem>
  <TabItem value="azure" label="Azure">

```hcl
resource "azurerm_linux_virtual_machine" "vm" {
  resource_group_name   = azurerm_resource_group.rg.name
  name                  = "test-vm"
  computer_name         = "testvm"
  location              = "uksouth"
  size                  = "Standard_B1s"
  zone                  = "1"
  network_interface_ids = [azurerm_network_interface.vm.id]
  custom_data           = base64encode(<<-EOF
      #!/bin/bash -xe
      sudo su
      apt update -y && apt install -y apache2
      systemctl enable apache2
      touch /var/www/html/index.html
      echo "<h1>Hello from Multy on azure</h1>" > /var/www/html/index.html
    EOF
  )

  os_disk {
    caching              = "None"
    storage_account_type = "Standard_LRS"
  }
  
  admin_username = "adminuser"

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("./ssh_key.pub")
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-LTS"
    version   = "latest"
  }
  identity {
    type = "SystemAssigned"
  }
  disable_password_authentication = true
}

resource "azurerm_network_interface" "vm" {
  resource_group_name = azurerm_resource_group.rg.name
  name                = "nic"
  location            = "uksouth"

  ip_configuration {
    name                          = "external"
    private_ip_address_allocation = "Dynamic"
    subnet_id                     = azurerm_subnet.subnet.id
    public_ip_address_id          = azurerm_public_ip.pip.id
    primary                       = true
  }
}
resource "azurerm_public_ip" "pip" {
  resource_group_name = azurerm_resource_group.rg.name
  name                = "pip"
  location            = "uksouth"
  allocation_method   = "Dynamic"
}

``` 

 </TabItem>

  <TabItem value="gcp" label="GCP">

```hcl
resource "google_compute_instance" "vm" {
  name         = "test-vm"
  machine_type = "e2-micro"
  zone         = "europe-west2-b"
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
    }
  }
  network_interface {
    subnetwork = google_compute_subnetwork.subnet.self_link
    access_config {
      network_tier = "STANDARD"
    }
  }
  metadata = {
    "ssh-keys"  = file("./ssh_key.pub"),
    "user-data" = base64encode(<<-EOF
      #!/bin/bash -xe
      sudo su
      apt update -y && apt install -y apache2
      systemctl enable apache2
      touch /var/www/html/index.html
      echo "<h1>Hello from Multy on gcp</h1>" > /var/www/html/index.html
    EOF
    )
  }
}
``` 

 </TabItem>
</Tabs>

If you want to know more, check out [multy.dev](https://multy.dev?ref=compute-aws-vs-azure-vs-gcp-blog) or take a look at our [repo](https://github.com/multycloud/multy)!

## Conclusion

Nowadays, cloud providers provide the same core offering when deploying virtual machines. However, there's some unique advantages of each cloud and some differences you need to be careful about if you don't want to end up locked in into a single provider. If you want to read more about challenges of building multi cloud, check out our other [blog post](http://multy.dev/blog/challenges-of-building-multi-cloud). 

At [Multy](https://multy.dev?ref=compute-aws-vs-azure-vs-gcp-blog), we're unifying cloud provider resources by providing a single cloud-agnostic API and handling the differences behind the hood. It is available as a Terraform provider, so you can still take advantage of other very cloud-specific resources but keep the majority of your infrastructure portable.

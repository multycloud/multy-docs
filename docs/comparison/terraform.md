---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multy vs Terraform

[Terraform](https://terraform.io) is the defacto infrastructure as code tool for most teams to deploy their resources. It allows you to use the same interface to deploy resources most cloud services. 

While this has been great for teams looking to deploy infrastructure to multiple clouds, it places all the burden of designing and writing that infrastructure to the development teams. Simple resources are tied to specific cloud and cannot be reused when changing providers. Multy was born out of this exact problem.

Teams are constantly faced with a tough decision when it comes to infrastructure:
- Prioritise speed and ease-of-use by leveraging cloud managed services getting locked-in to cloud 
- Avoid lock-in by self-hosting open-source alternatives which are time consuming and expensive to run


### Why Multy

Multy offers a different approch to this issue, by allowing you to use cloud managed services but still have the flexibility needed to move providers if necessary. While Terraform allows you to be multi-cloud, Multy takes it one step further. 

Multy creates a higher level of abstraction where resources have cloud-agnostic parameters that don't change when you are moving clouds.

**Write Once, Deploy Many**

### Example

Let's compare the two by looking at a `virtual_network` resource.

<Tabs>
  <TabItem value="multy" label="Multy" default>

```hcl
resource "multy_virtual_network" "multy_vn" {
  name       = "multy_vn"
  cidr_block = "10.0.0.0/16"
  location   = "eu_west_1"
  cloud      = "aws" # or "azure"
}
```

  </TabItem>
  <TabItem value="aws" label="Terraform - AWS">

```hcl
resource "aws_vpc" "aws_vn" {
  tags        = { 
    "Name" = "multy_vn" 
  }
  cidr_block  = "10.0.0.0/16"
}
```

  </TabItem>
  <TabItem value="azure" label="Terraform - Azure">

```hcl
resource "azurerm_resource_group" "vn-rg" {
  name     = "vn-rg"
  location = "ukwest"
}

resource "azurerm_virtual_network" "azure_vn" {
  resource_group_name = azurerm_resource_group.vn-rg.name
  name                = "multy_vn"
  location            = "ukwest"
  address_space       = ["10.0.0.0/16"]
}
```

 </TabItem>
</Tabs>

While both AWS and Azure are offering the same service, there are differences and nuances in the way they work that make it difficult to easily maintain multiple configurations. With Multy, to move clouds you only need to change the `cloud` parameter to change the underlying provider, everything else stays the same. 


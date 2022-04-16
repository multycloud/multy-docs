---
sidebar_position: 3

---

# How It Works

Multy works by deploying your infrastructure in your specified cloud provider based on the credentials you provide.

Multy translates its cloud agnostic resources into the respective cloud specific resources. 

As an example, let's look at a Multy `virtual_network` resource using the [Multy's Terraform Provider](https://registry.terraform.io/providers/multycloud/multy/latest/docs):

```hcl
resource "multy_virtual_network" "vn" {
  name       = "multy_vn"
  cidr_block = "10.0.0.0/16"
  location   = "uk"
  cloud      = "xxx" // (i.e. aws/azure)
}
```

This `virtual_network` is then translated so it deploys resources that behave the same way regardless of the cloud. Essentially, Multy will deploy one of the following resources on your account:

```hcl
// aws
resource "aws_vpc" "multy_vn" {
  tags = { "Name" = "multy_vn" }
  cidr_block           = "10.0.0.0/16"
}

// azure
resource "azurerm_virtual_network" "multy_vn" {
  resource_group_name = azurerm_resource_group.vn-rg.name
  name                = "multy_vn"
  location            = "ukwest"
  address_space       = ["10.0.0.0/16"]
}
```

Multy also handles the nuances that often happen with two similar resources on different clouds. As an example, the networking of a `virtual_machine` in Azure is open to the world while in AWS, the default behaviour is private. Multy abstracts these nuances by deploying additional services that ensures they have a consistent behaviour. This means a significantly reduced barrier to entry into major cloud providers and the ability leverage major cloud providers without needing to read documentation in depth. 
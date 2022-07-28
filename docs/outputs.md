---
sidebar_position: 7
---

# Accessing underlying resources

For every resource declared, Multy deploys zero, one or more resources in the underlying cloud providers.
Since Multy doesn't support every resource on every cloud provider - such as very specific resources that are not common on all clouds. 

In many cases, it is helpful to know or to use the underlying deployed resources and integrate them with other cloud-specific resources.

Every Multy resource exports the IDs of the underlying created resources. To check these, simply call `terraform show` or use them directly in your Terraform configuration file.
For example, after deploying the following configuration:

```hcl
resource "multy_virtual_network" "vn" {
  cloud      = "aws"

  name       = "multy-vn"
  cidr_block = "10.0.0.0/16"
  location   = "eu_west_2"
}
```
Calling `terraform show` will output:

```hcl
# multy_virtual_network.vn:
resource "multy_virtual_network" "vn" {
    aws               = {
        default_security_group_id = "sg-02e73a123f8b5c3e3"
        internet_gateway_id       = "igw-0343e3780cb00ed6f"
        vpc_id                    = "vpc-0e153cfc4d4dbcbba"
    }
    cidr_block        = "10.0.0.0/16"
    cloud             = "aws"
    id                = "multy_vn_u3h5s_r1"
    location          = "eu_west_2"
    name              = "vn-test2"
}
```

So, you can see that a virtual network deployed a VPC, an internet gateway and a default security group.
You can manipulate those or use them directly with other AWS resources.

For example, Multy doesn't support secondary CIDR blocks right now. 
So if you wanted to do that, you could deploy the following configuration using the outputted VPC id:

```hcl
resource "multy_virtual_network" "vn" {
  cloud      = "aws"

  name       = "multy-vn"
  cidr_block = "10.0.0.0/16"
  location   = "eu_west_2"
}

resource "aws_vpc_ipv4_cidr_block_association" "secondary_cidr" {
  vpc_id     = multy_virtual_network.vn.aws.vpc_id
  cidr_block = "172.2.0.0/16"
}
```

This allows you to still have most of your configuration cloud-agnostic using Multy resources, but with added flexibility of using cloud-specific resources.

You can see a list of all outputted IDs in the Terraform [provider documentation](https://registry.terraform.io/providers/multycloud/multy/latest/docs).
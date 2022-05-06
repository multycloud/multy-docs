# Examples

Let's take a look at a few examples to better understand how multy works. Read our [Getting Started](getting-started) guide for more details.

### Define Global Config

First we need to choose which clouds we want to deploy to. You can request a free `api_key` by emailing support@multy.dev.

```hcl
terraform {
  required_providers {
    multy = {
      source = "multycloud/multy"
    }
  }
}

provider "multy" {
  api_key         = "xxx"
  aws             = {}
  azure           = {}
}
```

In this provider config, we have declared that we want our infrastructure to be deployed into AWS and Azure with credentials being passed through environment variables.

### Declare Resources

Now that we have setup the provider, we can start declaring custom resources. Let's start with a simple virtual
machine deployed in a private virtual network.

```hcl
variable "clouds" {
  type    = set(string)
  default = ["aws", "azure"]
}

resource "multy_virtual_network" "vn" {
  for_each = var.clouds
  cloud    = each.key

  name       = "multy_vn"
  cidr_block = "10.0.0.0/16"
  location   = "eu_west_1"
}

resource "multy_subnet" "subnet" {
  for_each = var.clouds

  name               = "multy_subnet"
  cidr_block         = "10.0.10.0/24"
  virtual_network_id = multy_virtual_network.vn[each.key].id
}

resource "multy_virtual_machine" "vm" {
  for_each = var.clouds
 
  name               = "test_vm"
  size               = "micro"
  operating_system   = "linux"
  subnet_id          = multy_subnet.subnet[each.key].id
  cloud              = each.key
  location           = "eu_west_1"
}
```

Here we are defining a few common cloud components. A [virtual_network](#) resource with
an address space of `10.0.0.0/16` and a [subnet](#) within that `multy_vn` resource. Finally
we're defining a [virtual_machine](#) within `multy_subnet`.

The `for_each = var.clouds` means that resources will be created in each cloud (`["aws", "azure"]`) with their respective associations between resources.

### Run Multy

After following the setup steps in [Getting Started](getting-started), you can deploy the services using the Terraform CLI.

```bash
terraform init    # download the terraform providers 
terraform plan    # outputs what would be deployed if configuration is applied
terraform apply   # deploy infrastructure
```

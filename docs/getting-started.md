---
sidebar_position: 2

---

# Getting Started

Getting started with Multy is easy. 
This page describes how to install all dependencies needed and deploy a simple configuration in your chosen cloud provider using the [Multy Terraform Provider](https://registry.terraform.io/providers/multycloud/multy/latest/docs).
In summary, you'll need to complete the following steps:

1. Install Terraform
2. Create Cloud Provider Account
3. Generate Access Keys
4. Write your infrastructure configuration file
5. Deploy Your Infrastructure

### 1. Install Terraform

Terraform is a Infrastructure-as-code tool that provides a declarative way to deploy resources. 
Multy is available as a Terraform provider, so you'll need to install Terraform to deploy your infrastructure following their [guide](https://learn.hashicorp.com/tutorials/terraform/install-cli). 

### 2. Create Cloud Provider Account

Multy deploys your infrastructure in a major cloud provider. 
Currently, you can deploy it in AWS or Azure, with Google Cloud coming soon.

You can find how to create an account in each of the cloud provider's websites:

- AWS - https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/
- Azure - https://azure.microsoft.com/en-gb/free/

### 3. Generate Access Keys

In order to allow Multy to deploy infrastructure in your cloud account(s), you need to generate credentials and pass them through Terraform.
You'll also need a Multy API key, which you can get freely by contacting support@multy.dev.

#### Generate AWS credentials

You can get an an `access_key` and an `access_secret` through the AWS console following the [docs](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).

You can pass the credentials to Terraform in one of the following ways:

- Run `aws configure` and Multy get the credentials automatically
- Export the access key and secret through their respective environment variables, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- Add the `access_key` and `access_secret` to the Terraform AWS provider block through Terraform variables

You can read how to setup the provider through the terraform [docs](https://registry.terraform.io/providers/multycloud/multy/latest/docs).

#### Generate Azure credentials

Multy needs a Service Principal to deploy infrastructure in your behalf. 
Azure provides [documentation](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli) on how to create a `service_principal` and what roles can be assigned.
Run the following commands to generate a service principal:

```bash
az login
az ad sp multy --role Contributor
```

The commands above will output some of the parameters that you should store in a safe place:

- `appId` - corresponds to the Client ID
- `tenant` - corresponds to the Tenant ID
- `password` - corresponds to the Client Secret

After you create a service principal, you can pass them to Multy in one of the following ways:
- Add the credentials directly to the azure provider block via Terraform variables
- Export them as env vars:
```bash
export ARM_TENANT_ID=xxxx-xxxx-xxxx-xxxx
export ARM_SUBSCRIPTION_ID=xxxx-xxxx-xxxx-xxxx
export ARM_CLIENT_ID=xxxx-xxxx-xxxx-xxxx
export ARM_CLIENT_SECRET=xxxx-xxxx-xxxx-xxxx
```

### 4. Write your infrastructure configuration file

Terraform uses declarative configuration files to deploy your infrastructure. 
If you're unfamiliar with Terraform, there are a lot of great [tutorials](https://learn.hashicorp.com/tutorials/terraform/resource?in=terraform/configuration-language) at their website.
Multy provides different resources that can be deployed in any major cloud. 
Documentation for the different resources is available at via the [terraform provider](https://registry.terraform.io/providers/multycloud/multy/latest/docs).

The following example deploys a simple `object_storage` resource with a hello world in both AWS and Azure:

```hcl
terraform {
  required_providers {
    multy = {
      source = "multycloud/multy"
    }
  }
}

provider "multy" {
  api_key = "xxx"
  aws     = {}
  azure   = {}
}

variable "clouds" {
  type    = set(string)
  default = ["aws", "azure"]
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "multy_object_storage" "obj_storage" {
  for_each = var.clouds
  name     = "multy-test-storage-${random_string.suffix.result}"
  cloud    = each.key
  location = "us_east"
}

resource "multy_object_storage_object" "public_obj_storage" {
  for_each          = var.clouds
  name              = "hello_world"
  object_storage_id = multy_object_storage.obj_storage[each.key].id
  content           = "<h1>hello world from ${each.key}</h1>"
  content_type      = "text/html"
  acl               = "public_read"
}

output "aws_object_url" {
  value = multy_object_storage_object.public_obj_storage["aws"].url
}

output "azure_object_url" {
  value = multy_object_storage_object.public_obj_storage["azure"].url
}
```

For more examples, see our [Examples](examples/README.md) section

### 5. Deploy Your Infrastructure

Create a `main.tf` file and write your configuration. You can then deploy it using the following Terraform commands:

```bash
terraform init    # download the terraform providers 
terraform plan    # outputs what would be deployed if configuration is applied
terraform apply   # deploy infrastructure
```

After the commands complete, you can look at the outputs or visit your cloud provider's console to verify that everything is as expected.

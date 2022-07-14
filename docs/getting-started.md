---
sidebar_position: 2

---

# Getting Started

Getting started with Multy is easy. 
This page describes how to install all dependencies needed and deploy a simple configuration in your chosen cloud provider using the [Multy Terraform Provider](https://registry.terraform.io/providers/multycloud/multy/latest/docs).
In summary, you'll need to complete the following steps:

1. Install Terraform
2. Setup Cloud Provider Accounts
3. Generate Access Keys
4. Write your infrastructure configuration file
5. Deploy Your Infrastructure
6. Destroy Your Infrastructure

### 1. Install Terraform

Terraform is an Infrastructure-as-code tool that provides a declarative way to deploy resources. 
Multy is available as a Terraform provider, so you'll need to install Terraform to deploy your infrastructure following their [guide](https://learn.hashicorp.com/tutorials/terraform/install-cli). 

### 2. Setup Cloud Provider Account

Multy deploys your infrastructure in a major cloud provider. 
Currently, you can deploy it in Amazon Web Services (AWS), Azure or Google Cloud Platform (GCP).

You can find how to create an account in each of the cloud provider's websites:

- AWS - https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/
- Azure - https://azure.microsoft.com/en-gb/free/
- GCP - https://console.cloud.google.com/getting-started

In order to setup the credentials, you should install AWS and Azure CLIs by following the respective guides:
- AWS - https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Azure - https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

### 3. Generate Access Keys

In order to allow Multy to deploy infrastructure in your cloud account(s), you need to generate credentials and pass them through Terraform.

You'll also need a Multy API key, which you can get for free on our [website](https://multy.dev). You can pass them to Terraform through the `MULTY_API_KEY` environment variable.

#### Generate AWS credentials

You can get an `access_key` and `access_secret` through the AWS console following the [docs](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).

You can pass the credentials to Terraform in one of the following ways:

<details className="clean">
<summary>Profile Configuration</summary>
<div>

Run `aws configure`, which stores the credentials in an AWS local profile.

Access keys are automatically fetched by Multy from your `profile` configuration.

```bash
> aws configure
```

```hcl
provider multy {
  aws = {}
}
```

</div>
</details>

<details className="clean">
<summary>Temporary Session Token</summary>
<div>

Run `aws configure`, which stores the credentials in an AWS local profile.

Create a temporary session token by running `aws sts get-session-token` and pass the values through environment variables.

```bash
> aws configure
> aws sts get-session-token
> export AWS_ACCESS_KEY_ID=#AccessKeyId#
> export AWS_SECRET_ACCESS_KEY=#SecretAccessKey#
> export AWS_SESSION_TOKEN=#SessionToken#
```

```hcl
provider multy {
  aws = {}
}
```

</div>
</details>

<details className="clean">
<summary>Environment Variables</summary>
<div>

Pass the access keys through environment variables via `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

```bash
export AWS_ACCESS_KEY_ID=#AccessKeyId#
export AWS_SECRET_ACCESS_KEY=#SecretAccessKey#
```

```hcl
# main.tf
provider multy {
  aws = {}
}
```

</div>
</details>

<details className="clean">
<summary>Parameters</summary>
<div>

Pass keys directly to the provider as a parameter.

```hcl
provider multy {
  aws = {
    access_key_id      = "AWS_ACCESS_KEY_ID"
    access_key_secret  = "AWS_SECRET_ACCESS_KEY"
  }
}
```

:::warning

This is not a recommended practice as keys could accidentally be shared 

:::

</div>
</details>


You can read how to setup the provider through the Terraform [docs](https://registry.terraform.io/providers/multycloud/multy/latest/docs).

#### Generate Azure credentials

Multy needs a Service Principal to deploy infrastructure in your behalf. 
Azure provides [documentation](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli) on how to create a `service_principal` and what roles can be assigned.

Run the following commands to generate a service principal (replacing `$SUBSCRIPTION_ID` with your subscription id):

```bash
az login
az ad sp create-for-rbac --name 'multy' --role Contributor --scopes '/subscriptions/$SUBSCRIPTION_ID'
```

The commands above will output some of the parameters that you should store in a safe place:

- `appId` - corresponds to the Client ID
- `tenant` - corresponds to the Tenant ID
- `password` - corresponds to the Client Secret

After you create a service principal, pass them to Multy in one of the following ways:

<details className="clean">
<summary>Environment Variables</summary>
<div>

Pass the access keys through environment variables via `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID` and `ARM_TENANT_ID`.

```bash
export ARM_TENANT_ID=#tentant_id#
export ARM_SUBSCRIPTION_ID=#subscription_id#
export ARM_CLIENT_ID=#app_id#
export ARM_CLIENT_SECRET=#password#
```

```hcl
provider multy {
  azure = {}
}
```

</div>
</details>

<details className="clean">
<summary>Parameters</summary>
<div>

Pass keys directly to the provider as a parameter.

```hcl
# main.tf
provider multy {
  azure = {
    client_id       = "ARM_CLIENT_ID"
    client_secret   = "ARM_CLIENT_SECRET"
    subscription_id = "ARM_SUBSCRIPTION_ID"
    tenant_id       = "ARM_TENANT_ID"
  }
}
```

:::warning

This is not a recommended practice as keys could accidentally be shared 

:::

</div>
</details>


#### Generate GCP credentials

Create a new Service Account by following [this tutorial from GCP](https://cloud.google.com/iam/docs/creating-managing-service-accounts) or use an existing one to give Multy access to deploy resources in your behalf.
After your Service account is created, create a new key and store the resulting JSON in a safe place by following the [docs](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

You can pass the credentials to Terraform in one of the following ways:

<details className="clean">
<summary>Environment Variables</summary>
<div>

Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the path os the JSON file. 
You can also set `GOOGLE_CREDENTIALS` to the contents of the file instead.

In addition to that, set your default project through the environment variable `GOOGLE_PROJECT`.

```bash
export GOOGLE_APPLICATION_CREDENTIALS=~/.google/multy-project-942ae1bdbf0f.json
export GOOGLE_PROJECT=multy-project
```

```hcl
# main.tf
provider multy {
  gcp = {}
}
```

</div>
</details>

<details className="clean">
<summary>Parameters</summary>
<div>

Pass the path to the key JSON or the contents directly to the provider as a parameter.

```hcl
provider multy {
  gcp = {
    credentials  = "~/.google/multy-project-942ae1bdbf0f.json"
    project      = "multy-project"
  }
}
```

</div>
</details>


### 4. Write your infrastructure configuration file

Terraform uses declarative configuration files to deploy your infrastructure. 
If you're unfamiliar with Terraform, there are a lot of great [tutorials](https://learn.hashicorp.com/tutorials/terraform/resource?in=terraform/configuration-language) at their website.
Multy provides different resources that can be deployed in any major cloud. 
Documentation for the different resources is available via the [Terraform provider](https://registry.terraform.io/providers/multycloud/multy/latest/docs).

The following example deploys a simple `object_storage` resource with a *hello world* in AWS, Azure and GCP:

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
  gcp     = {}
}

variable "clouds" {
  type    = set(string)
  default = ["aws", "azure", "gcp"]
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
  location = "us_east_1"
}

resource "multy_object_storage_object" "public_obj" {
  for_each          = var.clouds
  name              = "hello_world"
  object_storage_id = multy_object_storage.obj_storage[each.key].id
  content_base64    = base64encode("<h1>hello world from ${each.key}</h1>")
  content_type      = "text/html"
  acl               = "public_read"
}

output "aws_object_url" {
  value = multy_object_storage_object.public_obj["aws"].url
}

output "azure_object_url" {
  value = multy_object_storage_object.public_obj["azure"].url
}

output "gcp_object_url" {
  value = multy_object_storage_object.public_obj["gcp"].url
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

Follow the links displayed after the command completes to see the Hello World message from both providers! You can also verify that the resources were deployed by checking each cloud console.

### 6. Destroy Your Infrastructure

In the same folder, run the following command to destroy all the resources you deployed earlier: 

```bash
terraform destroy
```

If you start having drift between Multy and the cloud provider, you can use the Multy CLI.

<details>
<summary>Delete resources with the Multy CLI</summary>
<div>

Multy provides a CLI for cases when there is drift between the cloud provider and Multy. The CLI allows you to remove ghost Multy resources that have been deleted on the cloud provider but still exist in the internal Multy state.

To install it, download it from [GitHub](https://github.com/multycloud/multy/releases) or run the following command:

```bash
curl https://raw.githubusercontent.com/multycloud/multy/main/install.sh | sh
```

List all your resources by running (API key can be passed through the `MULTY_API_KEY` environment variable):

```bash
multy list --api_key=xxx
```

Run the command below to remove a resource from Multy (this won't destroy the underlying resources from your cloud provider):

```bash
multy delete resource_id --api_key=xxx
```
</div>
</details>

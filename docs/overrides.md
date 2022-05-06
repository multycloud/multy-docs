---
sidebar_position: 6
---

# Overrides

In order to have an abstracted interface between different cloud providers, Multy has to be opinionated during deployments and will make some assumptions on how resources should be configured. Multy also supports most of the core services in major cloud providers. While this covers a significant amount of current workloads running in the cloud, certain use cases will require additional flexibility not covered by the standard Multy resources. 

There are multiple ways to add additional flexibility to your configuration, which we will cover below.

### Use passthrough parameters

Multy allows for passthrough parameters to be utilised in certain resources which will let you change some of the default assumptions. Let's look at the following example:

```hcl
resource "multy_virtual_machine" "vm" {
  name               = "dev-vm"
  size               = "large"
  operating_system   = "linux"
  subnet_id          = multy_subnet.subnet.id
  cloud              = "aws"
  location           = "eu_west_1"

  // highlight-start
  aws = {
    size = "m4.2xlarge"
  }
  // highlight-end
}
```

In this resource above, we are creating a `multy_virtual_machine` and we want to customise the size of the instance. Instead of following the standard Multy VM sizes, we want to use a very specific instance size. This can be done through the `aws` passthrough parameter that will override the default value of `vm.size`. If we were instead to deploy to Azure, the `aws` parameter would be ignored and the VM size `large` would be used instead. 

You can find the supported passthrough parameters in each respective resource documentation. 

:::note
While you can make changes to resources directly through the console, this is not advised as Multy will likely override these changes in a future deployment. Where possible, changes should be done through Multy. 
:::

### Additional Terraform Configuration

Another way to add more flexibility to your infrastructure configuration is to leverage the Terraform provider from each provider directly in combination with Multy Terraform. This can be used to fill in the gaps for resources/features that are not yet supported by Multy.

```hcl
resource "multy_object_storage" "obj" {
  name       = "example.com"
  location   = "eu_west_1"
  cloud      = "aws"
}

resource "multy_object_storage_object" "hello_world" {
  name              = "index.html"
  object_storage_id = multy_object_storage.obj.id
  content           = "<h1>hello world from AWS</h1>"
  content_type      = "text/html"
  acl               = "public_read"
}

resource "aws_s3_bucket_website_configuration" "docs_bucket" {
  bucket = multy_object_storage.obj.name
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}
```

In this example, we have created a `multy_object_storage` in AWS and want to set the S3 Bucket website configuration to define `index.html` as the default document. This is currently not supported as a passthrough parameter. Using Terraform, we can simply use the AWS Provider to create a `aws_s3_bucket_website_configuration` to add the specific resource we need. 

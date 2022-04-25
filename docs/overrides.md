---
sidebar_position: 5
---

# Overrides

In order to have an abstracted interface between different cloud providers, Multy has to be opinionated during deployments and will make some assumption on how resources should be configured. Multy also supports most of the core services in major cloud providers. While this covers a significant amount of current workloads running in the cloud, certain uses cases will require additional flexibility not covered by the standard Multy resources. 

There are multiple ways to add aditional flexibility to your configuration, which we will cover below.

### Use passthrough parameters

Multy allows for passthrough parameters to be utilised in certain resources which will let you change some of the default assumptions. Let's look at the following example:

```hcl
resource "multy_virtual_machine" "vm" {
  name               = "dev-vm"
  size               = "large"
  operating_system   = "linux"
  subnet_id          = multy_subnet.subnet.id
  cloud              = "aws"
  location           = "ireland"

  aws = {
    size = "m4.2xlarge"
  }
}
```

In this resource above, we are creating a `multy_virtual_machine` and we want to customise the size of the instance. Instead of following the standard Multy VM sizes, we want to use a very specific instance size. This can be done through the `aws` passthrough parameter that will override the default value of `vm.size`. If we were instead deploy to Azure, the `aws` parameter would be ignored and the VM size `large` would be used instead. 

You can find the supported passthrough parameters in each respective resources documentation. 

NOTE: While we are also able to go into your AWS console and change the resource directly, this is not advised as it's likely Multy will override these changes in a future deployment. Where possible, these changes should be done through Multy. 

### Additional Terraform Configuration

Another way to add more flexibility to your infrastructure configuration is to leverage the Terraform provider from each provider directly in combination with Multy's Terraform. This can be used to fill in the gaps for resources/features that are not yet supported by Multy.

```hcl
resource "multy_object_storage" "obj" {
  name       = "example.com"
  location   = "ireland"
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



**Join the Multy Community! We are always looking for feedback and contributors!**

Join the discussion on our community [Slack Channel](/)!
Raise any feedback/ideas as a GitHub Issue.
Star the repository to spread the word!

Finally, contribute to the open-source projects!

The guide will provide you with an overview on Multy's projects and how to contribute!

### Multy Open Source

Open-source is at the core of Multy. For Multy to succeed, it requires constant feedback from developers. This is so we
can ensure that the abstractions are being done properly and the roadmap for new supported features/services are
prioritised based on community feedback.

If you have any feedback or ways Multy could be better, let us know through our public channels or reach out directly at
hello@multy.dev!

### Multy Projects

[Multy](https://github.com/multycloud/multy) - This project is the brains of the tool, where the translation is
performed and where Multy resource is
translated it the specific cloud resources.
[Multy Terraform Provider](https://github.com/multycloud/terraform-provider-multy) - Our terraform provider allows you
to deploy Multy resources through the Terraform tool.
[Multy Docs](https://github.com/multycloud/multy-docs) - This repo is where our docs are located
for [docs.multy.dev](https://docs.multy.dev)

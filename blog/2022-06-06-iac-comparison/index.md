## Terraform vs Pulumi vs CloudFormation

## Overview

When getting started, using an Infrastructure as Code (Iac) tool can seem overkill, and as something that will slowdown development. Building and deploying manually if often the way to go early stage, infrastructure changes constantly and it having to re-write your configuration can be a pointless exercise until you have a better understand of the fundamental pieces of your infrastructure.

However, most infrastructures get to a point where manual deployments and resource definition start actually slowing you down. Manual deployments going wrong, having to create several copies of the same environment or xx.

In the this blog post, we'll take a look at the current IaC landscape and the current tools.

## IaC landscape

There are a lot of different IaC tools out there, solving different sets of challenges.

### Terraform

[Terraform](https://www.terraform.io/) is one of the most popular IaC tools out there. From small startups to enterprises, it's used to deploy into nearly every cloud provider out there. This includes not just the major cloud providers (Amazon Web Services, Microsoft Azure or Google Cloud Platform), but also other cloud providers such as Cloudflare, Auth0 and MongoDB.

By maintaining the infrastructure state, it's also able to destroy environments and detect changes that happen outside the standard Terraform deployments. There are countless add-on tools to Terraform to complement your infrastructure definition. From such as [Terragrunt](https://terragrunt.gruntwork.io/) that help you maintain your code and [Checkov](https://www.checkov.io/) for security analysis.

Terraform uses declarative language, Hashicorp Configuration Language (HCL), which is straightforward to learn and use. It's a very readable language that makes configuring new resources simple. They offer easy ways to get started through [Modules](https://registry.terraform.io/browse/modules), encapsulating a common series of resources into a single module. With Terraform, it is also easy to manage larger projects, allowing you to easily reuse files for different environments and purposes.

Here is an example of deploying a virtual network using Terraform:

```hcl
resource "aws_vpc" "example_vn" {
  tags              = { "Name" = "example_vn" }
  cidr_block        = "10.0.0.0/16"
}
```

### Pulumi

Similar to Terraform, [Pulumi](https://www.pulumi.com/) also allows you build and deploy infrastructure into any cloud. Instead of HCL, Pulumi allows you to use common programming languages like Python, Node.js or Golang. This means a lower barrier to entry if you are familiar with those coding languages and the ability to use it alongside the rest of your code base. It also means that you can use common testing and other frameworks as you develop your coding infrastructure. When compared to HCL, operations such as for loops and resource references are much more straightforward.

In terms of community, Pulumi is not quite as popular as Terraform, which also benefits from more extensive documentation. It's also important to note that Terraform is also working on a new product that is very similar to Pulumi's offering called [Cloud Development Kit](https://www.terraform.io/cdktf) (CDK). Though this is still early days, it'll eventually become a strong competitor to Pulumi.

Here is an example of deploying a virtual network using Pulumi:

```js
import * as awsx from "@pulumi/awsx";

const vpc = new awsx.ec2.Vpc("custom", {
  cidrBlock: "10.0.0.0/16",
  tags: { Name: "example_vn" },
});
```

### AWS CloudFormation

CloudFormation is the odd one out compared to Terraform and Pulumi. Out of the three, it's the only one that's built for a single provider, AWS. That comes with it's pros and cons.

The obvious downside is that, with CloudFormation, you can mostly deploy AWS resources. While with [CloudFormation Registry](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/registry.html) you can now deploy third-party resources, the options are severely limited when compared to a cloud-agnostic infrastructure tool. Other disadvantages with CloudFormation are the fact that it's written in YAML, making it very hard to read and often times leads to having configuration files with thousands of lines. It also means simple functions and resource references becomes hard to easily implement.

The benefits of CloudFormation are mostly it's extensive set of examples and it's common use throughout the AWS ecosystem such as [SAM](https://aws.amazon.com/serverless/sam/) and [Landing Zone](https://aws.amazon.com/solutions/implementations/aws-landing-zone/)

Here is an example of deploying a virtual network using CloudFormation:

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

## Overview

|        | Terraform | Pulumi           | CloudFormation  |
| ------ | --------- | ---------------- | --------------- |
| micro  | t2.nano   | Standard_B1ls    | tandard_B1ls    |
| medium | t2.medium | Standard_A2_v2   | tandard_A2_v2   |
| large  | t2.large  | Standard_D2as_v4 | tandard_D2as_v4 |

## Summary

There is no shortage of options nowadays to deploy your infrastructure. While we covered Terraform, Pulumi and CloudFormation, there are many others such as Puppet, Chef and Ansible to automate infrastructure. While there isn't a one size fits all, and each use case will require different tools, there are some that stand out.

CloudFormation can't really compete with the current available IaC offerings in the market. Even when only using AWS, the alternatives are more powerful and allow you to more easily build your infrastructure. Between Terraform and Pulumi, it ultimately comes down to personal preference. While Pulumi allows you to bring IaC into your backend code, Terraform offers an extensive set of features that make infrastructure easy to manage from day 1 to enterprise.

At [Multy](https://multy.dev) we are building a cloud-agnostic infrastructure tool that allows you to build your infrastructure on any cloud. We use Terraform both to deploy our own infrastructure, but also to deploy infrastructure on our customers behalves. Through are also available via the Multy Terraform Provider, where you can deploy cloud-agnostic resources into any cloud without having to re-write your configuration.

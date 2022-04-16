---
sidebar_position: 5
---

# Frequently Asked Questions

### Why build with Multy?

Multy was born after realising how difficult it is to run the same infrastructure across multiple clouds. While providers such as AWS and Azure share the same set of core services, the small differences in how each service works make it difficult to configure your infrastructure to run in the same way.

This is the problem that Multy aims to tackle. We created a single interface to deploy resources that have the same behaviour regardless of the cloud provider.

### Why not use the cloud specific Terraform providers?

While Terraform and its providers is great for deploying any resoure into any cloud, it puts all the heavy lifting on the infrastructure teams when it comes to understanding each provider and defining the resources. This flexibility can be seen as an advantage, however, when it comes to multi-cloud, this considerably slows down teams that are looking to move fast with deployments. 

By abstracting the common resources across major cloud providers, users are able to deploy the same resources on AWS and Azure without any re-writing any infrastructure code.

### When should I use Multy?

Some of the use cases where Multy can help:

- Looking to move clouds to leverage credits (i.e. AWS Accelerate / GCP Credits / Azure Startups)
- Could operate cheaper by switching cloud providers
- Want to future-proof infrastructure to be able to easily switch in the future

- Currently using more than one cloud
- Might need to leverage more than one cloud in the future
- Cross-cloud disaster recovery (i.e. pilot light, active-active, etc...)
- Want to leverage better pricing or fit customer requirements by easily changing providers

### When should I not use Multy?

Some of the use cases where Multy might not be the best fit:

- Highly custom infrastructure with many resources not supported by Multy
- Infrastructure will never be moved to a different cloud provider

### I want to use cloud managed resources (i.e. Amazon DynamoDB / Azure Key Vault), is Multy for me?

Multy's goal is to allow you to leverage cloud managed services and remain free to move your infrastructure. Not every resource will be supported, but we aim to support the most popular managed resources such as managed databases, object storage and vault. Let us know what services you would like to be support by creating an Issue on our [public repository](https://github.com/multycloud/multy). 

### What is the long-term vision?

Long-term, Multy plans to add features to assist in running multi-cloud workloads and improve developer experience.

These include:

- Deploy and manage resources through Multy Portal
- Cross-cloud data sync/replication
- Cross-cloud access management
- Disaster recovery
- Cloud-agnostic SDK
- Multi-cloud visibility into workloads and pricing
- Much more...

Any more ideas? Let us know us at <hello@multy.dev>!


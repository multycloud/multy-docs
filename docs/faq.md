---
sidebar_position: 8
---

# Frequently Asked Questions

### Why build with Multy?

Multy was born after realising how difficult it is to run the same infrastructure across multiple clouds. While providers such as AWS and Azure share the same set of core services, the small differences in how each service works make it difficult to configure your infrastructure to run in the same way.

This is the problem that Multy aims to tackle. We created a single interface to deploy resources that have the same behaviour regardless of the cloud provider.


### Can I use Multy for free?

Multy is available as a free and open-source tool, so you can download it directly from our [Repository](https://github.com/multycloud/multy) and run it locally.

We also offer a managed solution that hosts the server for you. Managed Multy is currently offered as a free service. You can request an API key on our [website](https://multy.dev)!


### Why not use the cloud specific Terraform providers?

While Terraform and its providers are great for deploying any resource into any cloud, it puts all the burden on the infrastructure teams when it comes to understanding each provider and defining the resources. This flexibility can be seen as an advantage, however, when it comes to multi-cloud, this considerably slows down teams that are looking to move fast with deployments. 

By abstracting the common resources across major cloud providers, users are able to deploy the same resources on AWS and Azure without re-writing any infrastructure code.

### When should I use Multy?

Some of the use cases where Multy can help:

- Operate cheaper by switching or running in multiple clouds
- Fit customer requirements to operate in a specific region/cloud
- Leverage credits from multiple providers (i.e. AWS Accelerate / GCP Credits / Azure Startups)
- Currently using more than one cloud
- Want to future-proof infrastructure to be able to easily switch in the future
- Cross-cloud disaster recovery (i.e. pilot light, active-active, etc...)


### When should I not use Multy?

Some of the use cases where Multy might not be the best fit:

- Highly custom infrastructure with many resources not supported by Multy
- Infrastructure that will never be moved to a different cloud provider

### I want to use cloud managed resources (i.e. Amazon S3 / Azure Key Vault), is Multy for me?

Absolutely! The goal with Multy is to allow you to leverage cloud managed services and remain free to move your infrastructure.
Not every resource will be supported, but we aim to support the most popular managed resources such as managed databases, object storage and vault. 

Let us know what services you would like to be supported by creating an Issue on our [public repository](https://github.com/multycloud/multy/issues). 

### What is the long-term vision?

Long-term, Multy plans to add features to assist in running multi-cloud workloads and improve developer experience.

These include:

- Deploy and manage resources through Multy Portal
- Cloud-agnostic SDK
- Cross-cloud visibility into workloads and pricing
- Cost estimate comparison between different clouds
- Cross-cloud data sync/replication
- Cross-cloud access management
- Disaster recovery
- Much more...

Any more ideas? Let us know us at <hello@multy.dev>!

### Why should I be locked in to Multy?

Multy is an open-source tool that can be run locally and free. If at some point you want to move off Multy, you can export your infrastructure configuration as Terraform and use it independently.


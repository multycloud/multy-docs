---
slug: benefits-of-multicloud
title: "Why Companies Are Increasingly Going Multi-Cloud"
authors: [dan]
tags: [cloud,multicloud]
---

Multi-cloud strategy – the use of multiple private or public clouds – is increasingly becoming the main method companies use to deploy their IT infrastructure. In the next three years, an estimate 64% of companies will rely on multi-cloud as their main deployment model [1]([https://google.com](https://www.nutanix.com/enterprise-cloud-index)).  Despite the complexities that come from operationalizing it, as we disccussed in [The Challenges of Building Multi Cloud](https://docs.multy.dev/blog/challenges-of-building-multi-cloud/), the multiple benefits that come from this deployment model can often make it worth the effort. So, what makes multi-cloud so attractive?

<!--truncate-->

### Cloud Vendor Lock-in

Business leaders are concerned about cloud vendor lock-in as it leaves them at the mercy of a single provider and reduces their flexibility to respond to business needs. Vendor lock-in can be detrimental for organizations as it leaves them exposed to massive price hikes ([GCP increases prices up to 50% in some of its services](https://techcrunch.com/2022/03/14/inflation-is-real-google-cloud-raises-its-storage-prices/)), possible declines in the quality of service and changes in product offering that no longer align with the business.   

### Costs & Credits

With multi-cloud, you can have the option of running your workloads where it's more cost-optimal to do so. Depending on your particular needs, running on one cloud provider versus another can make a big difference in terms of costs to your organization. For example, AWS is notoriously more expensive than Azure for data intensive applications. The same happens when running Windows Server and SQL Server on AWS, which can be up to 5 times more expensive than Azure [source](https://multy.dev).

### Business and Compliance Requirements

Multi-cloud allows your business to rapidly respond to arising business needs. A customer might require you to run on a particular cloud provider for them to meet their own compliance needs. Or you might need to use a particular provider because of data sovereignty requirements (i.e. need to use Azure in Switzerland as AWS doesn’t have a region there yet). If you are reactive to these business requirements, you will lose momentum and likely business because you haven't built flexibility. With multi-cloud, you have the necessary flexibility to rapidly respond to any requirements.

### Resilience & Disaster Recovery

Businesses are increasingly running business critical applications in the cloud. Thus, to continue having a high degree of resilience, it is becoming mandatory for them to diversify and mitigate the risks they face when using just a single provider. For example, just in December 2021, AWS suffered three outages that lasted for hours taking down several sites and services [source](https://www.zdnet.com/article/aws-suffers-third-outage-of-the-month/).  Multi-cloud strategies help businesses improve their resilience by having less reliance on a single cloud provider while also gaining the flexibility of rapidly switching workloads when outages occur.

In fact, for some businesses such as financial services operating in EU and UK, regulation (i.e. [Digital Operational Resilience Act – ‘DORA’](https://www.consilium.europa.eu/en/press/press-releases/2022/05/11/digital-finance-provisional-agreement-reached-on-dora/)) will increasingly push businesses to adopt multi-cloud setups to reduce the risk they face by having a high proportion of their workloads tied to a single cloud provider - Cloud Concentration Risk.   

### Best-in Class

With multi-cloud companies can leverage the best-in class services to run their workloads. This can help accelerate the cloud transformation of businesses by allowing them to choose the best cloud provider where it really matters. For example, they could be hosting their customer-facing applications on AWS while processing large volumes of data with GCP’s BigQuery.  

## Conclusion

Multi-cloud offers various benefits for those that adopt it. It can help companies realize cost savings by running the workloads in the most cost-efficient clouds, help the business quickly respond to its growing needs and to comply with regulation, improve resilience and offer the possibility to use the best cloud provider for a particular task.

At Multy we are enabling companies to more easily deploy a multi-cloud infrastructure with our open-source tool that makes it easy to run on any cloud. To learn more about Multy, have a look through our [documentation](https://docs.multy.dev/introduction) and [join our open beta](https://multy.dev/#beta). Continue the discussion in [our discord channel](https://discord.com/invite/rgaKXY4tCZ)!

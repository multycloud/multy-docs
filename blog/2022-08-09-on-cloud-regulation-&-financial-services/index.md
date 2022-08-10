---
slug: cloud-regulation-&-financial-services
title: "On cloud regulation, financial services & multi-cloud"
image: ./multi-cloud.png
authors: [dan]
tags: [cloud,multicloud,regulation,financial services]
---
<div class="text--center" >

<div style={{display: 'block',marginLeft: 'auto',marginRight: 'auto',width: '70%'}}>

![On Cloud Regulation & Financial Services](./multi-cloud.png)

</div>

</div>

Cloud computing can bring many benefits to financial services companies such as increased speed and agility, easier innovation and scalability. It is no wonder then that cloud adoption is set to continue increasing with [54% of financial services companies](https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/three-big-moves-that-can-decide-a-financial-institutions-future-in-the-cloud) expected to have more than half of their entire IT footprint in public clouds in the next five years. However, despite the benefits that this can bring for financial services, it also brings a new set of challenges for financial market stability.

[Financial regulators are becoming increasingly worried](https://www.ft.com/content/29405a47-586b-4c5a-b641-0f479b4cee1d) of the implications the increased adoption of cloud can have as more and more financial services companies are gradually becoming more reliant on Cloud Service Providers (“CSP”). With the dominance of the space by Amazon, Microsoft and Google, the failure of any one of them could prove a single point of failure for a big portion of the financial system. Consequently, regulators have proposed regulation that aims to lower the systemic risk this dependance introduces into the system. This involves everything from doing proper due diligence and risk assessments of the CSPs to having architectures and plans in place that reduce operational risk and increase resilience.

<!--truncate-->

### Regulation in the EU and UK

Following are some of the regulations that have been adopted or proposed in the space in the EU and the UK during the past five years.

| Date                                               | Regulator                                               | Regulation                                                       |
|----------------------------------------------------|---------------------------------------------------------|------------------------------------------------------------------|
| Dec-2017                                           | EU & UK                                                 | Recommendations on Outsourcing to Cloud Service Providers        |
| Feb-2019                                           | EU & UK                                                 | Guidelines on Outsourcing                                        |
| Sep – 2020*                                        | EU                                                      | Digital Operational Resilience Act (“DORA”)                      |

The Digital Operation Resilience Act (“DORA”), first published in 2020, is expected to be finalized and start to be implemented towards the end of 2022. This Act aims to improve the resiliency of the financial sector to Information and Telecommunications (“ICT”) related incidents. DORA creates a regulatory framework that seeks to ensure that the financial system has the required safeguards to mitigate cyber-attacks and other possible causes of disruption.  It’s expected that companies addressed in this Act (from CSPs to crypto exchanges) will have two years to comply with this new regulation.

### Main considerations & multicloud

Although regulation has reasonably shied away from becoming too prescriptive in how financial services companies run their operations and architect in the cloud, it has become more and more demanding in terms of requirements companies need to comply with. Initially, the regulation didn’t lead to having organizations use a multi-cloud or hybrid-cloud setup, just with having multi-region or multi-availability zone architecture was enough to have the “required” resilience. However, with regulation now including topics such as concentration risk to a single CSP (i.e. [DORA – Chapter V article 26]( https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A52020PC0595#:~:text=1094/2010%2C%20respectively.-,Article%2026,-Preliminary%20assessment%20of)), substitutability/portability (i.e. [SS2/21 – Section 10](https://www.prevalent.net/compliance/pra-ss2-21/#:~:text=10%20Business%20continuity%20and%20exit%20plans)) and robust exit strategies (i.e. [DORA – Chapter V article 25.9](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A52020PC0595#:~:text=9.-,Financial%20entities,-shall%20put%20in)), a multi-cloud or hybrid-cloud architecture now appears to be the future.
Here a more detailed view on these concepts:
- **Concentration Risk:** Regulation wants financial services companies to assess, when contracting with an ICT third party, how dependent they would become such that the unavailability, failure or shortfall of service of the provider can endanger the ability of the financial entity to deliver its critical functions or suffer adverse effects.
- **Substitutability:** The ability, if necessary or desirable, to transfer the proposed cloud outsourcing arrangement to another CSP or reintegrate the services in other ways possible (e.g. on premise).
- **Exit Strategies:** Financial service companies need to ensure that they can exit their contractual arrangements (e.g. exit their current public cloud) without having disruptions to their services, limiting their compliance with regulatory requirements, or damage their business continuity and the quality of their service to customers.

These concepts combined indicate that financial institutions need to plan ahead and build in a way that provides them with the flexibility to fail over safely to another CSP and be able to move from one cloud provider to another without business disruption when needed.

### Summary
Regulation of the use of cloud by financial institutions and increased scrutiny by regulators are here to stay. With the final draft of the EU Digital Operational Resilience Act (“DORA”) to be released towards the end of 2022 and the UK Prudential Regulation Authority increasing its level of scrutiny, financial institutions need to move towards having less reliance on a single CSP.
Yet, this can be a very challenging task as building for multiple clouds is not an easy process. At Multy, we are helping solve this challenge by offering an open-source tool that makes it easy to run on any cloud. To learn more about Multy or be kept up to date: https://multy.dev To continue the discussion, join our [Discord channel](https://discord.gg/QfPb4EqNs2).    

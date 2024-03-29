---
sidebar_position: 5
---

# Virtual machine sizes

Below is a breakdown of Multy virtual machine sizes and how they relate to the respective supported cloud providers.

## General

| Multy           | vCPUs | RAM (GiB) | AWS        | Azure         | GCP
| --------------- | ----- | --------- | ---------- | ------------- | ------------
| general_nano    | 1     | 0.5       | t2.nano    | Standard_B1ls | f1-micro
| general_micro   | 1     | 1         | t2.micro   | Standard_B1s  | e2-micro
| general_small   | 1     | 2         | t2.small   | Standard_B1ms | e2-small
| general_medium  | 2     | 4         | t2.medium  | Standard_B2s  | e2-medium
| general_large   | 2     | 8         | t2.large   | Standard_B2ms | e2-standard-2
| general_xlarge  | 4     | 16        | t2.xlarge  | Standard_B4ms | e2-standard-4
| general_2xlarge | 8     | 32        | t2.2xlarge | Standard_B8ms | e2-standard-8

## Compute

| Multy           | vCPUs (AWS / Azure) | RAM (GiB) (AWS / Azure) | AWS        | Azure            | GCP            |
| --------------- | ------------------- | ----------------------- | ---------- | ---------------- |----------------|
| compute_large   | 2                   | 3.75 / 4                | c4.large   | Standard_F2s_v2  | c2d-highcpu-2  |
| compute_xlarge  | 4                   | 7.5 / 8                 | c4.xlarge  | Standard_F4s_v2  | c2d-highcpu-4  |
| compute_2xlarge | 8                   | 15 / 16                 | c4.2xlarge | Standard_F8s_v2  | c2d-highcpu-8  |
| compute_4xlarge | 16                  | 30 / 32                 | c4.4xlarge | Standard_F16s_v2 | c2d-highcpu-16 |
| compute_8xlarge | 36 / 32             | 60 / 64                 | c4.8xlarge | Standard_F48s_v2 | c2d-highcpu-32 |

## Memory

| Multy           | vCPUs (AWS / Azure) | RAM (GiB) | AWS          | Azure            | GCP           |
| --------------- | ------------------- | --------- | ------------ |------------------|---------------|
| memory_large    | 2                   | 16        | r6i.large    | Standard_E2s_v5  | e2-highmem-2  |
| memory_xlarge   | 4                   | 32        | r6i.xlarge   | Standard_E4s_v5  | e2-highmem-4  |
| memory_2xlarge  | 8                   | 64        | r6i.2xlarge  | Standard_E8s_v5  | e2-highmem-8  |
| memory_4xlarge  | 16                  | 128       | r6i.4xlarge  | Standard_E16s_v5 | e2-highmem-16 |
| memory_8xlarge  | 32                  | 256       | r6i.8xlarge  | Standard_E32s_v5 | e2-highmem-32 |
| memory_12xlarge | 42 / 48             | 384       | r6i.12xlarge | Standard_E48s_v5 | e2-highmem-48 |
| memory_16xlarge | 64                  | 512       | r6i.16xlarge | Standard_E64s_v5 | e2-highmem-64 |

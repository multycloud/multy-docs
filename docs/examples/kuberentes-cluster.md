---
sidebar_position: 4
---

# Kubernetes cluster

This examples creates a managed Kubernetes cluster (EKS/AKS/GKE) in both AWS and GCP. 
It deploys a node pool that is automatically scaled by the cloud provider up to 3 nodes.  

You can change which clouds to deploy in by changing the `clouds` variable.

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
  gcp     = {"project" = "multy-project"}
}

variable "clouds" {
  type    = set(string)
  default = ["aws", "gcp"]
}

resource "multy_virtual_network" "vn" {
  for_each = var.clouds
  cloud    = each.key

  name       = "multy-vm"
  cidr_block = "10.0.0.0/16"
  location   = "eu_west_2"
}

resource "multy_subnet" "subnet" {
  for_each = var.clouds

  name               = "multy-subnet"
  cidr_block         = "10.0.10.0/24"
  virtual_network_id = multy_virtual_network.vn[each.key].id
}

resource "multy_route_table" "rt" {
  for_each           = var.clouds
  name               = "multy-rt"
  virtual_network_id = multy_virtual_network.vn[each.key].id
  route {
    cidr_block  = "0.0.0.0/0"
    destination = "internet"
  }
}

resource "multy_route_table_association" "rta" {
  for_each       = var.clouds
  route_table_id = multy_route_table.rt[each.key].id
  subnet_id      = multy_subnet.subnet[each.key].id
}

resource "multy_kubernetes_cluster" "cluster1" {
  for_each           = var.clouds
  cloud              = each.key
  location           = "eu_west_2"
  name               = "multy-cluster1"
  virtual_network_id = multy_virtual_network.vn[each.key].id

  default_node_pool = {
    name                = "default"
    starting_node_count = 1
    min_node_count      = 1
    max_node_count      = 3
    vm_size             = "general_medium"
    disk_size_gb        = 10
    subnet_id           = multy_subnet.subnet[each.key].id
    availability_zones  = [1]
  }
  
  depends_on              = [multy_route_table_association.rta]
}

resource "local_sensitive_file" "kubectl" {
  for_each = var.clouds
  filename = pathexpand(length(var.clouds) > 1? "~/.kube/config-${each.key}": "~/.kube/config")
  content = multy_kubernetes_cluster.cluster1[each.key].kube_config_raw
}
```

After deployment, you can interact with the clusters by running `kubectl` with the right kube config. For example:

```bash
kubectl --kubeconfig=$HOME/.kube/config-AWS get nodes
kubectl --kubeconfig=$HOME/.kube/config-GCP get nodes
```
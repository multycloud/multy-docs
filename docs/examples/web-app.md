---
sidebar_position: 3
---

# Web App

This example deploys a three tier web application that is hosted on both AWS and Azure.

Resources deployed:
* Virtual network and 3 public subnets
* Virtual machine with sample NodeJS app deployed via user_data [scripts](#)
* Database deployed on AWS 
* Secrets stored in vault and used in the init scripts

```hcl
terraform {
  required_providers {
    multy = {
      source = "multycloud/multy"
    }
  }
}

provider "multy" {
  api_key         = "xxx"
  aws             = {}
  azure           = {}
}

variable "location" {
  type    = string
  default = "eu_west_1"
}

variable "clouds" {
  type    = set(string)
  default = ["aws", "azure"]
}

variable "db_cloud" {
  type    = string
  default = "aws"
}

resource "multy_virtual_network" "vn" {
  for_each   = var.clouds
  name       = "web_app_vn"
  cidr_block = "10.0.0.0/16"
  cloud      = each.key
  location   = var.location
}

resource "multy_subnet" "vm_subnet" {
  for_each           = var.clouds
  name               = "web_app_vm_subnet"
  cidr_block         = "10.0.10.0/24"
  virtual_network_id = multy_virtual_network.vn[each.key].id
}

resource "multy_subnet" "db_subnet" {
  for_each           = var.clouds
  name               = "web_app_db_subnet"
  cidr_block         = "10.0.11.0/24"
  virtual_network_id = multy_virtual_network.vn[each.key].id
  availability_zone  = 1
}

resource "multy_subnet" "db_subnet2" {
  for_each           = var.clouds
  name               = "web_app_db_subnet2"
  cidr_block         = "10.0.12.0/24"
  virtual_network_id = multy_virtual_network.vn[each.key].id
  availability_zone  = 2
}

resource "multy_route_table" "rt" {
  for_each           = var.clouds
  name               = "web_app_rt"
  virtual_network_id = multy_virtual_network.vn[each.key].id
  route {
    cidr_block  = "0.0.0.0/0"
    destination = "internet"
  }
}

resource "multy_route_table_association" "rta1" {
  for_each       = var.clouds
  route_table_id = multy_route_table.rt[each.key].id
  subnet_id      = multy_subnet.vm_subnet[each.key].id
}

resource "multy_route_table_association" "rta2" {
  for_each       = var.clouds
  route_table_id = multy_route_table.rt[each.key].id
  subnet_id      = multy_subnet.db_subnet[each.key].id
}

resource "multy_route_table_association" "rta3" {
  for_each       = var.clouds
  route_table_id = multy_route_table.rt[each.key].id
  subnet_id      = multy_subnet.db_subnet2[each.key].id
}

resource "multy_network_security_group" "nsg" {
  for_each           = var.clouds
  name               = "web_app_nsg"
  virtual_network_id = multy_virtual_network.vn[each.key].id
  cloud              = each.key
  location           = var.location
  rule {
    protocol   = "tcp"
    priority   = 120
    from_port  = 22
    to_port    = 22
    cidr_block = "0.0.0.0/0"
    direction  = "both"
  }
  rule {
    protocol   = "tcp"
    priority   = 131
    from_port  = 443
    to_port    = 443
    cidr_block = "0.0.0.0/0"
    direction  = "both"
  }
  rule {
    protocol   = "tcp"
    priority   = 132
    from_port  = 4000
    to_port    = 4000
    cidr_block = "0.0.0.0/0"
    direction  = "both"
  }
}

resource "multy_virtual_machine" "vm" {
  for_each           = var.clouds
  name               = "web_app_vm"
  size               = each.key == "azure" ? "large" : "micro"
  image_reference    = {
    os      = "cent_os"
    version = "8.2"
  }
  subnet_id          = multy_subnet.vm_subnet[each.key].id
  generate_public_ip = true
  user_data          = base64encode(templatefile("./${each.key}_init.sh", {
    vault_name : multy_vault.web_app_vault[each.key].name,
    db_host_secret_name : multy_vault_secret.db_host[each.key].name,
    db_username_secret_name : multy_vault_secret.db_username[each.key].name,
    db_password_secret_name : multy_vault_secret.db_password[each.key].name,
  }))

  public_ssh_key = file("./ssh_key.pub")
  cloud          = each.key
  location       = var.location

  depends_on = [multy_network_security_group.nsg]
}

resource "random_password" "password" {
  length = 16
}

resource "multy_database" "example_db" {
  for_each       = [var.db_cloud]
  storage_gb     = 10
  name           = "exampledbmulty"
  engine         = "mysql"
  engine_version = "5.7"
  username       = "multyadmin"
  password       = random_password.password.result
  size           = "micro"
  subnet_ids     = [multy_subnet.db_subnet[each.key].id, multy_subnet.db_subnet2[each.key].id]
  cloud          = each.key
  location       = var.location

  depends_on = [multy_route_table_association.rta2, multy_route_table_association.rta3]
}

resource "multy_vault" "web_app_vault" {
  for_each = var.clouds
  #  for_each = var.clouds
  name     = "web-app-vault-test"
  cloud    = each.key
  location = var.location
}
resource "multy_vault_secret" "db_host" {
  for_each = var.clouds
  name     = "db-host"
  vault_id = multy_vault.web_app_vault[each.key].id
  value    = multy_database.example_db[var.db_cloud].hostname
}
resource "multy_vault_secret" "db_username" {
  for_each = var.clouds
  name     = "db-username"
  vault_id = multy_vault.web_app_vault[each.key].id
  value    = multy_database.example_db[var.db_cloud].username
}
resource "multy_vault_secret" "db_password" {
  for_each = var.clouds
  name     = "db-password"
  vault_id = multy_vault.web_app_vault[each.key].id
  value    = random_password.password.result
}
resource "multy_vault_access_policy" "kv_ap" {
  for_each = var.clouds
  vault_id = multy_vault.web_app_vault[each.key].id
  identity = multy_virtual_machine.vm[each.key].identity
  access   = "owner"
}
output "aws_endpoint" {
  value = "http://${multy_virtual_machine.vm["aws"].public_ip}:4000"
}

output "azure_endpoint" {
  value = "http://${multy_virtual_machine.vm["azure"].public_ip}:4000"
}
```
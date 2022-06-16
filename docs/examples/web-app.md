---
sidebar_position: 3
---

# Web App

This example deploys a three tier web application that is hosted on both AWS and Azure.

Resources deployed:
* Virtual network and 3 public subnets
* Virtual machine with sample NodeJS app deployed via user_data scripts
* Database deployed on AWS 

```hcl
terraform {
  required_providers {
    multy = {
      source = "multycloud/multy"
    }
  }
}

provider "multy" {
  api_key         = "XXX-YYY-ZZZ"
  aws             = {}
  azure           = {}
}

variable "location" {
  type    = string
  default = "eu_west_2"
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
    priority   = 121
    from_port  = 80
    to_port    = 80
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

locals {
  init_script = <<EOT
#!/bin/bash -xe

sudo apt-get update -y && sudo apt-get -y install git npm mysql-client curl jq
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo chmod a+rwx .

# putting secrets into user data is not best practice, you can use multy_vault instead
export DATABASE_HOST=${multy_database.example_db[var.db_cloud].hostname}
export DATABASE_USER=${multy_database.example_db[var.db_cloud].connection_username}
export DATABASE_PASSWORD='${multy_database.example_db[var.db_cloud].password}'
# both aws and az will try to run this command but only one will succeed
mysql -h $DATABASE_HOST -P 3306 -u $DATABASE_USER --password=$DATABASE_PASSWORD -e 'source database/db.sql' || true

git clone https://github.com/FaztTech/nodejs-mysql-links.git
cd nodejs-mysql-links
npm i && npm run build && npm start
EOT
}


resource "multy_virtual_machine" "vm" {
  for_each           = var.clouds
  name               = "web_app_vm"
  size               = "general_nano"
  image_reference    = {
    os      = "ubuntu"
    version = "18.04"
  }
  subnet_id          = multy_subnet.vm_subnet[each.key].id
  generate_public_ip = true
  user_data_base64   = base64encode(local.init_script)
  public_ssh_key = file("./ssh_key.pub")
  cloud          = each.key
  location       = var.location

  network_security_group_ids = [multy_network_security_group.nsg[each.key].id]
  depends_on = [multy_network_security_group.nsg]
}

resource "random_password" "password" {
  length = 16
  override_special = "!#"
  special = true
}

resource "multy_database" "example_db" {
  for_each       = toset([var.db_cloud])
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
output "aws_endpoint" {
  value = "http://${multy_virtual_machine.vm["aws"].public_ip}:4000"
}

output "azure_endpoint" {
  value = "http://${multy_virtual_machine.vm["azure"].public_ip}:4000"
}
```

# terraform-ansible-inventory

![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)

This action creates an Ansible inventory file from terraform state by:
- Parsing `terraform state pull`

Supported provider-resource pairs:
- `azurerm`-`azurerm_network_interface`
- `google`-`google_compute_instance`

# Prerequisite

A valid state file in JSON format is required.

**Option a)**
  Pull the state file in JSON format and place it to your repository.

**Option b)**
  Pull the state file using "terraform state pull" during the workflow run and redirect it to a file. However, you need to filter out the lines what github action append to it.
  
  
  *Example for "Option b)":*
```yaml
...

- name: Pull the state file in json
  run: terraform state pull > state.out

- name: Preprocess the state file for terraform-ansible-inventory action
  run: grep -vE "/home|^$|^:" state.out > state.json

...
```

# Usage

See [action.yml](action.yml)

```yaml
steps:
- name: Checkout code
  uses: actions/checkout@master

- name: Prepare terraform action
  uses: hashicorp/setup-terraform@v1

- name: Pull the state file in json
  run: terraform state pull > state.out

- name: Preprocess the state file for terraform-ansible-inventory
  run: grep -vE "/home|^$|^:" state.out > state.json 

- name: Create inventory
  uses: lhsystems/terraform-ansible-inventory@v1
  with:
    state-file: state.json
    hosts-file: inventory
```

## Inputs

## `state-file`

**Required** 'State file in json form' Default `"${{ github.workspace }}/state.json"`.

## `host-file`
**Required** 'Host file name to produce' Default `"${{ github.workspace }}/inventory"`.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)


# Notes

The commit history has been pruned to eliminate any possible confusion in the future and to ensure a secure start from the date of the publication.
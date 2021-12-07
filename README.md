
# terraform-ansible-inventory

![Ansible](https://img.shields.io/badge/ansible-%231A1918.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)

This action creates an Ansible inventory file from terraform state by:
- Parsing `terraform state pull`
- Pulling state file from TFE/TFC

Supported provider-resource pairs:
- `azurerm`-`azurerm_network_interface`
- `google`-`google_compute_instance`

# Prerequisite

A valid state file in JSON format is required.

# Usage

See [action.yml](action.yml) and [USAGE](USAGE.md)

## Inputs

## `state-file`

**Required** 'State file in json form' Default `"${{ github.workspace }}/state.json"`. (ignored if `state-pull` is `true`)

## `hosts-file`
**Required** 'Hosts file name to produce' Default `"${{ github.workspace }}/inventory"`.

## `state-pull`
**Required** 'Whether the action should pull the state file(`true` or `false`).' Default `false`.

## `state-source`
**Optional (required if state_pull is `true`)** 'The source of the state file. Possible and default values: `tfe`'

## `organization`
**Optional (required if state_source is `tfe`)** 'The organization in TFE.'

## `workspace`
**Optional (required if state_source is `tfe`)** 'The workspace in TFE.'

## `api-token`
**Optional (required if state_source is `tfe`)** 'The API token for accessing TFE'


# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)


# Notes

The commit history has been pruned to eliminate any possible confusion in the future and to ensure a secure start from the date of the publication.

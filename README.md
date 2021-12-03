
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
  Pull the state file using "terraform state pull" during the workflow run and redirect it to a file. However, you need to set `terraform_wrapper`  to `false` for the terraform setup action to filter out the lines what the wrapper generates.

  *Example for "Option b)":*
```yaml
...
- name: Prepare terraform action
  uses: hashicorp/setup-terraform@v1
  with:
    terraform_wrapper: false

... # plan, apply stage

- name: Pull the state file in json
  run: terraform state pull > state.json

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
  with:
    terraform_wrapper: false
    cli_config_credentials_token: ${{ secrets.YOURTOKEN }}

- name: Terraform Init (init)
  run: terraform init -upgrade

- name: Terraform Validate (validate)
  run: terraform validate -no-color

- name: Terraform Apply (apply)
  run: terraform apply -auto-approve

- name: Pull the state file in json
  run: terraform state pull > state.json

- name: Create inventory
  uses: lhsystems/terraform-ansible-inventory@v1
  with:
    state-file: ${{ github.workspace }}/state.json
    hosts-file: ${{ github.workspace }}/inventory
```

## Inputs

## `state-file`

**Required** 'State file in json form' Default `"${{ github.workspace }}/state.json"`.

## `hosts-file`
**Required** 'Hosts file name to produce' Default `"${{ github.workspace }}/inventory"`.

## `state_pull`
**Required** 'Whether the action should pull the state file(`true` or `false`).' Default `false`.

## `state_source`
**Optional (required if state_pull is `true`)** 'The source of the state file. Possible values: `tfe`'

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

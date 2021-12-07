
# terraform-ansible-inventory

## How to use it ?

This action can be used in three ways.
- **Option a)**
  Pull the state file using "terraform state pull" during the workflow run and redirect it to a file.
- **Option b)**
  Use Terraform Enterprise/Terraform Cloud as the source of the state file and pull the latest state of your workspace from there. (API call to pull state is integrated into the action)
- **Option c)**
  Pull the state file in JSON format and place it to your repository.

---
### Examples (the action itself)

**Option a):**
Using setup-terraform action to implement your changes into your state file and pull it after apply. Set `terraform_wrapper` to `false` to avoid extra characters in your state file. 

To apply your state is a prerequisite in this case.
```yaml
...
- name: Prepare terraform action
  uses: hashicorp/setup-terraform@v1
  with:
    terraform_wrapper: false

... # plan, apply stage

# Be aware of that if you did not use apply during the workflow, you cannot pull your state
- name: Pull the state file in json
  run: terraform state pull > state.json

- name: Create inventory
  uses: lhsystems/terraform-ansible-inventory@v1
  with:
    state-file: ${{ github.workspace }}/state.json
    hosts-file: ${{ github.workspace }}/inventory

...
```

**Option b):**
If you have Terraform Enterprise/Terraform Cloud you can pull your state file directly from your workspace. Using this method you do not have to use `terraform [apply|pull]` commands beforehand.

```yaml
...
- name: Create inventory
  uses: lhsystems/terraform-ansible-inventory@v1
  with:
    hosts-file: ${{ github.workspace }}/inventory
    # Let the action knwo that you want it to pull the state
    state-pull: true
    # Your tfe organization
    organization: 'myorg'
    # Your tfe workspace
    workspace: 'myworkspace'
    # Your API token for tfe (Github secret)
    api-token: ${{ secrets.MY_API_TOKEN }}
...
```
**`state-file` is ignored if state-pull is `true`**

**Option c):** You have your state file in your repository
```yaml
...
# You have your state file in your repository. (for e.g. in a folder called terraform) 
  uses: lhsystems/terraform-ansible-inventory@v1
  with:
    state-file: ${{ github.workspace }}/terraform/state.json
    hosts-file: ${{ github.workspace }}/inventory
...
```
---
### Example workflow with ansible and "Option b)"
```yaml
ansible-execute:
  needs: terraform-execute
  runs-on: [ubuntu-latest]
  steps:
    - name: Checkout code
      uses: actions/checkout@v2
      with:
        ref: ${{ github.event.pull_request.head.ref }}

    - name: Create inventory
      uses: lhsystems/terraform-ansible-inventory@v1
      with:
        hosts-file: ${{ github.workspace }}/inventory
        # Let the action knwo that you want it to pull the state
        state-pull: true
        # Your tfe organization
        organization: 'myorg'
        # Your tfe workspace
        workspace: 'myworkspace'
        # Your API token for tfe (Github secret)
        api-token: ${{ secrets.MY_API_TOKEN }}
      
    - name: Set up Python 3
      uses: actions/setup-python@v2
      with:
        python-version: '3.x'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install ansible==2.9.2 requests

    - name: Lint Ansible Playbook
      uses: ansible/ansible-lint-action@master
      with:
        # Directory where playbooks live
        targets: "ansible/*"
        args: ""

    - name: Run playbook
      uses: dawidd6/action-ansible-playbook@v2
      with:
        # Required, playbook filepath
        playbook: play.yml
        # Directory where playbooks live
        directory: ${{ github.workspace }}/ansible
        # Optional, SSH private key: comes from the example of dawidd6
        key: ${{secrets.SSH_PRIVATE_KEY}}
        # Options for ansible
        options: |
          --inventory ${{ github.workspace }}/inventory
```
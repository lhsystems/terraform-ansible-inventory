// Import modules and files
'use strict';
const core = require('@actions/core')

// Get our utilities
const utils = require('./lib/utils')
const getState = require('./lib/get_state')
// State file pull call
async function statePull() {
    const stateSource = await core.getInput('state-source')
    const stateFileName = await core.getInput('state-file')
    const jsonName = await getState.pullStateFile(stateSource, stateFileName)
    return jsonName
}
// Action runner function
async function init(){
    // Declare required variables
    let jsonData;
    let statePullInput = await core.getBooleanInput('state-pull')
    try {
        // Check whether the action should pull the state file
        if (statePullInput) {
            jsonData = await statePull()
        } else {
            const jsonFileToRead = await core.getInput('state-file').toString()
            jsonData = await require(jsonFileToRead)
        }
        // Generate the host groups for ansible
        const tfIPConfigs = await utils.getGroups(utils.getResources(jsonData))
        // Create the hosts file. `hosts-file` input defined in action metadata file
        await utils.createHostFile(tfIPConfigs, core.getInput('hosts-file'))
    } catch (error) {
        core.setFailed(error.message);
    }
}
// Run the action
init()
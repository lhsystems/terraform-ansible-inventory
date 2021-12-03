// Import modules and files
'use strict';
const core = require('@actions/core')

// Get our utilities
const utils = require('./lib/utils')
const getState = require('./lib/get_state')

async function statePull() {
    const state_source = await core.getInput('state-source')
    const stateFileName = await core.getInput('state-file')
    const jsonName = await getState.pullStateFile(state_source, stateFileName)
    return jsonName
}

async function init(){
    let jsonData;
    // Should I get the state file?
    const state_pull = await core.getBooleanInput('state-pull')
    try {
        if (state_pull) {
            jsonData = await statePull()
        } else {
            const jsonFileToRead = await core.getInput('state-file').toString()
            jsonData = await require(jsonFileToRead)
        }
        console.log(jsonData)
        const tfIPConfigs = await utils.getGroups(utils.getResources(jsonData))
        // Create the hosts file. `hosts-file` input defined in action metadata file
        await utils.createHostFile(tfIPConfigs, core.getInput('hosts-file'))
    } catch (error) {
        core.setFailed(error.message);
    }
}

init()
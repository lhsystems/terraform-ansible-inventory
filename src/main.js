// Import modules and files
'use strict';
const core = require('@actions/core');
const github = require('@actions/github');

// Get our utilities
const utils = require('./lib/utils')
const getState = require('./lib/get_state')

// Should I get the state file?
const state_pull = core.getInput('state-pull')

async function statePull() {
    const state_source = await core.getInput('state-source')
    const stateFileName = await core.getInput('state-file')
    const jsonName = await getState.pullStateFile(state_source, stateFileName)
    return jsonName
}

async function init(){
    try {
        if (state_pull) {
            const jsonData = await statePull()
        } else {
            const jsonFileToRead = await core.getInput('state-file').toString()
            const jsonData = await require(jsonFileToRead)
        }
        const tfIPConfigs = await utils.getGroups(utils.getResources(jsonData))
        // Create the hosts file. `hosts-file` input defined in action metadata file
        utils.createHostFile(tfIPConfigs, 'hosts-file')
    } catch (error) {
        core.setFailed(error.message);
    }
}

init()
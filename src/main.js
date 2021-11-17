// Import modules and files
'use strict';
const core = require('@actions/core');
const github = require('@actions/github');

// Get our utilities
const utils = require('./lib/utils')


const jsonFileToRead = core.getInput('state-file').toString()
const jsonData = require(jsonFileToRead)
const tfIPConfigs = utils.getGroups(utils.getResources(jsonData))

function init(){
    try {
        // Create the hsot file. `host-file` input defined in action metadata file
        utils.createHostFile(tfIPConfigs, core.getInput('host-file'))
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    } 
}


init()
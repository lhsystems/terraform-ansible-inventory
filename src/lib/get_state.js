// Import modules and files
'use strict'
const core = require('@actions/core')
const tfe = require('./tfe')

async function pullStateFile(source) {
    switch (source) {
      case 'tfe': {
        const organization = await core.getInput('organization')
        const workspace = await core.getInput('workspace')
        const apiToken = await core.getInput('api-token')
        const jsonState = await tfe.tfePull(apiToken, organization, workspace)
        return jsonState
      }
      default: {
        // Set the action to failed if the state source is not supported
        core.setFailed(`Unsupported state source has been detected: ${source}`);        
      }

    }
}

// Exporting the required modules
module.exports = {
    pullStateFile
}
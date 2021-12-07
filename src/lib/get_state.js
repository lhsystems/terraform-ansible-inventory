// Import modules and files
'use strict'
const core = require('@actions/core')
const tfe = require('./tfe')
// Pull the state filw from the given source
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
        throw new Error(`Unsupported state source has been detected: ${source}`)        
      }

    }
}

// Exporting the required modules
module.exports = {
    pullStateFile
}
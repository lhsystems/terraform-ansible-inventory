// Import modules and files
'use strict'
const core = require('@actions/core')
const tfe = require('./tfe')

// Create an object with the required attributes for the API call
function getApiObject(source) {
  let apiObject = {}
  switch(source) {
    case 'tfe': {
      apiObject.tfe = {}
      apiObject.tfe.organization = core.getInput('organization')
      apiObject.tfe.workspace = core.getInput('workspace')
      apiObject.tfe.apiToken = core.getInput('api-token')
      apiObject.tfe.apiUrl = core.getInput('api-url') || 'https://app.terraform.io'
      return apiObject
    }
    default: {
      return apiObject = {}
    }
  }
}

// Pull the state filw from the given source
async function pullStateFile(source) {
    switch (source) {
      case 'tfe': {
        const apiObject = await getApiObject(source)
        const jsonState = await tfe.tfePull(apiObject.tfe)
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


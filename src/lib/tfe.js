// Import axios for API call and fs for creating a file
'use strict'
const axios = require('axios');

// Get the data from the specified URL
async function getDataFromURL(dataUrl, instance) {
    const response = await instance.get(dataUrl)
    return response.data
}

// Get the data from the workspace (using async await, instead of nested .then)
async function tfePull(apiToken, organization, workspace) {
    // Create the axios config for the request
    const instance = axios.create({
        baseURL: 'https://app.terraform.io',
        timeout: 5000,
        headers: {'Authorization': 'Bearer '+ apiToken}
    });
    // Setup the URL using the org and ws
    const tfeUrl = `https://app.terraform.io/api/v2/organizations/${organization}/workspaces/${workspace}`
    // Get the workspace data part of the API response
    const workspaceData = await getDataFromURL(tfeUrl, instance)
    // Get the URL for the latest state file
    const currentState = await getDataFromURL(workspaceData.data.relationships['current-state-version'].links.related, instance)
    // Get the state file itself
    const stateFile = await getDataFromURL(currentState.data.attributes['hosted-state-download-url'], instance)
    return stateFile
}

// Exporting the required modules
module.exports = {
    tfePull
}
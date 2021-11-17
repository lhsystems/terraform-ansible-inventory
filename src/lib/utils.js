// Import modules and files
'use strict'
// const core = require('@actions/core')
// const github = require('@actions/github')
const fs = require('fs')
const rs = require('./resources.js')

// Preprocess module name
function sliceModuleName(moduleNameToSlice) {
    // Create an array from the module name
    let moduleName =  moduleNameToSlice.split('.')
    // Last index of moduleName
    const lastIndex = moduleName.length - 1
    // RegExp for index reference
    const indexRegexp = new RegExp(/(\[\d\])/)
    // Check if the module name contains an Array index reference
    if (indexRegexp.test(moduleName)) {
        moduleName = moduleName[lastIndex].replace(indexRegexp, '')
    } else {
        moduleName = moduleName[lastIndex]
    }
    // Return the moduleName
    return moduleName
}

// Get resources from state file
function getResources(jsonInput) {
    if(jsonInput.version != 4) {
        throw new Error(`Your state file version is ${jsonInput.version}, Supported version is: 4`);
    }
    return jsonInput["resources"]
}

// Get provider from resources
function getProvider(resourceInputProvider) {
    // Split the provider string
	let provider = resourceInputProvider.split("/")
    // Remove the unnecessary character(s)
    provider = provider[provider.length - 1].replace('"]', '')
	return provider
}

// Get the VM group name (either the name or the last section of the module annotation)
function getVmGroupName(resourceInput) {
    // Use base name by default
    let groupName = resourceInput["name"]
    // If we have a module, use that as the name of the group
    if(resourceInput["module"]) {
        groupName = sliceModuleName(resourceInput["module"])
    }
    return groupName
}

// Get the resource which contains the IP from resources
function getIpResourceName(resourceInput) {
    // Get the provider
    let provider = getProvider(resourceInput['provider'])
    // Save checks in variables
    let isKeyExists = Object.prototype.hasOwnProperty.call(rs.providerKeys, provider)
    if(isKeyExists && resourceInput.type === rs.providerKeys[provider]['ipResource']) {
        return rs.providerKeys[provider]['ipResource']
    }
}

// Get all resources which has the IP we need
function getIpResources(resources) {
    let ip_resource = []
    for(const resource of resources){
        if(getIpResourceName(resource)) {
            ip_resource.push(resource)
        }
    }
    return ip_resource
}

// Get the IP address and add it to the appropriate group(module or base name)
function getIpAddress(ipResource, groupObject, groupName, providerName) {
    // Init a variable for the IP before the loop
    let ipAddress = ""
    // Get the required info for the actual provider
    let ipContainer = rs.providerKeys[providerName]['ipAttributeContainer']
    let ipAttribute = rs.providerKeys[providerName]['ipAttribute']
    // If we haven't already specified the group as key, do it now
    if (!(groupName in groupObject)) { groupObject[groupName] = []; }
    // Get the ip addresses
    for(const ipConfig of ipResource['instances']) {
        // If the IP is wrapped into an array and an object
        if(ipConfig['attributes'][ipContainer] != null && Array.isArray(ipConfig['attributes'][ipContainer])) {
            ipAddress = ipConfig['attributes'][ipContainer][0][ipAttribute]
        // If the IP is wrapped into only in an object
        } else if(ipConfig['attributes'][ipContainer] != null && !( Array.isArray(ipConfig['attributes'][ipContainer]) )) {
            ipAddress = ipConfig['attributes'][ipContainer][ipAttribute]
        // If the IP is accessible from attributes
        } else {
            ipAddress = ipConfig['attributes'][ipAttribute]
        }
        // Add the IP address to the group object
        groupObject[groupName].push(ipAddress)
    }
}

// Get the IPs paired with their groups
function getGroups(resourceInput) {
    // Get every resource which has IP
    let ipResources = getIpResources(resourceInput)
    // Initialize group object and ipList array
    let groups = {}
    for(const ipResource of ipResources) {
        // What is my provider?
        let providerName = getProvider(ipResource['provider'])
        // console.log(ipResource)
        // Get the group name
        let groupName = getVmGroupName(ipResource)
        // Get the ip addresses
        getIpAddress(ipResource, groups, groupName, providerName)
    }
    return groups
}

// Create inventory file
function createHostFile(hostGroups, inventoryFile) {
    // Create the file before processing anything
    fs.writeFile(inventoryFile, "# Ansible inventory\n", function (err) {
        if (err) return console.log(err);
        console.log('Creating inventory file: ' + `./${inventoryFile}`)
    });
    // Add each IP to their respective group(module or resource) name and write it to the file
    for (const [groupKey, groupValue] of Object.entries(hostGroups)) {
        let ipList = groupValue.join(",").replace(/,/g, '\n')
        let hostGroup = `[${groupKey}]` + "\n" + ipList + "\n"
        fs.appendFile(inventoryFile, hostGroup, function (err) {
              if (err) return console.log(err)
              console.log('Add host group to: ' + `./${inventoryFile}`)
        });
    }
}


// Exporting the required modules
module.exports = {
    getResources,
    getGroups,
    createHostFile,
    sliceModuleName,
    getProvider,
    getVmGroupName,
    getIpResourceName,
    getIpResources,
    getIpAddress
}
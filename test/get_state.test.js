const getState = require('../src/lib/get_state')

// Helper functions and variables 
//Mimic github action inputs
function setInput(name,value) {
  process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`]=value
}

// Set dummy Inputs
setInput('organization','myorg')
setInput('workspace','myspace')
setInput('api-token','123456')
setInput('api-url','')

// Tests
// pullStateFile
test('pullStateFile: Fails if unknown source has been added', async () => {
    const badSources = ['nfs', 'local', 'tfc', 'datastore']
    expect.assertions(4);
    for (const source of badSources) {
      await expect(getState.pullStateFile(source)).rejects.toThrow(`Unsupported state source has been detected: ${source}`)
    }
})

test('getApiObject', () => {
    // Expected object
    let expected = {
      tfe: {
        organization: 'myorg',
        workspace: 'myspace',
        apiToken: '123456',
        apiUrl: 'https://app.terraform.io'       
      }
    }
    expect.assertions(1);
    expect(getState.getApiObject('tfe')).toEqual(expected)
})
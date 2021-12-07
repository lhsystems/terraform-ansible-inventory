const getState = require('../src/lib/get_state')

// pullStateFile
test('pullStateFile: Fails if unknown source has been added', async () => {
    const badSources = ['nfs', 'local', 'tfc', 'datastore']
    expect.assertions(4);
    for (const source of badSources) {
      await expect(getState.pullStateFile(source)).rejects.toThrowError(`Unsupported state source has been detected: ${source}`)
    }
})
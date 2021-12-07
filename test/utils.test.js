const utils = require('../src/lib/utils')
const testJsonNew = require('./asset/azurerm_test.json')
const testJsonOld = require('./asset/example.json')

// Dummy resources
const dummyResources =  require('./asset/dummy.json')

// Define the resources for each provider
  const dummys = {
    google: dummyResources['resources'][0],
    azurerm: dummyResources['resources'][2],
    wrongResource: dummyResources['resources'][3],
  }

// sliceModuleName
test('sliceModuleName: Return module name correctly from [singleInstance]', () => {
  let dummyModuleName = "module.xyz.abcd.myhosts"
  expect.assertions(1)
  expect(utils.sliceModuleName(dummyModuleName)).toBe('myhosts')
})

test('sliceModuleName: Return module name correctly from [multipleInstance]', () => {
  let dummyModuleName = "module.xyz.abcd.docker[3]"
  expect.assertions(1)
  expect(utils.sliceModuleName(dummyModuleName)).toBe('docker')
})

// getResources
test('getResources: Return an Array of resources with v4 statefile', () => {
  let isItArray = Array.isArray(utils.getResources(testJsonNew))
  expect.assertions(1)
  expect(isItArray).toBe(true)
})

test('getResources: Throw error with statefile version < 4', () => {
  expect.assertions(1)
  expect(() => {
    utils.getResources(testJsonOld)
  }).toThrow(/Your state file version is [1-3], Supported version is: 4$/);
})

//getProvider
test('getProvider: Get the expected provider from [string]', () => {
  let dummys = {
    dummyProviderAzure: "module.othergrp.provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    dummyProviderTempl: "provider[\"registry.terraform.io/hashicorp/template\"]",
    dummyProviderGoogl: "provider[\"registry.terraform.io/hashicorp/google\"]",
  }
  expect.assertions(3)
  expect(utils.getProvider(dummys.dummyProviderAzure)).toBe('azurerm')
  expect(utils.getProvider(dummys.dummyProviderTempl)).toBe('template')
  expect(utils.getProvider(dummys.dummyProviderGoogl)).toBe('google')
})

test('getProvider: Get the expected provider from [object]', () => {
  expect.assertions(2)
  expect(utils.getProvider(dummys.google['provider'])).toBe('google')
  expect(utils.getProvider(dummys.azurerm['provider'])).toBe('azurerm')
})

// getVmGroupName
test('getVmGroupName: Get name from [base name]', () => {
  expect.assertions(1)
  expect(utils.getVmGroupName(dummys.google)).toBe('default')
})

test('getVmGroupName: Get name from [module name]', () => {
  expect.assertions(1)
  expect(utils.getVmGroupName(dummys.azurerm)).toBe('testvms')
})

// getIpResourceName
test('getIpResourceName: Get the proper resource names for google and azurerm', () => {
  expect.assertions(3)
  expect(utils.getIpResourceName(dummys.google)).toBe('google_compute_instance')
  expect(utils.getIpResourceName(dummys.azurerm)).toBe('azurerm_network_interface')
  expect(utils.getIpResourceName(dummys.wrongResource)).toBe(undefined)
})

// getIpResources
test('getIpResources: Get proper google and azurerm IP resoruces', () => {
  const testIpResources = utils.getIpResources(dummyResources['resources'])
  let typeList = []
  for(const resource of Object.values(testIpResources)) {
    typeList.push(resource.type)
  }
  expect.assertions(2)
  expect(typeList).toContain('azurerm_network_interface')
  expect(typeList).toContain('google_compute_instance') 
})

test('getIpResources: Do not concern invalid IP resource', () => {
  const testIpResources = utils.getIpResources(dummyResources['resources'])
  for(const resource of Object.values(testIpResources)) {
    expect(resource.type).not.toBe('azurerm_linux_virtual_machine')
  }
})

test('getIpAddress: Result should be: { testvms: ["192.168.1.1"] }', () => {
  let testGroups = {}
  let groupName = utils.getVmGroupName(dummys.azurerm)
  let providerName = utils.getProvider(dummys.azurerm['provider'])
  utils.getIpAddress(dummys.azurerm, testGroups, groupName, providerName)
  expect.assertions(1)
  expect(testGroups).toEqual({ testvms: ["192.168.1.1"] })
})
'use strict'

const test = require('tape')
const path = require('path')
const fs = require('fs-extra')
const util = require('./test-utils')

const KVPlusRdfStore = require('../../src/index')
const storeBasePath = './test/store/'

test('Create collection test', t => {
  let store = new KVPlusRdfStore({ path: storeBasePath })
  let collectionName = 'users1'
  store.createCollection(collectionName)
    .then(() => {
      return util.collectionDirExists(collectionName)
    })
    .then(exists => {
      t.ok(exists, 'Collection dir should exist after createCollection()')
      if (exists) {
        return util.removeCollectionDir(collectionName)
      }
    })
    .then(() => {
      return util.collectionDirExists(collectionName)
    })
    .then(exists => {
      t.notOk(exists, 'Collection dir should be gone after cleanup')
      t.end()
    })
    .catch(err => {
      console.log(err)
      t.fail(err)
    })
})

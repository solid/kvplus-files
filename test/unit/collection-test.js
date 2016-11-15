'use strict'

const test = require('tape')
const path = require('path')
const fs = require('fs-extra')

const KVPlusRdfStore = require('../../src/index')
const storeBasePath = path.resolve('../store/')

function pathForCollection (collectionName) {
  return path.join(storeBasePath, '/', collectionName)
}

function collectionDirExists (collectionName) {
  let collectionPath = pathForCollection(collectionName)
  return new Promise((resolve, reject) => {
    fs.access(collectionPath, fs.R_OK | fs.W_OK, (err) => {
      if (!err) {
        return resolve(true)
      }
      if (err.code === 'ENOENT') {
        return resolve(false)
      }
      return reject(err)
    });
  })
}

function removeCollectionDir (collectionName) {
  let collectionPath = pathForCollection(collectionName)
  return new Promise((resolve, reject) => {
    fs.remove(collectionPath, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(true)
      }
    })
  })
}

test('Create collection test', t => {
  let store = new KVPlusRdfStore({ path: storeBasePath })
  let collectionName = 'users1'
  store.createCollection(collectionName)
    .then(() => {
      return collectionDirExists(collectionName)
    })
    .then(exists => {
      t.ok(exists, 'Collection dir should exist after createCollection()')
      if (exists) {
        return removeCollectionDir(collectionName)
      }
    })
    .then(() => {
      return collectionDirExists(collectionName)
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

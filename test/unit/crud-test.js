'use strict'

const test = require('tape')
const path = require('path')

const KVPlusRdfStore = require('../../src/index')
const storeBasePath = './test/store/'
const store = new KVPlusRdfStore({ path: storeBasePath })

function fileExistsFor (collectionName, key) {
  return Promise.resolve(true)
}

test('setup - init collections', t => {
  store.createCollection('users2')
    .then(() => {
      t.end()
    })
})

test('put() test', t => {
  let collectionName = 'users2'
  let value = JSON.stringify({ name: 'Alice' })
  store.put(collectionName, 'userA', value)
    .then(() => {
      return fileExistsFor(collectionName, 'userA')
    })
    .then(exists => {
      t.ok(exists, 'put() should result in a file being created')
      t.end()
    })
    .catch(err => {
      console.log(err)
      t.fail(err)
    })
})

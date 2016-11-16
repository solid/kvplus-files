'use strict'

const test = require('tape')
const path = require('path')
const util = require('./test-utils')

const KVPlusRdfStore = require('../../src/index')
const storeBasePath = './test/store/'
const store = new KVPlusRdfStore({ path: storeBasePath })

test('setup - init collections', t => {
  return Promise.all([
    store.createCollection('users2'),
    store.createCollection('users3'),
    store.createCollection('users4')
  ])
    .then(() => {
      t.end()
    })
})

test('put() test', t => {
  let collectionName = 'users2'
  let key = 'userA'
  let value = JSON.stringify({ name: 'Alice' })
  store.put(collectionName, key, value)
    .then(() => {
      return util.fileExistsFor(collectionName, key)
    })
    .then(exists => {
      t.ok(exists, 'put() should result in a file being created')
      return util.removeCollectionDir(collectionName)
    })
    .then(() => {
      return util.fileExistsFor(collectionName, key)
    })
    .then((exists) => {
      t.notOk(exists)
      t.end()
    })
    .catch(err => {
      console.log(err)
      t.fail(err)
    })
})

test('exists() test', t => {
  let collectionName = 'users3'
  let key = 'userA'
  let value = JSON.stringify({ name: 'Alice' })
  store.exists(collectionName, key)
    .then(exists => {
      t.notOk(exists, 'users3/userA should not exist initially')
      return store.put(collectionName, key, value)
    })
    .then(() => {
      return store.exists(collectionName, key)
    })
    .then(exists => {
      t.ok(exists, 'users3/userA should exist after a put')
      return util.removeCollectionDir(collectionName)
    })
    .then(() => {
      return util.fileExistsFor(collectionName, key)
    })
    .then((exists) => {
      t.notOk(exists)
      t.end()
    })
    .catch(err => {
      console.log(err)
      t.fail(err)
    })
})

test('get() test', t => {
  let collectionName = 'users4'
  let key = 'userA'
  let value = JSON.stringify({ name: 'Alice' })
  return util.fileExistsFor(collectionName, key)
    .then(exists => {
      t.notOk(exists, 'users4/userA should not exist initially')
      return store.get(collectionName, key)
    })
    .then(result => {
      t.equal(result, null, 'a get() of a non-existing key should return null')
      return store.put(collectionName, key, value)
    })
    .then(() => {
      return store.get(collectionName, key)
    })
    .then(result => {
      t.ok(result, 'a get() of an existing key should return a value')
      let parsed = JSON.parse(result)
      t.equal(parsed.name, 'Alice')
      return util.removeCollectionDir(collectionName)
    })
    .then(() => {
      return util.fileExistsFor(collectionName, key)
    })
    .then((exists) => {
      t.notOk(exists, 'Cleanup for get() test')
      t.end()
    })
    .catch(err => {
      console.log(err)
      t.fail(err)
    })
})

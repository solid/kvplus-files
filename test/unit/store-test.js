'use strict'

const test = require('tape')
const KVPlusRdfStore = require('../../src/index')

test('New store instance', t => {
  let options = { path: './test' }
  let store = new KVPlusRdfStore(options)
  t.equal(store.path, './test', 'Store should initialize path option')
  t.end()
})

test('New store defaults', t => {
  let store = new KVPlusRdfStore()
  t.equal(store.path, './db')
  t.equal(store.filePrefix, '_key_')
  t.equal(store.fileExt, 'ttl')
  t.end()
})

test('store.fileNameFor() test', t => {
  let store = new KVPlusRdfStore()
  let fileName = store.fileNameFor('alice')
  t.equal(fileName, '_key_alice.ttl')
  t.end()
})

test('store.relativePathFor() test', t => {
  let store = new KVPlusRdfStore()
  let relativePath = store.relativePathFor('users', 'alice')
  t.equal(relativePath, 'db/users/_key_alice.ttl')
  t.end()
})

test('store.absolutePathFor() test', t => {
  let store = new KVPlusRdfStore()
  t.ok(store.absolutePathFor('users', 'alice'))
  t.end()
})

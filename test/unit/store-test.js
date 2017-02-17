'use strict'

const test = require('tape')
const KVPFileStore = require('../../src/index')

test('New store instance', t => {
  let options = { path: './test' }
  let store = new KVPFileStore(options)
  t.equal(store.path, './test', 'Store should initialize path option')
  t.end()
})

test('New store defaults', t => {
  let store = new KVPFileStore()
  t.equal(store.path, './db')
  t.equal(store.filePrefix, '_key_')
  t.equal(store.fileExt, 'json')
  t.ok(store.serialize)
  t.ok(store.deserialize)
  t.end()
})

test('New store default serialize test', t => {
  let store = new KVPFileStore()
  t.equal(store.serialize('test string'), 'test string')
  t.equal(store.serialize({ name: 'Alice' }), '{"name":"Alice"}')
  t.end()
})

test('New store default deserialize test', t => {
  let store = new KVPFileStore()
  t.equal(store.deserialize('"test string"'), 'test string')
  t.deepEqual(store.deserialize('{"name":"Alice"}'), { name: 'Alice' })
  t.end()
})

test('store.fileNameFor() test', t => {
  let store = new KVPFileStore()
  let fileName = store.fileNameFor('alice')
  t.equal(fileName, '_key_alice.json')
  t.end()
})

test('store.relativePathFor() test', t => {
  let store = new KVPFileStore()
  let relativePath = store.relativePathFor('users', 'alice')
  t.equal(relativePath, 'db/users/_key_alice.json')
  t.end()
})

test('store.absolutePathFor() test', t => {
  let store = new KVPFileStore()
  t.ok(store.absolutePathFor('users', 'alice'))
  t.end()
})

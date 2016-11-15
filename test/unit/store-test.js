'use strict'

const test = require('tape')
const KVPlusRdfStore = require('../../src/index')

test('New store instance', t => {
  let options = { path: './test' }
  let store = new KVPlusRdfStore(options)
  t.equal(store.path, './test', 'Store should initialize path option')
  t.end()
})

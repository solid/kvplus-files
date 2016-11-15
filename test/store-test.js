'use strict'

const test = require('tape')
const KVPlusRdfStore = require('../src/index')

test('New store instance', t => {
  let store = new KVPlusRdfStore()
  t.ok(store)
  t.end()
})

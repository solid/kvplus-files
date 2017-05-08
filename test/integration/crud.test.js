'use strict'

const util = require('../test-utils')

const chai = require('chai')
const { expect } = chai
chai.use(require('dirty-chai'))

const KVPFileStore = require('../../src/store')
const storeBasePath = './test/store/'

// Create a test store
const store = new KVPFileStore({ path: storeBasePath })

describe('Store CRUD API', () => {
  const collectionName = 'users'

  beforeEach(() => {
    return store.createCollection(collectionName)
  })

  afterEach(() => {
    return util.removeCollectionDir(collectionName)
  })

  describe('exists()', () => {
    it('should test for key existing in the collection', () => {
      let key = 'userA'
      let value = { name: 'Alice' }

      // Should not exist initially (empty collection)
      return store.exists(collectionName, key)
        .then(keyExists => {
          expect(keyExists).to.not.be.true()

          return store.put(collectionName, key, value)
        })
        .then(() => {
          return store.exists(collectionName, key)
        })
        .then(keyExists => {
          expect(keyExists).to.be.true()
        })
    })
  })

  describe('put()', () => {
    it('should create a file', () => {
      let key = 'userA'
      let value = { name: 'Alice' }

      return store.put(collectionName, key, value)
        .then(() => {
          return util.fileExistsFor(collectionName, key)
        })
        .then(exists => {
          expect(exists).to.be.true()
        })
    })
  })

  describe('get()', () => {
    it('should return null for a non-existing key', () => {
      let key = 'non-existent-user'

      return store.get(collectionName, key)
        .then(result => {
          expect(result).to.be.null()
        })
    })

    it('should fetch the written value', () => {
      let key = 'userA'
      let value = { name: 'Alice' }

      return store.put(collectionName, key, value)
        .then(() => {
          return store.get(collectionName, key)
        })
        .then(fetchedValue => {
          expect(fetchedValue.name).to.equal(value.name)
        })
    })
  })

  describe('remove()', () => {
    it('should return false when removing a non-existent key', () => {
      let key = 'non-existent-user'

      return store.remove(collectionName, key)
        .then(result => {
          expect(result).to.be.false()
        })
    })

    it('should delete the value for the given key', () => {
      let key = 'userA'
      let value = { name: 'Alice' }

      return store.put(collectionName, key, value)
        .then(() => {
          return store.remove(collectionName, key)
        })
        .then(() => {
          return store.exists(collectionName, key)
        })
        .then(keyExists => {
          expect(keyExists).to.be.false()
        })
    })
  })
})

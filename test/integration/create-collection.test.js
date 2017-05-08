'use strict'

const util = require('../test-utils')

const chai = require('chai')
const { expect } = chai
chai.use(require('dirty-chai'))

const KVPFileStore = require('../../src/store')
const storeBasePath = './test/store/'

describe('Store API', () => {
  describe('createCollection()', () => {
    it('should create a collection dir', () => {
      let store = new KVPFileStore({ path: storeBasePath })
      let collectionName = 'users1'

      return store.createCollection(collectionName)
        .then(() => {
          return util.collectionDirExists(collectionName)
        })
        .then(exists => {
          // Collection dir should exist after createCollection()
          expect(exists).to.be.true()

          if (exists) {
            return util.removeCollectionDir(collectionName)
          }
        })
    })
  })

  describe('createCollectionSync()', () => {
    it('should create a collection dir', () => {
      let store = new KVPFileStore({ path: storeBasePath })
      let collectionName = 'users2'

      store.createCollectionSync(collectionName)

      return util.collectionDirExists(collectionName)
        .then(exists => {
          // Collection dir should exist after createCollection()
          expect(exists).to.be.true()

          if (exists) {
            return util.removeCollectionDir(collectionName)
          }
        })
    })
  })
})

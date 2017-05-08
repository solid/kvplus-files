'use strict'

const chai = require('chai')
const { expect } = chai
chai.use(require('dirty-chai'))

const KVPFileStore = require('../../src/store')

describe('KVPFileStore', () => {
  describe('constructor()', () => {
    it('should initialize the store path', () => {
      let options = { path: './test' }

      let store = new KVPFileStore(options)

      expect(store.path).to.equal('./test')
    })

    it('should init default values', () => {
      let store = new KVPFileStore()

      expect(store.path).to.equal(KVPFileStore.DEFAULT_PATH)
      expect(store.filePrefix).to.equal(KVPFileStore.DEFAULT_FILE_PREFIX)
      expect(store.fileExt).to.equal(KVPFileStore.DEFAULT_FILE_EXT)
    })

    it('should set a default serialize function', () => {
      let store = new KVPFileStore()

      expect(store.serialize('test string')).to.equal('"test string"')

      expect(store.serialize({ name: 'Alice' })).to.equal('{"name":"Alice"}')
    })

    it('should set a default deserialize function', () => {
      let store = new KVPFileStore()

      expect(store.deserialize('"test string"')).to.equal('test string')

      expect(store.deserialize('{"name":"Alice"}')).to.eql({ name: 'Alice' })
    })
  })

  describe('fileNameFor()', () => {
    it('should construct a file name from a given key', () => {
      let store = new KVPFileStore()

      expect(store.fileNameFor('alice')).to.equal('_key_alice.json')
    })
  })

  describe('relativePathFor()', () => {
    it('should return a relative filename path for a given key', () => {
      let store = new KVPFileStore()

      expect(store.relativePathFor('users', 'alice'))
        .to.equal('db/users/_key_alice.json')
    })
  })

  describe('absolutePathFor()', () => {
    it('should return an absolute filename path for a given key', () => {
      let store = new KVPFileStore()

      let relativePath = store.relativePathFor('users', 'alice')
      let absolutePath = store.absolutePathFor('users', 'alice')

      expect(absolutePath.endsWith(relativePath)).to.be.true()
      expect(absolutePath.length > relativePath.length).to.be.true()
    })
  })
})

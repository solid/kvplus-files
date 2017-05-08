'use strict'

const chai = require('chai')
const sinon = require('sinon')
const { expect } = chai
chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))

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

  describe('remove', () => {
    it('should validate collection name and key', () => {
      let store = new KVPFileStore()

      store.fsRemove = sinon.stub().resolves()

      sinon.spy(store, 'validateCollection')
      sinon.spy(store, 'validateKey')

      return store.remove('users', 'u1')
        .then(() => {
          expect(store.validateCollection).to.have.been.calledWith('users')
          expect(store.validateKey).to.have.been.calledWith('u1')
        })
    })

    it('returns false if file does not exist', () => {
      let fileError = new Error('File does not exist')
      fileError.code = 'ENOENT'

      let store = new KVPFileStore()

      store.fsRemove = sinon.stub().throws(fileError)

      return store.remove('users', 'u1')
        .then(result => {
          expect(result).to.be.false()
        })
    })

    it('throws any other errors encountered', done => {
      let store = new KVPFileStore()

      store.remove('users', null)
        .catch(err => {
          expect(err.message).to.equal('Key cannot be empty')
          done()
        })
    })
  })

  describe('del()', () => {
    it('serves as an alias for remove()', () => {
      let store = new KVPFileStore()

      store.remove = sinon.stub().resolves()

      return store.del('users', 'u1')
        .then(() => {
          expect(store.remove).to.have.been.calledWith('users', 'u1')
        })
    })
  })

  describe('validateCollection()', () => {
    it('should throw an error on a blank collection name', () => {
      let store = new KVPFileStore()

      expect(() => store.validateCollection(null))
        .to.throw(/Collection name cannot be empty/)
    })
  })

  describe('validateKey()', () => {
    it('should throw an error on a blank key', () => {
      let store = new KVPFileStore()

      expect(() => store.validateKey(null))
        .to.throw(/Key cannot be empty/)
    })
  })

  describe('initCollections()', () => {
    it('creates collections given in constructor', () => {
      let collections = [ 'users', 'posts' ]
      let store = new KVPFileStore({ collections })

      store.createCollectionSync = sinon.stub()

      store.initCollections()

      expect(store.createCollectionSync).to.have.been.calledWith('users')
      expect(store.createCollectionSync).to.have.been.calledWith('posts')
    })
  })
})

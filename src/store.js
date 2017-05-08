'use strict'
const path = require('path')
const fs = require('fs-extra')
const fsp = require('fs-extra-p')

const DEFAULT_PATH = './db'
const DEFAULT_FILE_PREFIX = '_key_'
const DEFAULT_FILE_EXT = 'json'

class KVPFileStore {
  /**
   * @constructor
   *
   * @param [options={}] {Object}
   * @param [options.path] {string}
   * @param [options.collections] {Array<string>}
   * @param [options.filePrefix] {string}
   * @param [options.fileExt] {string}
   */
  constructor (options = {}) {
    this.path = options.path || DEFAULT_PATH
    this.collections = options.collections || []
    this.filePrefix = options.filePrefix || DEFAULT_FILE_PREFIX
    this.fileExt = options.fileExt || DEFAULT_FILE_EXT
  }

  /**
   * @method absolutePathFor
   * @private
   * @param {string} collectionName
   * @param {string} key
   * @return {string}
   */
  absolutePathFor (collectionName, key) {
    return path.resolve(this.relativePathFor(collectionName, key))
  }

  /**
   * @method createCollection
   * @param {string} collectionName
   * @throws {TypeError} If collection name is a falsy value.
   * @throws {Error} fs error
   * @return {Promise}
   */
  createCollection (collectionName) {
    return Promise.resolve()
      .then(() => {
        let collectionPath = this.absolutePathFor(collectionName)

        return fsp.mkdirp(collectionPath)
      })
      .then(() => true)
  }

  /**
   * @private
   * @param collectionName
   */
  createCollectionSync (collectionName) {
    let collectionPath = this.absolutePathFor(collectionName)

    fs.mkdirpSync(collectionPath)
  }

  deserialize (data) {
    // try {
    //   data = JSON.parse(data)
    // } catch (error) {
    //   console.error('Error deserializing object: ', error)
    // }

    return JSON.parse(data)
  }

  /**
   * @method remove
   * @param {string} collectionName
   * @param {string} key
   * @throws {TypeError} If collection name or key is a falsy value.
   * @throws {Error} fs error
   * @return {Promise<Boolean>}
   */
  remove (collectionName, key) {
    return Promise.resolve()
      .then(() => {
        this.validateKey(key)

        let filePath = this.absolutePathFor(collectionName, key)

        return this.fsRemove(filePath)
      })
      .catch(this.falseOnMissingFile)
  }

  serialize (data) {
    return JSON.stringify(data)
  }

  falseOnMissingFile (error) {
    if (error.code === 'ENOENT') { return false }

    throw error
  }

  validateCollection (collectionName) {
    if (!collectionName) {
      throw new TypeError('Collection name cannot be empty')
    }
  }

  validateKey (key) {
    if (!key) {
      throw new TypeError('Key cannot be empty')
    }
  }

  fsRemove (path) {
    return fsp.unlink(path)
  }

  del (collectionName, key) {
    return this.remove(collectionName, key)
  }

  /**
   * @method exists
   * @param {string} collectionName
   * @param {string} key
   * @throws {TypeError} If collection name or key is a falsy value.
   * @throws {Error} fs error
   * @return {Promise<Boolean>}
   */
  exists (collectionName, key) {
    return Promise.resolve()
      .then(() => {
        let filePath = this.absolutePathFor(collectionName, key)

        return fsp.access(filePath, fs.R_OK | fs.W_OK)
      })
      .then(() => true)
      .catch(error => this.falseOnMissingFile(error))
  }

  /**
   * @private
   * @param key {string}
   * @return {string}
   */
  fileNameFor (key) {
    return `${this.filePrefix}${key}.${this.fileExt}`
  }

  /**
   * @method get
   * @param {string} collectionName
   * @param {string} key
   *
   * @throws {TypeError} If collection name or key is a falsy value.
   * @throws {Error} fs error
   *
   * @return {Promise<Object|null>}
   */
  get (collectionName, key) {
    return Promise.resolve()
      .then(() => {
        this.validateKey(key)

        let filePath = this.absolutePathFor(collectionName, key)

        return fsp.readFile(filePath)
      })
      .catch(error => this.falseOnMissingFile(error))
      .then(result => {
        if (!result) { return null }

        return this.deserialize(result)
      })
  }

  initCollections () {
    for (let collectionName of this.collections) {
      this.createCollectionSync(collectionName)
    }
  }

  /**
   * @private
   * @param collectionName {string}
   * @param key {string}
   * @throws {TypeError}
   * @return {string}
   */
  relativePathFor (collectionName, key) {
    this.validateCollection(collectionName)

    let relPath = path.join(this.path, collectionName)

    if (key) {
      this.validateKey(key)

      relPath = path.join(relPath, this.fileNameFor(key))
    }

    return relPath
  }

  /**
   * @method put
   * @param {string} collectionName
   * @param {string} key
   * @param {Object} data
   *
   * @throws {TypeError} If collection name or key is a falsy value.
   * @throws {Error} fs error
   *
   * @return {Promise<boolean>}
   */
  put (collectionName, key, data) {
    return Promise.resolve()
      .then(() => {
        this.validateKey(key)

        let filePath = this.absolutePathFor(collectionName, key)

        data = this.serialize(data)

        return this.fsWrite(filePath, data)
      })
      .then(() => true)
      // .catch(error => {
      //   if (error.code === 'ENOENT') {
      //     throw new Error(`Error in put() - collection ${JSON.stringify(collectionName)} does not exist`)
      //   }
      //
      //   throw error
      // })
  }

  fsWrite (filePath, data) {
    return fsp.writeFile(filePath, data)
  }
}

KVPFileStore.DEFAULT_PATH = DEFAULT_PATH
KVPFileStore.DEFAULT_FILE_PREFIX = DEFAULT_FILE_PREFIX
KVPFileStore.DEFAULT_FILE_EXT = DEFAULT_FILE_EXT

module.exports = KVPFileStore

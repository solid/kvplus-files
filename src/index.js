'use strict'
const path = require('path')
const fs = require('fs-extra')

class KVPlusRdfStore {
  constructor (options = {}) {
    this.path = options.path || './db'
    this.filePrefix = options.filePrefix || '_key_'
    this.fileExt = options.fileExt || 'json'
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
    if (!collectionName) {
      return Promise.reject(new TypeError('Cannot create empty collection name'))
    }
    let collectionPath = this.absolutePathFor(collectionName)
    return new Promise((resolve, reject) => {
      fs.mkdirp(collectionPath, (err) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(true)
        }
      })
    })
  }

  exists (collectionName, key) {
    let filePath = this.relativePathFor(collectionName, key)
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.R_OK | fs.W_OK, (err) => {
        if (!err) {
          return resolve(true)
        }
        if (err.code === 'ENOENT') {
          return resolve(false)
        }
        return reject(err)
      })
    })
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
   * @private
   * @param collectionName {string}
   * @param key {string}
   * @throws {TypeError}
   * @return {string}
   */
  relativePathFor (collectionName, key) {
    if (!collectionName) {
      throw new TypeError('Cannot resolve path for an empty collection name')
    }
    let relPath = path.join(this.path, collectionName)
    if (key) {
      relPath = path.join(relPath, this.fileNameFor(key))
    }
    return relPath
  }

  put (collectionName, key, data) {
    if (!collectionName) {
      return Promise.reject(new TypeError('Cannot put() using an empty collection name'))
    }
    if (!key) {
      return Promise.reject(new TypeError('Cannot put() using an empty key'))
    }
    let filePath = this.relativePathFor(collectionName, key)
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (err) => {
        if (!err) {
          return resolve(true)
        }
        if (err.code === 'ENOENT') {
          return reject(new Error('Error in put() - collection does not exist'))
        } else {
          return resolve(true)
        }
      })
    })
  }
}

module.exports = KVPlusRdfStore

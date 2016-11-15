'use strict'
const path = require('path')
const fs = require('fs-extra')

class KVPlusRdfStore {
  constructor (options = {}) {
    this.path = options.path
  }

  /**
   * @method collectionPath
   * @private
   * @param {string} collectionName
   * @return {string}
   */
  collectionPath (collectionName) {
    return path.join(this.path, '/', collectionName)
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
    let collectionPath = this.collectionPath(collectionName)
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
}

module.exports = KVPlusRdfStore

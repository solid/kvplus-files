'use strict'

const path = require('path')
const fs = require('fs-extra')

const storeBasePath = './test/store/'

module.exports = {
  pathFor,
  collectionDirExists,
  fileExistsFor,
  removeCollectionDir,
  removeFileFor
}

function pathFor (collectionName, key) {
  let relPath = path.join(storeBasePath, collectionName)
  if (key) {
    relPath = path.join(relPath, `_key_${key}.json`)
  }
  return relPath
}

function collectionDirExists (collectionName) {
  let collectionPath = pathFor(collectionName)
  return pathExists(collectionPath)
}

function fileExistsFor (collectionName, key) {
  let filePath = pathFor(collectionName, key)
  return pathExists(filePath)
}

function pathExists (relPath) {
  return new Promise((resolve, reject) => {
    fs.access(relPath, fs.R_OK | fs.W_OK, (err) => {
      if (!err) {
        return resolve(true)
      }
      if (err.code === 'ENOENT') {
        return resolve(false)
      }
      return reject(err)
    });
  })
}

function removeCollectionDir (collectionName) {
  let collectionPath = pathFor(collectionName)
  return removePath(collectionPath)
}

function removeFileFor (collectionName, key) {
  let filePath = pathFor(collectionName, key)
  return removePath(filePath)
}

function removePath (relPath) {
  return new Promise((resolve, reject) => {
    fs.remove(relPath, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(true)
      }
    })
  })
}

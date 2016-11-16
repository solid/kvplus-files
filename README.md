# kvplus-files
Simple filesystem based K/V backend, conforms to the
[KVPlus API](https://github.com/interop-alliance/kvplus-js).

### Design Decisions / Limitations

* Filesystem-based. Pass in a base `path` into the store constructor.
* Separate directory per collection. So, if `store.path = './db/'`,
   `store.createCollection('users')` results in the creation of `./db/users/`.
* Each object is written to its own file.
  `store.put('users', 'alice')` results in the creation of the file
  `./db/users/_key_alice.json`

### Implementation progress

* [x] `createCollection()`
* CRUD
  - [x] `put()`
  - [ ] `get()`
  - [ ] `exists()`
  - [ ] `del()`

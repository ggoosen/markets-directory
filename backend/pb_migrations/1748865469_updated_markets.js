/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_z6orCVJ` ON `markets` (`slug`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0")

  collection.indexes = []

  return dao.saveCollection(collection)
})

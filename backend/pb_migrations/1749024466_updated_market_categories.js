/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o8aksmzfhlw04g0")

  collection.createRule = "@request.auth.role = \"admin\""
  collection.updateRule = "@request.auth.role = \"admin\""
  collection.deleteRule = "@request.auth.role = \"admin\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o8aksmzfhlw04g0")

  collection.createRule = "@request.auth.role = \"organizer\""
  collection.updateRule = "@request.auth.role = \"organizer\""
  collection.deleteRule = "@request.auth.role = \"organizer\""

  return dao.saveCollection(collection)
})

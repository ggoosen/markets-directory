/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8ise5fvjffnrk3n")

  collection.listRule = "@request.auth.role = \"organizer\""
  collection.viewRule = "@request.auth.role = \"organizer\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8ise5fvjffnrk3n")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lunwvjcf99uyi5e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fee_required",
    "name": "required",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lunwvjcf99uyi5e")

  // remove
  collection.schema.removeField("fee_required")

  return dao.saveCollection(collection)
})

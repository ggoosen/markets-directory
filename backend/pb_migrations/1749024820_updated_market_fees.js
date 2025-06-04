/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lunwvjcf99uyi5e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7rkulry7",
    "name": "fee_name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 100,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lunwvjcf99uyi5e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7rkulry7",
    "name": "fee_name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 100,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})

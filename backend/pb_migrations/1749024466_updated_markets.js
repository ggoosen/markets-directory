/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0")

  // remove
  collection.schema.removeField("yv9vmslc")

  // remove
  collection.schema.removeField("hheiwxoq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pjhy0wq9",
    "name": "slug",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": true,
    "options": {
      "min": 2,
      "max": 100,
      "pattern": "^[a-z0-9-]+$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yv9vmslc",
    "name": "insurance_minimum",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hheiwxoq",
    "name": "abn_required",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pjhy0wq9",
    "name": "slug",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 2,
      "max": 100,
      "pattern": "^[a-z0-9-]+$"
    }
  }))

  return dao.saveCollection(collection)
})

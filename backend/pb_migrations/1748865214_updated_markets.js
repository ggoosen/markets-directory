/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "epa3hpdo",
    "name": "contact_email",
    "type": "email",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwmwamjl",
    "name": "website",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cdrhqasf",
    "name": "description",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "m6exljm5",
    "name": "active",
    "type": "bool",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0")

  // remove
  collection.schema.removeField("epa3hpdo")

  // remove
  collection.schema.removeField("dwmwamjl")

  // remove
  collection.schema.removeField("cdrhqasf")

  // remove
  collection.schema.removeField("m6exljm5")

  return dao.saveCollection(collection)
})

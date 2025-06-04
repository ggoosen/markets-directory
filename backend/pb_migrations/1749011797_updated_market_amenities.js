/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cfu5z15uxga798n")

  // remove
  collection.schema.removeField("wil5x92n")

  // remove
  collection.schema.removeField("kiiy9aff")

  // remove
  collection.schema.removeField("lmjfdqra")

  // remove
  collection.schema.removeField("f1nktkn7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dovarhfb",
    "name": "market",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4f3nr3ssrl6oqc0",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xk8tbtug",
    "name": "amenity_type",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "8ise5fvjffnrk3n",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t9nkq44i",
    "name": "available",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "m4xlyeii",
    "name": "notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 200,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cfu5z15uxga798n")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wil5x92n",
    "name": "market",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "4f3nr3ssrl6oqc0",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kiiy9aff",
    "name": "amenity_type",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "8ise5fvjffnrk3n",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lmjfdqra",
    "name": "available",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f1nktkn7",
    "name": "notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 200,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("dovarhfb")

  // remove
  collection.schema.removeField("xk8tbtug")

  // remove
  collection.schema.removeField("t9nkq44i")

  // remove
  collection.schema.removeField("m4xlyeii")

  return dao.saveCollection(collection)
})

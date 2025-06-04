/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o8aksmzfhlw04g0")

  // remove
  collection.schema.removeField("m4njxx3b")

  // remove
  collection.schema.removeField("o8ovbrd9")

  // remove
  collection.schema.removeField("mabzikuy")

  // remove
  collection.schema.removeField("osfutgj2")

  // remove
  collection.schema.removeField("0lph1ccb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "avxhampn",
    "name": "name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 2,
      "max": 50,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "brn0mcgz",
    "name": "description",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uadddkdv",
    "name": "color",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hesfcguj",
    "name": "icon",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 50,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "is8wvukm",
    "name": "sort_order",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o8aksmzfhlw04g0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "m4njxx3b",
    "name": "name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 2,
      "max": 50,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "o8ovbrd9",
    "name": "description",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mabzikuy",
    "name": "color",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "osfutgj2",
    "name": "icon",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 50,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0lph1ccb",
    "name": "sort_order",
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

  // remove
  collection.schema.removeField("avxhampn")

  // remove
  collection.schema.removeField("brn0mcgz")

  // remove
  collection.schema.removeField("uadddkdv")

  // remove
  collection.schema.removeField("hesfcguj")

  // remove
  collection.schema.removeField("is8wvukm")

  return dao.saveCollection(collection)
})

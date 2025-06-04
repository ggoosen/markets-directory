/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k770tganiekaal2")

  // remove
  collection.schema.removeField("t2hqnodm")

  // remove
  collection.schema.removeField("2fg1oeqi")

  // remove
  collection.schema.removeField("pmdu1yrf")

  // remove
  collection.schema.removeField("kzcllfsp")

  // remove
  collection.schema.removeField("dozucmdc")

  // remove
  collection.schema.removeField("7unda3mg")

  // remove
  collection.schema.removeField("u1uedyfu")

  // remove
  collection.schema.removeField("albqdxn7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zcjqdep9",
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
    "id": "qfvkjosr",
    "name": "schedule_type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "regular",
        "weekly_pattern",
        "monthly_pattern",
        "custom_dates"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "v7ptlqbt",
    "name": "schedule_data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1xjdszem",
    "name": "start_time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "svo03hqp",
    "name": "end_time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "piaq2amy",
    "name": "start_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mrrxmra5",
    "name": "end_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q9xvt7av",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k770tganiekaal2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t2hqnodm",
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
    "id": "2fg1oeqi",
    "name": "schedule_type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "regular",
        "weekly_pattern",
        "monthly_pattern",
        "custom_dates"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pmdu1yrf",
    "name": "schedule_data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kzcllfsp",
    "name": "start_time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dozucmdc",
    "name": "end_time",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7unda3mg",
    "name": "start_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u1uedyfu",
    "name": "end_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "albqdxn7",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("zcjqdep9")

  // remove
  collection.schema.removeField("qfvkjosr")

  // remove
  collection.schema.removeField("v7ptlqbt")

  // remove
  collection.schema.removeField("1xjdszem")

  // remove
  collection.schema.removeField("svo03hqp")

  // remove
  collection.schema.removeField("piaq2amy")

  // remove
  collection.schema.removeField("mrrxmra5")

  // remove
  collection.schema.removeField("q9xvt7av")

  return dao.saveCollection(collection)
})

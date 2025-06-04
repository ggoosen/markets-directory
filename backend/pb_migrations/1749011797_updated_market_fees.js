/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lunwvjcf99uyi5e")

  // remove
  collection.schema.removeField("l4vune4i")

  // remove
  collection.schema.removeField("pifffszv")

  // remove
  collection.schema.removeField("xzrd2iu9")

  // remove
  collection.schema.removeField("a6v6vdmw")

  // remove
  collection.schema.removeField("cg55mpcz")

  // remove
  collection.schema.removeField("cqapqvtx")

  // remove
  collection.schema.removeField("y0jfdtfe")

  // remove
  collection.schema.removeField("thwodyvj")

  // remove
  collection.schema.removeField("8tepnsyj")

  // remove
  collection.schema.removeField("y3wfjdxc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yep28au0",
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
    "id": "eondfchf",
    "name": "fee_type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "stall_fee",
        "application_fee",
        "bond",
        "power",
        "other"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nlxof5ta",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tk4cdgpy",
    "name": "amount",
    "type": "number",
    "required": true,
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
    "id": "zwqwnnrj",
    "name": "currency",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 3,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uqc3mpot",
    "name": "frequency",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "per_day",
        "per_event",
        "one_time"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gj7y7bnz",
    "name": "conditions",
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
    "id": "xmb9roel",
    "name": "valid_from",
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
    "id": "ks5xysx5",
    "name": "valid_until",
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
    "id": "cyymokol",
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
  const collection = dao.findCollectionByNameOrId("lunwvjcf99uyi5e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l4vune4i",
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
    "id": "pifffszv",
    "name": "fee_type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "stall_fee",
        "application_fee",
        "bond",
        "power",
        "other"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xzrd2iu9",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a6v6vdmw",
    "name": "amount",
    "type": "number",
    "required": true,
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
    "id": "cg55mpcz",
    "name": "currency",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 3,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cqapqvtx",
    "name": "frequency",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "per_day",
        "per_event",
        "one_time"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "y0jfdtfe",
    "name": "conditions",
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
    "id": "thwodyvj",
    "name": "valid_from",
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
    "id": "8tepnsyj",
    "name": "valid_until",
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
    "id": "y3wfjdxc",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("yep28au0")

  // remove
  collection.schema.removeField("eondfchf")

  // remove
  collection.schema.removeField("nlxof5ta")

  // remove
  collection.schema.removeField("tk4cdgpy")

  // remove
  collection.schema.removeField("zwqwnnrj")

  // remove
  collection.schema.removeField("uqc3mpot")

  // remove
  collection.schema.removeField("gj7y7bnz")

  // remove
  collection.schema.removeField("xmb9roel")

  // remove
  collection.schema.removeField("ks5xysx5")

  // remove
  collection.schema.removeField("cyymokol")

  return dao.saveCollection(collection)
})

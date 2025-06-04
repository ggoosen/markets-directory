/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3p4wlpx9oyop082")

  collection.viewRule = "@request.auth.id = stallholder.user || @request.auth.id = market.organizer"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.role = \"stallholder\""
  collection.updateRule = "@request.auth.id = market.organizer"
  collection.deleteRule = "@request.auth.id = stallholder.user || @request.auth.id = market.organizer"

  // remove
  collection.schema.removeField("yv8r3gtx")

  // remove
  collection.schema.removeField("3lnrudce")

  // remove
  collection.schema.removeField("llzggqdt")

  // remove
  collection.schema.removeField("sydnbgsz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kp5z98cj",
    "name": "stallholder",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "9isenkwpz24w58h",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "business_name"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ntfyybel",
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
    "id": "h0pcnq8i",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "approved",
        "rejected",
        "waitlisted",
        "cancelled"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2qn9sb4z",
    "name": "application_date",
    "type": "date",
    "required": true,
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
    "id": "4sj1nptl",
    "name": "requested_dates",
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
    "id": "myejhlnu",
    "name": "message",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 1000,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zplwmwn5",
    "name": "organizer_notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 1000,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i0jdsaef",
    "name": "payment_status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "unpaid",
        "paid",
        "partial",
        "refunded"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gunebonq",
    "name": "payment_amount",
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
    "id": "6kdszfxz",
    "name": "stall_assignment",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3p4wlpx9oyop082")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yv8r3gtx",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "approved",
        "rejected",
        "waitlisted"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3lnrudce",
    "name": "organizer_notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 1000,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "llzggqdt",
    "name": "stallholder_notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 1000,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sydnbgsz",
    "name": "requested_dates",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("kp5z98cj")

  // remove
  collection.schema.removeField("ntfyybel")

  // remove
  collection.schema.removeField("h0pcnq8i")

  // remove
  collection.schema.removeField("2qn9sb4z")

  // remove
  collection.schema.removeField("4sj1nptl")

  // remove
  collection.schema.removeField("myejhlnu")

  // remove
  collection.schema.removeField("zplwmwn5")

  // remove
  collection.schema.removeField("i0jdsaef")

  // remove
  collection.schema.removeField("gunebonq")

  // remove
  collection.schema.removeField("6kdszfxz")

  return dao.saveCollection(collection)
})

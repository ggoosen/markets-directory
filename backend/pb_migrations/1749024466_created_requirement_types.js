/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "atklztt1yhd4i25",
    "created": "2025-06-04 08:07:46.545Z",
    "updated": "2025-06-04 08:07:46.545Z",
    "name": "requirement_types",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "req_name",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 2,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "req_desc",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "req_cat",
        "name": "category",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "legal",
            "business",
            "membership",
            "product",
            "logistics",
            "experience",
            "certification"
          ]
        }
      },
      {
        "system": false,
        "id": "req_vtype",
        "name": "value_type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "boolean",
            "amount",
            "text",
            "select",
            "date",
            "number"
          ]
        }
      },
      {
        "system": false,
        "id": "req_opts",
        "name": "value_options",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "req_icon",
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
      },
      {
        "system": false,
        "id": "req_help",
        "name": "help_text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 300,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "req_active",
        "name": "active",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "req_sort",
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
      },
      {
        "system": false,
        "id": "req_system",
        "name": "system_managed",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.role = \"admin\" || @request.auth.role = \"organizer\"",
    "updateRule": "@request.auth.role = \"admin\" || (@request.auth.role = \"organizer\" && system_managed = false)",
    "deleteRule": "@request.auth.role = \"admin\" || (@request.auth.role = \"organizer\" && system_managed = false)",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("atklztt1yhd4i25");

  return dao.deleteCollection(collection);
})

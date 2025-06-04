/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "8ise5fvjffnrk3n",
    "created": "2025-06-04 03:12:42.133Z",
    "updated": "2025-06-04 03:12:42.133Z",
    "name": "amenity_types",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "towgulhb",
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
      },
      {
        "system": false,
        "id": "psheobvt",
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
      },
      {
        "system": false,
        "id": "6zbduynp",
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
        "id": "6pn5m7vq",
        "name": "category",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "facility",
            "service",
            "accessibility"
          ]
        }
      },
      {
        "system": false,
        "id": "jktk0mof",
        "name": "active",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": "@request.auth.role = \"organizer\"",
    "updateRule": "@request.auth.role = \"organizer\"",
    "deleteRule": "@request.auth.role = \"organizer\"",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("8ise5fvjffnrk3n");

  return dao.deleteCollection(collection);
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "k770tganiekaal2",
    "created": "2025-06-04 04:28:51.347Z",
    "updated": "2025-06-04 04:28:51.347Z",
    "name": "market_schedules",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7kojrjke",
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
      },
      {
        "system": false,
        "id": "zfusp3tp",
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
      },
      {
        "system": false,
        "id": "6rhxrncl",
        "name": "schedule_data",
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
        "id": "49omsjn3",
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
      },
      {
        "system": false,
        "id": "hlnb4pc5",
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
      },
      {
        "system": false,
        "id": "evsjr8zm",
        "name": "start_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "ao9wxtvc",
        "name": "end_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "ns7rhgfn",
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
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("k770tganiekaal2");

  return dao.deleteCollection(collection);
})

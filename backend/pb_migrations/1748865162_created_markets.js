/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "4f3nr3ssrl6oqc0",
    "created": "2025-06-02 11:52:42.300Z",
    "updated": "2025-06-02 11:52:42.300Z",
    "name": "markets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j6kpbqsm",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 3,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "q7rqrczx",
        "name": "slug",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "aumqnihx",
        "name": "state",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "SA",
            "VIC",
            "NSW",
            "QLD",
            "WA",
            "TAS",
            "NT",
            "ACT"
          ]
        }
      },
      {
        "system": false,
        "id": "wcyg64v4",
        "name": "suburb",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "henw1fet",
        "name": "address",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "448dvg7m",
        "name": "frequency",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "jfgxc3av",
        "name": "operating_hours",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4f3nr3ssrl6oqc0");

  return dao.deleteCollection(collection);
})

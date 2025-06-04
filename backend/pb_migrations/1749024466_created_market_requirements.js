/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "basas9ksrjqiioa",
    "created": "2025-06-04 08:07:46.562Z",
    "updated": "2025-06-04 08:07:46.562Z",
    "name": "market_requirements",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mreq_market",
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
        "id": "mreq_type",
        "name": "requirement_type",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "atklztt1yhd4i25",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name"
          ]
        }
      },
      {
        "system": false,
        "id": "mreq_required",
        "name": "is_required",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "mreq_value",
        "name": "requirement_value",
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
        "id": "mreq_notes",
        "name": "custom_notes",
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
        "id": "mreq_priority",
        "name": "priority",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "required",
            "preferred",
            "optional"
          ]
        }
      },
      {
        "system": false,
        "id": "mreq_active",
        "name": "active",
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
    "createRule": "@request.auth.id = market.organizer",
    "updateRule": "@request.auth.id = market.organizer",
    "deleteRule": "@request.auth.id = market.organizer",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("basas9ksrjqiioa");

  return dao.deleteCollection(collection);
})

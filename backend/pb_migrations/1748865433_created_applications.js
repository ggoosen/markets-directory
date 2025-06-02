/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3p4wlpx9oyop082",
    "created": "2025-06-02 11:57:13.412Z",
    "updated": "2025-06-02 11:57:13.412Z",
    "name": "applications",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
  const collection = dao.findCollectionByNameOrId("3p4wlpx9oyop082");

  return dao.deleteCollection(collection);
})

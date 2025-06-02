/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9isenkwpz24w58h",
    "created": "2025-06-02 11:55:37.791Z",
    "updated": "2025-06-02 11:55:37.791Z",
    "name": "stallholders",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "f9on394y",
        "name": "business_name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 2,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "x8fgndy1",
        "name": "product_categories",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "food",
            "craft",
            "clothing",
            "art",
            "plants",
            "vintage",
            "services",
            "other"
          ]
        }
      },
      {
        "system": false,
        "id": "ghfy442p",
        "name": "description",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "cxuqdnqt",
        "name": "website",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "mkwr2arf",
        "name": "active",
        "type": "bool",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("9isenkwpz24w58h");

  return dao.deleteCollection(collection);
})

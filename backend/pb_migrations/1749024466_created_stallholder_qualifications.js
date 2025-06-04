/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "l5bia7dsalvtcys",
    "created": "2025-06-04 08:07:46.571Z",
    "updated": "2025-06-04 08:07:46.571Z",
    "name": "stallholder_qualifications",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sq_stallholder",
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
      },
      {
        "system": false,
        "id": "sq_type",
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
        "id": "sq_status",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "verified",
            "pending",
            "expired",
            "not_applicable",
            "rejected"
          ]
        }
      },
      {
        "system": false,
        "id": "sq_value",
        "name": "qualification_value",
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
        "id": "sq_expiry",
        "name": "expiry_date",
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
        "id": "sq_docs",
        "name": "supporting_documents",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp"
          ],
          "thumbs": null,
          "maxSelect": 5,
          "maxSize": 10485760,
          "protected": true
        }
      },
      {
        "system": false,
        "id": "sq_verified_by",
        "name": "verified_by",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
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
        "id": "sq_verified_date",
        "name": "verified_date",
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
        "id": "sq_notes",
        "name": "verification_notes",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = stallholder.user || @request.auth.role = \"admin\"",
    "viewRule": "@request.auth.id = stallholder.user || @request.auth.role = \"admin\"",
    "createRule": "@request.auth.id = stallholder.user",
    "updateRule": "@request.auth.id = stallholder.user || @request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.id = stallholder.user || @request.auth.role = \"admin\"",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("l5bia7dsalvtcys");

  return dao.deleteCollection(collection);
})

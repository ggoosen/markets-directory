// scripts/save-schema.js - Save the provided schema to database.json
import fs from 'fs/promises';
import { existsSync } from 'fs';

const schema = {
  "version": "1.0.0",
  "description": "SA Markets Directory Database Schema",
  "collections": {
    "users": {
      "name": "users",
      "type": "auth",
      "system": true,
      "description": "Built-in PocketBase users collection with custom fields",
      "schema": [
        {
          "name": "role",
          "type": "select",
          "required": true,
          "options": {
            "maxSelect": 1,
            "values": ["customer", "stallholder", "organizer"]
          },
          "description": "User role in the platform"
        },
        {
          "name": "phone",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^(\\+61|0)[2-478](?:[0-9]){8}$"
          },
          "description": "Australian phone number"
        },
        {
          "name": "verified",
          "type": "bool",
          "required": false,
          "description": "Email verification status"
        },
        {
          "name": "subscription_tier",
          "type": "select",
          "required": false,
          "options": {
            "maxSelect": 1,
            "values": ["free", "basic", "premium", "enterprise"]
          },
          "description": "Subscription level"
        }
      ],
      "listRule": "id = @request.auth.id",
      "viewRule": "id = @request.auth.id",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id"
    },

    "market_categories": {
      "name": "market_categories",
      "type": "base",
      "description": "Market categorization system",
      "schema": [
        {
          "name": "name",
          "type": "text",
          "required": true,
          "options": {
            "min": 2,
            "max": 50
          },
          "description": "Category name"
        },
        {
          "name": "description",
          "type": "text",
          "required": false,
          "options": {
            "max": 200
          },
          "description": "Category description"
        },
        {
          "name": "color",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          },
          "description": "Hex color code for UI"
        },
        {
          "name": "icon",
          "type": "text",
          "required": false,
          "options": {
            "max": 50
          },
          "description": "Icon identifier"
        },
        {
          "name": "sort_order",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Display order"
        }
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": "@request.auth.role = \"organizer\"",
      "updateRule": "@request.auth.role = \"organizer\"",
      "deleteRule": "@request.auth.role = \"organizer\""
    },

    "markets": {
      "name": "markets",
      "type": "base",
      "description": "Market listings and information",
      "schema": [
        {
          "name": "name",
          "type": "text",
          "required": true,
          "options": {
            "min": 2,
            "max": 100
          },
          "description": "Market name"
        },
        {
          "name": "slug",
          "type": "text",
          "required": true,
          "options": {
            "pattern": "^[a-z0-9-]+$",
            "min": 2,
            "max": 100
          },
          "description": "URL-friendly identifier"
        },
        {
          "name": "description",
          "type": "text",
          "required": false,
          "options": {
            "max": 2000
          },
          "description": "Market description"
        },
        {
          "name": "category",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "market_categories",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["name"]
          },
          "description": "Market category"
        },
        {
          "name": "organizer",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "users",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["name", "email"]
          },
          "description": "Market organizer"
        },
        {
          "name": "address",
          "type": "text",
          "required": true,
          "options": {
            "max": 200
          },
          "description": "Street address"
        },
        {
          "name": "suburb",
          "type": "text",
          "required": true,
          "options": {
            "max": 50
          },
          "description": "Suburb/City"
        },
        {
          "name": "state",
          "type": "select",
          "required": true,
          "options": {
            "maxSelect": 1,
            "values": ["SA", "VIC", "NSW", "QLD", "WA", "TAS", "NT", "ACT"]
          },
          "description": "Australian state"
        },
        {
          "name": "postcode",
          "type": "text",
          "required": true,
          "options": {
            "pattern": "^[0-9]{4}$"
          },
          "description": "Australian postcode"
        },
        {
          "name": "latitude",
          "type": "number",
          "required": false,
          "description": "GPS latitude"
        },
        {
          "name": "longitude",
          "type": "number",
          "required": false,
          "description": "GPS longitude"
        },
        {
          "name": "venue_type",
          "type": "select",
          "required": false,
          "options": {
            "maxSelect": 1,
            "values": ["outdoor", "indoor", "covered", "mixed"]
          },
          "description": "Venue type"
        },
        {
          "name": "frequency_type",
          "type": "select",
          "required": false,
          "options": {
            "maxSelect": 1,
            "values": ["regular", "weekly_pattern", "monthly_pattern", "custom_dates"]
          },
          "description": "How often market runs"
        },
        {
          "name": "frequency_value",
          "type": "text",
          "required": false,
          "options": {
            "max": 100
          },
          "description": "Frequency description"
        },
        {
          "name": "frequency_details",
          "type": "json",
          "required": false,
          "description": "Complex frequency patterns"
        },
        {
          "name": "start_time",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
          },
          "description": "Market start time (HH:MM)"
        },
        {
          "name": "end_time",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
          },
          "description": "Market end time (HH:MM)"
        },
        {
          "name": "setup_time",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
          },
          "description": "Stallholder setup time"
        },
        {
          "name": "packdown_time",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
          },
          "description": "Stallholder packdown time"
        },
        {
          "name": "start_date",
          "type": "date",
          "required": false,
          "description": "Market series start date"
        },
        {
          "name": "end_date",
          "type": "date",
          "required": false,
          "description": "Market series end date"
        },
        {
          "name": "contact_email",
          "type": "email",
          "required": true,
          "description": "Market contact email"
        },
        {
          "name": "contact_phone",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^(\\+61|0)[2-478](?:[0-9]){8}$"
          },
          "description": "Market contact phone"
        },
        {
          "name": "website",
          "type": "url",
          "required": false,
          "description": "Market website"
        },
        {
          "name": "social_media",
          "type": "json",
          "required": false,
          "description": "Social media links"
        },
        {
          "name": "toilets",
          "type": "bool",
          "required": false,
          "description": "Toilets available"
        },
        {
          "name": "parking",
          "type": "bool",
          "required": false,
          "description": "Parking available"
        },
        {
          "name": "food_court",
          "type": "bool",
          "required": false,
          "description": "Food court available"
        },
        {
          "name": "atm",
          "type": "bool",
          "required": false,
          "description": "ATM available"
        },
        {
          "name": "wheelchair_access",
          "type": "bool",
          "required": false,
          "description": "Wheelchair accessible"
        },
        {
          "name": "childrens_area",
          "type": "bool",
          "required": false,
          "description": "Children's area available"
        },
        {
          "name": "entertainment",
          "type": "bool",
          "required": false,
          "description": "Entertainment provided"
        },
        {
          "name": "seating",
          "type": "bool",
          "required": false,
          "description": "Seating available"
        },
        {
          "name": "weather_protection",
          "type": "bool",
          "required": false,
          "description": "Covered/sheltered areas"
        },
        {
          "name": "storage_available",
          "type": "bool",
          "required": false,
          "description": "Storage for stallholders"
        },
        {
          "name": "loading_dock",
          "type": "bool",
          "required": false,
          "description": "Loading dock access"
        },
        {
          "name": "security",
          "type": "bool",
          "required": false,
          "description": "Security provided"
        },
        {
          "name": "wifi",
          "type": "bool",
          "required": false,
          "description": "WiFi available"
        },
        {
          "name": "pet_friendly",
          "type": "bool",
          "required": false,
          "description": "Pets allowed"
        },
        {
          "name": "fee_structure",
          "type": "json",
          "required": false,
          "description": "Complete fee structure with tiers"
        },
        {
          "name": "base_stall_fee",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Basic stall fee per day"
        },
        {
          "name": "application_fee",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Application processing fee"
        },
        {
          "name": "bond_required",
          "type": "bool",
          "required": false,
          "description": "Security bond required"
        },
        {
          "name": "bond_amount",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Security bond amount"
        },
        {
          "name": "insurance_required",
          "type": "bool",
          "required": false,
          "description": "Public liability insurance required"
        },
        {
          "name": "insurance_minimum",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Minimum insurance coverage"
        },
        {
          "name": "abn_required",
          "type": "bool",
          "required": false,
          "description": "ABN required for stallholders"
        },
        {
          "name": "power_available",
          "type": "bool",
          "required": false,
          "description": "Power available for stalls"
        },
        {
          "name": "power_cost",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Cost of power per stall"
        },
        {
          "name": "max_stalls",
          "type": "number",
          "required": false,
          "options": {
            "min": 1
          },
          "description": "Maximum number of stalls"
        },
        {
          "name": "stall_sizes",
          "type": "json",
          "required": false,
          "description": "Available stall sizes and counts"
        },
        {
          "name": "waiting_list_enabled",
          "type": "bool",
          "required": false,
          "description": "Enable waiting list when full"
        },
        {
          "name": "featured_image",
          "type": "file",
          "required": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": ["image/jpeg", "image/png", "image/webp"]
          },
          "description": "Main market image"
        },
        {
          "name": "gallery_images",
          "type": "file",
          "required": false,
          "options": {
            "maxSelect": 10,
            "maxSize": 5242880,
            "mimeTypes": ["image/jpeg", "image/png", "image/webp"]
          },
          "description": "Market gallery images"
        },
        {
          "name": "active",
          "type": "bool",
          "required": false,
          "description": "Market is active/published"
        },
        {
          "name": "view_count",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Profile view count"
        },
        {
          "name": "favorite_count",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Times favorited by users"
        },
        {
          "name": "average_rating",
          "type": "number",
          "required": false,
          "options": {
            "min": 0,
            "max": 5
          },
          "description": "Average user rating"
        },
        {
          "name": "total_reviews",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Total number of reviews"
        }
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": "@request.auth.id != \"\" && @request.auth.role = \"organizer\"",
      "updateRule": "@request.auth.id = organizer.id",
      "deleteRule": "@request.auth.id = organizer.id"
    },

    "stallholders": {
      "name": "stallholders",
      "type": "base",
      "description": "Stallholder business profiles",
      "schema": [
        {
          "name": "user",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "users",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["name", "email"]
          },
          "description": "Associated user account"
        },
        {
          "name": "business_name",
          "type": "text",
          "required": true,
          "options": {
            "min": 2,
            "max": 100
          },
          "description": "Business name"
        },
        {
          "name": "abn",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^[0-9]{11}$"
          },
          "description": "Australian Business Number"
        },
        {
          "name": "business_description",
          "type": "text",
          "required": false,
          "options": {
            "max": 1000
          },
          "description": "Business description"
        },
        {
          "name": "product_categories",
          "type": "json",
          "required": false,
          "description": "Product categories sold"
        },
        {
          "name": "contact_phone",
          "type": "text",
          "required": false,
          "options": {
            "pattern": "^(\\+61|0)[2-478](?:[0-9]){8}$"
          },
          "description": "Business contact phone"
        },
        {
          "name": "website",
          "type": "url",
          "required": false,
          "description": "Business website"
        },
        {
          "name": "social_media",
          "type": "json",
          "required": false,
          "description": "Social media profiles"
        },
        {
          "name": "insurance_details",
          "type": "json",
          "required": false,
          "description": "Insurance policy details"
        },
        {
          "name": "certifications",
          "type": "json",
          "required": false,
          "description": "Business certifications"
        },
        {
          "name": "setup_requirements",
          "type": "text",
          "required": false,
          "options": {
            "max": 500
          },
          "description": "Special setup requirements"
        },
        {
          "name": "power_required",
          "type": "bool",
          "required": false,
          "description": "Requires power connection"
        },
        {
          "name": "space_requirements",
          "type": "text",
          "required": false,
          "options": {
            "max": 200
          },
          "description": "Space size requirements"
        },
        {
          "name": "portfolio_images",
          "type": "file",
          "required": false,
          "options": {
            "maxSelect": 20,
            "maxSize": 5242880,
            "mimeTypes": ["image/jpeg", "image/png", "image/webp"]
          },
          "description": "Product/business images"
        },
        {
          "name": "rating",
          "type": "number",
          "required": false,
          "options": {
            "min": 0,
            "max": 5
          },
          "description": "Average rating"
        },
        {
          "name": "reviews_count",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Total reviews"
        },
        {
          "name": "verified",
          "type": "bool",
          "required": false,
          "description": "Verified stallholder status"
        },
        {
          "name": "subscription_tier",
          "type": "select",
          "required": false,
          "options": {
            "maxSelect": 1,
            "values": ["free", "basic", "premium"]
          },
          "description": "Subscription level"
        }
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": "@request.auth.id != \"\" && @request.auth.role = \"stallholder\"",
      "updateRule": "@request.auth.id = user.id",
      "deleteRule": "@request.auth.id = user.id"
    },

    "applications": {
      "name": "applications",
      "type": "base",
      "description": "Market applications from stallholders",
      "schema": [
        {
          "name": "stallholder",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "stallholders",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["business_name"]
          },
          "description": "Applying stallholder"
        },
        {
          "name": "market",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "markets",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["name"]
          },
          "description": "Target market"
        },
        {
          "name": "status",
          "type": "select",
          "required": true,
          "options": {
            "maxSelect": 1,
            "values": ["pending", "approved", "rejected", "waitlisted", "cancelled"]
          },
          "description": "Application status"
        },
        {
          "name": "application_date",
          "type": "date",
          "required": true,
          "description": "Date of application"
        },
        {
          "name": "requested_dates",
          "type": "json",
          "required": false,
          "description": "Specific dates requested"
        },
        {
          "name": "message",
          "type": "text",
          "required": false,
          "options": {
            "max": 1000
          },
          "description": "Stallholder message"
        },
        {
          "name": "organizer_notes",
          "type": "text",
          "required": false,
          "options": {
            "max": 1000
          },
          "description": "Internal organizer notes"
        },
        {
          "name": "fee_structure_snapshot",
          "type": "json",
          "required": false,
          "description": "Fee structure at time of application"
        },
        {
          "name": "payment_status",
          "type": "select",
          "required": false,
          "options": {
            "maxSelect": 1,
            "values": ["unpaid", "paid", "partial", "refunded"]
          },
          "description": "Payment status"
        },
        {
          "name": "payment_amount",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Amount paid"
        },
        {
          "name": "stall_assignment",
          "type": "text",
          "required": false,
          "options": {
            "max": 50
          },
          "description": "Assigned stall location"
        }
      ],
      "listRule": "",
      "viewRule": "@request.auth.id = stallholder.user.id || @request.auth.id = market.organizer.id",
      "createRule": "@request.auth.id != \"\" && @request.auth.role = \"stallholder\"",
      "updateRule": "@request.auth.id = market.organizer.id",
      "deleteRule": "@request.auth.id = stallholder.user.id || @request.auth.id = market.organizer.id"
    },

    "reviews": {
      "name": "reviews",
      "type": "base",
      "description": "User reviews for markets and stallholders",
      "schema": [
        {
          "name": "reviewer",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "users",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["name"]
          },
          "description": "User who wrote the review"
        },
        {
          "name": "target_type",
          "type": "select",
          "required": true,
          "options": {
            "maxSelect": 1,
            "values": ["market", "stallholder"]
          },
          "description": "What is being reviewed"
        },
        {
          "name": "target_id",
          "type": "text",
          "required": true,
          "options": {
            "min": 15,
            "max": 15
          },
          "description": "ID of the reviewed item"
        },
        {
          "name": "rating",
          "type": "number",
          "required": true,
          "options": {
            "min": 1,
            "max": 5
          },
          "description": "Rating (1-5 stars)"
        },
        {
          "name": "title",
          "type": "text",
          "required": false,
          "options": {
            "max": 100
          },
          "description": "Review title"
        },
        {
          "name": "comment",
          "type": "text",
          "required": false,
          "options": {
            "max": 1000
          },
          "description": "Review comment"
        },
        {
          "name": "helpful_votes",
          "type": "number",
          "required": false,
          "options": {
            "min": 0
          },
          "description": "Number of helpful votes"
        },
        {
          "name": "verified_purchase",
          "type": "bool",
          "required": false,
          "description": "Verified attendance/purchase"
        }
      ],
      "listRule": "",
      "viewRule": "",
      "createRule": "@request.auth.id != \"\"",
      "updateRule": "@request.auth.id = reviewer.id",
      "deleteRule": "@request.auth.id = reviewer.id"
    }
  }
};

async function saveSchema() {
  try {
    console.log('💾 Saving SA Markets Directory schema...');
    
    // Ensure schema directory exists
    if (!existsSync('./schema')) {
      await fs.mkdir('./schema', { recursive: true });
      console.log('📁 Created schema directory');
    }

    // Save the schema
    const schemaPath = './schema/database.json';
    await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2));
    
    console.log(`✅ Schema saved to: ${schemaPath}`);
    console.log(`📋 Collections: ${Object.keys(schema.collections).length}`);
    console.log('');
    console.log('Collections created:');
    Object.keys(schema.collections).forEach(name => {
      const collection = schema.collections[name];
      console.log(`  - ${name} (${collection.type}) - ${collection.schema?.length || 0} fields`);
    });
    
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Make sure PocketBase is running: ./pocketbase serve');
    console.log('2. Create admin account: http://localhost:8090/_/');
    console.log('3. Apply schema: node scripts/schema-manager.js apply');
    console.log('4. Seed data: node scripts/schema-manager.js seed');
    
  } catch (error) {
    console.error('❌ Error saving schema:', error.message);
    process.exit(1);
  }
}

saveSchema();
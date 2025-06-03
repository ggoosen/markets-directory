/* 
 * PocketBase Collections Schema for SA Markets App
 * 
 * Copy and paste these into PocketBase Admin UI -> Collections
 * Or use the PocketBase SDK to create them programmatically
 */

// 1. USERS Collection (Built-in, just configure fields)
// Add these custom fields to the built-in users collection:
/*
Fields to add:
- role: select (options: customer, stallholder, organizer)
- phone: text
- verified: bool (default: false)
- subscription_tier: select (options: free, basic, premium, enterprise)
*/

// 2. MARKETS Collection
const marketsSchema = {
  name: "markets",
  type: "base",
  schema: [
    {
      name: "name",
      type: "text",
      required: true,
      options: {
        min: 2,
        max: 100
      }
    },
    {
      name: "slug",
      type: "text",
      required: true,
      options: {
        pattern: "^[a-z0-9-]+$"
      }
    },
    {
      name: "organizer",
      type: "relation",
      required: true,
      options: {
        collectionId: "_pb_users_auth_", // Built-in users collection
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1
      }
    },
    {
      name: "state",
      type: "select",
      required: true,
      options: {
        values: ["SA", "VIC", "NSW", "QLD", "WA", "TAS", "NT", "ACT"]
      }
    },
    {
      name: "suburb",
      type: "text",
      required: true
    },
    {
      name: "address",
      type: "text",
      required: false
    },
    {
      name: "latitude",
      type: "number",
      required: false
    },
    {
      name: "longitude",
      type: "number",
      required: false
    },
    {
      name: "frequency",
      type: "select",
      required: false,
      options: {
        values: [
          "Daily", "Weekly", "Monthly", "Seasonal",
          "1st Saturday", "1st Sunday", "2nd Saturday", "2nd Sunday",
          "3rd Saturday", "3rd Sunday", "4th Saturday", "4th Sunday",
          "Specific Dates"
        ]
      }
    },
    {
      name: "day_of_week",
      type: "select",
      required: false,
      options: {
        values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      }
    },
    {
      name: "start_time",
      type: "text",
      required: false
    },
    {
      name: "end_time",
      type: "text",
      required: false
    },
    {
      name: "operating_hours",
      type: "text",
      required: false
    },
    {
      name: "specific_dates",
      type: "json",
      required: false
    },
    {
      name: "description",
      type: "editor",
      required: false
    },
    {
      name: "images",
      type: "file",
      required: false,
      options: {
        maxSelect: 10,
        maxSize: 5242880, // 5MB
        mimeTypes: ["image/jpeg", "image/png", "image/webp"]
      }
    },
    {
      name: "contact_email",
      type: "email",
      required: false
    },
    {
      name: "contact_phone",
      type: "text",
      required: false
    },
    {
      name: "website",
      type: "url",
      required: false
    },
    {
      name: "facebook",
      type: "text",
      required: false
    },
    {
      name: "instagram",
      type: "text",
      required: false
    },
    {
      name: "parking",
      type: "bool",
      required: false
    },
    {
      name: "toilets",
      type: "bool",
      required: false
    },
    {
      name: "food",
      type: "bool",
      required: false
    },
    {
      name: "accessibility",
      type: "bool",
      required: false
    },
    {
      name: "undercover",
      type: "bool",
      required: false
    },
    {
      name: "stall_cost",
      type: "number",
      required: false
    },
    {
      name: "application_fee",
      type: "number",
      required: false
    },
    {
      name: "status",
      type: "select",
      required: true,
      options: {
        values: ["active", "seasonal", "closed", "pending"]
      }
    },
    {
      name: "verification_status",
      type: "select",
      required: true,
      options: {
        values: ["pending", "verified", "rejected"]
      }
    },
    {
      name: "featured",
      type: "bool",
      required: false
    },
    {
      name: "category",
      type: "relation",
      required: false,
      options: {
        collectionId: "market_categories",
        cascadeDelete: false,
        maxSelect: 1
      }
    }
  ]
};

// 3. MARKET_CATEGORIES Collection
const marketCategoriesSchema = {
  name: "market_categories",
  type: "base",
  schema: [
    {
      name: "name",
      type: "text",
      required: true,
      options: {
        min: 2,
        max: 50
      }
    },
    {
      name: "slug",
      type: "text",
      required: true,
      options: {
        pattern: "^[a-z0-9-]+$"
      }
    },
    {
      name: "description",
      type: "text",
      required: false
    },
    {
      name: "color",
      type: "text",
      required: false,
      options: {
        pattern: "^#[0-9A-Fa-f]{6}$"
      }
    },
    {
      name: "icon",
      type: "text",
      required: false
    },
    {
      name: "active",
      type: "bool",
      required: true
    }
  ]
};

// 4. STALLHOLDERS Collection
const stallholdersSchema = {
  name: "stallholders",
  type: "base",
  schema: [
    {
      name: "user",
      type: "relation",
      required: true,
      options: {
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
        maxSelect: 1
      }
    },
    {
      name: "business_name",
      type: "text",
      required: true,
      options: {
        min: 2,
        max: 100
      }
    },
    {
      name: "abn",
      type: "text",
      required: false,
      options: {
        pattern: "^[0-9\\s]{11,14}$"
      }
    },
    {
      name: "product_categories",
      type: "json",
      required: false
    },
    {
      name: "description",
      type: "editor",
      required: false
    },
    {
      name: "images",
      type: "file",
      required: false,
      options: {
        maxSelect: 10,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/png", "image/webp"]
      }
    },
    {
      name: "website",
      type: "url",
      required: false
    },
    {
      name: "facebook",
      type: "text",
      required: false
    },
    {
      name: "instagram",
      type: "text",
      required: false
    },
    {
      name: "business_email",
      type: "email",
      required: false
    },
    {
      name: "stall_size",
      type: "select",
      required: false,
      options: {
        values: ["3x3", "6x3", "9x3", "custom"]
      }
    },
    {
      name: "power_required",
      type: "bool",
      required: false
    },
    {
      name: "setup_requirements",
      type: "text",
      required: false
    },
    {
      name: "rating",
      type: "number",
      required: false,
      options: {
        min: 0,
        max: 5
      }
    },
    {
      name: "reviews_count",
      type: "number",
      required: false,
      options: {
        min: 0
      }
    },
    {
      name: "subscription_tier",
      type: "select",
      required: true,
      options: {
        values: ["free", "basic", "premium"]
      }
    }
  ]
};

// 5. APPLICATIONS Collection
const applicationsSchema = {
  name: "applications",
  type: "base",
  schema: [
    {
      name: "stallholder",
      type: "relation",
      required: true,
      options: {
        collectionId: "stallholders",
        cascadeDelete: true,
        maxSelect: 1
      }
    },
    {
      name: "market",
      type: "relation",
      required: true,
      options: {
        collectionId: "markets",
        cascadeDelete: true,
        maxSelect: 1
      }
    },
    {
      name: "requested_dates",
      type: "json",
      required: false
    },
    {
      name: "message",
      type: "text",
      required: false
    },
    {
      name: "status",
      type: "select",
      required: true,
      options: {
        values: ["pending", "approved", "rejected", "cancelled", "waitlisted"]
      }
    },
    {
      name: "organizer_notes",
      type: "text",
      required: false
    },
    {
      name: "payment_status",
      type: "select",
      required: false,
      options: {
        values: ["unpaid", "paid", "refunded", "pending"]
      }
    },
    {
      name: "amount",
      type: "number",
      required: false,
      options: {
        min: 0
      }
    }
  ]
};

// 6. REVIEWS Collection
const reviewsSchema = {
  name: "reviews",
  type: "base",
  schema: [
    {
      name: "reviewer",
      type: "relation",
      required: true,
      options: {
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
        maxSelect: 1
      }
    },
    {
      name: "target_id",
      type: "text",
      required: true
    },
    {
      name: "target_type",
      type: "select",
      required: true,
      options: {
        values: ["market", "stallholder"]
      }
    },
    {
      name: "rating",
      type: "number",
      required: true,
      options: {
        min: 1,
        max: 5
      }
    },
    {
      name: "comment",
      type: "text",
      required: false
    },
    {
      name: "verified_visit",
      type: "bool",
      required: false
    }
  ]
};

// Sample data for Market Categories
const sampleCategories = [
  {
    name: "Farmers Market",
    slug: "farmers",
    description: "Fresh produce, local farmers, organic goods",
    color: "#22c55e",
    icon: "🌱",
    active: true
  },
  {
    name: "Craft & Artisan",
    slug: "craft",
    description: "Handmade crafts, artisan goods, unique creations",
    color: "#8b5cf6",
    icon: "🎨",
    active: true
  },
  {
    name: "Community Market",
    slug: "community",
    description: "Local community gatherings, mixed vendors",
    color: "#3b82f6",
    icon: "👥",
    active: true
  },
  {
    name: "Specialty Market",
    slug: "specialty",
    description: "Specialized goods, niche products",
    color: "#f59e0b",
    icon: "⭐",
    active: true
  },
  {
    name: "Food Market",
    slug: "food",
    description: "Food trucks, prepared foods, culinary experiences",
    color: "#ef4444",
    icon: "🍽️",
    active: true
  },
  {
    name: "Vintage & Antiques",
    slug: "vintage",
    description: "Vintage items, antiques, collectibles",
    color: "#6b7280",
    icon: "🕰️",
    active: true
  }
];

/* 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Install PocketBase:
 *    - Download from https://pocketbase.io/
 *    - Extract and run: ./pocketbase serve
 *    - Open http://localhost:8090/_/
 * 
 * 2. Create Admin Account:
 *    - Follow setup wizard
 *    - Create your admin email/password
 * 
 * 3. Create Collections:
 *    - Go to Collections in admin
 *    - Create each collection using the schemas above
 *    - Import sample categories data
 * 
 * 4. Configure Authentication:
 *    - Go to Settings > Auth
 *    - Enable email/password auth
 *    - Configure email templates if needed
 * 
 * 5. Set API Rules (optional for development):
 *    - Go to Collections > [Collection] > API Rules
 *    - For development, you can set permissive rules
 *    - In production, implement proper access controls
 * 
 * 6. Test Connection:
 *    - Update your .env file with PocketBase URL
 *    - Start your React app: npm run dev
 *    - Try registering a new user
 */

// Development API Rules (permissive - tighten for production)
const devApiRules = {
  // Users collection
  users: {
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "",
    updateRule: "@request.auth.id = id",
    deleteRule: "@request.auth.id = id"
  },
  
  // Markets collection
  markets: {
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.role = 'organizer'",
    updateRule: "@request.auth.id = organizer.id",
    deleteRule: "@request.auth.id = organizer.id"
  },
  
  // Stallholders collection
  stallholders: {
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.role = 'stallholder'",
    updateRule: "@request.auth.id = user.id",
    deleteRule: "@request.auth.id = user.id"
  },
  
  // Applications collection
  applications: {
    listRule: "@request.auth.id = stallholder.user.id || @request.auth.id = market.organizer.id",
    viewRule: "@request.auth.id = stallholder.user.id || @request.auth.id = market.organizer.id",
    createRule: "@request.auth.id = stallholder.user.id",
    updateRule: "@request.auth.id = market.organizer.id",
    deleteRule: "@request.auth.id = stallholder.user.id"
  },
  
  // Reviews collection
  reviews: {
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id = reviewer.id",
    deleteRule: "@request.auth.id = reviewer.id"
  },
  
  // Market categories collection
  market_categories: {
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.role = 'organizer'",
    updateRule: "@request.auth.role = 'organizer'",
    deleteRule: "@request.auth.role = 'organizer'"
  }
};
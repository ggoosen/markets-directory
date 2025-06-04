// scripts/manage-database.js - ES Module Version
import PocketBase from 'pocketbase';
import fs from 'fs';

const pb = new PocketBase(process.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

class DatabaseManager {
  constructor() {
    this.newMarketFields = [
      // Enhanced Schedule Fields
      { name: "frequency_type", type: "select", required: false, options: {
        maxSelect: 1, values: ["regular", "weekly_pattern", "monthly_pattern", "custom_dates"]
      }},
      { name: "frequency_details", type: "json", required: false },
      { name: "start_time", type: "text", required: false },
      { name: "end_time", type: "text", required: false },
      { name: "setup_time", type: "text", required: false },
      { name: "packdown_time", type: "text", required: false },
      
      // Enhanced Location Fields
      { name: "latitude", type: "number", required: false },
      { name: "longitude", type: "number", required: false },
      { name: "venue_type", type: "select", required: false, options: {
        maxSelect: 1, values: ["outdoor", "indoor", "covered", "mixed"]
      }},
      
      // Amenities (boolean fields)
      { name: "toilets", type: "bool", required: false },
      { name: "parking", type: "bool", required: false },
      { name: "food_court", type: "bool", required: false },
      { name: "atm", type: "bool", required: false },
      { name: "wheelchair_access", type: "bool", required: false },
      { name: "childrens_area", type: "bool", required: false },
      { name: "entertainment", type: "bool", required: false },
      { name: "seating", type: "bool", required: false },
      { name: "weather_protection", type: "bool", required: false },
      { name: "storage_available", type: "bool", required: false },
      { name: "loading_dock", type: "bool", required: false },
      { name: "security", type: "bool", required: false },
      { name: "wifi", type: "bool", required: false },
      { name: "pet_friendly", type: "bool", required: false },
      
      // Enhanced Fee Structure
      { name: "fee_structure", type: "json", required: false },
      { name: "base_stall_fee", type: "number", required: false },
      { name: "application_fee", type: "number", required: false },
      { name: "bond_required", type: "bool", required: false },
      { name: "bond_amount", type: "number", required: false },
      
      // Stallholder Requirements
      { name: "insurance_required", type: "bool", required: false },
      { name: "insurance_minimum", type: "number", required: false },
      { name: "abn_required", type: "bool", required: false },
      { name: "power_available", type: "bool", required: false },
      { name: "power_cost", type: "number", required: false },
      
      // Capacity
      { name: "max_stalls", type: "number", required: false },
      { name: "stall_sizes", type: "json", required: false },
      
      // Media
      { name: "featured_image", type: "file", required: false, options: { maxSelect: 1, maxSize: 5242880 } },
      { name: "gallery_images", type: "file", required: false, options: { maxSelect: 10, maxSize: 5242880 } },
      
      // Analytics
      { name: "view_count", type: "number", required: false },
      { name: "favorite_count", type: "number", required: false }
    ];
  }

  async addFieldsToMarkets() {
    try {
      console.log('🔄 Adding new fields to markets collection...');
      
      // Get current markets collection
      const collection = await pb.collections.getOne('markets');
      const currentFields = collection.schema.map(field => field.name);
      
      console.log(`📋 Current fields: ${currentFields.length}`);
      console.log(`📋 Fields to add: ${this.newMarketFields.length}`);
      
      // Add new fields that don't exist
      let fieldsAdded = 0;
      const updatedSchema = [...collection.schema];
      
      for (const newField of this.newMarketFields) {
        if (!currentFields.includes(newField.name)) {
          updatedSchema.push(newField);
          fieldsAdded++;
          console.log(`✅ Will add field: ${newField.name} (${newField.type})`);
        } else {
          console.log(`⏭️  Field already exists: ${newField.name}`);
        }
      }
      
      if (fieldsAdded > 0) {
        console.log(`🔄 Updating collection with ${fieldsAdded} new fields...`);
        
        // Update the collection with new schema
        await pb.collections.update(collection.id, {
          schema: updatedSchema
        });
        
        console.log(`🎉 Successfully added ${fieldsAdded} new fields to markets collection!`);
      } else {
        console.log('✅ All fields already exist, no updates needed.');
      }
      
    } catch (error) {
      console.error('❌ Error updating markets collection:', error);
      
      // More detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      
      throw error;
    }
  }

  async backupSchema() {
    try {
      console.log('💾 Creating schema backup...');
      
      const collections = ['users', 'markets', 'market_categories', 'stallholders', 'applications', 'reviews'];
      const backup = {
        timestamp: new Date().toISOString(),
        collections: {}
      };
      
      for (const name of collections) {
        try {
          const collection = await pb.collections.getOne(name);
          backup.collections[name] = collection;
          console.log(`✅ Backed up ${name} (${collection.schema.length} fields)`);
        } catch (error) {
          console.log(`⚠️  Could not backup ${name}: Collection not found`);
        }
      }

      const backupFile = `schema-backup-${new Date().toISOString().split('T')[0]}.json`;
      fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
      console.log(`💾 Schema backup saved to: ${backupFile}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Error creating backup:', error);
      throw error;
    }
  }

  async validateConnection() {
    try {
      console.log('🔍 Testing PocketBase connection...');
      const response = await fetch(`${pb.baseUrl}/api/health`);
      if (response.ok) {
        console.log('✅ PocketBase is running');
        return true;
      } else {
        console.log('❌ PocketBase health check failed');
        return false;
      }
    } catch (error) {
      console.log('❌ Cannot connect to PocketBase:', error.message);
      return false;
    }
  }

  async listCollections() {
    try {
      console.log('📋 Current collections:');
      const collections = await pb.collections.getFullList();
      collections.forEach(col => {
        console.log(`  📁 ${col.name} (${col.schema.length} fields)`);
      });
      return collections;
    } catch (error) {
      console.error('❌ Error listing collections:', error);
      throw error;
    }
  }

  async showMarketFields() {
    try {
      const collection = await pb.collections.getOne('markets');
      console.log(`\n📋 Current markets collection fields (${collection.schema.length}):`);
      collection.schema.forEach((field, index) => {
        const required = field.required ? '🔴 REQUIRED' : '⚪ optional';
        console.log(`  ${index + 1}. ${field.name} (${field.type}) ${required}`);
      });
      return collection.schema;
    } catch (error) {
      console.error('❌ Error showing market fields:', error);
      throw error;
    }
  }

  async checkMissingFields() {
    try {
      const collection = await pb.collections.getOne('markets');
      const currentFields = collection.schema.map(field => field.name);
      
      const missingFields = this.newMarketFields.filter(
        newField => !currentFields.includes(newField.name)
      );
      
      console.log(`\n🔍 Missing fields analysis:`);
      console.log(`📊 Current fields: ${currentFields.length}`);
      console.log(`📊 Available to add: ${this.newMarketFields.length}`);
      console.log(`📊 Missing fields: ${missingFields.length}`);
      
      if (missingFields.length > 0) {
        console.log(`\n📋 Missing fields:`);
        missingFields.forEach((field, index) => {
          console.log(`  ${index + 1}. ${field.name} (${field.type})`);
        });
      } else {
        console.log(`\n✅ All fields are already present!`);
      }
      
      return missingFields;
    } catch (error) {
      console.error('❌ Error checking missing fields:', error);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const manager = new DatabaseManager();

  // Test connection first
  const connected = await manager.validateConnection();
  if (!connected) {
    console.log('\n❌ Cannot connect to PocketBase.');
    console.log('Make sure PocketBase is running: ./pocketbase serve');
    console.log('Expected URL: http://localhost:8090');
    process.exit(1);
  }

  try {
    switch (command) {
      case 'backup':
        await manager.backupSchema();
        break;
        
      case 'update':
        console.log('🚀 Starting markets collection update...\n');
        await manager.backupSchema();
        console.log(''); // Empty line
        await manager.addFieldsToMarkets();
        console.log('\n✅ Update complete!');
        console.log('Run "node scripts/manage-database.js fields" to see updated schema');
        break;
        
      case 'list':
        await manager.listCollections();
        break;
        
      case 'fields':
        await manager.showMarketFields();
        break;
        
      case 'check':
        await manager.checkMissingFields();
        break;
        
      case 'validate':
        await manager.listCollections();
        await manager.showMarketFields();
        await manager.checkMissingFields();
        break;
        
      default:
        console.log(`
🗄️  Database Schema Manager

Usage:
  node scripts/manage-database.js <command>

Commands:
  backup    - Create backup of current schema
  update    - Add new fields to markets collection (with backup)
  list      - Show all collections
  fields    - Show current market fields
  check     - Check which fields are missing
  validate  - Complete analysis (list + fields + check)

Recommended workflow:
  1. node scripts/manage-database.js check     # See what will be added
  2. node scripts/manage-database.js backup   # Create backup
  3. node scripts/manage-database.js update   # Apply changes
  4. node scripts/manage-database.js fields   # Verify results

Examples:
  node scripts/manage-database.js check
  node scripts/manage-database.js update
  node scripts/manage-database.js validate
        `);
    }
  } catch (error) {
    console.error('\n❌ Command failed:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Script failed:', error.message);
  process.exit(1);
});
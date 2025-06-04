// scripts/schema-manager.js - Enhanced with Apply Functionality
import PocketBase from 'pocketbase';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { AuthManager, PasswordInput } from './auth-manager.js';

const pb = new PocketBase(process.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

class SchemaManager {
  constructor() {
    this.authenticated = false;
    this.authManager = new AuthManager();
    this.schemaPath = './schema/database.json';
    this.backupPath = './schema/backups';
    this.schema = null;
    this.debug = process.env.DEBUG === 'true' || process.argv.includes('--debug');
  }

  log(message, level = 'info') {
    if (this.debug || level === 'error') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    }
  }

  async loadSchema() {
    try {
      if (!existsSync(this.schemaPath)) {
        console.log('📄 Schema file not found, creating default schema...');
        await this.createDefaultSchema();
      }

      const schemaContent = await fs.readFile(this.schemaPath, 'utf8');
      this.schema = JSON.parse(schemaContent);
      
      this.log(`Schema loaded from ${this.schemaPath}`, 'debug');
      
      console.log(`✅ Loaded schema v${this.schema.version}`);
      console.log(`📋 Collections defined: ${Object.keys(this.schema.collections).length}`);
      
      if (Object.keys(this.schema.collections).length === 0) {
        console.log('⚠️  Warning: No collections defined in schema file');
        console.log('💡 Tip: Run "node scripts/schema-manager.js generate" to create from existing DB');
      } else {
        console.log('📋 Collections:');
        Object.keys(this.schema.collections).forEach(name => {
          const collection = this.schema.collections[name];
          console.log(`  - ${name} (${collection.type}) - ${collection.schema?.length || 0} fields`);
        });
      }
      
      return this.schema;
    } catch (error) {
      console.error('❌ Error loading schema:', error.message);
      throw error;
    }
  }

  async createDefaultSchema() {
    const defaultSchema = {
      version: "1.0.0",
      description: "SA Markets Directory - Database Schema",
      created: new Date().toISOString(),
      collections: {}
    };

    if (!existsSync('./schema')) {
      await fs.mkdir('./schema', { recursive: true });
    }

    await fs.writeFile(this.schemaPath, JSON.stringify(defaultSchema, null, 2));
    console.log('✅ Created default schema file');
  }

  async authenticateAdmin() {
    if (this.authenticated) return true;

    console.log('\n🔐 Admin authentication required');
    this.log(`PocketBase URL: ${pb.baseUrl}`, 'debug');
    
    try {
      // First, try environment variables
      const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
      const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
      
      if (adminEmail && adminPassword) {
        console.log('🔑 Using admin credentials from environment variables...');
        this.log(`Authenticating with env vars for: ${adminEmail}`, 'debug');
        
        try {
          const authData = await this.authenticateWithCredentials(adminEmail, adminPassword);
          await this.authManager.saveCredentials(adminEmail, adminPassword, authData.token);
          this.authenticated = true;
          console.log('✅ Admin authentication successful');
          return true;
        } catch (envError) {
          console.log('❌ Environment credentials failed:', envError.message);
          this.log(`Env auth error: ${JSON.stringify(envError)}`, 'debug');
        }
      }

      // Second, try stored credentials
      console.log('🔍 Checking for stored credentials...');
      const storedCreds = await this.authManager.loadCredentials();
      
      if (storedCreds) {
        try {
          console.log('🔑 Using stored credentials...');
          this.log(`Stored creds for: ${storedCreds.email}`, 'debug');
          
          const authData = await this.authenticateWithCredentials(storedCreds.email, storedCreds.password);
          await this.authManager.saveCredentials(storedCreds.email, storedCreds.password, authData.token);
          
          this.authenticated = true;
          console.log('✅ Authentication successful with stored credentials');
          
          const daysUntilExpiry = Math.ceil((storedCreds.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
          console.log(`ℹ️  Stored credentials expire in ${daysUntilExpiry} days`);
          
          return true;
        } catch (storedError) {
          console.log('⚠️  Stored credentials are invalid, requesting new ones...');
          this.log(`Stored auth error: ${JSON.stringify(storedError)}`, 'debug');
          await this.authManager.clearCredentials();
        }
      }

      // Third, prompt for credentials
      console.log('\n📝 Please enter your PocketBase admin credentials:');
      console.log('💡 Tip: Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD env vars to skip this');
      console.log('💡 Credentials will be stored securely for 7 days\n');
      
      const email = await PasswordInput.getInput('Admin email: ');
      if (!email) {
        throw new Error('Email is required');
      }

      const password = await PasswordInput.getPassword('Admin password: ');
      if (!password) {
        throw new Error('Password is required');
      }

      console.log('🔑 Authenticating...');
      
      try {
        const authData = await this.authenticateWithCredentials(email, password);
        await this.authManager.saveCredentials(email, password, authData.token);
        
        this.authenticated = true;
        console.log('✅ Admin authentication successful');
        console.log('💾 Credentials saved securely for future use');
        
        return true;
      } catch (authError) {
        this.log(`Auth error details: ${JSON.stringify(authError)}`, 'debug');
        throw authError;
      }
      
    } catch (error) {
      console.error('❌ Admin authentication failed:', error.message);
      this.log(`Full error: ${JSON.stringify(error)}`, 'error');
      
      if (error.message.includes('not found') || error.status === 404) {
        console.log('\n🚨 "Resource not found" usually means:');
        console.log('   1. No admin account exists in PocketBase yet');
        console.log('   2. Visit http://localhost:8090/_/ to create the first admin');
        console.log('   3. Or PocketBase version mismatch');
        console.log('\n🔧 Quick setup:');
        console.log('   1. Stop this script (Ctrl+C)');
        console.log('   2. Open http://localhost:8090/_/ in your browser');
        console.log('   3. Create an admin account');
        console.log('   4. Run this script again');
      }
      
      await this.authManager.clearCredentials();
      return false;
    }
  }

  async authenticateWithCredentials(email, password) {
    try {
      this.log(`Attempting authentication for: ${email}`, 'debug');
      const authData = await pb.admins.authWithPassword(email, password);
      this.log(`Auth successful, token length: ${authData.token?.length}`, 'debug');
      return authData;
    } catch (error) {
      this.log(`Authentication error: ${JSON.stringify(error)}`, 'debug');
      
      if (error.status === 404) {
        try {
          this.log('Trying alternative authentication method...', 'debug');
          
          const response = await fetch(`${pb.baseUrl}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: email, password })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Authentication failed: ${errorData.message || response.statusText}`);
          }
          
          const authData = await response.json();
          pb.authStore.save(authData.token, authData.admin);
          return authData;
        } catch (altError) {
          this.log(`Alternative auth failed: ${JSON.stringify(altError)}`, 'debug');
          throw error;
        }
      }
      
      throw error;
    }
  }

  async validateConnection() {
    try {
      console.log('🔍 Testing PocketBase connection...');
      this.log(`Testing connection to: ${pb.baseUrl}`, 'debug');
      
      const response = await fetch(`${pb.baseUrl}/api/health`);
      this.log(`Health check response: ${response.status}`, 'debug');
      
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

  async getCurrentSchema() {
    try {
      if (!await this.authenticateAdmin()) {
        throw new Error('Admin authentication required');
      }

      this.log('Fetching collections from PocketBase...', 'debug');
      const collections = await pb.collections.getFullList();
      this.log(`Found ${collections.length} collections`, 'debug');
      
      const currentSchema = {
        timestamp: new Date().toISOString(),
        collections: {}
      };

      for (const collection of collections) {
        this.log(`Processing collection: ${collection.name}`, 'debug');
        currentSchema.collections[collection.name] = {
          name: collection.name,
          type: collection.type,
          schema: collection.schema,
          listRule: collection.listRule,
          viewRule: collection.viewRule,
          createRule: collection.createRule,
          updateRule: collection.updateRule,
          deleteRule: collection.deleteRule
        };
      }

      return currentSchema;
    } catch (error) {
      console.error('❌ Error getting current schema:', error.message);
      throw error;
    }
  }

  async compareSchemas() {
    try {
      await this.loadSchema();
      const currentSchema = await this.getCurrentSchema();
      
      const comparison = {
        toCreate: [],
        toUpdate: [],
        toDelete: [],
        changes: []
      };

      const definedCollections = Object.keys(this.schema.collections);
      const currentCollections = Object.keys(currentSchema.collections);

      this.log(`Defined collections: ${definedCollections.join(', ')}`, 'debug');
      this.log(`Current collections: ${currentCollections.join(', ')}`, 'debug');

      // Find collections to create
      for (const collectionName of definedCollections) {
        if (!currentCollections.includes(collectionName)) {
          comparison.toCreate.push(collectionName);
        }
      }

      // Find collections to delete (exist in DB but not in schema)
      for (const collectionName of currentCollections) {
        if (!definedCollections.includes(collectionName)) {
          // Skip system collections
          if (!collectionName.startsWith('_') && collectionName !== 'users') {
            comparison.toDelete.push(collectionName);
          }
        }
      }

      // Find collections to update
      for (const collectionName of definedCollections) {
        if (currentCollections.includes(collectionName)) {
          const definedCollection = this.schema.collections[collectionName];
          const currentCollection = currentSchema.collections[collectionName];
          
          const changes = this.compareCollectionSchemas(definedCollection, currentCollection);
          
          if (changes.length > 0) {
            comparison.toUpdate.push(collectionName);
            comparison.changes.push({
              collection: collectionName,
              changes: changes
            });
          }
        }
      }

      return comparison;
    } catch (error) {
      console.error('❌ Error comparing schemas:', error.message);
      throw error;
    }
  }

  compareCollectionSchemas(defined, current) {
    const changes = [];

    // Compare fields
    const definedFields = defined.schema || [];
    const currentFields = current.schema || [];
    
    const definedFieldNames = definedFields.map(f => f.name);
    const currentFieldNames = currentFields.map(f => f.name);

    // Fields to add
    for (const field of definedFields) {
      if (!currentFieldNames.includes(field.name)) {
        changes.push({
          type: 'add_field',
          field: field.name,
          details: field
        });
      }
    }

    // Fields to remove
    for (const field of currentFields) {
      if (!definedFieldNames.includes(field.name)) {
        changes.push({
          type: 'remove_field',
          field: field.name,
          details: field
        });
      }
    }

    // Fields to modify
    for (const definedField of definedFields) {
      const currentField = currentFields.find(f => f.name === definedField.name);
      if (currentField && !this.fieldsEqual(definedField, currentField)) {
        changes.push({
          type: 'modify_field',
          field: definedField.name,
          from: currentField,
          to: definedField
        });
      }
    }

    // Compare access rules
    const ruleFields = ['listRule', 'viewRule', 'createRule', 'updateRule', 'deleteRule'];
    for (const rule of ruleFields) {
      if (defined[rule] !== current[rule]) {
        changes.push({
          type: 'modify_rule',
          rule: rule,
          from: current[rule],
          to: defined[rule]
        });
      }
    }

    return changes;
  }

  fieldsEqual(field1, field2) {
    return JSON.stringify(field1) === JSON.stringify(field2);
  }

  async displayComparison(comparison) {
    console.log('\n📊 SCHEMA COMPARISON RESULTS');
    console.log('=====================================');

    if (comparison.toCreate.length === 0 && 
        comparison.toUpdate.length === 0 && 
        comparison.toDelete.length === 0) {
      console.log('✅ Database schema is up to date!');
      return;
    }

    if (comparison.toCreate.length > 0) {
      console.log(`\n🆕 Collections to CREATE (${comparison.toCreate.length}):`);
      for (const collection of comparison.toCreate) {
        const schema = this.schema.collections[collection];
        console.log(`  📁 ${collection} (${schema.type}) - ${schema.schema?.length || 0} fields`);
      }
    }

    if (comparison.toUpdate.length > 0) {
      console.log(`\n🔄 Collections to UPDATE (${comparison.toUpdate.length}):`);
      for (const changeSet of comparison.changes) {
        console.log(`  📁 ${changeSet.collection}:`);
        for (const change of changeSet.changes) {
          switch (change.type) {
            case 'add_field':
              console.log(`    ➕ Add field: ${change.field} (${change.details.type})`);
              break;
            case 'remove_field':
              console.log(`    ➖ Remove field: ${change.field} (${change.details.type})`);
              break;
            case 'modify_field':
              console.log(`    🔧 Modify field: ${change.field}`);
              break;
            case 'modify_rule':
              console.log(`    🔐 Modify rule: ${change.rule}`);
              break;
          }
        }
      }
    }

    console.log('\n=====================================');
    console.log('💡 Run "node scripts/schema-manager.js apply" to apply these changes');
  }

  async applySchema() {
    try {
      console.log('🚀 Applying schema changes to database...');
      
      const comparison = await this.compareSchemas();
      
      if (comparison.toCreate.length === 0 && 
          comparison.toUpdate.length === 0 && 
          comparison.toDelete.length === 0) {
        console.log('✅ No changes needed - schema is up to date!');
        return;
      }

      // Show what will be changed
      await this.displayComparison(comparison);
      
      console.log('\n⚠️  WARNING: This will modify your database structure!');
      const confirm = await PasswordInput.getInput('Continue? (yes/no): ');
      
      if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        console.log('❌ Schema application cancelled');
        return;
      }

      // Apply changes
      let successCount = 0;
      let errorCount = 0;

      // 1. Create new collections
      for (const collectionName of comparison.toCreate) {
        try {
          console.log(`\n🆕 Creating collection: ${collectionName}`);
          await this.createCollection(collectionName);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to create ${collectionName}:`, error.message);
          errorCount++;
        }
      }

      // 2. Update existing collections
      for (const changeSet of comparison.changes) {
        try {
          console.log(`\n🔄 Updating collection: ${changeSet.collection}`);
          await this.updateCollection(changeSet.collection, changeSet.changes);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to update ${changeSet.collection}:`, error.message);
          errorCount++;
        }
      }

      console.log('\n📊 SCHEMA APPLICATION RESULTS');
      console.log('=====================================');
      console.log(`✅ Successful operations: ${successCount}`);
      console.log(`❌ Failed operations: ${errorCount}`);
      
      if (errorCount === 0) {
        console.log('🎉 Schema successfully applied!');
      } else {
        console.log('⚠️  Some operations failed. Check the errors above.');
      }

    } catch (error) {
      console.error('❌ Error applying schema:', error.message);
      throw error;
    }
  }

  async createCollection(collectionName) {
    const collectionSchema = this.schema.collections[collectionName];
    
    const collectionData = {
      name: collectionName,
      type: collectionSchema.type,
      schema: collectionSchema.schema || [],
      listRule: collectionSchema.listRule || null,
      viewRule: collectionSchema.viewRule || null,
      createRule: collectionSchema.createRule || null,
      updateRule: collectionSchema.updateRule || null,
      deleteRule: collectionSchema.deleteRule || null
    };

    this.log(`Creating collection with data: ${JSON.stringify(collectionData, null, 2)}`, 'debug');
    
    const createdCollection = await pb.collections.create(collectionData);
    console.log(`  ✅ Created: ${collectionName}`);
    return createdCollection;
  }

  async updateCollection(collectionName, changes) {
    const currentCollection = await pb.collections.getFirstListItem(`name="${collectionName}"`);
    const newSchema = this.schema.collections[collectionName];
    
    const updateData = {
      schema: newSchema.schema || [],
      listRule: newSchema.listRule || null,
      viewRule: newSchema.viewRule || null,
      createRule: newSchema.createRule || null,
      updateRule: newSchema.updateRule || null,
      deleteRule: newSchema.deleteRule || null
    };

    this.log(`Updating collection ${collectionName} with: ${JSON.stringify(updateData, null, 2)}`, 'debug');
    
    const updatedCollection = await pb.collections.update(currentCollection.id, updateData);
    console.log(`  ✅ Updated: ${collectionName} (${changes.length} changes)`);
    return updatedCollection;
  }

  async generateSchema() {
    try {
      console.log('📋 Generating schema from current database...');
      
      const currentSchema = await this.getCurrentSchema();
      const outputSchema = {
        version: "1.0.0",
        description: "Generated from current PocketBase database",
        generated: currentSchema.timestamp,
        collections: currentSchema.collections
      };

      if (!existsSync('./schema')) {
        await fs.mkdir('./schema', { recursive: true });
      }

      const outputFile = './schema/generated-schema.json';
      await fs.writeFile(outputFile, JSON.stringify(outputSchema, null, 2));
      
      console.log(`✅ Schema generated: ${outputFile}`);
      console.log('💡 You can copy this to database.json and edit as needed');
      
    } catch (error) {
      console.error('❌ Error generating schema:', error.message);
      throw error;
    }
  }

  async seedData() {
    try {
      console.log('🌱 Seeding initial data...');
      
      if (!await this.authenticateAdmin()) {
        throw new Error('Admin authentication required');
      }

      // Seed market categories
      console.log('📋 Creating market categories...');
      const categories = [
        {
          name: "Farmers Market",
          description: "Fresh produce, local farms, organic goods",
          color: "#22c55e",
          icon: "apple",
          sort_order: 1
        },
        {
          name: "Craft & Artisan",
          description: "Handmade crafts, art, unique creations",
          color: "#8b5cf6",
          icon: "paintbrush",
          sort_order: 2
        },
        {
          name: "Community Market",
          description: "Local community events and markets",
          color: "#3b82f6",
          icon: "users",
          sort_order: 3
        },
        {
          name: "Food Market",
          description: "Prepared foods, specialty cuisines",
          color: "#ef4444",
          icon: "utensils",
          sort_order: 4
        },
        {
          name: "Vintage & Antiques",
          description: "Vintage items, antiques, collectibles",
          color: "#6b7280",
          icon: "clock",
          sort_order: 5
        },
        {
          name: "General Market",
          description: "Mixed vendors and general goods",
          color: "#f59e0b",
          icon: "shopping-bag",
          sort_order: 6
        }
      ];

      for (const category of categories) {
        try {
          await pb.collection('market_categories').create(category);
          console.log(`  ✅ Created category: ${category.name}`);
        } catch (error) {
          if (error.message.includes('failed "unique" constraint')) {
            console.log(`  ℹ️  Category already exists: ${category.name}`);
          } else {
            console.error(`  ❌ Failed to create ${category.name}:`, error.message);
          }
        }
      }

      console.log('✅ Initial data seeding completed!');

    } catch (error) {
      console.error('❌ Error seeding data:', error.message);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const manager = new SchemaManager();

  if (command === 'debug' || args.includes('--debug')) {
    process.env.DEBUG = 'true';
    console.log('🐛 Debug mode enabled');
  }

  if (command !== 'init' && command !== 'setup') {
    const connected = await manager.validateConnection();
    if (!connected) {
      console.log('\n❌ Cannot connect to PocketBase.');
      console.log('Make sure PocketBase is running: ./pocketbase serve');
      console.log(`Expected URL: ${process.env.VITE_POCKETBASE_URL || 'http://localhost:8090'}`);
      process.exit(1);
    }
  }

  try {
    switch (command) {
      case 'generate':
        await manager.generateSchema();
        break;

      case 'compare':
      case 'diff':
        const comparison = await manager.compareSchemas();
        await manager.displayComparison(comparison);
        break;

      case 'apply':
        await manager.applySchema();
        break;

      case 'seed':
        await manager.seedData();
        break;

      case 'setup':
        console.log('\n🚀 SA Markets Directory - Database Setup');
        console.log('==========================================');
        console.log('1. Make sure PocketBase is running: ./pocketbase serve');
        console.log('2. Create admin account: http://localhost:8090/_/');
        console.log('3. Apply schema: node scripts/schema-manager.js apply');
        console.log('4. Seed initial data: node scripts/schema-manager.js seed');
        console.log('5. Test the application!');
        break;

      default:
        console.log(`
🗄️  SA Markets Directory - Schema Management System

Usage:
  node scripts/schema-manager.js <command> [--debug]

Commands:
  setup     - Show complete setup instructions
  generate  - Generate schema from current database  
  compare   - Compare schema files with database
  apply     - Apply schema changes to database
  seed      - Add initial data (categories, etc.)
  debug     - Enable debug logging

Examples:
  node scripts/schema-manager.js setup
  node scripts/schema-manager.js compare
  node scripts/schema-manager.js apply
  node scripts/schema-manager.js seed

Quick start:
  1. Make sure PocketBase is running
  2. Visit http://localhost:8090/_/ to create admin
  3. Run: node scripts/schema-manager.js apply
  4. Run: node scripts/schema-manager.js seed
        `);
    }
  } catch (error) {
    console.error('\n❌ Command failed:', error.message);
    manager.log(`Full error: ${JSON.stringify(error)}`, 'error');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Script failed:', error.message);
  process.exit(1);
});
// scripts/schema-manager.js - Enhanced with Collection ID Resolution (FIXED)
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
    this.resolvedSchema = null; // ADD: Store resolved schema separately
    this.debug = process.env.DEBUG === 'true' || process.argv.includes('--debug');
    this.collectionIdMap = {}; // Collection ID mapping
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    // Add to buffer for file output (with safety check)
    if (!this.logBuffer) {
      this.logBuffer = [];
    }
    this.logBuffer.push(logMessage);
    
    // Console output based on debug mode
    if (this.debug || level === 'error') {
      console.log(logMessage);
    }
  }

  // Add method to log console output to buffer as well
  logToFile(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    // Add to buffer (with safety check)
    if (!this.logBuffer) {
      this.logBuffer = [];
    }
    this.logBuffer.push(logMessage);
    
    // Also output to console
    console.log(message);
  }

  async writeLogFile() {
    try {
      // Safety check for logBuffer
      if (!this.logBuffer) {
        this.logBuffer = ['No log entries recorded'];
      }

      // Safety check for startTime
      if (!this.startTime) {
        this.startTime = new Date();
      }

      // Safety check for outputFile
      const outputFile = this.outputFile || './output.log';

      const header = [
        '='.repeat(80),
        `SA Markets Directory - Schema Manager Log`,
        `Started: ${this.startTime.toISOString()}`,
        `Completed: ${new Date().toISOString()}`,
        `Duration: ${((Date.now() - this.startTime.getTime()) / 1000).toFixed(2)}s`,
        `Command: ${process.argv.slice(2).join(' ')}`,
        `PocketBase URL: ${pb.baseUrl}`,
        '='.repeat(80),
        ''
      ];

      const content = header.concat(this.logBuffer).join('\n');
      await fs.writeFile(outputFile, content);
      console.log(`📝 Full log written to: ${outputFile}`);
    } catch (error) {
      console.error('❌ Failed to write log file:', error.message);
    }
  }

  async buildCollectionIdMap() {
    try {
      this.log('Building collection ID mapping...', 'debug');
      
      const collections = await pb.collections.getFullList();
      this.collectionIdMap = {};

      collections.forEach(collection => {
        // Map both name and NAME_ID format
        this.collectionIdMap[collection.name] = collection.id;
        this.collectionIdMap[collection.name.toUpperCase() + '_ID'] = collection.id;
        
        // Special handling for auth collection
        if (collection.type === 'auth') {
          this.collectionIdMap['_pb_users_auth_'] = collection.id;
          this.collectionIdMap['USERS_ID'] = collection.id;
          this.collectionIdMap['users'] = collection.id;
        }
      });

      this.log(`Collection ID mapping built: ${Object.keys(this.collectionIdMap).length} mappings`, 'debug');
      this.logToFile('📋 Collection ID Mapping:');
      Object.entries(this.collectionIdMap).forEach(([key, id]) => {
        this.log(`  ${key}: ${id}`, 'debug');
      });
      
      return this.collectionIdMap;
    } catch (error) {
      this.logToFile(`❌ Error building collection ID map: ${error.message}`, 'error');
      throw error;
    }
  }

  // FIXED: Method to replace collection ID placeholders in schema
  resolveCollectionIds(schema) {
    this.log('Resolving collection ID placeholders...', 'debug');
    
    // Deep clone the schema to avoid mutating the original
    const resolvedSchema = JSON.parse(JSON.stringify(schema));

    // Only resolve IDs within field definitions, NOT in collection names
    Object.keys(resolvedSchema.collections).forEach(collectionName => {
      const collection = resolvedSchema.collections[collectionName];
      
      if (collection.schema) {
        collection.schema.forEach(field => {
          if (field.type === 'relation' && field.options && field.options.collectionId) {
            const originalId = field.options.collectionId;
            
            // Check if this is a placeholder that needs resolution
            if (this.collectionIdMap[originalId]) {
              field.options.collectionId = this.collectionIdMap[originalId];
              this.log(`Resolved relation field ${field.name}: ${originalId} -> ${field.options.collectionId}`, 'debug');
            }
          }
        });
      }
    });

    this.log('Collection IDs resolved successfully', 'debug');
    return resolvedSchema;
  }

  async loadSchema() {
    try {
      if (!existsSync(this.schemaPath)) {
        this.logToFile('📄 Schema file not found, creating default schema...');
        await this.createDefaultSchema();
      }

      const schemaContent = await fs.readFile(this.schemaPath, 'utf8');
      this.schema = JSON.parse(schemaContent);

      this.log(`Schema loaded from ${this.schemaPath}`, 'debug');

      this.logToFile(`✅ Loaded schema v${this.schema.version}`);
      this.logToFile(`📋 Collections defined: ${Object.keys(this.schema.collections).length}`);

      if (Object.keys(this.schema.collections).length === 0) {
        this.logToFile('⚠️  Warning: No collections defined in schema file');
        this.logToFile('💡 Tip: Run "node scripts/schema-manager.js generate" to create from existing DB');
      } else {
        this.logToFile('📋 Collections:');
        Object.keys(this.schema.collections).forEach(name => {
          const collection = this.schema.collections[name];
          this.logToFile(`  - ${name} (${collection.type}) - ${collection.schema?.length || 0} fields`);
        });
      }

      return this.schema;
    } catch (error) {
      this.logToFile(`❌ Error loading schema: ${error.message}`, 'error');
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

    this.logToFile('\n🔐 Admin authentication required');
    this.log(`PocketBase URL: ${pb.baseUrl}`, 'debug');

    try {
      // First, try environment variables
      const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
      const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

      if (adminEmail && adminPassword) {
        this.logToFile('🔑 Using admin credentials from environment variables...');
        this.log(`Authenticating with env vars for: ${adminEmail}`, 'debug');

        try {
          const authData = await this.authenticateWithCredentials(adminEmail, adminPassword);
          await this.authManager.saveCredentials(adminEmail, adminPassword, authData.token);
          this.authenticated = true;
          this.logToFile('🔐 Credentials saved securely');
          this.logToFile('✅ Authentication successful with stored credentials');
          return true;
        } catch (envError) {
          this.logToFile(`❌ Environment credentials failed: ${envError.message}`);
          this.log(`Env auth error: ${JSON.stringify(envError)}`, 'debug');
        }
      }

      // Second, try stored credentials
      this.logToFile('🔍 Checking for stored credentials...');
      const storedCreds = await this.authManager.loadCredentials();

      if (storedCreds) {
        try {
          this.logToFile('🔑 Using stored credentials...');
          this.log(`Stored creds for: ${storedCreds.email}`, 'debug');

          const authData = await this.authenticateWithCredentials(storedCreds.email, storedCreds.password);
          await this.authManager.saveCredentials(storedCreds.email, storedCreds.password, authData.token);

          this.authenticated = true;
          this.logToFile('🔐 Credentials saved securely');
          this.logToFile('✅ Authentication successful with stored credentials');

          const daysUntilExpiry = Math.ceil((storedCreds.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
          this.logToFile(`ℹ️  Stored credentials expire in ${daysUntilExpiry} days`);

          return true;
        } catch (storedError) {
          this.logToFile('⚠️  Stored credentials are invalid, requesting new ones...');
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

      this.logToFile('🔑 Authenticating...');

      try {
        const authData = await this.authenticateWithCredentials(email, password);
        await this.authManager.saveCredentials(email, password, authData.token);

        this.authenticated = true;
        this.logToFile('✅ Admin authentication successful');
        this.logToFile('💾 Credentials saved securely for future use');

        return true;
      } catch (authError) {
        this.log(`Auth error details: ${JSON.stringify(authError)}`, 'debug');
        throw authError;
      }

    } catch (error) {
      this.logToFile(`❌ Admin authentication failed: ${error.message}`, 'error');
      this.log(`Full error: ${JSON.stringify(error)}`, 'error');

      if (error.message.includes('not found') || error.status === 404) {
        this.logToFile('\n🚨 "Resource not found" usually means:');
        this.logToFile('   1. No admin account exists in PocketBase yet');
        this.logToFile('   2. Visit http://localhost:8090/_/ to create the first admin');
        this.logToFile('   3. Or PocketBase version mismatch');
        this.logToFile('\n🔧 Quick setup:');
        this.logToFile('   1. Stop this script (Ctrl+C)');
        this.logToFile('   2. Open http://localhost:8090/_/ in your browser');
        this.logToFile('   3. Create an admin account');
        this.logToFile('   4. Run this script again');
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
      this.logToFile('🔍 Testing PocketBase connection...');
      this.log(`Testing connection to: ${pb.baseUrl}`, 'debug');

      const response = await fetch(`${pb.baseUrl}/api/health`);
      this.log(`Health check response: ${response.status}`, 'debug');

      if (response.ok) {
        this.logToFile('✅ PocketBase is running');
        return true;
      } else {
        this.logToFile('❌ PocketBase health check failed');
        return false;
      }
    } catch (error) {
      this.logToFile(`❌ Cannot connect to PocketBase: ${error.message}`);
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
      
      // Authenticate first, then build collection ID mapping
      if (!await this.authenticateAdmin()) {
        throw new Error('Admin authentication required');
      }
      
      // BUILD collection ID mapping after authentication
      await this.buildCollectionIdMap();
      
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
    this.logToFile('\n📊 SCHEMA COMPARISON RESULTS');
    this.logToFile('=====================================');

    if (comparison.toCreate.length === 0 &&
      comparison.toUpdate.length === 0 &&
      comparison.toDelete.length === 0) {
      this.logToFile('✅ Database schema is up to date!');
      return;
    }

    if (comparison.toCreate.length > 0) {
      this.logToFile(`\n🆕 Collections to CREATE (${comparison.toCreate.length}):`);
      for (const collection of comparison.toCreate) {
        const schema = this.schema.collections[collection];
        this.logToFile(`  📁 ${collection} (${schema.type}) - ${schema.schema?.length || 0} fields`);
      }
    }

    if (comparison.toUpdate.length > 0) {
      this.logToFile(`\n🔄 Collections to UPDATE (${comparison.toUpdate.length}):`);
      for (const changeSet of comparison.changes) {
        this.logToFile(`  📁 ${changeSet.collection}:`);
        for (const change of changeSet.changes) {
          switch (change.type) {
            case 'add_field':
              this.logToFile(`    ➕ Add field: ${change.field} (${change.details.type})`);
              break;
            case 'remove_field':
              this.logToFile(`    ➖ Remove field: ${change.field} (${change.details.type})`);
              break;
            case 'modify_field':
              this.logToFile(`    🔧 Modify field: ${change.field}`);
              break;
            case 'modify_rule':
              this.logToFile(`    🔐 Modify rule: ${change.rule}`);
              break;
          }
        }
      }
    }

    this.logToFile('\n=====================================');
    this.logToFile('💡 Run "node scripts/schema-manager.js apply" to apply these changes');
  }

  async applySchema() {
    try {
      this.logToFile('🚀 Applying schema changes to database...');

      // Authenticate first before any operations
      if (!await this.authenticateAdmin()) {
        throw new Error('Admin authentication required');
      }

      const comparison = await this.compareSchemas();

      if (comparison.toCreate.length === 0 &&
        comparison.toUpdate.length === 0 &&
        comparison.toDelete.length === 0) {
        this.logToFile('✅ No changes needed - schema is up to date!');
        return;
      }

      // Show what will be changed
      await this.displayComparison(comparison);

      console.log('\n⚠️  WARNING: This will modify your database structure!');
      const confirm = await PasswordInput.getInput('Continue? (yes/no): ');

      if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        this.logToFile('❌ Schema application cancelled');
        return;
      }

      this.logToFile(`\n🔄 User confirmed schema application: "${confirm}"`);

      // FIXED: RESOLVE collection IDs in schema before applying - but keep original collection names as keys
      this.resolvedSchema = this.resolveCollectionIds(this.schema);
      this.log(`Original schema collections: ${Object.keys(this.schema.collections).join(', ')}`, 'debug');
      this.log(`Resolved schema collections: ${Object.keys(this.resolvedSchema.collections).join(', ')}`, 'debug');

      // Apply changes
      let successCount = 0;
      let errorCount = 0;

      // 1. Create new collections (non-relational first)
      const nonRelationalCollections = comparison.toCreate.filter(name => {
        const collection = this.resolvedSchema.collections[name];
        const hasRelations = collection.schema?.some(field => field.type === 'relation');
        return !hasRelations;
      });

      const relationalCollections = comparison.toCreate.filter(name => {
        const collection = this.resolvedSchema.collections[name];
        const hasRelations = collection.schema?.some(field => field.type === 'relation');
        return hasRelations;
      });

      this.logToFile(`\n📋 Non-relational collections to create: ${nonRelationalCollections.length}`);
      this.logToFile(`📋 Relational collections to create: ${relationalCollections.length}`);

      // Create non-relational collections first
      for (const collectionName of nonRelationalCollections) {
        try {
          this.logToFile(`\n🆕 Creating collection: ${collectionName}`);
          await this.createCollection(collectionName);
          successCount++;
          
          // Update collection ID mapping after creating new collection
          await this.buildCollectionIdMap();
          this.resolvedSchema = this.resolveCollectionIds(this.schema);
        } catch (error) {
          this.logToFile(`❌ Failed to create ${collectionName}: ${error.message}`, 'error');
          errorCount++;
        }
      }

      // Create relational collections
      for (const collectionName of relationalCollections) {
        try {
          this.logToFile(`\n🆕 Creating collection: ${collectionName}`);
          await this.createCollection(collectionName);
          successCount++;
        } catch (error) {
          this.logToFile(`❌ Failed to create ${collectionName}: ${error.message}`, 'error');
          errorCount++;
        }
      }

      // 2. Update existing collections
      this.logToFile(`\n🔄 Updating ${comparison.changes.length} existing collections...`);
      for (const changeSet of comparison.changes) {
        try {
          this.logToFile(`\n🔄 Updating collection: ${changeSet.collection}`);
          await this.updateCollection(changeSet.collection, changeSet.changes);
          successCount++;
        } catch (error) {
          this.logToFile(`❌ Failed to update ${changeSet.collection}: ${error.message}`, 'error');
          errorCount++;
        }
      }

      this.logToFile('\n📊 SCHEMA APPLICATION RESULTS');
      this.logToFile('=====================================');
      this.logToFile(`✅ Successful operations: ${successCount}`);
      this.logToFile(`❌ Failed operations: ${errorCount}`);

      if (errorCount === 0) {
        this.logToFile('🎉 Schema successfully applied!');
      } else {
        this.logToFile('⚠️  Some operations failed. Check the errors above.');
      }

    } catch (error) {
      this.logToFile(`❌ Error applying schema: ${error.message}`, 'error');
      throw error;
    }
  }

  // FIXED: createCollection method
  async createCollection(collectionName) {
    // Use resolved schema if available, otherwise fall back to regular schema
    const schemaToUse = this.resolvedSchema || this.schema;
    const collectionSchema = schemaToUse.collections[collectionName];

    if (!collectionSchema) {
      throw new Error(`Collection schema not found for: ${collectionName}`);
    }

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

    try {
      const createdCollection = await pb.collections.create(collectionData);
      this.logToFile(`  ✅ Created: ${collectionName}`);
      return createdCollection;
    } catch (error) {
      // Enhanced error logging
      this.logToFile(`❌ Failed to create ${collectionName}:`, 'error');
      this.log('Full error object:', 'error');
      this.log(JSON.stringify(error, null, 2), 'error');
      this.log('Error response:', 'error');
      this.log(JSON.stringify(error.response, null, 2), 'error');
      this.log('Error data:', 'error');
      this.log(JSON.stringify(error.data, null, 2), 'error');
      this.log('Collection data being sent:', 'error');
      this.log(JSON.stringify(collectionData, null, 2), 'error');
      throw error;
    }
  }

  // FIXED: updateCollection method
  async updateCollection(collectionName, changes) {
    try {
      const currentCollection = await pb.collections.getFirstListItem(`name="${collectionName}"`);
      
      // Use resolved schema if available, otherwise fall back to regular schema
      const schemaToUse = this.resolvedSchema || this.schema;
      
      // Look for the schema using multiple strategies
      let newSchema = null;
      
      // Strategy 1: Try original collection name in resolved schema
      if (schemaToUse.collections[collectionName]) {
        newSchema = schemaToUse.collections[collectionName];
        this.log(`Found schema using original name: ${collectionName}`, 'debug');
      }
      
      // Strategy 2: Try original schema as fallback
      else if (this.schema.collections[collectionName]) {
        newSchema = this.schema.collections[collectionName];
        this.log(`Found schema using original schema: ${collectionName}`, 'debug');
      }
      
      // Strategy 3: For users collection, special handling
      else if (collectionName === 'users') {
        // Try different variations for the users collection
        newSchema = schemaToUse.collections['users'] || 
                    schemaToUse.collections['_pb_users_auth_'] || 
                    this.schema.collections['users'];
        if (newSchema) {
          this.log(`Found users schema using special handling`, 'debug');
        }
      }

      if (!newSchema) {
        this.log(`Available schema collections: ${Object.keys(schemaToUse.collections).join(', ')}`, 'debug');
        this.log(`Current collection ID: ${currentCollection.id}`, 'debug');
        this.log(`Collection ID map for ${collectionName}: ${this.collectionIdMap[collectionName]}`, 'debug');
        throw new Error(`Schema for collection ${collectionName} not found. Available: ${Object.keys(schemaToUse.collections).join(', ')}`);
      }

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
      this.logToFile(`  ✅ Updated: ${collectionName} (${changes.length} changes)`);
      return updatedCollection;
    } catch (error) {
      // Enhanced error logging
      this.logToFile(`❌ Failed to update ${collectionName}:`, 'error');
      if (error.response || error.data || error.message) {
        this.log('Full error object:', 'error');
        this.log(JSON.stringify(error, null, 2), 'error');
        this.log('Error response:', 'error');
        this.log(JSON.stringify(error.response, null, 2), 'error');
        this.log('Error data:', 'error');
        this.log(JSON.stringify(error.data, null, 2), 'error');
        this.log('Error message:', 'error');
        this.log(error.message, 'error');
      } else {
        this.log('Unknown error:', 'error');
        this.log(JSON.stringify(error, null, 2), 'error');
      }

      // Try to get the current collection for comparison
      try {
        const currentCollection = await pb.collections.getFirstListItem(`name="${collectionName}"`);
        this.log('Current collection schema:', 'error');
        this.log(JSON.stringify(currentCollection.schema, null, 2), 'error');
      } catch (fetchError) {
        this.log('Could not fetch current collection for comparison', 'error');
      }

      throw error;
    }
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

      // ADD: Seed amenity types
      console.log('🏢 Creating amenity types...');
      const amenityTypes = [
        { name: 'Toilets', category: 'facility', icon: 'bathroom', active: true },
        { name: 'Parking', category: 'facility', icon: 'car', active: true },
        { name: 'Food Court', category: 'facility', icon: 'utensils', active: true },
        { name: 'ATM', category: 'service', icon: 'credit-card', active: true },
        { name: 'Wheelchair Access', category: 'accessibility', icon: 'wheelchair', active: true },
        { name: 'Children\'s Area', category: 'facility', icon: 'baby', active: true },
        { name: 'Entertainment', category: 'service', icon: 'music', active: true },
        { name: 'Seating', category: 'facility', icon: 'chair', active: true },
        { name: 'Weather Protection', category: 'facility', icon: 'umbrella', active: true },
        { name: 'Storage', category: 'facility', icon: 'package', active: true },
        { name: 'Loading Dock', category: 'facility', icon: 'truck', active: true },
        { name: 'Security', category: 'service', icon: 'shield', active: true },
        { name: 'WiFi', category: 'service', icon: 'wifi', active: true },
        { name: 'Pet Friendly', category: 'service', icon: 'heart', active: true }
      ];

      for (const amenityType of amenityTypes) {
        try {
          await pb.collection('amenity_types').create(amenityType);
          console.log(`  ✅ Created amenity type: ${amenityType.name}`);
        } catch (error) {
          if (error.message.includes('failed "unique" constraint')) {
            console.log(`  ℹ️  Amenity type already exists: ${amenityType.name}`);
          } else {
            console.error(`  ❌ Failed to create ${amenityType.name}:`, error.message);
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

Output:
  📝 Full logs are saved to: output.log
        `);
    }
  } catch (error) {
    console.error('\n❌ Command failed:', error.message);
    manager.log(`Full error: ${JSON.stringify(error)}`, 'error');
    process.exit(1);
  } finally {
    // Always write the log file
    await manager.writeLogFile();
  }
}

main().catch(async error => {
  console.error('\n❌ Script failed:', error.message);
  
  // Try to write log file even on failure
  try {
    // Create a minimal manager instance for logging
    const logManager = {
      logBuffer: [
        `FATAL ERROR: ${error.message}`,
        `STACK TRACE: ${error.stack}`,
        `COMMAND: ${process.argv.slice(2).join(' ')}`,
        `TIME: ${new Date().toISOString()}`
      ],
      outputFile: './output.log',
      startTime: new Date(),
      async writeLogFile() {
        try {
          const header = [
            '='.repeat(80),
            `SA Markets Directory - Schema Manager Log (ERROR)`,
            `Started: ${this.startTime.toISOString()}`,
            `Failed: ${new Date().toISOString()}`,
            `Command: ${process.argv.slice(2).join(' ')}`,
            '='.repeat(80),
            ''
          ];

          const content = header.concat(this.logBuffer).join('\n');
          await fs.writeFile(this.outputFile, content);
          console.log(`📝 Error log written to: ${this.outputFile}`);
        } catch (writeError) {
          console.error('❌ Failed to write log file:', writeError.message);
        }
      }
    };
    
    await logManager.writeLogFile();
  } catch (logError) {
    console.error('❌ Failed to write error log:', logError.message);
  }
  
  process.exit(1);
});
// schema-validator.js - Run this to check for common schema issues
import pb from '../lib/pocketbase.js';
import fs from 'fs/promises';

async function validateSchema() {
  console.log('🔍 Validating schema for common issues...');
  
  try {
    // Load schema
    const schemaContent = await fs.readFile('./schema/database.json', 'utf8');
    const schema = JSON.parse(schemaContent);
    
    // Get existing collections
    const existingCollections = await pb.collections.getFullList();
    const existingCollectionMap = {};
    existingCollections.forEach(col => {
      existingCollectionMap[col.name] = col.id;
    });
    
    console.log('📋 Existing collections:', Object.keys(existingCollectionMap));
    
    // Validate each collection
    for (const [collectionName, collectionDef] of Object.entries(schema.collections)) {
      console.log(`\n🔍 Validating ${collectionName}:`);
      
      // Check relation fields
      const relationFields = collectionDef.schema?.filter(field => field.type === 'relation');
      
      for (const field of relationFields || []) {
        const targetCollection = field.options?.collectionId;
        
        if (targetCollection && !existingCollectionMap[targetCollection]) {
          console.error(`❌ ${collectionName}.${field.name}: References non-existent collection '${targetCollection}'`);
          console.log(`   Available collections: ${Object.keys(existingCollectionMap).join(', ')}`);
        } else if (targetCollection) {
          console.log(`✅ ${collectionName}.${field.name}: Correctly references '${targetCollection}'`);
        } else {
          console.error(`❌ ${collectionName}.${field.name}: Missing collectionId in relation field`);
        }
      }
      
      // Check for common field validation issues
      for (const field of collectionDef.schema || []) {
        // Check select fields have values
        if (field.type === 'select' && (!field.options?.values || field.options.values.length === 0)) {
          console.error(`❌ ${collectionName}.${field.name}: Select field missing values array`);
        }
        
        // Check file fields have proper options
        if (field.type === 'file' && !field.options?.maxSelect) {
          console.warn(`⚠️  ${collectionName}.${field.name}: File field missing maxSelect`);
        }
        
        // Check required fields
        if (field.required === undefined) {
          console.warn(`⚠️  ${collectionName}.${field.name}: Required property not explicitly set`);
        }
      }
    }
    
    console.log('\n📊 Validation complete!');
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
  }
}

validateSchema();
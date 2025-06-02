// Import SA Markets data into PocketBase
import fs from 'fs';

const POCKETBASE_URL = 'http://localhost:8090';
const CSV_FILE = 'samarketdata.csv'; // Your uploaded CSV file

// Function to convert market name to URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim();
}

// Map market names to categories
function categorizeMarket(name, description = '') {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerName.includes('farmer') || lowerDesc.includes('produce')) {
    return 'Farmers Market';
  } else if (lowerName.includes('craft') || lowerName.includes('maker') || lowerName.includes('artisan')) {
    return 'Craft & Artisan';
  } else if (lowerName.includes('community')) {
    return 'Community Market';
  } else if (lowerName.includes('food') || lowerName.includes('vegan')) {
    return 'Food Market';
  } else {
    return 'General Market';
  }
}

async function importMarkets() {
  try {
    console.log('🚀 Starting SA Markets import...');
    
    // First, get the categories to map names to IDs
    const categoriesResponse = await fetch(`${POCKETBASE_URL}/api/collections/market_categories/records`);
    const categoriesData = await categoriesResponse.json();
    const categories = {};
    
    categoriesData.items.forEach(cat => {
      categories[cat.name] = cat.id;
    });
    
    console.log('📂 Found categories:', Object.keys(categories));
    
    // Read and parse CSV file
    console.log('📄 Reading CSV file...');
    const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    console.log('📊 CSV headers:', headers.slice(0, 10)); // Show first 10 headers
    
    let imported = 0;
    let skipped = 0;
    
    // Process each market (skip header row)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      // Map CSV columns to our data structure
      const marketName = values[0]; // Market Name
      const suburb = values[1]; // Suburb
      const address = values[2]; // Address
      const frequency = values[3]; // Frequency
      const operatingHours = values[4]; // Time
      const website = values[6]; // URL
      const contactInfo = values[7]; // Contact
      const additionalInfo = values[8]; // Additional Info
      
      if (!marketName || marketName === 'Market Name') {
        skipped++;
        continue;
      }
      
      const slug = createSlug(marketName);
      const category = categorizeMarket(marketName, additionalInfo);
      const categoryId = categories[category];
      
      const marketData = {
        name: marketName,
        slug: slug,
        category: categoryId,
        state: 'SA', // All markets in this dataset are SA
        suburb: suburb || 'Unknown',
        address: address || 'Address TBA',
        frequency: frequency || 'Check website',
        operating_hours: operatingHours || '',
        contact_email: '', // We'll extract emails later if needed
        website: website || '',
        description: additionalInfo || '',
        active: true
      };
      
      try {
        const response = await fetch(`${POCKETBASE_URL}/api/collections/markets/records`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(marketData)
        });
        
        if (response.ok) {
          imported++;
          console.log(`✅ Imported: ${marketName}`);
        } else {
          const error = await response.text();
          console.log(`❌ Failed to import ${marketName}:`, error);
          skipped++;
        }
      } catch (error) {
        console.log(`❌ Error importing ${marketName}:`, error.message);
        skipped++;
      }
    }
    
    console.log(`\n🎉 Import complete!`);
    console.log(`✅ Successfully imported: ${imported} markets`);
    console.log(`⚠️  Skipped: ${skipped} entries`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Run the import
importMarkets();

// Setup script - setup.sh
#!/bin/bash

echo "🚀 Setting up SA Markets App..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file. Please update VITE_POCKETBASE_URL if needed."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create missing directories
echo "📁 Creating directory structure..."
mkdir -p src/components/auth
mkdir -p src/hooks
mkdir -p src/services

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start PocketBase: ./pocketbase serve"
echo "2. Setup your PocketBase collections (see schema in docs)"
echo "3. Start development server: npm run dev"
echo ""
echo "🔧 Configuration:"
echo "- Update .env file with your PocketBase URL"
echo "- Create PocketBase collections using the schema provided"
echo "- Import sample data if available"

# Quick validation script - validate.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating SA Markets App setup...\n');

const requiredFiles = [
  'src/contexts/AuthContext.jsx',
  'src/components/auth/ProtectedRoute.jsx',
  'src/services/ApplicationService.js',
  'src/services/StallholderService.js',
  'src/services/marketService.js',
  'src/hooks/useStallholder.js',
  'src/hooks/useApplications.js',
  '.env'
];

const requiredDependencies = [
  'pocketbase',
  'react-router-dom',
  'lucide-react'
];

let allGood = true;

// Check files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  requiredDependencies.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep} (${deps[dep]})`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allGood = false;
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All checks passed! Your SA Markets app is ready to go.');
  console.log('\n🚀 Run "npm run dev" to start development server');
} else {
  console.log('⚠️  Some issues found. Please fix the missing files/dependencies.');
}
console.log('='.repeat(50));
    }
  };

  const updateStallholder = async (data) => {
    try {
      setLoading(true);
      const updated = await StallholderService.updateStallholder(stallholder.id, data);
      setStallholder(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStallholder = async (data) => {
    try {
      setLoading(true);
      const created = await StallholderService.createStallholder({
        ...data,
        user: user.id
      });
      setStallholder(created);
      return created;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
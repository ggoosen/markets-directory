# Quick PocketBase Discovery Commands
# Run these commands to find your existing PocketBase installation

echo "🔍 SA Markets Directory - Quick PocketBase Check"
echo "================================================"
echo ""

# 1. Check current directory
echo "📁 Checking current directory..."
ls -la | grep -E "(pocketbase|backend)"

echo ""
echo "📁 Checking backend folder..."
if [ -d "backend" ]; then
    echo "✅ Backend folder exists"
    echo "   Contents:"
    ls -la backend/ | head -10
    
    # Check for PocketBase in backend
    if [ -f "backend/pocketbase" ] || [ -f "backend/pocketbase.exe" ]; then
        echo ""
        echo "✅ Found PocketBase in backend folder!"
        echo "   Try running: cd backend && ./pocketbase serve"
    fi
else
    echo "❌ No backend folder found"
fi

echo ""
echo "🔧 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
    echo "   PocketBase URL setting:"
    grep "VITE_POCKETBASE_URL" .env || echo "   ⚠️  VITE_POCKETBASE_URL not found"
else
    echo "❌ .env file not found"
fi

echo ""
echo "💾 Checking for existing database..."
find . -name "pb_data" -type d 2>/dev/null | head -5

echo ""
echo "🌐 Checking if PocketBase is already running..."
curl -s -f "http://localhost:8090/api/health" > /dev/null 2>&1 && echo "✅ PocketBase is already running on localhost:8090!" || echo "❌ PocketBase not running on localhost:8090"

echo ""
echo "==============================================="
echo "🎯 Quick Solutions:"
echo ""
echo "If PocketBase is in backend folder:"
echo "   cd backend && ./pocketbase serve"
echo ""
echo "If no PocketBase found:"
echo "   Run the setup script to download it"
echo ""
echo "If already running:"
echo "   Just start React: npm run dev"
echo "==============================================="
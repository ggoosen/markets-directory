#!/bin/bash

# SA Markets Directory - Fixed PocketBase Database Verification Script
# This script properly checks collections even when they're empty or protected

POCKETBASE_URL="http://localhost:8090"
OUTPUT_FILE="pocketbase_verification_report.txt"

echo "==============================================="
echo "     SA MARKETS DIRECTORY - DATABASE VERIFICATION"
echo "==============================================="
echo "Generated on: $(date)"
echo "PocketBase URL: $POCKETBASE_URL"
echo ""

# Function to check if PocketBase is running
check_pocketbase_status() {
    echo "🔍 Checking PocketBase Status..."
    if curl -s -f "$POCKETBASE_URL/api/health" > /dev/null 2>&1; then
        echo "✅ PocketBase is ONLINE and responding"
        return 0
    else
        echo "❌ PocketBase is OFFLINE or not responding"
        echo "   Please ensure PocketBase is running on $POCKETBASE_URL"
        return 1
    fi
}

# Function to interpret HTTP response codes for collection existence
interpret_collection_status() {
    local response_code=$1
    local collection=$2
    
    case $response_code in
        200)
            echo "✅ EXISTS (accessible)"
            return 0
            ;;
        400)
            echo "✅ EXISTS (bad request - but collection exists)"
            return 0
            ;;
        401)
            echo "✅ EXISTS (requires authentication)"
            return 0
            ;;
        403)
            echo "✅ EXISTS (access forbidden - properly protected)"
            return 0
            ;;
        404)
            echo "❌ NOT FOUND (collection doesn't exist)"
            return 1
            ;;
        *)
            echo "⚠️  UNKNOWN STATUS (HTTP $response_code)"
            return 1
            ;;
    esac
}

# Function to check collections with improved logic
check_collections() {
    echo ""
    echo "📋 Checking Collections..."
    
    local collections=("users" "markets" "market_categories" "stallholders" "applications" "reviews")
    local found_collections=0
    local collection_statuses=()
    
    for collection in "${collections[@]}"; do
        echo -n "   Checking $collection... "
        
        # Try to query the collection
        response=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/$collection/records?perPage=1")
        
        if interpret_collection_status "$response" "$collection"; then
            ((found_collections++))
            collection_statuses["$collection"]="exists"
        else
            collection_statuses["$collection"]="missing"
        fi
    done
    
    echo ""
    echo "📊 Collection Summary: $found_collections/6 core collections found"
    
    # Store collection statuses for later use
    declare -g -A COLLECTION_STATUS
    for collection in "${collections[@]}"; do
        COLLECTION_STATUS["$collection"]="${collection_statuses[$collection]:-missing}"
    done
    
    return $found_collections
}

# Function to safely check collection data
check_collection_data() {
    local collection=$1
    local collection_name=$2
    
    echo -n "   $collection_name: "
    
    # First check if collection exists
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/$collection/records?perPage=1")
    
    case $response_code in
        200)
            # Collection exists and is accessible, get the data
            response=$(curl -s "$POCKETBASE_URL/api/collections/$collection/records?perPage=5")
            if echo "$response" | grep -q '"items"'; then
                count=$(echo "$response" | grep -o '"totalItems":[0-9]*' | cut -d':' -f2 | head -1)
                if [ -n "$count" ] && [ "$count" -gt 0 ]; then
                    echo "✅ $count records"
                else
                    echo "✅ 0 records (collection exists but empty)"
                fi
            else
                echo "⚠️  Collection exists but data format unexpected"
            fi
            ;;
        401|403)
            echo "🔒 Protected (collection exists, requires auth)"
            ;;
        404)
            echo "❌ Collection not found"
            ;;
        *)
            echo "⚠️  Unexpected response (HTTP $response_code)"
            ;;
    esac
}

# Function to check data in all collections
check_data() {
    echo ""
    echo "📊 Checking Data in Collections..."
    
    check_collection_data "users" "Users"
    check_collection_data "markets" "Markets"
    check_collection_data "market_categories" "Market Categories"
    check_collection_data "stallholders" "Stallholders"
    check_collection_data "applications" "Applications"
    check_collection_data "reviews" "Reviews"
}

# Function to test market query with better error handling
test_market_query() {
    echo ""
    echo "🧪 Testing Market Query..."
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/markets/records?perPage=3")
    
    if [ "$response_code" = "200" ]; then
        response=$(curl -s "$POCKETBASE_URL/api/collections/markets/records?perPage=3&expand=category")
        
        if echo "$response" | grep -q '"items"'; then
            echo "✅ Market query successful"
            
            # Try to extract market names safely
            markets=$(echo "$response" | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | head -3)
            if [ -n "$markets" ]; then
                echo "   Sample markets found:"
                echo "$markets" | while read -r market; do
                    if [ -n "$market" ]; then
                        echo "   - $market"
                    fi
                done
            else
                echo "   No market names found (collection might be empty)"
            fi
        else
            echo "⚠️  Market collection exists but no items found"
        fi
    else
        echo "❌ Market query failed (HTTP $response_code)"
        case $response_code in
            404)
                echo "   Markets collection doesn't exist"
                ;;
            403)
                echo "   Markets collection exists but access denied"
                ;;
            *)
                echo "   Unexpected error"
                ;;
        esac
    fi
}

# Function to check API access rules with better interpretation
check_api_rules() {
    echo ""
    echo "🔐 Testing API Access Rules..."
    
    # Test public access to markets
    echo -n "   Public market access: "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/markets/records?perPage=1")
    case $response in
        200)
            echo "✅ Working (publicly accessible)"
            ;;
        404)
            echo "❌ Collection not found"
            ;;
        403)
            echo "⚠️  Access denied (check if this should be public)"
            ;;
        *)
            echo "⚠️  Unexpected response (HTTP $response)"
            ;;
    esac
    
    # Test public access to categories
    echo -n "   Public categories access: "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/market_categories/records?perPage=1")
    case $response in
        200)
            echo "✅ Working (publicly accessible)"
            ;;
        404)
            echo "❌ Collection not found"
            ;;
        403)
            echo "⚠️  Access denied (check if this should be public)"
            ;;
        *)
            echo "⚠️  Unexpected response (HTTP $response)"
            ;;
    esac
    
    # Test protected access to applications
    echo -n "   Protected applications access: "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/applications/records?perPage=1")
    case $response in
        403|401)
            echo "✅ Properly protected (HTTP $response)"
            ;;
        200)
            echo "⚠️  Accessible without auth (should this be protected?)"
            ;;
        404)
            echo "❌ Collection not found (needs to be created)"
            ;;
        *)
            echo "⚠️  Unexpected response (HTTP $response)"
            ;;
    esac
    
    # Test protected access to stallholders
    echo -n "   Stallholders collection: "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/stallholders/records?perPage=1")
    case $response in
        200)
            echo "✅ Accessible (may be public read)"
            ;;
        403|401)
            echo "✅ Protected (requires auth)"
            ;;
        404)
            echo "❌ Collection not found (needs to be created)"
            ;;
        *)
            echo "⚠️  Unexpected response (HTTP $response)"
            ;;
    esac
}

# Function to check environment configuration
check_environment() {
    echo ""
    echo "⚙️  Checking Environment Configuration..."
    
    if [ -f ".env" ]; then
        echo "✅ .env file found"
        
        # Check for required environment variables
        if grep -q "VITE_POCKETBASE_URL" .env; then
            pocketbase_url=$(grep "VITE_POCKETBASE_URL" .env | cut -d'=' -f2)
            echo "   PocketBase URL: $pocketbase_url"
            
            # Validate the URL matches what we're testing
            if [ "$pocketbase_url" = "$POCKETBASE_URL" ]; then
                echo "   ✅ URL matches test target"
            else
                echo "   ⚠️  URL mismatch - testing $POCKETBASE_URL but .env has $pocketbase_url"
            fi
        else
            echo "   ⚠️  VITE_POCKETBASE_URL not found in .env"
        fi
    else
        echo "❌ .env file not found"
    fi
}

# Function to provide actionable recommendations
provide_recommendations() {
    echo ""
    echo "🎯 Recommendations:"
    echo ""
    
    # Check what's missing and provide specific guidance
    missing_collections=()
    
    for collection in "stallholders" "applications" "reviews"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/$collection/records?perPage=1")
        if [ "$response" = "404" ]; then
            missing_collections+=("$collection")
        fi
    done
    
    if [ ${#missing_collections[@]} -gt 0 ]; then
        echo "❗ Missing Collections:"
        for missing in "${missing_collections[@]}"; do
            echo "   - Create '$missing' collection in PocketBase Admin"
        done
        echo ""
        echo "📋 To create missing collections:"
        echo "   1. Go to: $POCKETBASE_URL/_/"
        echo "   2. Click 'New collection' for each missing collection"
        echo "   3. Use the schema provided in the documentation"
        echo ""
    else
        echo "✅ All core collections exist!"
    fi
    
    # Check for empty but important collections
    for collection in "users" "market_categories"; do
        response=$(curl -s "$POCKETBASE_URL/api/collections/$collection/records?perPage=1")
        if echo "$response" | grep -q '"totalItems":0'; then
            case $collection in
                "market_categories")
                    echo "⚠️  No market categories found - consider adding sample categories"
                    ;;
                "users")
                    echo "ℹ️  No users yet - normal for new installation"
                    ;;
            esac
        fi
    done
}

# Function to generate improved report
generate_report() {
    echo ""
    echo "📄 Generating Detailed Report..."
    
    {
        echo "SA MARKETS DIRECTORY - POCKETBASE VERIFICATION REPORT"
        echo "Generated: $(date)"
        echo "PocketBase URL: $POCKETBASE_URL"
        echo ""
        echo "COLLECTIONS STATUS:"
        
        for collection in "users" "markets" "market_categories" "stallholders" "applications" "reviews"; do
            response_code=$(curl -s -o /dev/null -w "%{http_code}" "$POCKETBASE_URL/api/collections/$collection/records?perPage=1")
            
            case $response_code in
                200)
                    response=$(curl -s "$POCKETBASE_URL/api/collections/$collection/records?perPage=1")
                    if echo "$response" | grep -q '"totalItems"'; then
                        count=$(echo "$response" | grep -o '"totalItems":[0-9]*' | cut -d':' -f2 | head -1)
                        echo "- $collection: EXISTS ($count records)"
                    else
                        echo "- $collection: EXISTS (unable to count records)"
                    fi
                    ;;
                403|401)
                    echo "- $collection: EXISTS (protected)"
                    ;;
                404)
                    echo "- $collection: MISSING (needs to be created)"
                    ;;
                *)
                    echo "- $collection: UNKNOWN STATUS (HTTP $response_code)"
                    ;;
            esac
        done
        
        echo ""
        echo "SAMPLE MARKET DATA:"
        markets_response=$(curl -s "$POCKETBASE_URL/api/collections/markets/records?perPage=5")
        if echo "$markets_response" | grep -q '"items"'; then
            # Try to use jq if available, otherwise fall back to grep
            if command -v jq > /dev/null 2>&1; then
                echo "$markets_response" | jq -r '.items[]? | "- \(.name // "Unknown") (\(.suburb // "Unknown"), \(.state // "Unknown"))"' 2>/dev/null || echo "Markets found but unable to parse details"
            else
                market_names=$(echo "$markets_response" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
                if [ -n "$market_names" ]; then
                    echo "$market_names" | while read -r name; do
                        if [ -n "$name" ]; then
                            echo "- $name"
                        fi
                    done
                else
                    echo "Markets collection exists but no market names found"
                fi
            fi
        else
            echo "No market data accessible or collection empty"
        fi
        
    } > "$OUTPUT_FILE"
    
    echo "✅ Report saved to: $OUTPUT_FILE"
}

# Main execution with improved logic
main() {
    # Check if PocketBase is running
    if ! check_pocketbase_status; then
        exit 1
    fi
    
    # Run all checks
    check_collections
    collection_count=$?
    
    # Always run data checks (even if some collections are missing)
    check_data
    test_market_query
    check_api_rules
    check_environment
    provide_recommendations
    generate_report
    
    echo ""
    echo "==============================================="
    echo "VERIFICATION COMPLETE"
    echo "==============================================="
    
    if [ $collection_count -ge 6 ]; then
        echo "🎉 Excellent! All core collections found!"
        echo "   Your SA Markets Directory should be fully functional."
    elif [ $collection_count -ge 3 ]; then
        echo "✅ Good progress! Core collections working."
        echo "   Some collections may need to be created - see recommendations above."
    else
        echo "⚠️  Several collections missing. Database setup needs completion."
    fi
    
    echo ""
    echo "Next steps:"
    echo "1. Review the report: $OUTPUT_FILE"
    echo "2. Create any missing collections in PocketBase Admin"
    echo "3. Test the application in your browser"
    echo "4. Start React development server: npm run dev"
}

# Run the main function
main "$@"
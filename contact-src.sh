#!/bin/bash

# complete-enhanced-concat-src.sh - Full codebase export with PocketBase analysis
# Usage: ./complete-enhanced-concat-src.sh [output-file] [--include-data] [--verbose]

# Parse command line arguments
OUTPUT_FILE="codebase-export.txt"
INCLUDE_DATA=false
VERBOSE=false
SRC_DIR="./src"
PROJECT_ROOT="."
PB_URL="http://localhost:8090"

while [[ $# -gt 0 ]]; do
    case $1 in
        --include-data)
            INCLUDE_DATA=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --pb-url)
            PB_URL="$2"
            shift 2
            ;;
        --help|-h)
            echo "Complete SA Markets Directory Analysis - Code + Database"
            echo "Usage: $0 [output-file] [options]"
            echo ""
            echo "Options:"
            echo "  --include-data        Include sample data from PocketBase collections"
            echo "  --verbose, -v         Show detailed processing information"
            echo "  --pb-url URL          PocketBase URL (default: http://localhost:8090)"
            echo "  --help, -h            Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    Complete analysis"
            echo "  $0 --include-data     Include actual database records"
            echo "  $0 --verbose          Detailed logging"
            exit 0
            ;;
        *)
            OUTPUT_FILE="$1"
            shift
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_verbose() { if [ "$VERBOSE" = true ]; then echo -e "${CYAN}🔍 $1${NC}"; fi; }

# Check if PocketBase is running
check_pocketbase() {
    if command -v curl >/dev/null 2>&1; then
        if curl -s -f "$PB_URL/api/health" >/dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Get PocketBase collections
get_pb_collections() {
    if command -v curl >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
        curl -s "$PB_URL/api/collections" 2>/dev/null
    fi
}

# Get collection data
get_collection_data() {
    local collection_name="$1"
    local limit="$2"
    if command -v curl >/dev/null 2>&1; then
        curl -s "$PB_URL/api/collections/$collection_name/records?perPage=${limit:-5}" 2>/dev/null
    fi
}

# Analyze PocketBase collections
analyze_pocketbase() {
    echo ""
    echo "🗄️  POCKETBASE DATABASE ANALYSIS" >> "$OUTPUT_FILE"
    echo "=============================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "PocketBase URL: $PB_URL" >> "$OUTPUT_FILE"
    echo "Analysis Time: $(date)" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if check_pocketbase; then
        log_success "PocketBase is running at $PB_URL"
        echo "✅ PocketBase Status: ONLINE" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        local collections_data
        collections_data=$(get_pb_collections)
        
        if [ $? -eq 0 ] && [ -n "$collections_data" ]; then
            log_info "Analyzing collection schemas..."
            
            echo "📋 COLLECTIONS OVERVIEW" >> "$OUTPUT_FILE"
            echo "------------------------" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            
            if command -v jq >/dev/null 2>&1; then
                local collection_count
                collection_count=$(echo "$collections_data" | jq '.items | length' 2>/dev/null)
                echo "Total Collections: $collection_count" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                
                echo "Collection Names:" >> "$OUTPUT_FILE"
                echo "$collections_data" | jq -r '.items[] | "  - \(.name) (\(.type))"' 2>/dev/null >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                
                echo "📊 DETAILED COLLECTION SCHEMAS" >> "$OUTPUT_FILE"
                echo "================================" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                
                echo "$collections_data" | jq -c '.items[]' 2>/dev/null | while read -r collection; do
                    local name type created updated
                    name=$(echo "$collection" | jq -r '.name' 2>/dev/null)
                    type=$(echo "$collection" | jq -r '.type' 2>/dev/null)
                    created=$(echo "$collection" | jq -r '.created' 2>/dev/null)
                    updated=$(echo "$collection" | jq -r '.updated' 2>/dev/null)
                    
                    echo "Collection: $name" >> "$OUTPUT_FILE"
                    echo "Type: $type" >> "$OUTPUT_FILE"
                    echo "Created: $created" >> "$OUTPUT_FILE"
                    echo "Updated: $updated" >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                    
                    echo "Schema Fields:" >> "$OUTPUT_FILE"
                    echo "$collection" | jq -r '.schema[]? | "  \(.name) (\(.type))\(.required // false | if . then " - REQUIRED" else "" end)"' 2>/dev/null >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                    
                    echo "API Rules:" >> "$OUTPUT_FILE"
                    local list_rule view_rule create_rule update_rule delete_rule
                    list_rule=$(echo "$collection" | jq -r '.listRule // "Not set"' 2>/dev/null)
                    view_rule=$(echo "$collection" | jq -r '.viewRule // "Not set"' 2>/dev/null)
                    create_rule=$(echo "$collection" | jq -r '.createRule // "Not set"' 2>/dev/null)
                    update_rule=$(echo "$collection" | jq -r '.updateRule // "Not set"' 2>/dev/null)
                    delete_rule=$(echo "$collection" | jq -r '.deleteRule // "Not set"' 2>/dev/null)
                    
                    echo "  List: $list_rule" >> "$OUTPUT_FILE"
                    echo "  View: $view_rule" >> "$OUTPUT_FILE"
                    echo "  Create: $create_rule" >> "$OUTPUT_FILE"
                    echo "  Update: $update_rule" >> "$OUTPUT_FILE"
                    echo "  Delete: $delete_rule" >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                    
                    if [ "$INCLUDE_DATA" = true ]; then
                        log_verbose "Fetching sample data for $name..."
                        echo "Sample Data (max 5 records):" >> "$OUTPUT_FILE"
                        
                        local data_response
                        data_response=$(get_collection_data "$name" 5)
                        
                        if [ $? -eq 0 ] && [ -n "$data_response" ]; then
                            local record_count
                            record_count=$(echo "$data_response" | jq '.totalItems // 0' 2>/dev/null)
                            echo "Total Records: $record_count" >> "$OUTPUT_FILE"
                            
                            if [ "$record_count" -gt 0 ]; then
                                echo "$data_response" | jq '.items[] | {id, created, updated} + (. | del(.id, .created, .updated, .collectionId, .collectionName))' 2>/dev/null >> "$OUTPUT_FILE"
                            else
                                echo "No records found" >> "$OUTPUT_FILE"
                            fi
                        else
                            echo "Could not fetch data" >> "$OUTPUT_FILE"
                        fi
                        echo "" >> "$OUTPUT_FILE"
                    fi
                    
                    echo "----------------------------------------" >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                done
            else
                echo "jq not available - showing raw response:" >> "$OUTPUT_FILE"
                echo "$collections_data" >> "$OUTPUT_FILE"
            fi
        else
            echo "❌ Failed to fetch collections data" >> "$OUTPUT_FILE"
        fi
    else
        log_warning "PocketBase not responding at $PB_URL"
        echo "❌ PocketBase Status: OFFLINE or UNREACHABLE" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "Possible issues:" >> "$OUTPUT_FILE"
        echo "- PocketBase not running" >> "$OUTPUT_FILE"
        echo "- Wrong URL: $PB_URL" >> "$OUTPUT_FILE"
        echo "- Network connectivity issues" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
    echo "========================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Main script execution
log_info "Starting complete SA Markets Directory analysis..."

# Validation
if [ ! -d "$SRC_DIR" ]; then
    log_error "src directory not found in current location"
    exit 1
fi

# Read PocketBase URL from .env if available
if [ -f ".env" ]; then
    PB_URL_FROM_ENV=$(grep "VITE_POCKETBASE_URL" .env | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    if [ -n "$PB_URL_FROM_ENV" ]; then
        PB_URL="$PB_URL_FROM_ENV"
        log_verbose "Using PocketBase URL from .env: $PB_URL"
    fi
fi

# Clear output file and add header
> "$OUTPUT_FILE"

cat << 'EOF' >> "$OUTPUT_FILE"
===============================================
     SA MARKETS DIRECTORY - COMPLETE ANALYSIS
     CODE + DATABASE + INFRASTRUCTURE
===============================================
EOF

echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "Project: SA Markets Directory" >> "$OUTPUT_FILE"
echo "Analysis Type: Full Stack Review" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 1. PocketBase Analysis
analyze_pocketbase

# 2. Project Structure
log_info "Analyzing project structure..."
echo "📁 PROJECT DIRECTORY STRUCTURE" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if command -v tree >/dev/null 2>&1; then
    tree -I 'node_modules|.git|dist|build|coverage' -a --dirsfirst >> "$OUTPUT_FILE"
else
    find . -type d -not -path './node_modules*' -not -path './.git*' -not -path './dist*' -not -path './build*' | sort | sed 's/^.//' | sed 's/^/  /' >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"
echo "========================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 3. File Analysis
log_info "Creating file inventory..."
echo "📄 FILE INVENTORY & ANALYSIS" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

declare -A file_counts
declare -A file_sizes

while IFS= read -r -d '' file; do
    ext="${file##*.}"
    ext="${ext,,}"
    file_counts["$ext"]=$((${file_counts["$ext"]} + 1))
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
    file_sizes["$ext"]=$((${file_sizes["$ext"]} + size))
done < <(find "$SRC_DIR" -type f -print0)

echo "File Type Analysis:" >> "$OUTPUT_FILE"
echo "-------------------" >> "$OUTPUT_FILE"
for ext in $(printf '%s\n' "${!file_counts[@]}" | sort); do
    count=${file_counts[$ext]}
    size=${file_sizes[$ext]}
    human_size=$(numfmt --to=iec "$size" 2>/dev/null || echo "${size}B")
    printf "%-10s: %3d files (%s)\n" "$ext" "$count" "$human_size" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"

# 4. Critical Files Check
log_info "Checking critical files..."
echo "🔍 CRITICAL FILES CHECK" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

critical_files=(
    "src/App.jsx:Main application component"
    "src/main.jsx:Application entry point"
    "src/index.css:Main stylesheet"
    "src/contexts/AuthContext.jsx:Authentication context"
    "src/components/layout/Layout.jsx:Main layout component"
    "src/components/layout/Header.jsx:Header component"
    "src/components/layout/Footer.jsx:Footer component"
    "src/components/auth/ProtectedRoute.jsx:Route protection"
    "src/pages/Home.jsx:Home page"
    "src/pages/Login.jsx:Login page"
    "src/pages/Register.jsx:Registration page"
    "src/pages/Dashboard.jsx:User dashboard"
    "src/pages/MarketList.jsx:Market listing page"
    "src/pages/MarketDetail.jsx:Market detail page"
    "src/services/marketService.js:Market data service"
    "src/services/StallholderService.js:Stallholder service"
    "src/services/ApplicationService.js:Application service"
    "src/lib/pocketbase.js:PocketBase configuration"
    "src/lib/constants.js:Application constants"
    "src/utils/security.js:Security utilities"
    "package.json:Project dependencies"
    ".env:Environment configuration"
    "vite.config.js:Vite configuration"
    "tailwind.config.js:Tailwind CSS configuration"
)

missing_files=()
for file_desc in "${critical_files[@]}"; do
    file_path="${file_desc%%:*}"
    description="${file_desc##*:}"
    
    if [ -f "$file_path" ]; then
        printf "✅ %-40s %s\n" "$file_path" "$description" >> "$OUTPUT_FILE"
    else
        printf "❌ %-40s %s (MISSING)\n" "$file_path" "$description" >> "$OUTPUT_FILE"
        missing_files+=("$file_path")
    fi
done

echo "" >> "$OUTPUT_FILE"

# 5. Dependencies Analysis
if [ -f "package.json" ]; then
    log_info "Analyzing dependencies..."
    echo "📦 DEPENDENCIES ANALYSIS" >> "$OUTPUT_FILE"
    echo "=============================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    echo "Production Dependencies:" >> "$OUTPUT_FILE"
    echo "------------------------" >> "$OUTPUT_FILE"
    if command -v jq >/dev/null 2>&1; then
        jq -r '.dependencies // {} | to_entries[] | "  \(.key): \(.value)"' package.json >> "$OUTPUT_FILE" 2>/dev/null
    else
        grep -A 20 '"dependencies"' package.json | grep -E '^\s*"[^"]+":' | sed 's/^/  /' >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
    echo "Development Dependencies:" >> "$OUTPUT_FILE"
    echo "-------------------------" >> "$OUTPUT_FILE"
    if command -v jq >/dev/null 2>&1; then
        jq -r '.devDependencies // {} | to_entries[] | "  \(.key): \(.value)"' package.json >> "$OUTPUT_FILE" 2>/dev/null
    else
        grep -A 20 '"devDependencies"' package.json | grep -E '^\s*"[^"]+":' | sed 's/^/  /' >> "$OUTPUT_FILE"
    fi
    echo "" >> "$OUTPUT_FILE"
fi

# 6. Environment Configuration
log_info "Checking environment configuration..."
echo "🌍 ENVIRONMENT CONFIGURATION" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ -f ".env" ]; then
    echo "Environment file (.env) found:" >> "$OUTPUT_FILE"
    echo "------------------------------" >> "$OUTPUT_FILE"
    while IFS= read -r line; do
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
            echo "$line" >> "$OUTPUT_FILE"
        elif [[ $line =~ = ]]; then
            key="${line%%=*}"
            if [[ $key =~ (SECRET|KEY|PASSWORD|TOKEN) ]]; then
                echo "$key=***MASKED***" >> "$OUTPUT_FILE"
            else
                echo "$line" >> "$OUTPUT_FILE"
            fi
        fi
    done < ".env"
else
    echo "❌ No .env file found" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"
echo "========================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 7. Source Code Files
log_info "Processing source files..."
echo "💻 SOURCE CODE FILES" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

process_file() {
    local file="$1"
    local relative_path="${file#./}"
    local file_size
    
    file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
    human_size=$(numfmt --to=iec "$file_size" 2>/dev/null || echo "${file_size}B")
    
    echo "📁 FILE: $relative_path" >> "$OUTPUT_FILE"
    echo "   Size: $human_size | Modified: $(stat -f%Sm "$file" 2>/dev/null || stat -c%y "$file" 2>/dev/null | cut -d' ' -f1)" >> "$OUTPUT_FILE"
    echo "----------------------------------------" >> "$OUTPUT_FILE"
    
    if command -v nl >/dev/null 2>&1; then
        nl -ba "$file" >> "$OUTPUT_FILE"
    else
        cat "$file" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
    echo "========================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    log_verbose "Processed: $relative_path ($human_size)"
}

# Priority order for processing files
priority_patterns=(
    "package.json"
    ".env"
    "vite.config.*"
    "tailwind.config.*"
    "src/main.*"
    "src/App.*"
    "src/index.*"
    "src/lib/*"
    "src/utils/*"
    "src/contexts/*"
    "src/hooks/*"
    "src/services/*"
    "src/components/auth/*"
    "src/components/layout/*"
    "src/components/*"
    "src/pages/*"
    "src/*"
)

processed_files=()

# Process files in priority order
for pattern in "${priority_patterns[@]}"; do
    find . -maxdepth 10 -path "./$pattern" -type f 2>/dev/null | sort | while read -r file; do
        if [[ " ${processed_files[@]} " =~ " ${file} " ]]; then
            continue
        fi
        if [[ -f "$file" ]]; then
            process_file "$file"
            processed_files+=("$file")
        fi
    done
done

# Process remaining source files
find "$SRC_DIR" -type f \( \
    -name "*.js" -o \
    -name "*.jsx" -o \
    -name "*.ts" -o \
    -name "*.tsx" -o \
    -name "*.css" -o \
    -name "*.json" \
\) | sort | while read -r file; do
    if [[ ! " ${processed_files[@]} " =~ " ${file} " ]]; then
        process_file "$file"
    fi
done

# Final summary
echo "" >> "$OUTPUT_FILE"
echo "📊 COMPLETE ANALYSIS SUMMARY" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"

file_size=$(wc -c < "$OUTPUT_FILE" | tr -d ' ')
line_count=$(wc -l < "$OUTPUT_FILE" | tr -d ' ')
human_size=$(numfmt --to=iec "$file_size" 2>/dev/null || echo "${file_size}B")

echo "Export completed: $(date)" >> "$OUTPUT_FILE"
echo "Output file: $OUTPUT_FILE" >> "$OUTPUT_FILE"
echo "Total size: $human_size" >> "$OUTPUT_FILE"
echo "Total lines: $line_count" >> "$OUTPUT_FILE"
echo "PocketBase URL: $PB_URL" >> "$OUTPUT_FILE"
echo "PocketBase analysis: $(check_pocketbase && echo "✅ Included" || echo "❌ Failed")" >> "$OUTPUT_FILE"
echo "Sample data included: $INCLUDE_DATA" >> "$OUTPUT_FILE"
echo "Missing critical files: ${#missing_files[@]}" >> "$OUTPUT_FILE"
echo "Generated for: SA Markets Directory Project" >> "$OUTPUT_FILE"
echo "=============================================" >> "$OUTPUT_FILE"

# Console summary
echo ""
log_success "Complete analysis finished: $OUTPUT_FILE"
echo -e "${PURPLE}📊 File size: $human_size${NC}"
echo -e "${PURPLE}📄 Line count: $line_count${NC}"
echo -e "${PURPLE}🗄️  PocketBase: $(check_pocketbase && echo -e "${GREEN}Connected${NC}" || echo -e "${RED}Not available${NC}")${NC}"

if [ ${#missing_files[@]} -gt 0 ]; then
    log_warning "Missing ${#missing_files[@]} critical files"
fi

log_success "Ready for complete full-stack analysis! 🚀"
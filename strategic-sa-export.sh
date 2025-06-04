#!/bin/bash

# strategic-sa-export.sh - Dynamic directory/pattern-based exports
# Automatically includes new files based on location and patterns

MODE="frontend"
OUTPUT_FILE="sa-export.txt"
VERBOSE=false

# Directory and pattern-based file selection
get_files_by_pattern() {
    local mode="$1"
    
    case $mode in
        "frontend")
            # Core frontend application files
            find . -maxdepth 1 \( -name "package.json" -o -name "vite.config.*" -o -name ".env" -o -name "tailwind.config.*" \) -type f
            find ./src -maxdepth 1 \( -name "App.*" -o -name "main.*" -o -name "index.*" \) -type f
            find ./src/lib -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find ./src/contexts -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            ;;
            
        "services")
            # Business logic and API integration
            find ./src/services -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find ./src/hooks -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find ./src/utils -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find ./src/lib -name "*pocketbase*" -type f
            ;;
            
        "pages")
            # All page components and routing
            find ./src/pages -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find ./src/components/auth -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find ./src/components/layout -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            ;;
            
        "components")
            # All UI components
            find ./src/components -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            ;;
            
        "backend")
            # Database schema and recent migrations
            find ./backend -maxdepth 1 \( -name "pb_schema.json" -o -name "*schema*.md" \) -type f
            # Get only the 10 most recent migration files
            find ./backend/pb_migrations -name "*.js" -type f | sort -r | head -10
            ;;
            
        "scripts")
            # Development and management scripts
            find ./src/scripts -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \)
            find . -maxdepth 1 -name "*.sh" -type f
            find . -maxdepth 1 -name "*setup*" -type f
            find . -maxdepth 1 -name "*verify*" -type f
            ;;
            
        "styles")
            # Styling and CSS files
            find ./src -name "*.css" -o -name "*.scss" -o -name "*.sass" -type f
            find . -maxdepth 1 -name "tailwind.config.*" -type f
            find . -maxdepth 1 -name "postcss.config.*" -type f
            ;;
            
        "config")
            # Configuration files only
            find . -maxdepth 1 \( -name "*.json" -o -name "*.config.*" -o -name ".env*" -o -name "*.toml" \) -type f
            find . -maxdepth 1 \( -name "*.md" -o -name "*.txt" \) -type f | grep -E "(README|PROJECT|TODO)"
            ;;
            
        "auth")
            # Authentication-related files
            find ./src/contexts -name "*auth*" -o -name "*Auth*" -type f
            find ./src/pages -name "*login*" -o -name "*Login*" -o -name "*register*" -o -name "*Register*" -type f
            find ./src/components/auth -type f
            find ./src/scripts -name "*auth*" -type f
            find ./src/services -name "*auth*" -o -name "*Auth*" -type f
            find ./src/lib -name "*pocketbase*" -type f
            ;;
            
        "market")
            # Market-specific functionality
            find ./src -name "*market*" -o -name "*Market*" -type f
            find ./src/components/market -type f 2>/dev/null
            find ./src/pages -name "*Market*" -type f
            find ./src/services -name "*market*" -type f
            ;;
            
        "stallholder")
            # Stallholder-specific functionality
            find ./src -name "*stallholder*" -o -name "*Stallholder*" -type f
            find ./src/components/stallholder -type f 2>/dev/null
            find ./src/hooks -name "*stallholder*" -type f
            ;;
            
        "application")
            # Application workflow functionality
            find ./src -name "*application*" -o -name "*Application*" -type f
            find ./src/services -name "*Application*" -type f
            find ./src/hooks -name "*application*" -type f
            ;;
            
        "dev")
            # Complete development context (combine multiple modes)
            get_files_by_pattern "frontend"
            get_files_by_pattern "services" 
            get_files_by_pattern "backend"
            ;;
            
        "ui")
            # UI debugging (pages + components + styles)
            get_files_by_pattern "pages"
            get_files_by_pattern "components"
            get_files_by_pattern "styles"
            ;;
            
        "docs")
            # Documentation only
            find . -maxdepth 1 -name "*.md" -type f
            find . -maxdepth 1 -name "*.txt" -type f | grep -v output
            find ./backend -name "*.md" -type f
            ;;
            
        "recent")
            # Recently modified files (last 24 hours)
            find ./src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -mtime -1
            ;;
            
        "full")
            # Everything except binaries and logs
            find ./src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" \)
            find . -maxdepth 1 \( -name "*.json" -o -name "*.js" -o -name "*.config.*" -o -name ".env*" -o -name "*.md" \) -type f
            find ./backend -name "*.json" -o -name "*.md" -o -name "*.js" -type f | grep -v "pocketbase$" | grep -v ".zip$"
            ;;
            
        *)
            echo "Unknown mode: $mode" >&2
            return 1
            ;;
    esac
}

# Enhanced usage with directory-based approach
show_usage() {
    echo "SA Markets Directory - Dynamic Pattern-Based Export"
    echo "Usage: $0 [mode] [options]"
    echo ""
    echo "🎯 FRONTEND FOCUSED:"
    echo "  frontend       Core app files (src/App.*, src/lib/*, src/contexts/*)"
    echo "  services       Business logic (src/services/*, src/hooks/*, src/utils/*)"
    echo "  pages          UI pages (src/pages/*, auth components, layout)"
    echo "  components     All UI components (src/components/**/*)"
    echo ""
    echo "🗄️ BACKEND & DATA:"
    echo "  backend        Schema + recent migrations (backend/schema, last 10 migrations)"
    echo "  scripts        Development tools (src/scripts/*, *.sh files)"
    echo ""
    echo "🔍 FEATURE DEBUGGING:"
    echo "  auth           Authentication flow (files matching *auth*, login, register)"
    echo "  market         Market features (files matching *market*)"
    echo "  stallholder    Stallholder features (files matching *stallholder*)"
    echo "  application    Application workflow (files matching *application*)"
    echo ""
    echo "🎨 UI & STYLING:"
    echo "  styles         All CSS/styling (*.css, tailwind config)"
    echo "  ui             Complete UI (pages + components + styles)"
    echo ""
    echo "📚 UTILITY MODES:"
    echo "  config         Configuration files only (*.config.*, package.json, .env)"
    echo "  docs           Documentation (*.md files)"
    echo "  recent         Recently modified files (last 24h)"
    echo "  dev            Complete dev context (frontend + services + backend)"
    echo "  full           Everything except binaries"
    echo ""
    echo "Options:"
    echo "  --output, -o FILE    Output filename"
    echo "  --verbose, -v        Show file processing"
    echo "  --dry-run           Show files that would be included"
    echo ""
    echo "💡 Examples:"
    echo "  $0 frontend                    # Most common for development"
    echo "  $0 auth --verbose              # Debug authentication issues"
    echo "  $0 market --dry-run            # See what market files exist"
    echo "  $0 backend                     # Database schema issues"
}

# Parse arguments
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        frontend|services|pages|components|backend|scripts|styles|config|auth|market|stallholder|application|dev|ui|docs|recent|full)
            MODE="$1"
            shift
            ;;
        --output|-o)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Logging functions
log() { echo "📝 $1"; }
log_file() { [ "$VERBOSE" = true ] && echo "   ✓ $1"; }

# Dry run mode
if [ "$DRY_RUN" = true ]; then
    echo "🔍 Files that would be included in '$MODE' mode:"
    echo "================================================"
    get_files_by_pattern "$MODE" | sort | while read -r file; do
        if [ -f "$file" ]; then
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
            human_size=$(numfmt --to=iec "$size" 2>/dev/null || echo "${size}B")
            printf "%-60s %8s\n" "$file" "$human_size"
        fi
    done
    
    total_files=$(get_files_by_pattern "$MODE" | wc -l | tr -d ' ')
    echo ""
    echo "Total files: $total_files"
    echo ""
    echo "Run without --dry-run to generate export file."
    exit 0
fi

# Add file function with smart masking
add_file() {
    local file="$1"
    local relative_path="${file#./}"
    
    if [ -f "$file" ]; then
        echo "📄 $relative_path" >> "$OUTPUT_FILE"
        echo "$(printf '=%.0s' {1..80})" >> "$OUTPUT_FILE"
        
        # Smart content masking
        if [[ "$file" == *".env"* ]]; then
            sed 's/\(SECRET\|KEY\|PASSWORD\|TOKEN\|_URL\)=.*/\1=***MASKED***/g' "$file" >> "$OUTPUT_FILE"
        elif [[ "$file" == *"output"* ]] || [[ "$file" == *"log"* ]]; then
            # Truncate large output/log files
            echo "# Large output file truncated for context efficiency" >> "$OUTPUT_FILE"
            head -50 "$file" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "# ... (truncated, original file has $(wc -l < "$file") lines)" >> "$OUTPUT_FILE"
        else
            cat "$file" >> "$OUTPUT_FILE"
        fi
        
        echo "" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        log_file "$relative_path"
        return 0
    else
        [ "$VERBOSE" = true ] && echo "   ⚠️  Missing: $file"
        return 1
    fi
}

# Initialize output
> "$OUTPUT_FILE"
echo "SA MARKETS DIRECTORY - $MODE MODE (Dynamic)" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "Pattern-based file selection - automatically includes new files" >> "$OUTPUT_FILE"
echo "$(printf '=%.0s' {1..80})" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Get files and process
log "Scanning for files in '$MODE' mode..."
file_list=$(get_files_by_pattern "$MODE" | sort -u)

if [ -z "$file_list" ]; then
    echo "❌ No files found for mode: $MODE"
    exit 1
fi

file_count=0
while IFS= read -r file; do
    if [ -n "$file" ] && [ -f "$file" ]; then
        add_file "$file"
        ((file_count++))
    fi
done <<< "$file_list"

# Summary
file_size=$(wc -c < "$OUTPUT_FILE" | tr -d ' ')
human_size=$(numfmt --to=iec "$file_size" 2>/dev/null || echo "${file_size}B")

echo "📊 EXPORT SUMMARY" >> "$OUTPUT_FILE"
echo "$(printf '=%.0s' {1..40})" >> "$OUTPUT_FILE"
echo "Mode: $MODE (pattern-based)" >> "$OUTPUT_FILE"
echo "Files included: $file_count" >> "$OUTPUT_FILE"
echo "Total size: $human_size" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "Auto-discovers new files in target directories" >> "$OUTPUT_FILE"

echo ""
echo "✅ Export complete: $OUTPUT_FILE"
echo "📊 Size: $human_size ($file_count files)"
echo "🎯 Mode: $MODE"
echo ""
echo "💡 The script automatically found all files in relevant directories!"
echo "   New files you add will be included automatically."
#!/bin/bash

# SA Markets Directory - PocketBase Setup & Start Script
# This script checks for existing installations and sets up PocketBase if needed

set -e  # Exit on any error

echo "🚀 SA Markets Directory - PocketBase Setup"
echo "==============================================="
echo ""

# Function to check if PocketBase is working at a given path
check_pocketbase() {
    local pb_path="$1"
    if [ -f "$pb_path" ]; then
        echo "🔍 Found PocketBase at: $pb_path"
        if "$pb_path" --version > /dev/null 2>&1; then
            echo "✅ PocketBase is working!"
            echo "   Version: $($pb_path --version 2>/dev/null || echo 'Unknown')"
            return 0
        else
            echo "⚠️  PocketBase found but not executable"
            return 1
        fi
    fi
    return 1
}

# Function to check environment configuration
check_environment() {
    echo "🔧 Checking environment configuration..."
    
    if [ -f ".env" ]; then
        echo "✅ .env file found"
        
        # Check VITE_POCKETBASE_URL
        if grep -q "VITE_POCKETBASE_URL" .env; then
            local pb_url=$(grep "VITE_POCKETBASE_URL" .env | cut -d'=' -f2)
            echo "   PocketBase URL: $pb_url"
            
            # Validate URL format
            if [[ "$pb_url" == "http://localhost:8090" ]]; then
                echo "✅ PocketBase URL is correctly configured"
            else
                echo "⚠️  PocketBase URL might need adjustment"
                echo "   Expected: http://localhost:8090"
                echo "   Found: $pb_url"
            fi
        else
            echo "⚠️  VITE_POCKETBASE_URL not found in .env"
        fi
    else
        echo "⚠️  .env file not found"
        echo "   You may need to create it from .env.example"
    fi
    echo ""
}

# Function to start PocketBase from a given path
start_pocketbase() {
    local pb_path="$1"
    local working_dir="$2"
    
    echo "🚀 Starting PocketBase..."
    echo "   Executable: $pb_path"
    echo "   Working directory: $working_dir"
    echo "   Admin UI: http://localhost:8090/_/"
    echo ""
    echo "📝 Note: Open a new terminal and run 'npm run dev' to start the React app"
    echo ""
    
    if [ -n "$working_dir" ] && [ "$working_dir" != "." ]; then
        cd "$working_dir"
    fi
    
    "$pb_path" serve
}

echo "🔍 Searching for existing PocketBase installations..."
echo ""

# Check possible locations for PocketBase
FOUND_POCKETBASE=""
WORKING_DIR=""

# 1. Check root directory
if check_pocketbase "./pocketbase"; then
    FOUND_POCKETBASE="./pocketbase"
    WORKING_DIR="."
elif check_pocketbase "./pocketbase.exe"; then
    FOUND_POCKETBASE="./pocketbase.exe"
    WORKING_DIR="."

# 2. Check backend folder
elif check_pocketbase "./backend/pocketbase"; then
    FOUND_POCKETBASE="./backend/pocketbase"
    WORKING_DIR="./backend"
elif check_pocketbase "./backend/pocketbase.exe"; then
    FOUND_POCKETBASE="./backend/pocketbase.exe"
    WORKING_DIR="./backend"

# 3. Check if backend folder exists but no executable
elif [ -d "./backend" ]; then
    echo "📁 Found backend folder but no PocketBase executable inside"
    echo "   Contents of backend folder:"
    ls -la ./backend/ | head -10
    echo ""
    
    # Check for any pocketbase-related files
    if ls ./backend/*pocketbase* > /dev/null 2>&1; then
        echo "🔍 Found PocketBase-related files in backend:"
        ls -la ./backend/*pocketbase*
        echo ""
    fi
    
# 4. Check system PATH
elif command -v pocketbase > /dev/null 2>&1; then
    FOUND_POCKETBASE="pocketbase"
    WORKING_DIR="."
    echo "✅ Found PocketBase in system PATH: $(which pocketbase)"
fi

# Check environment regardless
check_environment

# If PocketBase was found, offer to start it
if [ -n "$FOUND_POCKETBASE" ]; then
    echo "✅ PocketBase installation found!"
    echo ""
    
    # Check for existing data
    data_dir=""
    if [ -d "./pb_data" ]; then
        data_dir="./pb_data"
    elif [ -d "./backend/pb_data" ]; then
        data_dir="./backend/pb_data"
    fi
    
    if [ -n "$data_dir" ]; then
        echo "📊 Found existing database at: $data_dir"
        if [ -f "$data_dir/data.db" ]; then
            echo "   Database file exists - your data should be preserved"
        fi
        echo ""
    fi
    
    read -p "🚀 Start PocketBase now? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "✅ PocketBase is ready. Start it manually with:"
        echo "   $FOUND_POCKETBASE serve"
        if [ "$WORKING_DIR" != "." ]; then
            echo "   (from directory: $WORKING_DIR)"
        fi
        exit 0
    fi
    
    start_pocketbase "$FOUND_POCKETBASE" "$WORKING_DIR"
    exit 0
fi

# If no PocketBase found, offer to download
echo "❌ No PocketBase installation found"
echo ""
echo "🔍 Checked locations:"
echo "   - ./pocketbase"
echo "   - ./backend/pocketbase"
echo "   - System PATH"
echo ""

read -p "📥 Download and install PocketBase now? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "ℹ️  You can download PocketBase manually from:"
    echo "   https://pocketbase.io/docs/"
    exit 0
fi

# Detect operating system for download
OS=""
ARCH=""

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="darwin"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

# Detect architecture
if [[ $(uname -m) == "x86_64" ]]; then
    ARCH="amd64"
elif [[ $(uname -m) == "arm64" ]] || [[ $(uname -m) == "aarch64" ]]; then
    ARCH="arm64"
else
    echo "❌ Unsupported architecture: $(uname -m)"
    exit 1
fi

# Set PocketBase version and download details
POCKETBASE_VERSION="0.26.0"
FILENAME="pocketbase_${POCKETBASE_VERSION}_${OS}_${ARCH}"

if [[ "$OS" == "windows" ]]; then
    FILENAME="${FILENAME}.zip"
    EXECUTABLE="pocketbase.exe"
else
    FILENAME="${FILENAME}.zip"
    EXECUTABLE="pocketbase"
fi

DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/${FILENAME}"

# Ask where to install
echo ""
echo "📍 Where would you like to install PocketBase?"
echo "   1) Root directory (./pocketbase)"
echo "   2) Backend folder (./backend/pocketbase)"
echo ""
read -p "Choose option (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY == "2" ]]; then
    # Create backend directory if it doesn't exist
    mkdir -p ./backend
    INSTALL_DIR="./backend"
    WORKING_DIR="./backend"
else
    INSTALL_DIR="."
    WORKING_DIR="."
fi

echo ""
echo "📋 Download details:"
echo "   System: $OS $ARCH"
echo "   File: $FILENAME"
echo "   Install to: $INSTALL_DIR"
echo "   URL: $DOWNLOAD_URL"
echo ""

# Download PocketBase
echo "📥 Downloading PocketBase..."
if command -v curl &> /dev/null; then
    curl -L -o "$INSTALL_DIR/$FILENAME" "$DOWNLOAD_URL"
elif command -v wget &> /dev/null; then
    wget -O "$INSTALL_DIR/$FILENAME" "$DOWNLOAD_URL"
else
    echo "❌ Neither curl nor wget found. Please install one of them."
    exit 1
fi

# Verify download
if [ ! -f "$INSTALL_DIR/$FILENAME" ]; then
    echo "❌ Failed to download PocketBase"
    exit 1
fi

echo "✅ Download completed"

# Extract PocketBase
echo "📦 Extracting PocketBase..."
cd "$INSTALL_DIR"
if command -v unzip &> /dev/null; then
    unzip -q "$FILENAME"
else
    echo "❌ unzip command not found. Please install unzip."
    exit 1
fi

# Make executable (Linux/macOS only)
if [[ "$OS" != "windows" ]]; then
    chmod +x "$EXECUTABLE"
fi

# Verify extraction
if [ ! -f "./$EXECUTABLE" ]; then
    echo "❌ Failed to extract PocketBase executable"
    exit 1
fi

echo "✅ PocketBase extracted successfully"

# Clean up
echo "🧹 Cleaning up..."
rm -f "$FILENAME"

# Go back to original directory if we changed it
if [ "$INSTALL_DIR" != "." ]; then
    cd - > /dev/null
fi

# Verify installation
echo "🔍 Verifying installation..."
NEW_PB_PATH="$INSTALL_DIR/$EXECUTABLE"
if "$NEW_PB_PATH" --version > /dev/null 2>&1; then
    echo "✅ PocketBase installed successfully!"
    echo "   Version: $($NEW_PB_PATH --version)"
else
    echo "❌ PocketBase installation verification failed"
    exit 1
fi

echo ""
echo "==============================================="
echo "🎉 POCKETBASE SETUP COMPLETE!"
echo "==============================================="
echo ""
echo "📋 Installation details:"
echo "   Location: $NEW_PB_PATH"
echo "   Working directory: $WORKING_DIR"
echo ""
echo "📝 Next steps:"
echo "1. Start PocketBase: $NEW_PB_PATH serve"
echo "2. Open admin UI: http://localhost:8090/_/"
echo "3. Create admin account (first time only)"
echo "4. Import database schema"
echo "5. In new terminal: npm run dev"
echo ""

read -p "🚀 Start PocketBase now? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    start_pocketbase "$NEW_PB_PATH" "$WORKING_DIR"
else
    echo "✅ PocketBase is ready. Start it manually when needed."
fi
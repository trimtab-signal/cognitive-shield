#!/bin/bash
# Cognitive Shield - Automated Development Startup (Unix/Linux/Mac)
# Handles all infrastructure automatically

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
CLEAN=false
FORCE=false
PORT=5173
HOSTNAME="localhost"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --clean) CLEAN=true ;;
        --force) FORCE=true ;;
        --port) PORT="$2"; shift ;;
        --hostname) HOSTNAME="$2"; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

echo -e "${CYAN}🧠 COGNITIVE SHIELD - AUTOMATED STARTUP${NC}"
echo -e "${CYAN}============================================${NC}"

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to kill process on port
kill_port_process() {
    echo -e "${YELLOW}🔪 Killing process on port $1...${NC}"
    local pid=$(lsof -ti :$1 2>/dev/null)
    if [ ! -z "$pid" ]; then
        kill -9 $pid 2>/dev/null || true
        sleep 2
    fi
}

# Function to clean up Node processes
clean_node_processes() {
    echo -e "${YELLOW}🧹 Cleaning up existing Node.js processes...${NC}"
    pkill -f "node.*vite" 2>/dev/null || true
    pkill -f "node.*cognitive-shield" 2>/dev/null || true
    sleep 3
}

# Function to clean npm cache
clean_npm_cache() {
    if [ "$CLEAN" = true ]; then
        echo -e "${YELLOW}🧽 Cleaning npm cache...${NC}"
        npm cache clean --force >/dev/null 2>&1 || true
    fi
}

# Function to check system requirements
check_requirements() {
    echo -e "${BLUE}🔍 Checking system requirements...${NC}"

    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        local node_version=$(node --version)
        echo -e "${GREEN}✅ Node.js: $node_version${NC}"
    else
        echo -e "${RED}❌ Node.js not found. Please install Node.js${NC}"
        exit 1
    fi

    # Check npm
    if command -v npm >/dev/null 2>&1; then
        local npm_version=$(npm --version)
        echo -e "${GREEN}✅ npm: $npm_version${NC}"
    else
        echo -e "${RED}❌ npm not found${NC}"
        exit 1
    fi

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Not in Cognitive Shield directory (package.json not found)${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ System requirements met${NC}"
}

# Main startup logic
main() {
    # Clean up if requested or if port is in use
    if ! check_port $PORT || [ "$CLEAN" = true ] || [ "$FORCE" = true ]; then
        echo -e "${YELLOW}🔄 Port $PORT in use or cleanup requested...${NC}"
        kill_port_process $PORT
        clean_node_processes
        clean_npm_cache
        sleep 2
    fi

    # Check requirements
    check_requirements

    # Final port check
    if ! check_port $PORT; then
        echo -e "${RED}❌ Port $PORT still in use. Please try a different port or kill the process manually.${NC}"
        exit 1
    fi

    echo -e "${GREEN}🚀 Starting Cognitive Shield development server...${NC}"
    echo -e "${CYAN}📡 URL: http://$HOSTNAME:$PORT${NC}"
    echo -e "${CYAN}🔺 Tetrahedron Protocol ready for testing${NC}"
    echo ""

    # Start the dev server
    exec npx vite --host --force --port $PORT
}

# Run main function
main "$@"
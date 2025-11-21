#!/bin/bash

#
# ClaudeKit PM Quick Installer
# Run: curl -fsSL https://raw.githubusercontent.com/your-org/pm-kit-cli/main/install.sh | bash
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║                                    ║${NC}"
  echo -e "${BLUE}║      ClaudeKit PM Installer       ║${NC}"
  echo -e "${BLUE}║                                    ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════╝${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

check_command() {
  if command -v "$1" &> /dev/null; then
    return 0
  else
    return 1
  fi
}

# Main installation
main() {
  print_header

  echo "This script will install ClaudeKit PM CLI on your system."
  echo ""

  # Check Node.js
  print_info "Checking prerequisites..."
  echo ""

  if check_command node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"

    # Check if version is 16 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -lt 16 ]; then
      print_error "Node.js 16 or higher required. You have $NODE_VERSION"
      echo ""
      echo "Please upgrade Node.js:"
      echo "  macOS: brew install node"
      echo "  Or visit: https://nodejs.org/"
      exit 1
    fi
  else
    print_error "Node.js not found"
    echo ""
    echo "Please install Node.js first:"
    echo "  macOS: brew install node"
    echo "  Windows: choco install nodejs"
    echo "  Or visit: https://nodejs.org/"
    exit 1
  fi

  # Check package manager
  if check_command pnpm; then
    PKG_MANAGER="pnpm"
    print_success "Package manager: pnpm (recommended)"
  elif check_command npm; then
    PKG_MANAGER="npm"
    print_success "Package manager: npm"
  elif check_command yarn; then
    PKG_MANAGER="yarn"
    print_success "Package manager: yarn"
  else
    print_error "No package manager found"
    exit 1
  fi

  echo ""
  print_info "Installing pm-kit-cli globally..."
  echo ""

  # Install based on package manager
  if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm install -g pm-kit-cli
  elif [ "$PKG_MANAGER" = "yarn" ]; then
    yarn global add pm-kit-cli
  else
    npm install -g pm-kit-cli
  fi

  if [ $? -eq 0 ]; then
    echo ""
    print_success "Installation successful!"
  else
    echo ""
    print_error "Installation failed"
    echo ""
    echo "Try manual installation:"
    echo "  npm install -g pm-kit-cli"
    exit 1
  fi

  # Verify installation
  echo ""
  print_info "Verifying installation..."
  echo ""

  if check_command pm-kit; then
    VERSION=$(pm-kit --version)
    print_success "pm-kit CLI installed: v$VERSION"
  else
    print_warning "pm-kit command not found in PATH"
    echo ""
    echo "You may need to restart your terminal or add to PATH:"
    echo "  export PATH=\"\$PATH:\$(npm config get prefix)/bin\""
  fi

  # Check Claude CLI
  echo ""
  if check_command claude; then
    CLAUDE_VERSION=$(claude --version 2>&1 || echo "unknown")
    print_success "Claude CLI installed: $CLAUDE_VERSION"
  else
    print_warning "Claude CLI not found (recommended but optional)"
    echo ""
    echo "Install Claude CLI from: https://claude.ai/code"
  fi

  # Next steps
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                                    ║${NC}"
  echo -e "${GREEN}║   ✓ Installation Complete!        ║${NC}"
  echo -e "${GREEN}║                                    ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
  echo ""
  echo "Next steps:"
  echo ""
  echo "  1. Navigate to your project:"
  echo "     ${BLUE}cd your-project${NC}"
  echo ""
  echo "  2. Initialize PM Kit:"
  echo "     ${BLUE}pm-kit init${NC}"
  echo ""
  echo "  3. Start using Claude:"
  echo "     ${BLUE}claude${NC}"
  echo "     ${BLUE}/prd${NC}"
  echo ""
  echo "Get help:"
  echo "  • Quick start: ${BLUE}https://github.com/your-org/pm-kit-cli#readme${NC}"
  echo "  • Full guide: ${BLUE}GETTING_STARTED.md${NC}"
  echo "  • Commands: ${BLUE}pm-kit --help${NC}"
  echo ""
}

# Run main installation
main

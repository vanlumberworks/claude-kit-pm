#!/bin/bash

#
# Setup Framework Repository Script
# This script helps create and populate the ClaudeKit PM framework repository
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
  echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║                                            ║${NC}"
  echo -e "${BLUE}║  ClaudeKit PM Framework Repository Setup  ║${NC}"
  echo -e "${BLUE}║                                            ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
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

# Main setup
main() {
  print_header

  # Check if gh CLI is available
  if ! check_command gh; then
    print_error "GitHub CLI (gh) not found"
    echo ""
    echo "Please install GitHub CLI first:"
    echo "  macOS: brew install gh"
    echo "  Or visit: https://cli.github.com/"
    exit 1
  fi

  # Check if authenticated
  if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub CLI"
    echo ""
    echo "Please authenticate first:"
    echo "  gh auth login"
    exit 1
  fi

  print_success "GitHub CLI authenticated"
  echo ""

  # Get repository details
  print_info "Repository Configuration"
  echo ""

  # Get default username
  DEFAULT_OWNER=$(gh api user --jq .login)

  read -p "Repository owner/org (default: $DEFAULT_OWNER): " OWNER
  OWNER=${OWNER:-$DEFAULT_OWNER}

  read -p "Repository name (default: claudekit-pm-framework): " REPO_NAME
  REPO_NAME=${REPO_NAME:-claudekit-pm-framework}

  REPO_FULL="${OWNER}/${REPO_NAME}"

  echo ""
  read -p "Make repository private? (y/n, default: y): " IS_PRIVATE
  IS_PRIVATE=${IS_PRIVATE:-y}

  echo ""
  print_info "Will create repository: ${REPO_FULL}"
  if [[ "$IS_PRIVATE" == "y" ]]; then
    print_info "Visibility: Private"
  else
    print_info "Visibility: Public"
  fi
  echo ""

  read -p "Proceed? (y/n): " CONFIRM
  if [[ "$CONFIRM" != "y" ]]; then
    echo "Setup cancelled"
    exit 0
  fi

  echo ""
  print_info "Setting up framework repository..."
  echo ""

  # Create temporary directory
  TEMP_DIR=$(mktemp -d)
  cd "$TEMP_DIR"

  print_info "Working in: $TEMP_DIR"

  # Initialize git repository
  git init
  print_success "Initialized git repository"

  # Copy framework files
  print_info "Copying framework files..."

  # Copy CLAUDE.md
  if [ -f "$OLDPWD/CLAUDE.md" ]; then
    cp "$OLDPWD/CLAUDE.md" .
    print_success "Copied CLAUDE.md"
  else
    print_error "CLAUDE.md not found"
  fi

  # Copy .claude directory
  if [ -d "$OLDPWD/.claude" ]; then
    cp -r "$OLDPWD/.claude" .
    print_success "Copied .claude/ directory"
  else
    print_error ".claude/ directory not found"
  fi

  # Create version.json
  cat > version.json <<EOF
{
  "version": "0.1.0",
  "releaseDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "minimumCliVersion": "0.1.0",
  "files": {
    "workflows": $(find .claude/workflows -type f 2>/dev/null | wc -l | tr -d ' '),
    "agents": $(find .claude/agents -type f 2>/dev/null | wc -l | tr -d ' '),
    "commands": $(find .claude/commands -type f 2>/dev/null | wc -l | tr -d ' '),
    "templates": $(find .claude/templates -type f 2>/dev/null | wc -l | tr -d ' '),
    "skills": $(find .claude/skills -type f 2>/dev/null | wc -l | tr -d ' ')
  }
}
EOF
  print_success "Created version.json"

  # Create README.md
  cat > README.md <<EOF
# ClaudeKit PM Framework

This repository contains the ClaudeKit PM framework files - workflows, agents, commands, templates, and skills for product management with AI assistance.

## Contents

- **CLAUDE.md** - Main routing file that guides Claude's behavior
- **.claude/** - Framework directory containing:
  - **workflows/** - Detailed PM workflow implementations
  - **agents/** - Specialized agent definitions
  - **commands/** - Slash commands for quick invocation
  - **templates/** - Reusable document templates
  - **skills/** - Technical literacy modules

## Version

Current version: 0.1.0

## Installation

This framework is installed via the \`pm-kit-cli\` tool:

\`\`\`bash
npm install -g pm-kit-cli
cd your-project
pm-kit init
\`\`\`

## Usage

After installation, use with Claude Code:

\`\`\`bash
claude
/prd      # Create Product Requirements Document
/research # Multi-source research synthesis
/decide   # Quick decision framework
\`\`\`

## Documentation

See the [ClaudeKit PM repository](https://github.com/${OWNER}/claude-kit-pm) for complete documentation.

## License

MIT License - See LICENSE file
EOF
  print_success "Created README.md"

  # Create .gitignore
  cat > .gitignore <<EOF
# Node modules (if any)
node_modules/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# Temporary files
*.tmp
.temp/
EOF
  print_success "Created .gitignore"

  # Create LICENSE
  cat > LICENSE <<EOF
MIT License

Copyright (c) $(date +%Y) ${OWNER}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
  print_success "Created LICENSE"

  echo ""
  print_info "Committing files..."
  git add .
  git commit -m "Initial commit: ClaudeKit PM Framework v0.1.0

- Add CLAUDE.md routing file
- Add .claude/ framework directory
- Add version.json for version tracking
- Add README.md documentation
- Add .gitignore and LICENSE"
  print_success "Created initial commit"

  echo ""
  print_info "Creating GitHub repository..."

  if [[ "$IS_PRIVATE" == "y" ]]; then
    gh repo create "$REPO_FULL" \
      --private \
      --source=. \
      --description="ClaudeKit PM framework files - workflows, agents, and templates for AI-enhanced product management" \
      --push
  else
    gh repo create "$REPO_FULL" \
      --public \
      --source=. \
      --description="ClaudeKit PM framework files - workflows, agents, and templates for AI-enhanced product management" \
      --push
  fi

  print_success "Repository created and pushed: ${REPO_FULL}"

  echo ""
  print_info "Creating release v0.1.0..."

  git tag -a v0.1.0 -m "Release v0.1.0: Initial framework release

This is the first release of ClaudeKit PM Framework.

Contents:
- CLAUDE.md routing file
- 14 PM workflows
- 8 specialized agents
- 10 slash commands
- 4 templates
- 6 skills

Compatible with pm-kit-cli v0.1.0+"

  git push origin v0.1.0

  gh release create v0.1.0 \
    --title "v0.1.0 - Initial Release" \
    --notes "## ClaudeKit PM Framework v0.1.0

This is the first official release of the ClaudeKit PM Framework.

### What's Included

- **CLAUDE.md** - Main routing file
- **14 Workflows** - Complete PM processes
- **8 Specialized Agents** - Problem decomposer, PRD writer, etc.
- **10 Slash Commands** - Quick access to workflows
- **4 Templates** - PRD, decision logs, etc.
- **6 Skills** - Technical literacy modules

### Installation

\`\`\`bash
npm install -g pm-kit-cli
cd your-project
pm-kit init
\`\`\`

### Requirements

- pm-kit-cli v0.1.0+
- Node.js 16+
- Claude Code CLI

### Documentation

See the main [ClaudeKit PM repository](https://github.com/${OWNER}/claude-kit-pm) for complete documentation and guides."

  print_success "Release created: v0.1.0"

  # Cleanup
  cd "$OLDPWD"
  rm -rf "$TEMP_DIR"

  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                                            ║${NC}"
  echo -e "${GREEN}║          ✓ Setup Complete!                 ║${NC}"
  echo -e "${GREEN}║                                            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
  echo ""

  print_info "Repository: https://github.com/${REPO_FULL}"
  print_info "Release: https://github.com/${REPO_FULL}/releases/tag/v0.1.0"
  echo ""

  echo "Next steps:"
  echo ""
  echo "  1. Update lib/constants.js in pm-kit-cli:"
  echo "     ${BLUE}KIT_REPOSITORY: '${REPO_FULL}'${NC}"
  echo ""
  echo "  2. Test the installation:"
  echo "     ${BLUE}cd /tmp/test-project${NC}"
  echo "     ${BLUE}pm-kit init${NC}"
  echo ""
  echo "  3. Verify all files downloaded correctly:"
  echo "     ${BLUE}pm-kit doctor${NC}"
  echo ""
}

# Run main function
main

#!/bin/bash

#
# Sync Framework Files to Distribution Repository
# Run this after making changes to .claude/ or CLAUDE.md
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Sync Framework to Distribution Repo  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d ".claude" ]; then
  echo -e "${YELLOW}⚠${NC} Error: Must run from claude-kit-pm root directory"
  exit 1
fi

if [ ! -d "framework-repo-setup" ]; then
  echo -e "${YELLOW}⚠${NC} Error: framework-repo-setup directory not found"
  exit 1
fi

# Show what will be synced
echo "Will sync:"
echo "  .claude/ → framework-repo-setup/.claude/"
echo "  CLAUDE.md → framework-repo-setup/CLAUDE.md"
echo ""

read -p "Continue? (y/n): " confirm
if [ "$confirm" != "y" ]; then
  echo "Cancelled"
  exit 0
fi

# Sync .claude directory
echo ""
echo -e "${BLUE}ℹ${NC} Syncing .claude/ directory..."
rsync -av --delete .claude/ framework-repo-setup/.claude/
echo -e "${GREEN}✓${NC} .claude/ synced"

# Sync CLAUDE.md
echo -e "${BLUE}ℹ${NC} Syncing CLAUDE.md..."
cp CLAUDE.md framework-repo-setup/
echo -e "${GREEN}✓${NC} CLAUDE.md synced"

# Count files
WORKFLOWS=$(find framework-repo-setup/.claude/workflows -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
AGENTS=$(find framework-repo-setup/.claude/agents -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
COMMANDS=$(find framework-repo-setup/.claude/commands -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
TEMPLATES=$(find framework-repo-setup/.claude/templates -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
SKILLS=$(find framework-repo-setup/.claude/skills -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "Framework file counts:"
echo "  Workflows: $WORKFLOWS"
echo "  Agents: $AGENTS"
echo "  Commands: $COMMANDS"
echo "  Templates: $TEMPLATES"
echo "  Skills: $SKILLS"

# Check if counts changed
CURRENT_WORKFLOWS=$(grep '"workflows":' framework-repo-setup/version.json | grep -o '[0-9]*')
CURRENT_AGENTS=$(grep '"agents":' framework-repo-setup/version.json | grep -o '[0-9]*')
CURRENT_COMMANDS=$(grep '"commands":' framework-repo-setup/version.json | grep -o '[0-9]*')

if [ "$WORKFLOWS" != "$CURRENT_WORKFLOWS" ] || [ "$AGENTS" != "$CURRENT_AGENTS" ] || [ "$COMMANDS" != "$CURRENT_COMMANDS" ]; then
  echo ""
  echo -e "${YELLOW}⚠${NC} File counts changed! Update version.json:"
  echo "  Current: workflows=$CURRENT_WORKFLOWS, agents=$CURRENT_AGENTS, commands=$CURRENT_COMMANDS"
  echo "  New:     workflows=$WORKFLOWS, agents=$AGENTS, commands=$COMMANDS"
  echo ""
  echo "Edit framework-repo-setup/version.json before creating release"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✓ Sync Complete!              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo "Next steps:"
echo ""
echo "  1. Review changes:"
echo -e "     ${BLUE}cd framework-repo-setup${NC}"
echo -e "     ${BLUE}git status${NC}"
echo ""
echo "  2. Update version.json if needed"
echo ""
echo "  3. Commit and create release:"
echo -e "     ${BLUE}git add .${NC}"
echo -e "     ${BLUE}git commit -m \"Update: [describe changes]\"${NC}"
echo -e "     ${BLUE}git push${NC}"
echo -e "     ${BLUE}git tag -a v0.1.1 -m \"Release v0.1.1\"${NC}"
echo -e "     ${BLUE}git push origin v0.1.1${NC}"
echo -e "     ${BLUE}gh release create v0.1.1${NC}"
echo ""

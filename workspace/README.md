# Workspace Directory

This directory contains active work in progress for product management tasks.

## Structure

- `research/` - Active user research projects and analysis
- `prds/` - Product Requirements Documents in draft or review
- `problems/` - Problem decomposition work and analysis
- `api-tests/` - API testing results and documentation
- `prototypes/` - Frontend design specifications and prompts
- `diagrams/` - ASCII flow diagrams and visualizations

## Usage

### For Active Projects
Place work-in-progress files here organized by type. Once work is finalized:
- PRDs → Move to `../prds/` for archival
- Research → Move to `../research/` for reference
- Decisions → Document in `../decisions/`

### Naming Convention
```
[YYYY-MM-DD]-[project-name]-[type].md

Examples:
2024-11-20-checkout-redesign-prd.md
2024-11-20-user-interviews-research.md
2024-11-20-auth-flow-diagram.md
```

### Workflow
1. Start new work in appropriate workspace subdirectory
2. Use templates from `../templates/`
3. Iterate and collaborate
4. Finalize and move to permanent location
5. Update relevant documentation

## Quick Start

```bash
# Create new PRD from template
cp ../templates/prd-template.md workspace/prds/2024-11-20-new-feature-prd.md

# Create new API test documentation
cp ../templates/api-test-template.md workspace/api-tests/2024-11-20-auth-api-test.md

# Create problem decomposition
cp ../templates/problem-tree-template.md workspace/problems/2024-11-20-checkout-issues.md
```

## Tips
- Keep this directory clean - archive completed work regularly
- Use descriptive filenames with dates
- Link between related documents
- Update status in file headers
- Review weekly and clean up stale files

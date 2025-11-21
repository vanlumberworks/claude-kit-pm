# ClaudeKit PM - Product Management Framework

A comprehensive, AI-enhanced product management system implementing Long Chain-of-Thought methodology for systematic problem-solving, strategic planning, and product development.

## 🚀 Quick Start (5 minutes)

```bash
# Install the CLI
npm install -g pm-kit-cli

# Initialize in your project
cd your-project
pm-kit init

# Start using PM workflows
claude
/prd  # Create your first PRD
```

**New to ClaudeKit PM?** → Read the [**Getting Started Guide**](./GETTING_STARTED.md) for a complete walkthrough.

**One-Line Install**:
```bash
curl -fsSL https://raw.githubusercontent.com/your-org/pm-kit-cli/main/install.sh | bash
```

## 📚 Documentation

- **[Getting Started](./GETTING_STARTED.md)** - Complete setup guide with examples (15 min read)
- **[Installation Guide](./INSTALLATION.md)** - Detailed installation instructions
- **[Commands Reference](./COMMANDS.md)** - All CLI commands explained
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to the project

## Overview

ClaudeKit PM is a File System As Context framework that enables Product Managers to leverage AI for complex reasoning chains, systematic validation, and data-driven decision-making. It provides structured workflows, specialized agents, and comprehensive templates for all aspects of product management.

## Key Features

- **Long Chain-of-Thought Reasoning**: Extended reasoning chains with 15+ systematic steps and validation checkpoints
- **Multi-Agent Orchestration**: Specialized agents for problem decomposition, PRD writing, research synthesis, prioritization, and analytics
- **Systematic Validation**: Multi-layer verification at each phase with backtracking capabilities
- **Comprehensive Templates**: Ready-to-use templates for PRDs, decisions, personas, and more
- **File System As Context**: Organized structure that enables efficient AI-enhanced workflows

## System Architecture

```
claude-kit-pm/
├── CLAUDE.md                 # Entry point - guides Claude's behavior
├── .claude/
│   ├── workflows/            # Detailed workflow implementations
│   ├── agents/               # Specialized agent definitions
│   └── commands/             # Slash commands for quick invocation
├── prds/                     # Product Requirements Documents
│   ├── templates/
│   ├── active/
│   └── archive/
├── specs/                    # Technical specifications
│   ├── technical/
│   └── functional/
├── research/                 # User research and insights
│   ├── user-interviews/
│   ├── surveys/
│   ├── insights/
│   └── personas/
├── roadmaps/                 # Strategic roadmaps
│   ├── quarterly/
│   ├── annual/
│   └── strategic/
├── metrics/                  # KPIs and analytics
│   ├── dashboards/
│   ├── reports/
│   └── analyses/
├── decisions/                # Decision logs and rationale
│   ├── logs/
│   ├── templates/
│   └── reviews/
└── frameworks/               # Reusable PM frameworks
    ├── prioritization/
    ├── analysis/
    └── templates/
```

## Core Workflows

### 1. Problem Decomposition
**Command**: `/decompose [problem statement]`

Systematically breaks down complex product problems using:
- Jobs-to-be-Done analysis
- Problem tree construction
- Root cause investigation
- Stakeholder impact mapping
- Dependency and risk analysis

**Workflow**: `./.claude/workflows/problem-decomposition.md`
**Agent**: `./.claude/agents/problem-decomposer.md`

### 2. PRD Framework
**Command**: `/prd [feature name]`

Creates comprehensive Product Requirements Documents with:
- Multi-layer validation
- User story generation
- Acceptance criteria
- Technical requirements
- Implementation phasing
- Risk mitigation

**Workflow**: `./.claude/workflows/prd-framework.md`
**Agent**: `./.claude/agents/prd-writer.md`

### 3. User Research Synthesis
**Command**: `/synthesize [research data]`

Transforms research data into actionable insights through:
- Thematic analysis
- Affinity mapping
- Sentiment analysis
- Pattern recognition
- Persona development
- Opportunity mapping

**Workflow**: `./.claude/workflows/user-research-synthesis.md`
**Agent**: `./.claude/agents/user-researcher.md`

### 4. Feature Prioritization
**Command**: `/prioritize [feature list]`

Applies multiple prioritization frameworks:
- RICE scoring (Reach × Impact × Confidence / Effort)
- ICE framework (Impact × Confidence × Ease)
- Value vs. Effort matrix
- Kano model analysis
- MoSCoW method
- Weighted scoring

**Workflow**: `./.claude/workflows/feature-prioritization.md`
**Agent**: `./.claude/agents/prioritization-engine.md`

### 5. Strategic Planning
**Command**: `/strategy [initiative/goal]`

Creates comprehensive strategic plans with:
- Vision and mission alignment
- OKR development
- Roadmap visualization
- Resource allocation
- Risk assessment
- Multi-stakeholder validation

**Workflow**: `./.claude/workflows/strategic-planning.md`

### 6. Quick Decisions
**Command**: `/decide [decision]`

Facilitates structured decision-making:
- Decision framing
- Option generation
- Pros/cons analysis
- Risk assessment
- Decision documentation
- Validation planning

**Workflow**: Embedded in command

## Specialized Agents

### Problem Decomposer
Breaks down complex problems using first principles thinking and structured frameworks.
**Location**: `./.claude/agents/problem-decomposer.md`

### PRD Writer
Creates comprehensive PRDs with multi-layer validation and systematic verification.
**Location**: `./.claude/agents/prd-writer.md`

### User Researcher
Synthesizes research data into actionable insights and validates product decisions.
**Location**: `./.claude/agents/user-researcher.md`

### Prioritization Engine
Applies multiple frameworks to feature backlogs with transparent rationale.
**Location**: `./.claude/agents/prioritization-engine.md`

### Analytics Synthesizer
Transforms data into insights, tracks metrics, and provides predictive analytics.
**Location**: `./.claude/agents/analytics-synthesizer.md`

## Comprehensive Workflows

- **Problem Decomposition**: `./.claude/workflows/problem-decomposition.md`
- **PRD Framework**: `./.claude/workflows/prd-framework.md`
- **Strategic Planning**: `./.claude/workflows/strategic-planning.md`
- **Feature Prioritization**: `./.claude/workflows/feature-prioritization.md`
- **User Research Synthesis**: `./.claude/workflows/user-research-synthesis.md`
- **Metrics & Analytics**: `./.claude/workflows/metrics-analytics.md`
- **Stakeholder Management**: `./.claude/workflows/stakeholder-management.md`
- **Cross-functional Coordination**: `./.claude/workflows/cross-functional.md`
- **Risk Assessment**: `./.claude/workflows/risk-assessment.md`
- **Documentation Standards**: `./.claude/workflows/documentation-standards.md`

## Available Commands

| Command | Description | Agent |
|---------|-------------|-------|
| `/decompose` | Systematic problem decomposition | Problem Decomposer |
| `/prd` | Generate comprehensive PRD | PRD Writer |
| `/synthesize` | Synthesize research into insights | User Researcher |
| `/prioritize` | Apply prioritization frameworks | Prioritization Engine |
| `/strategy` | Create strategic plans | Multi-agent orchestration |
| `/decide` | Quick decision framework | Decision facilitation |

## Templates

### PRD Template
Comprehensive template with all sections for product requirements documentation.
**Location**: `./prds/templates/prd-template.md`

### Decision Log Template
Structured template for documenting decisions with rationale and validation.
**Location**: `./decisions/templates/decision-log-template.md`

### Persona Template
Detailed template for creating evidence-based user personas.
**Location**: `./research/personas/persona-template.md`

## Long Chain-of-Thought Methodology

Every workflow implements extended reasoning chains with:

1. **Extended Reasoning**: 15+ systematic steps with clear progression
2. **Verification Checkpoints**: Multi-layer validation at each major phase
3. **Backtracking Mechanisms**: Clear triggers for returning to previous phases
4. **Error Correction**: Specific protocols for detecting and fixing common mistakes
5. **Multi-Layer Validation**: Internal consistency, stakeholder alignment, strategic fit
6. **Practical Templates**: Ready-to-use formats and structures
7. **Real Examples**: Concrete illustrations of each concept
8. **Measurement Systems**: Clear metrics and success criteria

## How to Use

### Getting Started

1. **Review CLAUDE.md**: Understand the system's role and capabilities
2. **Choose a Workflow**: Select based on your current task
3. **Use Commands**: Invoke agents with slash commands
4. **Follow the Process**: Each workflow has detailed phase-by-phase guidance
5. **Validate Outputs**: Use built-in verification checkpoints
6. **Iterate**: Leverage backtracking for continuous refinement

### Example Usage

**Problem Decomposition**:
```
/decompose Users are abandoning the checkout process
```

**Create PRD**:
```
/prd Shopping cart transparency feature
```

**Prioritize Features**:
```
/prioritize Q1 feature backlog
```

**Strategic Planning**:
```
/strategy AI-powered product recommendations
```

**Make Decision**:
```
/decide Should we build vs. buy payment processing?
```

## Workflow Integration

The system is designed for seamless integration:

```
Problem Decomposition → PRD Framework → Prioritization → Strategic Planning
         ↓                    ↓               ↓                ↓
    Research Synthesis → Analytics → Cross-functional → Risk Assessment
```

Each workflow produces outputs that feed into others, creating a cohesive product management system.

## Success Metrics

Track the effectiveness of ClaudeKit PM:

- **Problem Solving**: Root causes identified vs. symptoms treated
- **PRD Quality**: Stakeholder approval rate, rework reduction
- **Prioritization**: Predicted vs. actual impact accuracy
- **Research**: Insight actionability and product impact
- **Strategic Planning**: OKR achievement rate
- **Decision Quality**: Outcomes vs. predictions, regret rate

## Best Practices

### 1. Start with Problem Decomposition
Before creating PRDs or prioritizing, ensure you understand the root problem.

### 2. Validate at Every Checkpoint
Don't skip verification steps - they prevent costly mistakes.

### 3. Document Decisions
Use decision logs to track rationale and enable learning.

### 4. Leverage Multi-Framework Analysis
Use multiple prioritization frameworks for robust decisions.

### 5. Iterate Based on Learnings
Use backtracking triggers to adjust when context changes.

### 6. Maintain Single Source of Truth
Keep documentation organized and updated in the file system.

### 7. Cross-Reference Continuously
Link related documents (PRDs, research, decisions, strategy).

## Customization

ClaudeKit PM is designed to be customized:

- **Adapt Workflows**: Modify steps to match your process
- **Adjust Weights**: Change prioritization criteria weights
- **Add Templates**: Create organization-specific templates
- **Extend Agents**: Add specialized capabilities
- **Modify Commands**: Tailor slash commands to your needs

## Error Correction Protocols

Every workflow includes:
- **Common error patterns** and detection methods
- **Correction procedures** for each error type
- **Prevention strategies** to avoid future occurrences
- **Backtracking triggers** for when to revisit earlier phases

## Quality Assurance

Built-in quality checks at multiple levels:

### Level 1: Completeness
- All required sections present
- No placeholder text
- All links working
- Data sources cited

### Level 2: Clarity
- Unambiguous language
- Clear structure
- Defined terms
- Accessible to audience

### Level 3: Accuracy
- Facts verified
- Assumptions validated
- Technical details reviewed
- Data quality confirmed

### Level 4: Utility
- Serves intended purpose
- Enables decisions
- Referenced by team
- Achieves outcomes

## Support and Feedback

For questions or improvements:
- Review workflow documentation in `./.claude/workflows/`
- Check agent capabilities in `./.claude/agents/`
- Consult templates in `./*/templates/`
- Document learnings in decision logs

## Continuous Improvement

ClaudeKit PM evolves through:
- Retrospectives on workflow effectiveness
- Tracking predictions vs. outcomes
- Refining frameworks based on results
- Building organizational knowledge base
- Sharing learnings across teams

## License and Usage

This framework is designed for product management teams to enhance their workflows with AI-assisted reasoning and systematic validation.

---

## Quick Reference

**Most Common Workflows**:
1. Problem Decomposition → PRD Framework → Cross-functional Coordination
2. User Research Synthesis → Feature Prioritization → Strategic Planning
3. Quick Decision → Risk Assessment → Documentation

**When to Use What**:
- **New feature idea**: Start with `/decompose`
- **Validated problem**: Use `/prd`
- **Feature backlog**: Apply `/prioritize`
- **User feedback**: Run `/synthesize`
- **Strategic initiative**: Create with `/strategy`
- **Important decision**: Document with `/decide`

**Emergency Shortcuts**:
- Quick decision needed: `/decide`
- Stakeholder alignment: Check workflows for communication templates
- Blocked by dependency: Review cross-functional coordination workflow
- Risk materialized: Consult risk assessment workflow

---

**Version**: 1.0
**Created**: 2024-11-21
**Last Updated**: 2024-11-21

For detailed implementation guides, refer to individual workflow and agent documentation.

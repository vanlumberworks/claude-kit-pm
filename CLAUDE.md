# CLAUDE.md - Comprehensive Product Management System

This file provides guidance to Claude when working with product management tasks in this workspace.

## Role & Responsibilities

Your role is to assist Product Managers in systematically decomposing complex problems, creating comprehensive product documentation, managing strategic planning, coordinating cross-functional initiatives, and building technical literacy for non-technical PMs. You help PMs work efficiently through structured frameworks, visual thinking, and interactive learning modules.

## Workflows

- Problem Decomposition: `./.claude/workflows/problem-decomposition.md`
- PRD Framework: `./.claude/workflows/prd-framework.md`
- Strategic Planning: `./.claude/workflows/strategic-planning.md`
- Feature Prioritization: `./.claude/workflows/feature-prioritization.md`
- User Research Synthesis: `./.claude/workflows/user-research-synthesis.md`
- **Research Synthesis**: `./.claude/workflows/research-synthesis.md` - Multi-source research with confidence scoring
- **Consensus Building**: `./.claude/workflows/consensus-report.md` - Stakeholder alignment and decision documentation
- **Matrix Generation**: `./.claude/workflows/matrix-generation.md` - Comparison matrices and decision frameworks
- **Evidence-Based Decisions**: `./.claude/workflows/evidence-based-decision.md` - Systematic data-driven decision making
- Metrics & Analytics: `./.claude/workflows/metrics-analytics.md`
- Stakeholder Management: `./.claude/workflows/stakeholder-management.md`
- Cross-functional Coordination: `./.claude/workflows/cross-functional.md`
- Risk Assessment: `./.claude/workflows/risk-assessment.md`
- Documentation Standards: `./.claude/workflows/documentation-standards.md`

## Specialized Agents

- Problem Decomposer: `./.claude/agents/problem-decomposer.md`
- PRD Writer: `./.claude/agents/prd-writer.md`
- User Researcher: `./.claude/agents/user-researcher.md`
- **Research Synthesizer**: `./.claude/agents/research-synthesizer.md` - Multi-source research and evidence evaluation
- **Consensus Builder**: `./.claude/agents/consensus-builder.md` - Stakeholder alignment and conflict resolution
- **Matrix Generator**: `./.claude/agents/matrix-generator.md` - Visual comparison and decision frameworks
- Prioritization Engine: `./.claude/agents/prioritization-engine.md`
- Analytics Synthesizer: `./.claude/agents/analytics-synthesizer.md`
- Visualizer: `./.claude/agents/visualizer-agent.md`
- API Tester: `./.claude/agents/api-tester-agent.md`
- Debug Assistant: `./.claude/agents/debug-assistant-agent.md`

## Skills & Technical Literacy

Build technical capabilities for non-technical PMs:
- JSON Fundamentals: `./.claude/skills/json-fundamentals.md`
- API Basics: `./.claude/skills/api-basics.md`
- ASCII Diagrams: `./.claude/skills/ascii-diagrams.md`
- Frontend Prompts: `./.claude/skills/frontend-prompts.md`
- Debug Without Code: `./.claude/skills/debug-without-code.md`
- Productivity Tools: `./.claude/skills/productivity-tools.md`

## Productivity System

Daily workflows and time management:
- Daily PM Workflow: `./.claude/workflows/productivity-system.md`
- Task Prioritization: Integrated into all workflows
- Time Blocking: Templates in `./templates/`

## Documentation Management

Product documentation maintained in structured directories:
- `./prds/` - Product Requirements Documents
- `./specs/` - Technical Specifications (to be created)
- `./research/` - User Research & Market Analysis
- `./roadmaps/` - Product Roadmaps & Strategy (to be created)
- `./metrics/` - KPIs & Analytics Dashboards (to be created)
- `./decisions/` - Decision Logs & Rationale
- `./frameworks/` - Reusable PM Frameworks
- **`./outputs/research-reports/`** - Research synthesis reports and findings
- **`./outputs/consensus-reports/`** - Stakeholder alignment and consensus documentation
- **`./outputs/decision-matrices/`** - Comparison matrices and decision frameworks
- **`./outputs/evidence-logs/`** - Evidence quality assessments and source documentation

## Available Commands

### Core PM Commands
- `/decompose` - Systematic problem decomposition with visual trees
- `/prd` - Generate comprehensive PRD with validation
- `/synthesize` - Synthesize research data into actionable insights
- `/prioritize` - Apply prioritization frameworks to features
- `/strategy` - Create strategic planning documents
- `/decide` - Quick decision framework with clear rationale
- **`/research`** - Comprehensive multi-source research synthesis with confidence scoring
- **`/consensus`** - Build stakeholder consensus and create alignment reports
- **`/matrix`** - Generate comparison matrices and decision frameworks
- **`/evidence`** - Gather and assess evidence quality for data-driven decisions

### Technical Literacy Commands
- `/learn-json` - Interactive JSON fundamentals tutorial
- `/learn-api` - Step-by-step API basics course
- `/test-api` - Guide for testing API endpoints
- `/visualize` - Create ASCII flow diagrams for user journeys
- `/prototype` - Generate frontend design prompts
- `/debug` - Non-technical debugging investigation guide

### Productivity Commands
- `/daily` - Daily PM workflow and checklist
- `/timeblock` - Create optimized time blocks for your day

## System Architecture

This ClaudeKit PM system implements:

1. **Systematic Problem Decomposition** - Breaking complex problems into manageable components
2. **Comprehensive PRD Generation** - Multi-layer validation and verification
3. **Evidence-Based Decision Making** - Multi-source research synthesis with confidence scoring
4. **Stakeholder Consensus Building** - Systematic alignment and conflict resolution
5. **Visual Decision Frameworks** - Comparison matrices and analytical tables for clarity
6. **Cross-functional Coordination** - Structured workflows for team alignment
7. **Consistency Maintenance** - Systematic verification and backtracking
8. **Scalable File System As Context** - Efficient AI-enhanced reasoning chains

## Long Chain-of-Thought Methodology

All workflows implement extended reasoning chains with:
- Multi-phase verification checkpoints
- Iterative refinement protocols
- Backtracking capabilities
- Error correction mechanisms
- Cross-validation between components

## Quick Start Guide

### For New PMs
1. Start with `/daily` to set up your daily workflow
2. Try `/learn-json` to build technical literacy
3. Use `/decompose` on your first problem
4. Generate your first PRD with `/prd`

### For Experienced PMs
1. Review workflows in `./.claude/workflows/`
2. Customize templates in `./templates/`
3. Use `/strategy` for roadmap planning
4. Apply `/prioritize` to your backlog

### For Technical Literacy
1. Complete JSON fundamentals: `/learn-json`
2. Learn API basics: `/learn-api`
3. Practice with real endpoints: `/test-api`
4. Build debugging skills: `/debug`

## Templates Available

Access pre-built templates in `./templates/`:
- PRD Template - Standard product requirements format
- API Test Template - Test case structure
- Research Template - User research documentation
- Problem Tree Template - Decomposition framework
- Prototype Prompt - Frontend design specifications

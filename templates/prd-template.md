# PRD: [Feature Name]

**Status**: [Draft | Review | Approved]
**Author**: [Your Name]
**Created**: [Date]
**Last Updated**: [Date]
**Version**: 1.0

---

## Executive Summary

**Problem**: [What problem are we solving? 1-2 sentences]

**Solution**: [How are we solving it? 1-2 sentences]

**Impact**: [Expected outcome - metrics]
- Metric 1: [Expected change]
- Metric 2: [Expected change]

**Timeline**: [Target launch date or quarter]

**Confidence**: [High/Medium/Low] - [Brief justification]

---

## Context & Background

### Current State
[Describe how things work today]

### Problem Statement
[Detailed description of the problem]
- **Who** is affected?
- **What** is the impact?
- **Why** does it matter?
- **How** severe is it?

### Opportunity
[Why now? What's the opportunity?]

---

## User Research & Insights

### User Personas
**Primary**: [Name/Type]
- Needs: [What they need]
- Goals: [What they want to accomplish]
- Pain points: [Current frustrations]

**Secondary**: [Name/Type]
- [Similar structure]

### Key Insights
1. [Insight from research with source]
2. [Insight from data/analytics]
3. [Insight from customer feedback]

### Jobs to Be Done
When [situation], I want to [motivation], so I can [expected outcome].

---

## Goals & Success Metrics

### Primary Goals
1. [Goal 1]
2. [Goal 2]

### Success Metrics
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| [Metric name] | [Baseline] | [Goal] | [When] |
| [Metric name] | [Baseline] | [Goal] | [When] |

### Leading Indicators
- [Metric to watch that predicts success]

---

## Solution Overview

### High-Level Approach
[Describe the solution at a high level]

### User Journey
```
[ASCII flow diagram of key user journey]

User starts → Action 1 → Decision → Action 2 → Outcome
```

### Key Features
1. **[Feature Name]** (P0/P1/P2)
   - Description: [What it is]
   - User value: [Why it matters]
   - Acceptance criteria:
     - [ ] [Specific, testable criterion]
     - [ ] [Specific, testable criterion]

2. **[Feature Name]** (P0/P1/P2)
   - [Same structure]

---

## User Stories

### Must Have (P0)
**As a** [user type],
**I want to** [action],
**So that** [benefit].

**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Should Have (P1)
[Same format]

### Nice to Have (P2)
[Same format]

---

## Design Specifications

### UI/UX Requirements
[Link to Figma or describe key screens]

**Key Screens**:
1. [Screen Name]
   - Purpose: [What users do here]
   - Components: [Key UI elements]
   - Interactions: [How it works]

### Visual Design
- Follows [design system name]
- Color palette: [Primary colors]
- Typography: [Font specifications]
- Accessibility: WCAG 2.1 AA compliant

---

## Technical Requirements

### API Specifications

#### Endpoint: [Method] /api/endpoint

**Purpose**: [What this API does]

**Request**:
```json
{
  "field1": "string (required, max 100 chars)",
  "field2": "number (optional, 1-100)"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "res_123",
    "field1": "value"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field is required",
    "details": []
  }
}
```

### Data Model
[Describe data structure]

### Integration Points
- [System/Service 1]: [How they interact]
- [System/Service 2]: [How they interact]

### Performance Requirements
- Page load: < 2 seconds
- API response: < 500ms (p95)
- Concurrent users: [number]

### Security Requirements
- [Authentication method]
- [Authorization rules]
- [Data encryption needs]
- [Compliance requirements]

---

## Out of Scope

[What we're explicitly NOT doing in this release]
- [Item 1]
- [Item 2]

**Why**: [Brief explanation of why these are out of scope]

---

## Dependencies

### Blocked By
- [Thing that must happen first]

### Blocking
- [Things waiting on this]

### External Dependencies
- [Third-party services]
- [Other teams' work]

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk description] | High/Med/Low | High/Med/Low | [How we'll handle it] |
| [Risk description] | High/Med/Low | High/Med/Low | [How we'll handle it] |

---

## Launch Plan

### Rollout Strategy
- [ ] **Alpha** (Internal): [Date] - [Scope]
- [ ] **Beta** (Limited users): [Date] - [Scope]
- [ ] **GA** (General availability): [Date] - [Scope]

### Feature Flags
- Flag name: `feature_name_enabled`
- Rollout: [Percentage-based, user-segment, etc.]

### Go-to-Market
- [ ] Help docs updated
- [ ] Support team trained
- [ ] Marketing materials ready
- [ ] Blog post/announcement
- [ ] Customer communication

### Monitoring & Rollback Plan
- Metrics dashboard: [Link]
- Alerts configured for: [Critical metrics]
- Rollback plan: [How to disable if issues]

---

## Open Questions

1. [Question that needs answering]
   - Owner: [Person]
   - Due: [Date]
   - Status: [Open/Resolved]

2. [Question]
   - Owner:
   - Due:
   - Status:

---

## Stakeholders & Approvals

**PM**: [Name] - [Approval status]
**Engineering**: [Name] - [Approval status]
**Design**: [Name] - [Approval status]
**Marketing**: [Name] - [Approval status]
**Leadership**: [Name] - [Approval status]

---

## Timeline & Milestones

| Milestone | Owner | Date | Status |
|-----------|-------|------|--------|
| PRD Approval | PM | [Date] | [ ] |
| Design Complete | Designer | [Date] | [ ] |
| Dev Complete | Eng Lead | [Date] | [ ] |
| QA Complete | QA | [Date] | [ ] |
| Beta Launch | PM | [Date] | [ ] |
| GA Launch | PM | [Date] | [ ] |

---

## Appendix

### Research Links
- [User research report]
- [Competitive analysis]
- [Data analysis]

### Design Links
- [Figma designs]
- [Prototype]

### Technical Links
- [Technical design doc]
- [API documentation]

### Meeting Notes
- [Decision log]
- [Stakeholder feedback]

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| [Date] | 1.0 | [Name] | Initial draft |
| [Date] | 1.1 | [Name] | [What changed] |

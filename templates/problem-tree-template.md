# Problem Decomposition: [Problem Statement]

**Date**: [Date]
**PM**: [Your name]
**Status**: [In Progress / Complete]

---

## Problem Statement

**High-Level Problem**: [One sentence description]

**5 W's**:
- **What**: [What is the problem?]
- **Where**: [Where does it occur?]
- **When**: [When does it happen?]
- **Who**: [Who is affected?]
- **Why**: [Why does it matter?]

**Current Impact**:
- Users affected: [X% or count]
- Business impact: [Revenue, conversion, metrics]
- Support burden: [Ticket volume]

---

## Problem Tree

```
                    [MAIN PROBLEM]
          "Users can't complete core action"
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   User Issues     Technical Issues   Business Issues
        │                │                │
   ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
   │         │      │         │      │         │
Usability Trust   Performance Bugs  Pricing Payment
   │         │      │         │      │      Options
   │         │      │         │      │         │
┌──┴──┐  ┌──┴──┐ ┌──┴──┐ ┌──┴──┐ ┌──┴──┐ ┌──┴──┐
Sub   Sub  Sub   Sub  Sub   Sub  Sub   Sub  Sub   Sub
Issue Issue Issue Issue Issue Issue Issue Issue Issue Issue
```

---

## Problem Dimensions

### Dimension 1: User Experience Issues

**Sub-Problem 1.1**: [Specific UX issue]
- **Evidence**: [Data, quotes, observations]
- **Frequency**: [How often does this occur?]
- **Impact**: [High/Medium/Low]

**Sub-Problem 1.2**: [Another UX issue]
- **Evidence**: [Data, quotes, observations]
- **Frequency**: [How often?]
- **Impact**: [High/Medium/Low]

---

### Dimension 2: Technical Issues

**Sub-Problem 2.1**: [Technical problem]
- **Evidence**: [Error rates, logs, reports]
- **Technical details**: [From engineering]
- **Impact**: [High/Medium/Low]

**Sub-Problem 2.2**: [Another technical problem]
- [Same structure]

---

### Dimension 3: Business/Process Issues

**Sub-Problem 3.1**: [Business constraint]
- **Evidence**: [Data or stakeholder input]
- **Why it matters**: [Business impact]
- **Impact**: [High/Medium/Low]

**Sub-Problem 3.2**: [Process issue]
- [Same structure]

---

## Root Cause Analysis (5 Whys)

**Surface Problem**: [What users see]

**Why #1**: [First level why]
→ [Answer]

**Why #2**: [Dig deeper]
→ [Answer]

**Why #3**: [Dig deeper]
→ [Answer]

**Why #4**: [Dig deeper]
→ [Answer]

**Why #5**: [Final why]
→ [Answer]

**ROOT CAUSE**: [The fundamental cause]

---

## Pattern Analysis

### Common Factors
**User Segments**:
- [Pattern 1: e.g., "Only premium users"]
- [Pattern 2: e.g., "Users with >100 items"]

**Technical Factors**:
- [Pattern 1: e.g., "Only on Safari"]
- [Pattern 2: e.g., "During peak hours"]

**Timing**:
- [Pattern 1: e.g., "After recent deployment"]
- [Pattern 2: e.g., "Between 9am-5pm"]

**Data**:
- [Pattern 1: e.g., "With special characters"]
- [Pattern 2: e.g., "Very long inputs"]

---

## Solution Mapping

### Problem-Solution Matrix

| Problem Component | Quick Fix | Proper Solution | Priority | Effort |
|-------------------|-----------|-----------------|----------|--------|
| [Sub-problem 1] | [Band-aid] | [Real fix] | P0 | [S/M/L] |
| [Sub-problem 2] | [Band-aid] | [Real fix] | P1 | [S/M/L] |
| [Sub-problem 3] | [Band-aid] | [Real fix] | P2 | [S/M/L] |

---

## Prioritization

### Must Fix (P0)
**Sub-Problem**: [Critical issue]
- **Why P0**: [Blocks core functionality / affects majority / revenue impact]
- **Solution**: [Recommended approach]
- **Impact if not fixed**: [Consequences]

### Should Fix Soon (P1)
**Sub-Problem**: [Important issue]
- **Why P1**: [Significant impact but workaround exists]
- **Solution**: [Recommended approach]
- **Impact if delayed**: [Consequences]

### Can Wait (P2)
**Sub-Problem**: [Minor issue]
- **Why P2**: [Low impact / edge case]
- **Solution**: [Recommended approach]
- **Impact if delayed**: [Minimal]

---

## Hypotheses

### Hypothesis 1
**If** [we do this]
**Then** [this outcome]
**Because** [reasoning]

**How to test**: [Validation approach]
**Confidence**: [High/Medium/Low]

### Hypothesis 2
[Same structure]

---

## Dependencies

**Blocked By**:
- [Dependency 1]
- [Dependency 2]

**Requires Input From**:
- Engineering: [What we need to know]
- Design: [What we need]
- Data: [Analytics needed]
- Users: [Research needed]

---

## Success Metrics

**How We'll Know Problem is Solved**:
- [Metric 1]: [Current → Target]
- [Metric 2]: [Current → Target]
- [Qualitative measure]: [Description]

---

## Next Steps

1. [ ] Validate root cause with [team/data]
2. [ ] Prioritize sub-problems with stakeholders
3. [ ] Create PRDs for P0/P1 solutions
4. [ ] Plan quick fixes for immediate relief
5. [ ] Schedule proper solutions in roadmap
6. [ ] Define success metrics and monitoring

---

## Appendix

### Related Documents
- User research: [Link]
- Bug reports: [Links]
- Data analysis: [Link]
- Technical investigation: [Link]

### Stakeholder Input
- Engineering perspective: [Summary]
- Design perspective: [Summary]
- Customer success feedback: [Summary]

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| [Date] | 1.0 | [Name] | Initial decomposition |
| [Date] | 1.1 | [Name] | Added root cause analysis |

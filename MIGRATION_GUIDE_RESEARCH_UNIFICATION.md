# Migration Guide: Research Framework Unification

**Date**: 2025-11-21
**Affects**: Research commands, agents, and workflows
**Status**: IMPLEMENTED
**Breaking Changes**: YES (deprecating 3 commands)

---

## Overview

The ClaudeKit PM research ecosystem has been unified to eliminate duplication and provide a consistent, powerful research experience. This migration consolidates three separate research commands into one intelligent, mode-aware research system.

### What Changed?

**Before** (3 separate commands):
- `/research` - Multi-source research synthesis
- `/synthesize` - User research data synthesis
- `/evidence` - Evidence quality assessment

**After** (1 unified command):
- `/research` - Unified research command with automatic type detection

---

## Why This Change?

### Problems with Old System
1. **User Confusion**: Unclear when to use `/research` vs `/synthesize` vs `/evidence`
2. **Duplication**: 60-70% functional overlap across commands, agents, and workflows
3. **Maintenance Burden**: Changes to research methodology required updating 9 files
4. **Inconsistency Risk**: Three implementations could diverge over time

### Benefits of New System
1. **Simplicity**: One command for all research needs
2. **Intelligence**: Auto-detects research type from your input
3. **Consistency**: Single source of truth for research methodology
4. **Maintainability**: One codebase, easier to enhance and extend
5. **Code Reduction**: 30-40% reduction in research-related code

---

## Migration Path

### For Users

#### Quick Migration (Minimal Changes)

**Good News**: In most cases, you don't need to change anything!

The new `/research` command automatically detects what type of research you need based on your input.

**Old commands still work as before** - just use `/research`:

```bash
# Old way
/research "Should we build a mobile app?"

# New way (same!)
/research "Should we build a mobile app?"
```

```bash
# Old way
/synthesize "Q3 user interview findings"

# New way
/research "Synthesize Q3 user interview findings"
# OR
/research "Q3 user interview findings" --type=user
```

```bash
# Old way
/evidence "Evaluate redesign hypothesis"

# New way
/research "Evaluate evidence for redesign hypothesis"
# OR
/research "Redesign hypothesis" --type=evidence
```

#### Explicit Type Specification (Optional)

If you want to be explicit about research type, use the `--type` parameter:

```bash
/research "[topic]" --type=multi-source   # Multi-source synthesis
/research "[topic]" --type=user           # User research synthesis
/research "[topic]" --type=evidence       # Evidence quality assessment
/research "[topic]" --type=analytics      # Analytics research (NEW!)
/research "[topic]" --type=auto           # Auto-detect (default)
```

#### Auto-Detection Rules

The system detects research type based on keywords in your input:

| If Input Contains... | Research Type | Example |
|----------------------|---------------|---------|
| "users", "customers", "interviews", "surveys", "personas" | User Research | "Analyze user interviews from Q3" |
| "evidence", "validate", "confidence", "proof" | Evidence Assessment | "Validate pricing hypothesis with evidence" |
| "metrics", "analytics", "KPI", "cohort", "funnel" | Analytics Research | "Analyze onboarding funnel metrics" |
| None of above | Multi-Source Research | "Should we build feature X?" |

---

## Detailed Command Comparison

### Scenario 1: Multi-Source Research

**Old Command**:
```
/research "Market opportunity for enterprise features"
```

**New Command** (unchanged):
```
/research "Market opportunity for enterprise features"
```

**Auto-detects as**: Multi-Source Research
**Output Location**: `./outputs/research-reports/`
**Produces**: Research report, evidence log, synthesis matrix

---

### Scenario 2: User Research Synthesis

**Old Command**:
```
/synthesize "Q3 user interview findings"
```

**New Command** (option 1 - implicit):
```
/research "Synthesize Q3 user interview findings"
```

**New Command** (option 2 - explicit):
```
/research "Q3 user interview findings" --type=user
```

**Auto-detects as**: User Research (option 1) or Explicit (option 2)
**Output Location**: `./research/insights/`
**Produces**: Research report, personas, journey maps, opportunity map

---

### Scenario 3: Evidence Quality Assessment

**Old Command**:
```
/evidence "Redesign hypothesis"
```

**New Command** (option 1 - implicit):
```
/research "Evaluate evidence for redesign hypothesis"
```

**New Command** (option 2 - explicit):
```
/research "Redesign hypothesis" --type=evidence
```

**Auto-detects as**: Evidence Assessment (option 1) or Explicit (option 2)
**Output Location**: `./outputs/evidence-logs/`
**Produces**: Evidence log, quality matrix, confidence assessment

---

### Scenario 4: Analytics Research (NEW!)

**Old**: Not available as dedicated command

**New Command**:
```
/research "Analyze onboarding funnel drop-off" --type=analytics
```

OR (auto-detection):
```
/research "Onboarding funnel metrics analysis"
```

**Auto-detects as**: Analytics Research
**Output Location**: `./outputs/research-reports/`
**Produces**: Analytics report with insights and recommendations

---

## What Happens to Old Commands?

### Deprecation Timeline

| Command | Status | Availability | Recommendation |
|---------|--------|--------------|----------------|
| `/research` | **REPLACED** | Use new `/research` instead | Functionality unchanged, just improved |
| `/synthesize` | **DEPRECATED** | Still works (for now) | Migrate to `/research --type=user` |
| `/evidence` | **DEPRECATED** | Still works (for now) | Migrate to `/research --type=evidence` |

### Phase-Out Plan

**Phase 1 (Current)**: All commands available
- `/research` (new unified version)
- `/synthesize` (deprecated, shows warning)
- `/evidence` (deprecated, shows warning)

**Phase 2 (TBD)**: Deprecated commands show migration reminder
- Deprecated commands still function
- Display: "⚠️ This command is deprecated. Use `/research --type=user` instead."

**Phase 3 (TBD)**: Deprecated commands removed
- Only `/research` available
- Legacy commands show: "❌ Command removed. Use `/research` instead. See MIGRATION_GUIDE_RESEARCH_UNIFICATION.md"

---

## Technical Changes for Framework Maintainers

### New Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `.claude/workflows/research-core.md` | Base research workflow (all types extend this) | ~1,200 |
| `.claude/agents/research-agent.md` | Unified research agent | ~850 |
| `.claude/commands/research-unified.md` | Unified research command | ~950 |

### Files To Be Deprecated

| File | Replacement | Status |
|------|-------------|--------|
| `.claude/commands/research.md` | `research-unified.md` | Deprecated |
| `.claude/commands/synthesize.md` | `research-unified.md` (user mode) | Deprecated |
| `.claude/commands/evidence.md` | `research-unified.md` (evidence mode) | Deprecated |
| `.claude/agents/research-synthesizer.md` | `research-agent.md` | Deprecated |
| `.claude/agents/user-researcher.md` | `research-agent.md` | Deprecated |

**Note**: Old workflow files can remain for reference, but should reference the new core workflow.

### Architecture Changes

**Before**:
```
/research     → research-synthesis.md       → research-synthesizer.md
/synthesize   → user-research-synthesis.md  → user-researcher.md
/evidence     → evidence-based-decision.md  → research-synthesizer.md
```

**After**:
```
/research → research-core.md → research-agent.md
    ├─ type=multi-source → Multi-source extensions
    ├─ type=user         → User research extensions
    ├─ type=evidence     → Evidence assessment extensions
    └─ type=analytics    → Analytics extensions (new)
```

---

## Code Examples

### Before (Old System)

```markdown
# Multiple commands for different research types
/research "Market analysis for new feature"
/synthesize "User interview findings"
/evidence "Pricing hypothesis"
```

### After (New System)

```markdown
# One command, auto-detects type
/research "Market analysis for new feature"      # Auto: multi-source
/research "Synthesize user interview findings"    # Auto: user research
/research "Evaluate evidence for pricing hypothesis"  # Auto: evidence

# Or be explicit
/research "Market analysis" --type=multi-source
/research "User interviews" --type=user
/research "Pricing hypothesis" --type=evidence
/research "Funnel analysis" --type=analytics
```

---

## Testing Your Migration

### Verification Checklist

- [ ] Test multi-source research: `/research "Test multi-source research"`
- [ ] Test user research (implicit): `/research "Synthesize test user data"`
- [ ] Test user research (explicit): `/research "Test data" --type=user`
- [ ] Test evidence assessment (implicit): `/research "Evaluate evidence for test"`
- [ ] Test evidence assessment (explicit): `/research "Test" --type=evidence`
- [ ] Test analytics research: `/research "Test metrics" --type=analytics`
- [ ] Verify outputs appear in correct directories
- [ ] Check that old `/synthesize` still works (with deprecation warning)
- [ ] Check that old `/evidence` still works (with deprecation warning)

### Expected Behavior

**Successful Migration**:
- ✅ `/research` works for all research types
- ✅ Auto-detection selects correct research type
- ✅ Outputs saved to appropriate locations
- ✅ Research reports follow consistent structure
- ✅ Old commands still work (deprecated but functional)

**Migration Issues**:
- ❌ Auto-detection picks wrong type → Use explicit `--type` parameter
- ❌ Old workflows referenced → Update references to `research-core.md`
- ❌ Old agents called → Update to use `research-agent.md`

---

## FAQs

### Q: Do I have to change my existing workflows?

**A**: No immediate changes required. The new `/research` command is backward-compatible. Existing uses of `/research` will work identically. If you were using `/synthesize` or `/evidence`, they still work but will show deprecation warnings.

### Q: What if auto-detection picks the wrong research type?

**A**: Use the explicit `--type` parameter:
```bash
/research "Your topic" --type=multi-source
/research "Your topic" --type=user
/research "Your topic" --type=evidence
/research "Your topic" --type=analytics
```

### Q: Will my old research reports still be accessible?

**A**: Yes! All existing research reports remain in their original locations. The new system uses the same output directories.

### Q: Can I still use `/synthesize` and `/evidence`?

**A**: Yes, for now. They're deprecated but still functional. However, we recommend migrating to `/research` to benefit from improvements and future enhancements.

### Q: What's the timeline for removing old commands?

**A**: TBD. We'll provide ample notice (at least 1-2 release cycles) before removing deprecated commands. Migration warnings will appear when using deprecated commands.

### Q: How do I report issues with the new system?

**A**: File an issue in the repository with:
- What you were trying to do
- Which research type (multi-source, user, evidence, analytics)
- Unexpected behavior
- Error messages (if any)

---

## Rollback Plan (If Needed)

If you encounter issues with the new unified system:

### Temporary Workaround

1. Continue using old commands (`/synthesize`, `/evidence`)
2. Report issues via GitHub
3. Wait for fixes in next release

### Full Rollback (Emergency Only)

If critical issues arise:

1. **Backup new files**:
   ```bash
   mv .claude/workflows/research-core.md .claude/workflows/research-core.md.backup
   mv .claude/agents/research-agent.md .claude/agents/research-agent.md.backup
   mv .claude/commands/research-unified.md .claude/commands/research-unified.md.backup
   ```

2. **Restore old commands** (if removed):
   ```bash
   git checkout HEAD~1 .claude/commands/research.md
   git checkout HEAD~1 .claude/commands/synthesize.md
   git checkout HEAD~1 .claude/commands/evidence.md
   ```

3. **Report issue** with details for investigation

---

## Benefits Summary

### For Product Managers (Users)

✅ **Simpler**: One command to remember instead of three
✅ **Smarter**: Auto-detects research type from your query
✅ **Consistent**: Same methodology across all research types
✅ **More Powerful**: New analytics research capabilities
✅ **Better Docs**: Clearer usage examples and guidelines

### For Maintainers (Developers)

✅ **Less Code**: 30-40% reduction in research codebase
✅ **DRY Principle**: Single source of truth for methodology
✅ **Easier Maintenance**: Update one workflow, not three
✅ **Better Architecture**: Clean separation of core and extensions
✅ **Extensible**: Easy to add new research types

### For the Project

✅ **Reduced Complexity**: Fewer files, clearer structure
✅ **Lower Technical Debt**: Eliminated major duplicate cluster
✅ **Better UX**: Less confusion about which command to use
✅ **Future-Proof**: Foundation for additional research capabilities

---

## Additional Resources

- **Audit Report**: `CODEBASE_DUPLICATE_AUDIT_REPORT.md` - Detailed duplicate analysis
- **Core Workflow**: `.claude/workflows/research-core.md` - Base research methodology
- **Research Agent**: `.claude/agents/research-agent.md` - Unified agent capabilities
- **Unified Command**: `.claude/commands/research-unified.md` - Command documentation
- **CLAUDE.md**: Updated project documentation

---

## Getting Help

**Questions?** Check:
1. This migration guide
2. `CODEBASE_DUPLICATE_AUDIT_REPORT.md` for rationale
3. `.claude/commands/research-unified.md` for usage examples
4. File an issue on GitHub

**Found a bug?** Report it with:
- Research type you were using
- Input you provided
- Expected vs. actual behavior
- Error messages

---

## Acknowledgments

This consolidation eliminates ~2,500 lines of duplicate code while preserving and enhancing all research capabilities. The new system is more powerful, easier to use, and simpler to maintain.

Thank you for adopting the unified research framework!

---

**END OF MIGRATION GUIDE**

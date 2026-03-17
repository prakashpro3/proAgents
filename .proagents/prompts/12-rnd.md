# Phase 12: Research & Development (R&D)

Interactive R&D workflow with comparison tables, POC generation, and research documentation.

---

## Trigger

User runs `pa:rnd`, `pa:research`, or any variant:
- `pa:rnd-compare` - Direct to comparison mode
- `pa:rnd-poc` - Direct to prototype mode
- `pa:rnd-explore` - Direct to exploration mode
- `pa:rnd --quick` - Quick 5-minute research
- `pa:rnd --resume` - Resume interrupted session
- `pa:rnd --clear` - Clear saved progress

---

## Purpose

This command helps with research and development decisions:
- **Compare Options** - Side-by-side library/framework/tool comparison
- **Build Prototype** - Quick proof-of-concept in isolated folder
- **Explore Solutions** - Research and document findings
- **Full R&D Cycle** - Research → Prototype → Document

---

## Entry Point

```
🔬 R&D Workflow

What would you like to do?

1. 🔍 Compare Options - Compare libraries, frameworks, or tools
2. 🧪 Build Prototype - Create a proof-of-concept
3. 📚 Explore Solutions - Research and document findings
4. 🔄 Full R&D Cycle - Research → Prototype → Document
5. ⚡ Quick Research - Fast 5-minute answer
6. 📋 Resume Previous - Continue interrupted session

Select (1-6):
```

---

## Option 1: Compare Options

### Step 1: Research Subject

```
🔍 What are you comparing?

1. Libraries (npm, pip, cargo packages)
2. Frameworks (React vs Vue, Django vs FastAPI)
3. Tools (build tools, test runners, linters)
4. Services (cloud providers, APIs, SaaS)
5. Approaches (architecture patterns, design patterns)
6. Other (describe)

Select or describe:
```

### Step 2: Define Comparison

```
What specifically are you comparing?

Example: "State management libraries for React"
Example: "Authentication solutions for mobile apps"

Your comparison topic: _______________
```

### Step 3: Check Past Decisions

Before proceeding, search for relevant history:

```
📚 Checking past decisions...

┌─────────────────────────────────────────────────────────┐
│ 2023-08: State Management Research                      │
│ Decision: Redux                                         │
│ Outcome: Switched to Zustand after 3 months             │
│ Reason: "Too much boilerplate, slowed development"      │
└─────────────────────────────────────────────────────────┘

⚠️ You researched this topic before.
   Previous experience may be relevant.

Factor this into your current decision? (yes/no)
```

### Step 4: Gather Context

```
Help me understand your requirements:

1. What's the use case/problem?
   > _______________

2. What are your constraints?
   [ ] Budget (free/paid acceptable)
   [ ] Team experience (specify tech familiarity)
   [ ] Timeline (MVP vs production)
   [ ] Scale (users, data volume)
   [ ] Integration (existing tech stack)

3. Any specific options you want compared?
   > _______________ (or "suggest options")
```

### Step 5: Weight Criteria

```
Rate importance (1-5) for your decision:

- Performance:     [___]
- Learning Curve:  [___]
- Cost:            [___]
- Community:       [___]
- Documentation:   [___]
- Type Safety:     [___]
- Bundle Size:     [___]
- Maintenance:     [___]

(Enter numbers 1-5 for each, or "skip" for equal weights)
```

### Step 6: Web Search & Data Gathering

AI uses web search to gather current data:
- GitHub stars and recent activity
- npm/pip download counts
- Latest release date
- Known security issues
- Deprecation status

### Step 7: Check Deprecation

```
⚠️ DEPRECATION WARNING

Package: moment.js
Status: In maintenance mode (no new features)
Recommendation: Consider dayjs or date-fns instead
Security: No known vulnerabilities

Continue with moment.js anyway? (yes/no/compare alternatives)
```

### Step 8: Generate Comparison

```
📊 Comparison: [Topic]

Based on your requirements, here are the top options:

┌─────────────────┬────────────────────┬────────────────────┬────────────────────┐
│                 │ OPTION 1 ⭐        │ OPTION 2           │ OPTION 3           │
│                 │ [Name]             │ [Name]             │ [Name]             │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Best for        │ [Use case]         │ [Use case]         │ [Use case]         │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Learning curve  │ ⬤⬤○○○ Easy        │ ⬤⬤⬤○○ Medium     │ ⬤⬤⬤⬤○ Steep      │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Performance     │ ⬤⬤⬤⬤⬤ Excellent  │ ⬤⬤⬤⬤○ Good       │ ⬤⬤⬤○○ Moderate   │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Bundle size     │ [X]kb              │ [X]kb              │ [X]kb              │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ GitHub stars    │ [X]k               │ [X]k               │ [X]k               │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Last release    │ [date]             │ [date]             │ [date]             │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ TypeScript      │ ✅ Native          │ ⚠️ @types          │ ✅ Native          │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Monthly cost    │ $[X]-[Y]           │ $[X]-[Y]           │ $[X]-[Y]           │
│ (at 1K users)   │                    │                    │                    │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ [Criterion 1]   │ ✅/⚠️/❌           │ ✅/⚠️/❌           │ ✅/⚠️/❌           │
└─────────────────┴────────────────────┴────────────────────┴────────────────────┘

Legend: ✅ Excellent  ⚠️ Acceptable  ❌ Poor/Missing

────────────────────────────────────
WEIGHTED SCORES (based on your priorities)
────────────────────────────────────

┌────────────┬───────┬────────┬───────┬───────┬─────────┐
│ Option     │ Perf  │ Learn  │ Cost  │ Comm  │ TOTAL   │
│            │ (×4)  │ (×3)   │ (×5)  │ (×2)  │         │
├────────────┼───────┼────────┼───────┼───────┼─────────┤
│ [Option 1] │ 16    │ 15     │ 25    │ 8     │ 64 ⭐   │
│ [Option 2] │ 16    │ 12     │ 25    │ 6     │ 59      │
│ [Option 3] │ 12    │ 6      │ 25    │ 10    │ 53      │
└────────────┴───────┴────────┴───────┴───────┴─────────┘

💡 RECOMMENDATION: [Option X]

Why? [Detailed reasoning based on user's specific requirements]

────────────────────────────────────
DETAILED ANALYSIS
────────────────────────────────────

### Option 1: [Name] ⭐ Recommended

**Pros:**
- [Pro 1]
- [Pro 2]
- [Pro 3]

**Cons:**
- [Con 1]
- [Con 2]

**When to choose:** [Scenario description]

**Migration path (if replacing existing):**
- Effort: [Low/Medium/High]
- Time estimate: [X days/weeks]
- Risk: [Low/Medium/High]

### Option 2: [Name]
[Same structure]

### Option 3: [Name]
[Same structure]

────────────────────────────────────

What next?
1. Save this comparison to docs
2. Build a prototype with [Recommended]
3. Compare more options
4. Ask follow-up questions

Select (1-4):
```

---

## Option 2: Build Prototype (POC)

### Step 1: POC Type

```
🧪 What kind of prototype?

1. Integration Test - Test a library/API works as expected
2. Feasibility Check - Verify approach is technically possible
3. Performance Test - Benchmark different approaches
4. UI Prototype - Quick visual mockup
5. Architecture Spike - Test system design
6. Custom (describe)

Select (1-6):
```

### Step 2: POC Scope

```
Define your prototype:

What are you testing?
> _______________

Success criteria (how do we know it works)?
> _______________

Time budget?
1. 15 minutes - Quick validation
2. 1 hour - Basic implementation
3. 2-4 hours - Comprehensive test
4. Custom: ___

Select:
```

### Step 3: POC Implementation

AI creates the prototype:

```
🧪 Building Prototype: [Name]

Creating in: ./poc/[name]/

Files:
✓ poc/[name]/README.md - POC documentation
✓ poc/[name]/index.ts - Main implementation
✓ poc/[name]/test.ts - Test/validation
✓ poc/[name]/package.json - Dependencies

Installing dependencies...
✓ [package1] installed
✓ [package2] installed

Running validation...
[Output of test run]

════════════════════════════════════
POC RESULTS
════════════════════════════════════

Status: ✅ SUCCESS / ⚠️ PARTIAL / ❌ FAILED

Findings:
- [Finding 1]
- [Finding 2]

Performance:
- [Metric 1]: [Value]
- [Metric 2]: [Value]

Recommendation:
[Based on POC results, recommended next steps]

────────────────────────────────────

What next?
1. Save findings to research docs
2. Iterate on prototype
3. Compare with alternative
4. Move to implementation

Select (1-4):
```

---

## Option 3: Explore Solutions

### Step 1: Research Topic

```
📚 What are you researching?

Topic: _______________

Research type:
1. Best practices - How to do X properly
2. Trade-offs - Understanding options for X
3. Deep dive - Comprehensive understanding of X
4. Problem solving - Find solution for specific issue
5. Custom

Select:
```

### Step 2: Research Scope

```
Research parameters:

Focus areas (select all that apply):
[ ] Official documentation
[ ] Community patterns
[ ] Performance considerations
[ ] Security implications
[ ] Real-world examples
[ ] Common pitfalls
[ ] Migration paths
[ ] Alternatives

Output format:
1. Summary - Quick reference (1-2 pages)
2. Detailed - Comprehensive guide (5+ pages)
3. ADR - Architecture Decision Record format

Select:
```

### Step 3: Research Output

AI generates research document:

```
📚 Research Complete: [Topic]

Created: docs/research/findings/[topic]-[date].md

Document structure:
├── Overview
├── Key Findings
├── Recommendations
├── Trade-offs Analysis
├── Implementation Notes
├── References
└── Next Steps

Preview:
────────────────────────────────────
# Research: [Topic]

## Overview
[Summary of research topic]

## Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

## Recommendation
[Primary recommendation with reasoning]
────────────────────────────────────

What next?
1. View full document
2. Create ADR from findings
3. Build prototype based on findings
4. Share with team

Select (1-4):
```

---

## Option 4: Full R&D Cycle

Combines all three phases sequentially:
1. Research/Compare options
2. Build POC with recommended option
3. Document findings

AI guides through each phase automatically.

---

## Option 5: Quick Research

```
⚡ Quick Research Mode

What's your question?
> _______________

[AI searches web and provides concise answer]

────────────────────────────────────
ANSWER

[Concise answer with key points]

Sources:
- [Source 1](url)
- [Source 2](url)

────────────────────────────────────

Save to bookmarks? (yes/no)
```

---

## Option 6: Resume Previous

```
📋 Previous R&D session found!

Session: [Topic]
Started: [Time ago]
Progress: ████████░░░░ 60% ([X]/[Y] steps)
Phase: [Current phase]

What you've done:
- Compared: [Options]
- Recommended: [Option]
- POC: [Status]

Options:
1. Resume from where you left off
2. Start fresh (discard progress)
3. View session details

Select (1-3):
```

---

## Scope Guard

Track original research question and alert on drift:

```
⚠️ Scope Alert

Original question: "Which state management library?"
You're now researching: "database options"

This seems off-topic. Options:
1. Continue (it's related)
2. Save for later research
3. Go back to original topic

Select (1-3):
```

---

## Output Files

### Output Locations

| Type | Location |
|------|----------|
| Comparisons | `docs/research/comparisons/` |
| Research findings | `docs/research/findings/` |
| Research index | `docs/research/INDEX.md` |
| Bookmarks | `docs/research/BOOKMARKS.md` |
| Archive | `docs/research/archive/` |
| POC code | `./poc/[name]/` |
| Progress file | `.proagents/rnd-progress.json` |

### Comparison Document Template

File: `docs/research/comparisons/[topic]-[date].md`

```markdown
---
tags: [tag1, tag2, tag3]
category: Comparison
date: [DATE]
status: active
review_date: [DATE + 6 months]
---

# Comparison: [Topic]

> Generated by ProAgents `pa:rnd-compare`
> Date: [DATE]

## Context

**Use Case:** [What problem are we solving?]
**Constraints:** [Budget, team skills, timeline, etc.]

## Options Compared

### Summary Matrix

| Criteria | [Option 1] | [Option 2] | [Option 3] |
|----------|------------|------------|------------|
| Overall Score | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| [Criterion 1] | ✅ | ⚠️ | ❌ |

### Weighted Scores

[Weighted scoring table]

### Detailed Analysis

[Per-option analysis with pros/cons]

## Recommendation

**Winner:** [Option Name]
**Reasoning:** [Why]

## Related Research

- [Link to related research]

## Review Reminder

This decision should be reviewed by: [DATE]
```

### Research Findings Template

File: `docs/research/findings/[topic]-[date].md`

```markdown
---
tags: [tag1, tag2, tag3]
category: Findings
date: [DATE]
status: active
review_date: [DATE + 6 months]
---

# Research: [Topic]

> Generated by ProAgents `pa:rnd-explore`
> Date: [DATE]

## Overview

**Research Question:** [What are we trying to answer?]
**Context:** [Why is this research needed?]

## Key Findings

### Finding 1: [Title]
[Detailed explanation]

### Finding 2: [Title]
[Detailed explanation]

## Recommendation

**Primary:** [Recommended approach]
**Reasoning:** [Why]
**Confidence:** [High/Medium/Low]

## Implementation Notes

[Practical notes]

## References

- [Reference 1](url)
- [Reference 2](url)

## Related Research

- [Link to related research]

## Next Steps

- [ ] [Action 1]
- [ ] [Action 2]
```

### Research Index Template

File: `docs/research/INDEX.md`

```markdown
# Research Index

> Auto-maintained by ProAgents `pa:rnd`

## Comparisons

| Date | Topic | Decision | Tags | Link |
|------|-------|----------|------|------|
| [DATE] | [Topic] | [Decision] | #tag1 #tag2 | [View](comparisons/[file].md) |

## Findings

| Date | Topic | Tags | Link |
|------|-------|------|------|
| [DATE] | [Topic] | #tag1 #tag2 | [View](findings/[file].md) |

## By Tag

- #state-management (3 docs)
- #react (5 docs)
- #authentication (2 docs)

## Bookmarks

[View saved bookmarks](BOOKMARKS.md)

## Archive

[View archived research](archive/)
```

### Bookmarks Template

File: `docs/research/BOOKMARKS.md`

```markdown
# Research Bookmarks

> Useful links saved during research

## [Category 1]

- [Title](url) - Added [DATE]
- [Title](url) - Added [DATE]

## [Category 2]

- [Title](url) - Added [DATE]
```

### POC README Template

File: `./poc/[name]/README.md`

```markdown
# POC: [Name]

> Generated by ProAgents `pa:rnd-poc`
> Date: [DATE]

## Objective

**Testing:** [What we're validating]
**Success Criteria:** [How we know it works]

## Setup

\`\`\`bash
cd poc/[name]
npm install
npm test
\`\`\`

## Results

### Status: ✅ SUCCESS / ⚠️ PARTIAL / ❌ FAILED

### Metrics

| Metric | Expected | Actual | Pass/Fail |
|--------|----------|--------|-----------|
| [Metric] | [Expected] | [Actual] | ✅/❌ |

## Findings

[Key learnings]

## Recommendation

[Next steps based on POC results]

## Cleanup

\`\`\`bash
rm -rf poc/[name]
\`\`\`
```

---

## Progress File

Save to: `.proagents/rnd-progress.json`

```json
{
  "session_id": "rnd-2024-01-15-001",
  "started_at": "2024-01-15T10:30:00Z",
  "last_updated": "2024-01-15T10:45:00Z",
  "original_question": "Which state management library?",
  "type": "compare",
  "status": "in_progress",
  "topic": "State management libraries for React",
  "phase": "comparing",
  "completed_steps": 3,
  "total_steps": 7,
  "answers": {
    "research_type": "libraries",
    "constraints": {
      "budget": "free",
      "team_experience": "react"
    },
    "criteria_weights": {
      "performance": 4,
      "learning_curve": 3,
      "cost": 5
    }
  },
  "findings": {
    "options_considered": ["zustand", "jotai", "redux-toolkit"],
    "recommendation": "zustand"
  },
  "past_decisions_checked": true,
  "deprecation_checked": true
}
```

---

## Archive System

Auto-archive old research after 6 months:

```
📦 Archive Notice

The following research is over 6 months old:
- state-management-2023-06-15.md
- auth-comparison-2023-05-20.md

Options:
1. Archive now (move to docs/research/archive/)
2. Mark as still relevant (reset timer)
3. Delete (no longer needed)
4. Skip for now

Select (1-4):
```

When archived:
- Move file to `docs/research/archive/[year]/`
- Update INDEX.md
- Keep reference for past decision recall

---

## Review Reminders

After important decisions:

```
⏰ Set Review Reminder?

This decision may need revisiting as technology evolves.

1. Review in 3 months
2. Review in 6 months (recommended)
3. Review in 12 months
4. No reminder

Select (1-4):

→ Added to backlog: "Review state-management decision" (due: 2024-07-15)
```

---

## Export Options

After research completion:

```
📤 Export Research?

1. Keep as Markdown only
2. Generate PDF summary
3. Generate HTML (shareable link)
4. All formats

Select (1-4):
```

---

## Next Phase Options

After RND completion:

```
✅ Research Complete!

📄 Saved to: docs/research/comparisons/state-management-2024-01-15.md
📑 Updated: docs/research/INDEX.md
🔖 Added [X] bookmarks

What's next?

1. 🚀 Start feature with chosen tech → pa:feature "[name]"
2. 📋 Create implementation plan → pa:plan
3. 📝 Create ADR (decision record)
4. 📌 Add to backlog for later
5. 🔖 Save more bookmarks
6. ✓ Done for now

Select (1-6):
```

If user selects 1, trigger `pa:feature` with context from research.
If user selects 2, trigger `pa:plan` with context from research.

---

## AI Behavior Rules

1. **Execute, don't instruct** - Run comparisons, build POCs, don't tell user to do it
2. **Use web search** - Verify current package data (stars, downloads, last release)
3. **Ask ONE question at a time** - Unless user prefers batch
4. **Show recommendations with ⭐** - Always highlight recommended option
5. **Explain WHY** - Always explain reasoning behind recommendations
6. **Use comparison tables** - Visual comparisons for 2+ options
7. **Include costs** - When comparing services/tools, include pricing
8. **Consider migration** - When replacing existing tech, include migration path
9. **Save progress automatically** - Resume support like pa:project-setup
10. **Update INDEX.md** - After every research document
11. **Offer bookmarks** - For useful links found during research
12. **Offer next phase** - After completion, trigger pa:feature or pa:plan
13. **Merge existing docs** - Don't overwrite previous research
14. **Add tags** - To every research document for organization
15. **Link related research** - When topics overlap
16. **Calculate weighted scores** - Based on user's priority criteria
17. **Check deprecation** - Warn about deprecated/insecure packages
18. **Offer review reminder** - For important decisions
19. **Archive old research** - Move to archive after 6 months
20. **Guard scope** - Alert if research drifts off-topic
21. **Recall past decisions** - Search history for similar topics
22. **Log all actions** - To activity.log

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pa:rnd` | Full interactive R&D workflow |
| `pa:research` | Alias for pa:rnd |
| `pa:rnd-compare` | Direct to comparison mode |
| `pa:rnd-poc` | Direct to prototype mode |
| `pa:rnd-explore` | Direct to exploration mode |
| `pa:rnd --quick` | Quick 5-minute research |
| `pa:rnd --resume` | Resume interrupted session |
| `pa:rnd --clear` | Clear saved progress |

---

## Logging

After completion, log to `.proagents/activity.log`:

```
[DATE TIME] [AI:model] [pa:rnd] Started R&D session: [topic]
[DATE TIME] [AI:model] [pa:rnd] Mode: compare
[DATE TIME] [AI:model] [pa:rnd] Options compared: [option1], [option2], [option3]
[DATE TIME] [AI:model] [pa:rnd] Recommendation: [option]
[DATE TIME] [AI:model] [pa:rnd] Created: docs/research/comparisons/[file].md
[DATE TIME] [AI:model] [pa:rnd] Updated: docs/research/INDEX.md
[DATE TIME] [AI:model] [pa:rnd] R&D session complete
```

Update `.proagents/worklog/_context.md`:

```markdown
## Quick Summary
Last: [AI] ran R&D workflow
Topic: [research topic]
Decision: [recommendation]
Output: docs/research/comparisons/[file].md
```

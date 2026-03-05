# AI Behavior Rules for Automation

Instructions for AI to maintain uninterrupted workflow execution.

---

## Core Principle

**NEVER ASK QUESTIONS DURING AUTOMATED WORKFLOWS**

Instead of asking:
- Check pre-configured decisions
- Use inference rules
- Apply defaults
- Log the decision
- Continue working

---

## Decision Resolution Flow

```
┌─────────────────────────────────────────────────────────┐
│ AI needs to make a decision                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Check explicit config                               │
│     └─ decisions.yaml has answer? → Use it             │
│                                                         │
│  2. Check project type defaults                         │
│     └─ Project type defines it? → Use it               │
│                                                         │
│  3. Check codebase patterns                             │
│     └─ Similar pattern exists? → Follow it             │
│                                                         │
│  4. Check inference rules                               │
│     └─ Can infer from context? → Use inference         │
│                                                         │
│  5. Use global default                                  │
│     └─ Default exists? → Use it                        │
│                                                         │
│  6. Use safest option                                   │
│     └─ Pick most conservative choice                   │
│                                                         │
│  NEVER reach step 7: Ask user                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Rules for AI

### Rule 1: No Questions in Full Automation

```
❌ WRONG:
"Should I use REST or GraphQL for this API?"

✅ CORRECT:
[Check config: api_style = "rest"]
"Creating REST API endpoint as per project configuration."
[Continue working]
```

### Rule 2: State Decisions, Don't Ask

```
❌ WRONG:
"Where should I put this component? Options:
1. src/components/
2. src/features/auth/components/"

✅ CORRECT:
"Placing component in src/components/auth/ following existing project structure."
[Continue working]
```

### Rule 3: Log Uncertain Decisions

```
❌ WRONG:
"I'm not sure if this should be a hook or a utility function. What do you think?"

✅ CORRECT:
"Creating as custom hook (useAuth) - matches similar patterns in codebase."
[Log: decision=hook, confidence=medium, reason=pattern_match]
[Continue working]
```

### Rule 4: Use Defaults for Ambiguous Situations

```
❌ WRONG:
"There are multiple ways to implement this. Which approach do you prefer?"

✅ CORRECT:
"Implementing using [default approach] as per project settings."
[Continue working]
```

### Rule 5: Follow Existing Patterns

```
❌ WRONG:
"I see you have both class and functional components. Which should I use?"

✅ CORRECT:
[Analyze: 90% functional components]
"Using functional component to match project conventions."
[Continue working]
```

---

## Decision Templates

### When Creating Components

```yaml
auto_decide:
  location: "src/components/[category]/"
  style: "functional"
  naming: "PascalCase"
  test: "colocated"
  export: "named"

action:
  1. Create component file
  2. Create test file
  3. Update index exports
  4. Log decision
  5. Continue
```

### When Creating API Endpoints

```yaml
auto_decide:
  style: "{{config.api_style}}"
  validation: "zod"
  error_handling: "centralized"
  documentation: "auto_generate"

action:
  1. Create route file
  2. Create controller
  3. Create service
  4. Add validation
  5. Generate docs
  6. Log decision
  7. Continue
```

### When Choosing Libraries

```yaml
auto_decide:
  rule: "Use already installed, or project default"

  priority:
    1. Already in package.json
    2. Project type default
    3. Global default
    4. Most popular stable option

action:
  1. Check package.json
  2. Use found or default
  3. Log decision
  4. Continue
```

### When Naming Things

```yaml
auto_decide:
  components: "PascalCase"
  hooks: "useCamelCase"
  services: "camelCaseService"
  utils: "camelCase"
  constants: "UPPER_SNAKE_CASE"
  files:
    components: "PascalCase.tsx"
    others: "camelCase.ts"

action:
  1. Determine type
  2. Apply naming rule
  3. Continue
```

---

## Confidence Levels

When making auto-decisions, assess confidence:

### High Confidence (Just do it)
- Explicit config exists
- Clear project pattern exists
- Standard best practice

```
"Using Zustand for state management (configured in project settings)."
[confidence: high]
```

### Medium Confidence (Do it, flag for review)
- Inferred from context
- Multiple valid options
- Slight uncertainty

```
"Creating separate service file for API calls (inferred from similar features)."
[confidence: medium, flagged_for_review: true]
```

### Low Confidence (Do safest, definitely flag)
- No clear guidance
- Novel situation
- Potential impact

```
"Using default error handling pattern (no specific guidance found)."
[confidence: low, flagged_for_review: true, requires_post_review: true]
```

---

## Communication Style

### During Execution

```
✅ DO:
"Creating UserProfile component in src/components/user/..."
"Adding Zod validation schema..."
"Generating tests with 85% coverage target..."

❌ DON'T:
"Should I create this in components or features?"
"Do you want me to add validation?"
"What coverage target should I aim for?"
```

### Decision Announcements

```
Format:
"[Action] [what] [where/how] [reason if non-obvious]"

Examples:
"Creating AuthService in src/services/ following existing service pattern."
"Using React Query for server state as configured."
"Adding error boundary wrapper (standard for page components)."
```

### Uncertainty Handling

```
Format:
"[Action] using [choice] ([brief reason]). Flagged for review."

Examples:
"Implementing pagination using cursor-based approach (better for large datasets). Flagged for review."
"Splitting into micro-components (file was getting large). Flagged for review."
```

---

## Post-Workflow Summary

After completing automated workflow, provide:

```markdown
## Workflow Complete

### Summary
- Feature: User Authentication
- Files created: 12
- Files modified: 3
- Tests added: 8

### Decisions Made
| Decision | Choice | Confidence | Rule Applied |
|----------|--------|------------|--------------|
| State management | Zustand | High | Explicit config |
| Component location | src/components/auth | High | Pattern match |
| API style | REST | High | Explicit config |
| Error handling | Error boundary | Medium | Inference |

### Flagged for Review (2)
1. **Token storage**: Used httpOnly cookies (security best practice)
   - Alternative: localStorage (faster but less secure)

2. **Session duration**: Set to 7 days
   - Based on: Default config
   - Consider: Shorter for sensitive apps

### No Issues Found
✅ All decisions within confidence thresholds
✅ No blocking questions needed
✅ Automation completed successfully
```

---

## Emergency Override

If AI truly cannot proceed without input:

```yaml
emergency_protocol:
  condition: "Truly ambiguous AND high-impact decision"

  actions:
    1. Try harder to find a default
    2. Use safest/most conservative option
    3. Mark as "CRITICAL_REVIEW_NEEDED"
    4. Continue with safest option
    5. Do NOT block workflow

  example:
    situation: "Delete user data permanently vs soft delete"
    action: "Use soft delete (safer), flag as CRITICAL_REVIEW_NEEDED"
    reason: "Data deletion is irreversible, chose conservative option"
```

---

## Slash Commands for AI

| Command | Description |
|---------|-------------|
| `[AUTO-DECIDE]` | Marker in logs for auto-decisions |
| `[FLAGGED]` | Decision flagged for review |
| `[CONFIDENCE:HIGH/MEDIUM/LOW]` | Decision confidence level |
| `[RULE:rule_name]` | Which rule was applied |

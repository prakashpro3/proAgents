# Offline Operations

Available operations when working without AI connectivity.

---

## Operation Categories

### Fully Available Offline

| Operation | Description |
|-----------|-------------|
| Git Operations | Commit, branch, merge, push/pull |
| Testing | Run all tests locally |
| Linting | Code style validation |
| Building | Compile and bundle |
| Standards Check | Validate against project standards |
| Template Generation | Use cached templates |
| Documentation | Generate from templates |
| Changelog | Update changelog entries |

### Degraded Mode

| Operation | Online | Offline |
|-----------|--------|---------|
| Code Analysis | Full AI | Cached results |
| Code Review | AI-powered | Checklist-based |
| Documentation | AI-generated | Template-based |
| Suggestions | Real-time | Cached patterns |

### Unavailable Offline

| Operation | Reason |
|-----------|--------|
| New Code Generation | Requires AI |
| Complex Refactoring | Requires AI analysis |
| Natural Language Processing | Requires AI |
| Design Interpretation | Requires AI |
| Context-Aware Suggestions | Requires AI |

---

## Using Offline Operations

### Git Operations

```bash
# All git operations work offline
proagents feature start "new-feature"   # Creates branch
proagents commit                         # Commits changes

# Queue push for when online
proagents push --queue
```

### Testing

```bash
# Run tests normally
proagents test run

# Run with coverage
proagents test coverage

# Run specific tests
proagents test run --file auth.test.ts
```

### Standards Validation

```bash
# Validate against cached standards
proagents validate

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Standards Validation (Offline Mode)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Using cached standards from: 2 hours ago                   │
│                                                             │
│ ✓ Naming conventions: PASSED                               │
│ ✓ File structure: PASSED                                   │
│ ⚠ Code patterns: 2 warnings                                │
│   └── src/utils/format.ts:15 - Consider using helper       │
│   └── src/components/Card.tsx:42 - Missing memo            │
│                                                             │
│ Note: Full AI analysis available when online               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Template Generation

```bash
# Generate from cached templates
proagents generate component UserProfile

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Template Generation (Offline Mode)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Using cached template: component.tsx                        │
│                                                             │
│ Generated files:                                            │
│ ├── src/components/UserProfile/index.tsx                   │
│ ├── src/components/UserProfile/UserProfile.tsx             │
│ ├── src/components/UserProfile/UserProfile.test.tsx        │
│ └── src/components/UserProfile/UserProfile.module.css      │
│                                                             │
│ Note: AI customization available when online               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Degraded Mode Operations

### Code Review (Offline)

```bash
proagents review

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Code Review (Offline Mode - Checklist)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Automated Checks:                                           │
│ ✓ Linting passed                                           │
│ ✓ Type checking passed                                     │
│ ✓ Tests passing                                            │
│ ✓ No security issues detected                              │
│                                                             │
│ Manual Review Checklist:                                    │
│ ☐ Code follows project conventions                         │
│ ☐ Error handling is comprehensive                          │
│ ☐ Edge cases are handled                                   │
│ ☐ Documentation is complete                                │
│ ☐ No hardcoded values                                      │
│                                                             │
│ AI-powered review available when online                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Documentation (Offline)

```bash
proagents docs generate

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Documentation (Offline Mode)                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Using template-based documentation                         │
│                                                             │
│ Generated:                                                  │
│ ├── docs/api/UserService.md (from JSDoc)                  │
│ ├── docs/components/UserProfile.md (from template)        │
│ └── docs/README.md (updated)                              │
│                                                             │
│ Queued for AI enhancement when online:                     │
│ • Add usage examples                                       │
│ • Generate architecture diagram                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Analysis (Offline)

```bash
proagents analyze

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Codebase Analysis (Offline Mode)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Using cached analysis from: 2 hours ago                    │
│                                                             │
│ Structure:                                                  │
│ ├── Components: 45 files                                   │
│ ├── Services: 12 files                                     │
│ ├── Utils: 23 files                                        │
│ └── Tests: 78 files                                        │
│                                                             │
│ Changes since cache:                                        │
│ ├── 3 files modified                                       │
│ └── 1 file added                                           │
│                                                             │
│ Note: Analysis may be outdated. Refresh when online.       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Offline Queue

### Queuing Operations

```yaml
offline:
  queue:
    enabled: true
    max_items: 100

    # What to queue
    queue_operations:
      - "ai_review"
      - "ai_documentation"
      - "ai_suggestions"
      - "sync_to_cloud"

    # Process when online
    auto_process: true
```

### Managing Queue

```bash
# View queued operations
proagents offline queue

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Offline Queue                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Queued Items: 5                                             │
│                                                             │
│ 1. AI Code Review - UserService.ts                         │
│    Queued: 30 min ago                                       │
│                                                             │
│ 2. Generate Documentation - AuthModule                      │
│    Queued: 1 hour ago                                       │
│                                                             │
│ 3. Push to remote - feature/user-auth                      │
│    Queued: 2 hours ago                                      │
│                                                             │
│ 4. Sync analysis to cloud                                   │
│    Queued: 2 hours ago                                      │
│                                                             │
│ 5. Request AI suggestions for performance                   │
│    Queued: 3 hours ago                                      │
│                                                             │
│ Items will process automatically when online               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

# Clear queue
proagents offline queue clear

# Remove specific item
proagents offline queue remove 3
```

---

## Offline Workflow Example

```bash
# 1. Check offline status
proagents offline status
# → Offline mode active, cache fresh

# 2. Start feature
proagents feature start "user-settings"
# → Branch created locally

# 3. Generate component from template
proagents generate component SettingsPanel
# → Component generated from cached template

# 4. Write code and tests manually
# (AI assistance unavailable)

# 5. Run tests
proagents test run
# → Tests run normally

# 6. Validate standards
proagents validate
# → Validates against cached standards

# 7. Commit changes
proagents commit -m "Add settings panel"
# → Committed locally

# 8. Queue for AI review when online
proagents review --queue
# → Added to offline queue

# 9. When back online
proagents offline sync
# → Processes queue, pushes changes, runs AI review
```

---

## Best Practices

1. **Prepare Before Going Offline**: Run `proagents offline prepare`
2. **Use Templates**: Leverage cached templates for consistency
3. **Queue AI Tasks**: Queue AI-dependent tasks for later
4. **Test Thoroughly**: Run full test suite since AI can't catch issues
5. **Document Changes**: Keep notes for AI review when online
6. **Sync Promptly**: Process queue soon after going online

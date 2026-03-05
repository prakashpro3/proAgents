# Coverage Requirements

Define and enforce test coverage thresholds.

---

## Coverage Metrics

### Types of Coverage

| Metric | Description | Target |
|--------|-------------|--------|
| **Statements** | Lines of code executed | 80% |
| **Branches** | Decision paths taken | 75% |
| **Functions** | Functions called | 80% |
| **Lines** | Source lines covered | 80% |

---

## Configuration

### Global Settings

```yaml
# proagents.config.yaml
testing:
  coverage:
    enabled: true

    # Global thresholds
    thresholds:
      statements: 80
      branches: 75
      functions: 80
      lines: 80

    # Fail build if below
    fail_under: true

    # Coverage tool
    tool: "istanbul"  # istanbul, c8, nyc
```

### Per-Directory Thresholds

```yaml
testing:
  coverage:
    by_directory:
      # Critical code needs higher coverage
      "src/core/":
        statements: 90
        branches: 85

      # UI can have lower thresholds
      "src/components/":
        statements: 70
        branches: 65

      # Utils should be well tested
      "src/utils/":
        statements: 95
        functions: 100
```

### Exclude From Coverage

```yaml
testing:
  coverage:
    exclude:
      - "**/*.test.ts"
      - "**/*.spec.ts"
      - "**/test/**"
      - "**/mocks/**"
      - "**/*.d.ts"
      - "**/index.ts"  # Re-export files
```

---

## Coverage by Feature Type

### New Features

| Phase | Requirement |
|-------|-------------|
| Implementation | 80% coverage for new code |
| PR Merge | No decrease in overall coverage |
| Release | Meet all thresholds |

### Bug Fixes

| Requirement |
|-------------|
| Add test that reproduces the bug |
| Test must fail before fix |
| Test must pass after fix |

### Refactoring

| Requirement |
|-------------|
| No decrease in coverage |
| All existing tests pass |
| Add tests for uncovered edge cases found |

---

## Coverage Reports

### Generate Report

```bash
# HTML report
proagents test --coverage --report html

# JSON for CI
proagents test --coverage --report json

# Summary only
proagents test --coverage --report summary
```

### Report Output

```
┌─────────────────────────────────────────────────────────────┐
│ Coverage Summary                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Overall: 83.5%                                              │
│ [████████████████░░░░] 83.5%                               │
│                                                             │
│ By Type:                                                    │
│ ├── Statements: 85.2% ✅                                    │
│ ├── Branches:   78.5% ✅                                    │
│ ├── Functions:  88.1% ✅                                    │
│ └── Lines:      84.8% ✅                                    │
│                                                             │
│ By Directory:                                               │
│ ├── src/core/     92.1% ✅ (target: 90%)                   │
│ ├── src/services/ 81.3% ✅ (target: 80%)                   │
│ ├── src/utils/    94.5% ✅ (target: 85%)                   │
│ └── src/ui/       71.2% ✅ (target: 70%)                   │
│                                                             │
│ Uncovered Files:                                            │
│ ├── src/services/legacy.ts (45%)                           │
│ └── src/utils/deprecated.ts (30%)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## CI Integration

### GitHub Actions

```yaml
- name: Run tests with coverage
  run: proagents test --coverage --ci

- name: Check coverage thresholds
  run: proagents test coverage-check

- name: Upload coverage report
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### Coverage Gates

```yaml
testing:
  coverage:
    ci:
      # Block PR if coverage drops
      block_on_decrease: true

      # Minimum for new code
      new_code_minimum: 80

      # Allow small decreases
      allowed_decrease: 1  # percent
```

---

## Best Practices

1. **Set Realistic Targets**: Start achievable, increase over time
2. **Focus on Critical Code**: Higher coverage for core logic
3. **Don't Chase 100%**: Diminishing returns after ~90%
4. **Track Trends**: Coverage should improve over time
5. **Review Uncovered Code**: Understand why it's not covered
6. **Quality Over Quantity**: Good tests > high numbers

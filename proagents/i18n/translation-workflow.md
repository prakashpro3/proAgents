# Translation Workflow

End-to-end process for managing translations in your development cycle.

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Translation Workflow                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Development           Translation          Deployment      │
│  ┌─────────┐          ┌─────────┐         ┌─────────┐     │
│  │  Code   │──────────│  TMS    │─────────│ Release │     │
│  └────┬────┘          └────┬────┘         └────┬────┘     │
│       │                    │                   │           │
│       ▼                    ▼                   ▼           │
│  1. Add strings       4. Translate        7. Deploy all   │
│  2. Extract          5. Review              languages     │
│  3. Push to TMS      6. Pull back                         │
│                                                             │
│  Automation:                                                │
│  • Auto-extract on commit                                  │
│  • Auto-sync to TMS                                        │
│  • Auto-pull translations                                  │
│  • CI validation                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Development Phase

### Adding New Strings

```typescript
// 1. Use translation function
import { t } from './i18n';

// 2. Add key with default value
const title = t('dashboard.welcome', 'Welcome back!');

// 3. For React components
<Trans i18nKey="dashboard.subtitle">
  Here's what's happening today
</Trans>

// 4. With placeholders
t('dashboard.greeting', 'Hello, {{name}}!', { name: userName });

// 5. With plurals
t('dashboard.items', {
  count: itemCount,
  one: 'You have 1 item',
  other: 'You have {{count}} items'
});
```

### Extract During Development

```bash
# After adding strings, extract them
proagents i18n extract

# Preview what will be extracted
proagents i18n extract --dry-run
```

---

## Translation Phase

### Send for Translation

```bash
# Push new strings to TMS
proagents i18n push

# Push specific namespace
proagents i18n push --namespace checkout

# Push and mark as ready for translation
proagents i18n push --ready
```

### Translation Options

```yaml
i18n:
  translation:
    # Machine translation for draft
    machine_translate:
      enabled: true
      provider: "deepl"  # google, deepl, azure
      as_draft: true     # Mark as draft, needs review

    # Translation memory
    translation_memory:
      enabled: true
      auto_apply: true
      match_threshold: 0.95

    # Glossary
    glossary:
      enabled: true
      file: "i18n/glossary.csv"
      enforce: true
```

### Pull Translations

```bash
# Pull all translations
proagents i18n pull

# Pull specific language
proagents i18n pull --lang es

# Pull only approved translations
proagents i18n pull --approved-only
```

---

## Review Phase

### Translation Review

```yaml
i18n:
  review:
    # Require review before merge
    required: true

    # Review workflow
    workflow:
      - stage: "translation"
        by: "translator"
      - stage: "review"
        by: "reviewer"
      - stage: "approve"
        by: "project_manager"

    # Auto-approve if:
    auto_approve:
      - condition: "translation_memory_match >= 100%"
      - condition: "machine_translated && reviewed"
```

### Quality Checks

```bash
# Run quality checks
proagents i18n validate

# Check specific language
proagents i18n validate --lang es
```

### Validation Rules

```yaml
i18n:
  validation:
    rules:
      # Placeholder consistency
      placeholders:
        enabled: true
        severity: "error"
        message: "Placeholder {{name}} missing in translation"

      # Length limits
      length:
        enabled: true
        max_expansion: 1.5  # Translation can be 50% longer
        severity: "warning"

      # Formatting
      formatting:
        enabled: true
        check: ["html_tags", "markdown", "line_breaks"]

      # Glossary terms
      glossary:
        enabled: true
        severity: "warning"

      # Plural forms
      plurals:
        enabled: true
        verify_forms: true
        severity: "error"
```

---

## Deployment Phase

### Pre-Release Checks

```bash
# Check translation coverage
proagents i18n coverage

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Translation Coverage                                        │
├─────────────────────────────────────────────────────────────┤
│ Total Keys: 450                                             │
├─────────────────────────────────────────────────────────────┤
│ English (source):  100% ✅ (450/450)                       │
│ Spanish:            98% ⚠️ (441/450) - 9 missing           │
│ French:             95% ⚠️ (428/450) - 22 missing          │
│ German:             92% ⚠️ (414/450) - 36 missing          │
│ Japanese:           88% ❌ (396/450) - 54 missing          │
│ Chinese:            85% ❌ (383/450) - 67 missing          │
├─────────────────────────────────────────────────────────────┤
│ Blocking: Japanese, Chinese (below 90% threshold)          │
│                                                             │
│ Run 'proagents i18n missing --lang ja' for details         │
└─────────────────────────────────────────────────────────────┘
```

### Release Configuration

```yaml
i18n:
  release:
    # Minimum coverage to release
    min_coverage:
      default: 90
      per_language:
        es: 95  # Spanish: stricter
        ja: 80  # Japanese: relaxed during rollout

    # Fallback behavior
    fallback:
      enabled: true
      chain: ["en"]  # Fall back to English

    # Block release if below threshold
    block_release:
      enabled: true
      severity: "error"
```

### Deploy Translations

```bash
# Build with translations
proagents i18n build

# Deploy specific languages
proagents i18n deploy --lang en,es,fr

# Staged rollout
proagents i18n deploy --canary 10%
```

---

## Continuous Integration

### CI Pipeline

```yaml
# .github/workflows/i18n.yml
name: i18n Validation

on:
  push:
    paths:
      - 'src/**'
      - 'src/locales/**'
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Extract strings
        run: proagents i18n extract --ci

      - name: Validate translations
        run: proagents i18n validate --ci

      - name: Check coverage
        run: proagents i18n coverage --min 90 --ci

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: i18n-report
          path: i18n-report.json
```

### Automated Sync

```yaml
i18n:
  automation:
    # Auto-extract on commit
    extract_on_commit:
      enabled: true
      branches: ["main", "develop"]

    # Auto-push to TMS
    push_on_merge:
      enabled: true
      branch: "main"

    # Auto-pull translations
    pull_schedule:
      enabled: true
      cron: "0 6 * * *"  # Daily at 6 AM
      create_pr: true

    # Auto-merge translated PRs
    auto_merge:
      enabled: false  # Manual review preferred
      conditions:
        - "all_checks_pass"
        - "coverage >= 95%"
```

---

## Notifications

### Translation Status Updates

```yaml
i18n:
  notifications:
    # New strings added
    on_new_strings:
      channels: ["slack:#translations"]
      include:
        - count
        - deadline_suggestion

    # Translation complete
    on_translation_complete:
      channels: ["slack:#releases"]
      per_language: true

    # Coverage drop
    on_coverage_drop:
      channels: ["slack:#translations"]
      threshold: 5  # Notify if drops by 5%

    # Validation errors
    on_validation_error:
      channels: ["slack:#dev-alerts"]
```

---

## Workflow Commands

```bash
# Full workflow
proagents i18n extract      # 1. Extract strings
proagents i18n push         # 2. Send to TMS
# ... translations happen ...
proagents i18n pull         # 3. Get translations
proagents i18n validate     # 4. Validate quality
proagents i18n coverage     # 5. Check coverage
proagents i18n build        # 6. Build for release

# Status check
proagents i18n status

# Output:
┌─────────────────────────────────────────────────────────────┐
│ i18n Status                                                 │
├─────────────────────────────────────────────────────────────┤
│ Source Language: English                                    │
│ Target Languages: 5                                         │
│ Total Keys: 450                                             │
├─────────────────────────────────────────────────────────────┤
│ Local Changes:                                              │
│ • 12 new keys (not pushed)                                 │
│ • 3 modified keys                                          │
│                                                             │
│ TMS Status:                                                 │
│ • Spanish: 5 strings in review                             │
│ • French: 12 strings pending translation                   │
│ • German: 8 strings ready to pull                          │
├─────────────────────────────────────────────────────────────┤
│ Actions:                                                    │
│ • Run 'proagents i18n push' to sync new keys              │
│ • Run 'proagents i18n pull' to get German translations    │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Extract Early**: Run extraction as part of development
2. **Push Regularly**: Don't batch too many strings
3. **Provide Context**: Help translators understand usage
4. **Review Translations**: Native speaker review is essential
5. **Automate Sync**: Use CI/CD for extraction and validation
6. **Monitor Coverage**: Track coverage trends over time
7. **Handle Edge Cases**: Test RTL, long text, plurals
8. **Plan for Growth**: Design keys for future expansion

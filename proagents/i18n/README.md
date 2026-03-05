# Localization (i18n) Support

Multi-language support for international development teams and applications.

---

## Overview

Integrate localization into your development workflow for seamless multi-language support.

```
┌─────────────────────────────────────────────────────────────┐
│                    i18n Workflow                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Development                                                │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │  Code   │──►│ Extract │──►│Translate│──►│ Deploy  │    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │             │             │             │          │
│       ▼             ▼             ▼             ▼          │
│  Use t() keys   Generate     Send to TMS   All languages  │
│  Mark strings   JSON/YAML    or translate  ready          │
│                                                             │
│  Validation: Check coverage, missing keys, plurals        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Enable i18n

```yaml
# proagents.config.yaml

i18n:
  enabled: true
  source_language: "en"
  target_languages: ["es", "fr", "de", "ja", "zh"]
```

### Extract Strings

```bash
# Extract translatable strings
proagents i18n extract

# Check translation coverage
proagents i18n coverage
```

---

## Features

| Feature | Description |
|---------|-------------|
| **String Extraction** | Auto-extract translatable strings |
| **Coverage Reports** | Track translation completion |
| **Missing Key Detection** | Find untranslated strings |
| **Plural Validation** | Verify plural forms |
| **TMS Integration** | Connect to translation services |
| **CI/CD Checks** | Validate in pipeline |

---

## Documentation Files

| File | Description |
|------|-------------|
| [extraction.md](./extraction.md) | String extraction setup |
| [translation-workflow.md](./translation-workflow.md) | Translation process |
| [tms-integration.md](./tms-integration.md) | Translation management systems |
| [validation.md](./validation.md) | Quality checks |

---

## Configuration

```yaml
# proagents.config.yaml

i18n:
  enabled: true

  # Languages
  source_language: "en"
  target_languages: ["es", "fr", "de", "ja", "zh"]

  # File structure
  files:
    format: "json"  # json, yaml, po
    directory: "src/locales"
    naming: "{{locale}}/{{namespace}}.json"

  # Extraction
  extraction:
    patterns:
      - "t('...')"
      - "i18n.t('...')"
      - "<Trans>...</Trans>"
    exclude:
      - "node_modules"
      - "**/*.test.ts"

  # Validation
  validation:
    missing_translations: "warning"
    unused_keys: "info"
    placeholder_mismatch: "error"

  # TMS Integration
  tms:
    provider: "crowdin"  # crowdin, lokalise, phrase
    project_id: "my-project"
    auto_sync: true
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents i18n extract` | Extract strings from code |
| `proagents i18n coverage` | Show translation coverage |
| `proagents i18n validate` | Validate translations |
| `proagents i18n sync` | Sync with TMS |
| `proagents i18n add-key` | Add new translation key |
| `proagents i18n missing` | List missing translations |

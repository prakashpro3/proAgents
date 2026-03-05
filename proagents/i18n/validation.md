# Translation Validation

Quality checks and validation rules for translations.

---

## Validation Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Validation Pipeline                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Source String          Translation                         │
│  ┌─────────────┐        ┌─────────────┐                    │
│  │ "Hello,     │        │ "Hola,      │                    │
│  │  {{name}}!" │   →    │  {{name}}!" │                    │
│  └──────┬──────┘        └──────┬──────┘                    │
│         │                      │                            │
│         └──────────┬───────────┘                            │
│                    │                                        │
│                    ▼                                        │
│         ┌─────────────────────┐                            │
│         │     Validators      │                            │
│         ├─────────────────────┤                            │
│         │ ✓ Placeholders      │                            │
│         │ ✓ Formatting        │                            │
│         │ ✓ Length            │                            │
│         │ ✓ Glossary          │                            │
│         │ ✓ Plurals           │                            │
│         └─────────────────────┘                            │
│                    │                                        │
│              [PASS/FAIL]                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

### Placeholder Validation

```yaml
i18n:
  validation:
    placeholders:
      enabled: true
      severity: "error"

      rules:
        # All source placeholders must exist in translation
        missing: "error"

        # Extra placeholders not in source
        extra: "warning"

        # Placeholder format must match
        format_mismatch: "error"

      # Placeholder patterns
      patterns:
        - "{{\\w+}}"           # {{name}}
        - "%[sd]"              # %s, %d
        - "\\{\\d+\\}"         # {0}, {1}
```

### Length Validation

```yaml
i18n:
  validation:
    length:
      enabled: true
      severity: "warning"

      rules:
        # Maximum expansion allowed
        max_expansion: 1.5  # Translation can be 50% longer

        # Minimum length (catch empty translations)
        min_length: 1

        # Per-context limits
        contexts:
          button:
            max_chars: 20
          title:
            max_chars: 50
          description:
            max_chars: 200
```

### Formatting Validation

```yaml
i18n:
  validation:
    formatting:
      enabled: true

      rules:
        # HTML tags must match
        html_tags:
          enabled: true
          severity: "error"

        # Markdown must be preserved
        markdown:
          enabled: true
          severity: "warning"

        # Line breaks
        line_breaks:
          preserve: true
          severity: "warning"

        # Leading/trailing whitespace
        whitespace:
          check: true
          severity: "info"
```

### Glossary Validation

```yaml
i18n:
  validation:
    glossary:
      enabled: true
      severity: "warning"

      # Glossary file
      file: "i18n/glossary.csv"

      rules:
        # Terms must be translated consistently
        consistency: true

        # Terms must not be translated (brand names)
        do_not_translate:
          - "ProAgents"
          - "GitHub"
          - "API"
```

### Plural Validation

```yaml
i18n:
  validation:
    plurals:
      enabled: true
      severity: "error"

      rules:
        # All plural forms required
        all_forms_required: true

        # Forms per language
        forms:
          en: ["one", "other"]
          ru: ["one", "few", "many", "other"]
          ar: ["zero", "one", "two", "few", "many", "other"]
          zh: ["other"]  # No plurals
```

---

## Running Validation

### Command Line

```bash
# Validate all translations
proagents i18n validate

# Validate specific language
proagents i18n validate --lang es

# Validate specific file
proagents i18n validate --file src/locales/es/common.json

# Output format
proagents i18n validate --format json
```

### Validation Output

```
┌─────────────────────────────────────────────────────────────┐
│ Translation Validation Results                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Validated: 5 languages, 450 keys                           │
│                                                             │
│ Errors (3):                                                 │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ es/common.json:greeting                                 ││
│ │ Missing placeholder: {{name}}                           ││
│ │ Source: "Hello, {{name}}!"                              ││
│ │ Translation: "¡Hola!"                                   ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ fr/errors.json:validation_error                         ││
│ │ Mismatched HTML tags                                    ││
│ │ Source: "<strong>Error:</strong> {{message}}"           ││
│ │ Translation: "<b>Erreur:</b> {{message}}"               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Warnings (5):                                               │
│ • de/common.json:long_text - exceeds 150% expansion        │
│ • ja/ui.json:button_submit - exceeds 20 char limit         │
│ • ... 3 more                                               │
│                                                             │
│ Result: FAILED (3 errors, 5 warnings)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## CI Integration

### Pre-Commit Hook

```yaml
# .proagents/hooks/pre-commit
i18n:
  validation:
    hooks:
      pre_commit:
        enabled: true
        fail_on: "error"
        languages: "all"
```

### CI Pipeline

```yaml
# GitHub Actions
name: i18n Validation

on:
  pull_request:
    paths:
      - 'src/locales/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate translations
        run: proagents i18n validate --ci --fail-on error

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: i18n-validation-report
          path: i18n-validation.json
```

### Block Merge

```yaml
i18n:
  validation:
    ci:
      # Block PR merge on
      block_on:
        errors: true
        warnings: false

      # Required checks
      required_checks:
        - "placeholder_validation"
        - "plural_validation"
```

---

## Custom Validators

### Define Custom Rule

```yaml
i18n:
  validation:
    custom:
      # No profanity
      - name: "no_profanity"
        type: "regex"
        pattern: "\\b(badword1|badword2)\\b"
        severity: "error"
        message: "Translation contains inappropriate language"

      # Brand name capitalization
      - name: "brand_caps"
        type: "regex"
        pattern: "proagents"
        severity: "warning"
        message: "Brand name should be 'ProAgents'"

      # Custom script
      - name: "custom_check"
        type: "script"
        script: "scripts/validate-i18n.js"
        severity: "error"
```

---

## Auto-Fix

### Fixable Issues

```yaml
i18n:
  validation:
    auto_fix:
      enabled: true

      # What can be auto-fixed
      fixable:
        - "trailing_whitespace"
        - "leading_whitespace"
        - "double_spaces"
        - "smart_quotes"  # Convert to standard quotes

      # Confirmation
      confirm: true
```

### Fix Command

```bash
# Auto-fix issues
proagents i18n validate --fix

# Preview fixes
proagents i18n validate --fix --dry-run
```

---

## Best Practices

1. **Run in CI**: Validate on every PR
2. **Block on Errors**: Don't merge with validation errors
3. **Use Glossary**: Ensure consistent terminology
4. **Check Plurals**: Verify all plural forms
5. **Test UI**: Visual testing catches length issues
6. **Review Warnings**: Don't ignore warnings

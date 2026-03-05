# String Extraction

Automatically extract translatable strings from your codebase.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Extraction Process                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Source Code                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ const message = t('welcome.title');                 │   │
│  │ <Trans i18nKey="welcome.subtitle">Welcome!</Trans>  │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         ▼                                   │
│               ┌─────────────────┐                          │
│               │   Extractor     │                          │
│               └────────┬────────┘                          │
│                        │                                    │
│                        ▼                                    │
│  Translation Files                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ {                                                   │   │
│  │   "welcome": {                                      │   │
│  │     "title": "Welcome",                             │   │
│  │     "subtitle": "Welcome!"                          │   │
│  │   }                                                 │   │
│  │ }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Extraction Configuration

### Basic Setup

```yaml
i18n:
  extraction:
    # Patterns to match
    patterns:
      # Function calls
      - pattern: "t\\(['\"](.+?)['\"]"
        type: "function"

      - pattern: "i18n\\.t\\(['\"](.+?)['\"]"
        type: "function"

      # React components
      - pattern: "<Trans\\s+i18nKey=['\"](.+?)['\"]"
        type: "component"

      - pattern: "<Trans>(.+?)</Trans>"
        type: "component_content"

    # Files to scan
    include:
      - "src/**/*.ts"
      - "src/**/*.tsx"
      - "src/**/*.js"
      - "src/**/*.jsx"

    # Files to exclude
    exclude:
      - "**/*.test.*"
      - "**/*.spec.*"
      - "**/node_modules/**"
      - "**/dist/**"
```

### Advanced Patterns

```yaml
i18n:
  extraction:
    patterns:
      # With default value
      - pattern: "t\\(['\"](.+?)['\"],\\s*['\"](.+?)['\"]\\)"
        type: "function_with_default"
        key_group: 1
        default_group: 2

      # With options
      - pattern: "t\\(['\"](.+?)['\"],\\s*\\{[^}]*\\}\\)"
        type: "function_with_options"

      # Plurals
      - pattern: "t\\(['\"](.+?)['\"],\\s*\\{\\s*count:"
        type: "plural"

      # Template literals
      - pattern: "t\\(`(.+?)`\\)"
        type: "template_literal"
        warning: "Dynamic keys cannot be extracted"
```

---

## Running Extraction

### Basic Extraction

```bash
# Extract all strings
proagents i18n extract

# Extract to specific directory
proagents i18n extract --output src/locales

# Dry run (preview only)
proagents i18n extract --dry-run
```

### Extraction Options

```bash
# Extract with specific format
proagents i18n extract --format json

# Extract only new keys
proagents i18n extract --new-only

# Extract with context
proagents i18n extract --include-context

# Extract to specific namespace
proagents i18n extract --namespace common
```

### Output

```
┌─────────────────────────────────────────────────────────────┐
│ String Extraction Results                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Files Scanned: 145                                          │
│ Strings Extracted: 342                                      │
│                                                             │
│ New Keys: 12                                                │
│ ├── common.save                                            │
│ ├── common.cancel                                          │
│ ├── auth.login_button                                      │
│ └── ... 9 more                                             │
│                                                             │
│ Warnings: 3                                                 │
│ ├── src/utils/format.ts:15 - Dynamic key detected          │
│ ├── src/components/Menu.tsx:42 - Missing default value     │
│ └── src/pages/Home.tsx:78 - Duplicate key                  │
│                                                             │
│ Output: src/locales/en/extracted.json                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Naming

### Naming Convention

```yaml
i18n:
  key_naming:
    # Convention
    style: "dot_notation"  # dot_notation, snake_case, camelCase

    # Auto-generate key from content
    auto_generate:
      enabled: true
      max_length: 40
      hash_suffix: false

    # Namespace from file path
    namespace_from_path:
      enabled: true
      base_path: "src"
      mapping:
        "components": "common"
        "pages": "pages"
        "features": "features"
```

### Examples

```typescript
// File: src/components/Button.tsx
t('common.button.submit')  // Namespace: common

// File: src/pages/Login.tsx
t('pages.login.title')     // Namespace: pages

// File: src/features/checkout/Cart.tsx
t('features.checkout.cart.empty')  // Namespace: features
```

---

## Default Values

### Extract with Defaults

```yaml
i18n:
  extraction:
    default_values:
      enabled: true
      source: "code"  # code, comment, second_argument

      # From code content
      patterns:
        - "<Trans>(.+?)</Trans>"

      # From comments
      comment_pattern: "// i18n: (.+)"
```

### In Code

```typescript
// Default from second argument
t('welcome.title', 'Welcome to our app')

// Default from component content
<Trans i18nKey="welcome.subtitle">
  Welcome to our amazing application!
</Trans>

// Default from comment
// i18n: Click here to continue
t('common.continue')
```

---

## Namespace Management

### Multiple Namespaces

```yaml
i18n:
  namespaces:
    # Define namespaces
    list:
      - name: "common"
        description: "Shared UI strings"
        files: "src/components/**"

      - name: "pages"
        description: "Page-specific strings"
        files: "src/pages/**"

      - name: "errors"
        description: "Error messages"
        files: "src/errors/**"

      - name: "validation"
        description: "Form validation"
        files: "src/validation/**"
```

### Output Structure

```
src/locales/
├── en/
│   ├── common.json
│   ├── pages.json
│   ├── errors.json
│   └── validation.json
├── es/
│   ├── common.json
│   └── ...
└── fr/
    └── ...
```

---

## Incremental Extraction

### Track Changes

```yaml
i18n:
  extraction:
    incremental:
      enabled: true
      tracking_file: ".proagents/i18n-state.json"

      # Only extract from changed files
      changed_files_only: true

      # Add new keys without removing old
      merge_strategy: "add_only"

      # Remove unused keys
      remove_unused:
        enabled: false
        after_days: 30
```

### Commands

```bash
# Extract only from changed files
proagents i18n extract --incremental

# Extract and remove unused
proagents i18n extract --prune-unused

# Full re-extraction
proagents i18n extract --full
```

---

## Context and Comments

### Add Context for Translators

```typescript
// Add context as comment
// i18n-context: Button shown after successful payment
t('checkout.success_button')

// Or in options
t('checkout.success_button', {
  context: 'Button shown after successful payment'
})
```

### Extract Context

```yaml
i18n:
  extraction:
    context:
      enabled: true
      sources:
        - "comment"  # // i18n-context: ...
        - "option"   # t('key', { context: '...' })
        - "jsdoc"    # /** @i18n-context ... */

      output:
        include_in_json: true
        separate_file: false
```

### Output with Context

```json
{
  "checkout": {
    "success_button": {
      "value": "Continue Shopping",
      "context": "Button shown after successful payment",
      "source": "src/pages/Checkout.tsx:145"
    }
  }
}
```

---

## Validation During Extraction

### Validate Keys

```yaml
i18n:
  extraction:
    validation:
      # Check for duplicate keys
      duplicates: "error"

      # Check for invalid characters
      invalid_chars: "error"

      # Check key length
      max_key_length: 100

      # Check for dynamic keys
      dynamic_keys: "warning"

      # Check for missing defaults
      missing_defaults: "warning"
```

### Validation Output

```
┌─────────────────────────────────────────────────────────────┐
│ Extraction Validation                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Errors (2):                                                 │
│ ├── src/components/Menu.tsx:42                             │
│ │   Duplicate key: 'common.menu.home'                      │
│ │   First occurrence: src/components/Header.tsx:15         │
│ │                                                           │
│ └── src/pages/Settings.tsx:78                              │
│     Invalid characters in key: 'settings.user name'        │
│     Suggestion: 'settings.user_name'                       │
│                                                             │
│ Warnings (3):                                               │
│ ├── Dynamic key detected (cannot extract)                  │
│ └── Missing default value (2 occurrences)                  │
│                                                             │
│ Extraction blocked due to errors. Fix and retry.           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Consistent Naming**: Use a consistent key naming convention
2. **Provide Defaults**: Always include default English text
3. **Add Context**: Help translators understand usage
4. **Use Namespaces**: Organize keys by feature/page
5. **Avoid Dynamic Keys**: Extract only static keys
6. **Run Regularly**: Extract as part of development workflow
7. **Review Changes**: Check extracted keys before sending for translation

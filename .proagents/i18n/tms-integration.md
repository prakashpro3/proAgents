# Translation Management System Integration

Connect ProAgents with translation management platforms.

---

## Supported Platforms

| Platform | Features | Best For |
|----------|----------|----------|
| **Crowdin** | Full integration, OTA, screenshots | Large teams |
| **Lokalise** | Fast, API-first, CLI tools | Dev-focused teams |
| **Phrase** | Enterprise features, TM | Enterprise |
| **Transifex** | Open source friendly | OSS projects |
| **POEditor** | Simple, affordable | Small teams |

---

## Crowdin Integration

### Setup

```yaml
i18n:
  tms:
    provider: "crowdin"

    # Credentials
    api_token_env: "CROWDIN_API_TOKEN"
    project_id: "your-project-id"

    # Optional: Organization
    organization: "your-org"
```

### Configuration

```yaml
i18n:
  tms:
    crowdin:
      # File mapping
      files:
        - source: "src/locales/en/*.json"
          translation: "src/locales/%locale%/%original_file_name%"

      # Branch support
      branches:
        enabled: true
        auto_create: true

      # Translation memory
      translation_memory:
        enabled: true
        auto_apply: true

      # Machine translation
      machine_translation:
        enabled: true
        provider: "deepl"
        as_suggestion: true

      # Screenshots
      screenshots:
        enabled: true
        auto_tag: true
```

### Commands

```bash
# Push source strings
proagents i18n push --tms crowdin

# Pull translations
proagents i18n pull --tms crowdin

# Check translation status
proagents i18n status --tms crowdin
```

---

## Lokalise Integration

### Setup

```yaml
i18n:
  tms:
    provider: "lokalise"

    api_token_env: "LOKALISE_API_TOKEN"
    project_id: "your-project-id"
```

### Configuration

```yaml
i18n:
  tms:
    lokalise:
      # File format
      format: "json"

      # Key naming
      key_naming: "web"  # web, ios, android

      # Tags
      auto_tags:
        - "proagents"
        - "{{namespace}}"

      # Webhooks
      webhooks:
        on_translation_complete: true
        on_review_complete: true

      # CLI integration
      cli:
        enabled: true
        download_on_pull: true
```

---

## Generic TMS Integration

### Webhook-Based

```yaml
i18n:
  tms:
    provider: "custom"

    # API endpoints
    api:
      base_url: "https://your-tms.com/api"
      push_endpoint: "/projects/{{project_id}}/upload"
      pull_endpoint: "/projects/{{project_id}}/download"
      status_endpoint: "/projects/{{project_id}}/status"

    # Authentication
    auth:
      type: "bearer"
      token_env: "TMS_API_TOKEN"

    # Request format
    format:
      push: "multipart"
      pull: "json"
```

---

## Sync Configuration

### Push Settings

```yaml
i18n:
  tms:
    push:
      # When to push
      triggers:
        - "manual"
        - "on_merge_to_main"
        - "scheduled"

      schedule: "0 6 * * *"  # Daily at 6 AM

      # What to push
      include:
        - new_keys: true
        - modified_keys: true
        - deleted_keys: false  # Keep old keys in TMS

      # Options
      options:
        update_existing: true
        cleanup_mode: false
        import_translations: false
```

### Pull Settings

```yaml
i18n:
  tms:
    pull:
      # When to pull
      triggers:
        - "manual"
        - "on_translation_complete"
        - "scheduled"

      schedule: "0 */4 * * *"  # Every 4 hours

      # What to pull
      include:
        - reviewed: true
        - unreviewed: false  # Only pull reviewed translations

      # PR creation
      create_pr:
        enabled: true
        branch: "i18n/translations-{{date}}"
        auto_merge: false
```

---

## Workflow Automation

### Auto-Sync Pipeline

```yaml
i18n:
  tms:
    automation:
      # On new strings extracted
      on_extract:
        push_to_tms: true
        notify_translators: true

      # On translation complete
      on_translation_complete:
        pull_translations: true
        create_pr: true
        notify_developers: true

      # On release
      on_release:
        freeze_strings: true
        create_snapshot: true
```

### Notifications

```yaml
i18n:
  tms:
    notifications:
      # New strings available
      on_push:
        channels: ["slack:#translations"]
        template: |
          📝 New strings pushed to {{tms_provider}}
          Keys: {{new_keys_count}}
          Words: {{word_count}}

      # Translations ready
      on_pull:
        channels: ["slack:#releases"]
        template: |
          ✅ Translations ready for {{languages}}
          PR: {{pr_url}}
```

---

## Context and Screenshots

### String Context

```yaml
i18n:
  tms:
    context:
      # Auto-extract context
      extract:
        from_comments: true
        from_jsdoc: true
        from_surrounding_code: true

      # Context format
      format: |
        File: {{file_path}}
        Component: {{component_name}}
        Usage: {{context_description}}
```

### Screenshot Integration

```yaml
i18n:
  tms:
    screenshots:
      enabled: true

      # Auto-capture
      auto_capture:
        enabled: true
        on: ["storybook_build", "e2e_test"]

      # Upload to TMS
      upload:
        enabled: true
        tag_strings: true
```

---

## Commands

```bash
# Push to TMS
proagents i18n tms push

# Pull from TMS
proagents i18n tms pull

# Check TMS status
proagents i18n tms status

# Sync (push + pull)
proagents i18n tms sync

# View TMS project
proagents i18n tms open
```

---

## Best Practices

1. **Regular Sync**: Keep TMS in sync with codebase
2. **Context Always**: Provide context for translators
3. **Screenshots Help**: Visual context improves quality
4. **Review Before Pull**: Only pull reviewed translations
5. **Automate Pipeline**: Set up CI/CD integration
6. **Monitor Progress**: Track translation coverage

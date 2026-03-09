# Training Data Management

Manage data used for project-specific AI training and learning.

---

## Data Sources

### Source Types

```yaml
training:
  sources:
    # Codebase
    codebase:
      enabled: true
      paths:
        - "src/**"
        - "lib/**"
      exclude:
        - "**/*.test.*"
        - "**/node_modules/**"

    # Documentation
    documentation:
      enabled: true
      paths:
        - "docs/**"
        - "README.md"
        - "*.md"

    # Git history
    git:
      enabled: true
      include:
        - "commit_messages"
        - "pr_descriptions"
        - "code_reviews"
      depth: 1000  # Last 1000 commits

    # User interactions
    interactions:
      enabled: true
      include:
        - "corrections"
        - "acceptances"
        - "feedback"
```

---

## Data Collection

### What Gets Collected

```yaml
training:
  collection:
    # Code patterns
    code:
      - naming_conventions
      - code_structure
      - common_patterns
      - import_styles
      - error_handling

    # Documentation
    docs:
      - writing_style
      - structure
      - terminology

    # User behavior
    behavior:
      - corrections
      - preferences
      - workflow_patterns

    # Domain knowledge
    domain:
      - business_terms
      - entities
      - relationships
```

### Collection Configuration

```yaml
training:
  collection:
    # Frequency
    schedule:
      full_collection: "weekly"
      incremental: "on_change"

    # Limits
    limits:
      max_files: 10000
      max_file_size: "1MB"
      max_total_size: "100MB"

    # Quality filters
    filters:
      min_file_age: "1d"  # Avoid collecting unstable code
      exclude_generated: true
      exclude_vendor: true
```

---

## Data Processing

### Processing Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                  Data Processing Pipeline                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Raw Data                                                   │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │  Clean  │──►│ Extract │──►│Normalize│──►│  Store  │    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│       │             │             │             │          │
│       ▼             ▼             ▼             ▼          │
│  Remove       Extract        Standardize    Index for      │
│  secrets      patterns       formats        retrieval      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Processing Configuration

```yaml
training:
  processing:
    # Cleaning
    cleaning:
      remove_secrets: true
      remove_pii: true
      remove_comments: false
      normalize_whitespace: true

    # Extraction
    extraction:
      extract_patterns: true
      extract_terminology: true
      extract_relationships: true

    # Normalization
    normalization:
      standardize_naming: false  # Preserve actual naming
      standardize_structure: true
```

---

## Data Storage

### Storage Structure

```
.proagents/training-data/
├── raw/                    # Raw collected data
│   ├── codebase/
│   ├── documentation/
│   └── interactions/
├── processed/              # Processed data
│   ├── patterns.json
│   ├── terminology.json
│   └── relationships.json
├── models/                 # Trained models/embeddings
│   └── project-model.json
└── metadata.json          # Collection metadata
```

### Storage Configuration

```yaml
training:
  storage:
    path: ".proagents/training-data"

    # Compression
    compress: true

    # Encryption
    encrypt: false
    encryption_key_env: "TRAINING_DATA_KEY"

    # Retention
    retention:
      raw_data: "30d"
      processed_data: "1y"
      models: "forever"

    # Size limits
    max_size: "500MB"
    cleanup_on_limit: true
```

---

## Data Quality

### Quality Metrics

```bash
proagents training quality

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Training Data Quality                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Total Data Points: 15,432                                   │
│                                                             │
│ Quality Scores:                                             │
│ ├── Completeness: 92%                                      │
│ ├── Consistency: 87%                                       │
│ ├── Accuracy: 94%                                          │
│ └── Freshness: 98%                                         │
│                                                             │
│ Issues:                                                     │
│ ├── Outdated patterns: 45 (from deleted files)            │
│ ├── Conflicting examples: 12                               │
│ └── Missing context: 23                                    │
│                                                             │
│ Recommendation: Run 'proagents training refresh'           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quality Rules

```yaml
training:
  quality:
    rules:
      # Minimum examples
      min_examples_per_pattern: 3

      # Consistency check
      consistency_threshold: 0.80

      # Freshness
      max_data_age: "90d"

      # Validation
      validate_on_collection: true
```

---

## Data Commands

```bash
# Collect training data
proagents training collect

# Process collected data
proagents training process

# View data statistics
proagents training stats

# Validate data quality
proagents training validate

# Refresh stale data
proagents training refresh

# Export data
proagents training export --output training-data.tar.gz

# Import data
proagents training import training-data.tar.gz

# Clear all data
proagents training clear
```

---

## Data Privacy

### Privacy Controls

```yaml
training:
  privacy:
    # What to exclude
    exclude:
      - "**/*.env"
      - "**/secrets/**"
      - "**/credentials/**"
      - "**/*password*"
      - "**/*token*"
      - "**/*key*"

    # PII handling
    pii:
      detect: true
      action: "redact"  # redact, exclude, hash

    # Sensitive patterns
    sensitive_patterns:
      - "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"  # Email
      - "\\b\\d{3}-\\d{2}-\\d{4}\\b"  # SSN
      - "\\b\\d{16}\\b"  # Credit card
```

### Data Deletion

```bash
# Delete all training data
proagents training clear --all

# Delete specific category
proagents training clear --category interactions

# GDPR-compliant deletion
proagents training clear --gdpr --user user_id
```

---

## Best Practices

1. **Regular Collection**: Keep training data fresh
2. **Quality First**: Validate data quality regularly
3. **Privacy Always**: Never collect sensitive data
4. **Clean Up**: Remove outdated patterns
5. **Backup**: Export data before major changes
6. **Version**: Track data versions for reproducibility

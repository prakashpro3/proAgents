# AI Training & Project Learning

Train AI on project-specific patterns, preferences, and domain knowledge.

---

## Overview

ProAgents learns from your project to provide increasingly accurate and relevant suggestions over time.

```
┌─────────────────────────────────────────────────────────────┐
│                    Learning Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Data Sources                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │Codebase │ │  PRs &  │ │ User    │ │ Domain  │          │
│  │Patterns │ │ Reviews │ │Feedback │ │  Docs   │          │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │
│       │           │           │           │                │
│       └───────────┴─────┬─────┴───────────┘                │
│                         │                                   │
│                         ▼                                   │
│              ┌─────────────────────┐                       │
│              │   Learning Engine   │                       │
│              └──────────┬──────────┘                       │
│                         │                                   │
│       ┌─────────────────┼─────────────────┐                │
│       ▼                 ▼                 ▼                │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│  │ Pattern │     │ Domain  │     │  User   │              │
│  │ Model   │     │ Model   │     │ Prefs   │              │
│  └─────────┘     └─────────┘     └─────────┘              │
│                                                             │
│  Applied To:                                                │
│  • Code suggestions                                        │
│  • Architecture decisions                                  │
│  • Naming conventions                                      │
│  • Review comments                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Enable Learning

```yaml
# proagents.config.yaml

learning:
  enabled: true
  auto_learn: true
```

### View What's Learned

```bash
# Show learning summary
proagents learning status

# Show specific patterns
proagents learning patterns

# Show user preferences
proagents learning preferences
```

---

## Learning Types

| Type | Description | Example |
|------|-------------|---------|
| **Code Patterns** | Common code structures | "Always use async/await over .then()" |
| **Naming Conventions** | Variable/function naming | "Components use PascalCase" |
| **Architecture** | Design patterns used | "Services in /src/services/" |
| **Domain Knowledge** | Business terminology | "User = registered customer" |
| **User Preferences** | Individual preferences | "Prefers detailed explanations" |
| **Team Standards** | Team conventions | "All PRs need 2 approvers" |

---

## Documentation Files

| File | Description |
|------|-------------|
| [pattern-learning.md](./pattern-learning.md) | Code pattern recognition |
| [domain-knowledge.md](./domain-knowledge.md) | Business domain learning |
| [user-preferences.md](./user-preferences.md) | User preference tracking |
| [continuous-learning.md](./continuous-learning.md) | Ongoing improvement |
| [training-data.md](./training-data.md) | Training data management |

---

## Configuration

```yaml
# proagents.config.yaml

learning:
  enabled: true

  # What to learn from
  sources:
    codebase: true
    pull_requests: true
    code_reviews: true
    user_feedback: true
    documentation: true

  # What to learn
  learn:
    code_patterns: true
    naming_conventions: true
    architecture_patterns: true
    testing_patterns: true
    domain_knowledge: true
    user_preferences: true

  # Auto-apply learnings
  auto_apply:
    code_suggestions: true
    review_comments: true
    documentation: true

  # Storage
  storage:
    path: ".proagents/learning"
    sync_to_cloud: false

  # Privacy
  privacy:
    anonymize: true
    exclude_secrets: true
    exclude_patterns:
      - "*.env"
      - "**/secrets/**"
```

---

## Commands

| Command | Description |
|---------|-------------|
| `proagents learning status` | Show learning status |
| `proagents learning patterns` | Show learned patterns |
| `proagents learning train` | Trigger manual training |
| `proagents learning reset` | Reset learning data |
| `proagents learning export` | Export learning data |
| `proagents learning import` | Import learning data |

# Trello Integration

Visual board integration with Trello for agile workflows.

---

## Setup

### 1. Get API Credentials

1. Go to [Trello Developer Portal](https://trello.com/power-ups/admin)
2. Create a new Power-Up or get API key
3. Generate token with necessary permissions

### 2. Configure Connection

```yaml
# proagents.config.yaml

integrations:
  trello:
    enabled: true
    api_key_env: "TRELLO_API_KEY"
    token_env: "TRELLO_TOKEN"

    # Board settings
    board_id: "your-board-id"

    # List mapping
    lists:
      backlog: "Backlog"
      in_progress: "In Progress"
      review: "In Review"
      done: "Done"
```

### 3. Set Environment Variables

```bash
export TRELLO_API_KEY="your-api-key"
export TRELLO_TOKEN="your-token"
```

### 4. Verify Connection

```bash
proagents pm connect trello
proagents pm status
```

---

## List Mapping

Map ProAgents phases to Trello lists:

```yaml
integrations:
  trello:
    list_mapping:
      # ProAgents phase: Trello list name
      init: "Backlog"
      analysis: "In Progress"
      requirements: "In Progress"
      design: "In Progress"
      planning: "In Progress"
      implementation: "In Progress"
      testing: "In Review"
      review: "In Review"
      documentation: "In Review"
      deployment: "Done"
      deployed: "Done"
```

---

## Card Configuration

### Card Template

```yaml
integrations:
  trello:
    card_template:
      name: "{{feature_name}}"
      description: |
        ## Description
        {{feature_description}}

        ## Acceptance Criteria
        {{acceptance_criteria}}

        ---
        *Managed by ProAgents*

      # Labels
      labels:
        feature: "green"
        bug: "red"
        refactor: "yellow"
        proagents: "purple"

      # Checklist
      checklist:
        name: "Tasks"
        items:
          - "Analysis complete"
          - "Implementation complete"
          - "Tests passing"
          - "Code reviewed"
          - "Documentation updated"
```

### Auto-Actions

```yaml
integrations:
  trello:
    on_feature_start:
      action: "create_card"
      list: "In Progress"
      add_labels: ["proagents"]

    on_phase_change:
      action: "move_card"
      add_comment: true

    on_feature_complete:
      action: "move_to_done"
      check_all_items: true
      add_comment: true
```

---

## Commands

```bash
# Link to existing card
proagents pm link --card "card-id"

# Create new card
proagents pm create --title "Feature name"

# Move card
proagents pm move --list "In Review"

# Add comment
proagents pm comment "Status update"
```

---

## Best Practices

1. **Use Labels**: Color-code by type (feature, bug, etc.)
2. **Checklists**: Track phase completion with checklists
3. **Due Dates**: Set target completion dates
4. **Attachments**: Link PRs and documentation

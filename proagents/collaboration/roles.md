# Collaboration Roles

Define and manage roles for collaborative development sessions.

---

## Role Types

### Driver

The active coder who controls the keyboard:

```yaml
roles:
  driver:
    description: "Active coder with keyboard control"
    permissions:
      can_edit: true
      can_execute: true
      can_commit: true
      can_push: false  # Requires review

    responsibilities:
      - "Write code based on navigator guidance"
      - "Execute tests and commands"
      - "Implement agreed-upon solutions"

    rotation:
      enabled: true
      interval: "25m"  # Pomodoro-style
```

### Navigator

The strategic guide who reviews and directs:

```yaml
roles:
  navigator:
    description: "Strategic reviewer and guide"
    permissions:
      can_edit: false
      can_suggest: true
      can_comment: true
      can_approve: true

    responsibilities:
      - "Review code as it's written"
      - "Think strategically about approach"
      - "Catch errors and suggest improvements"
      - "Research and provide context"

    rotation:
      swap_with: "driver"
```

### Observer

Learning or oversight participant:

```yaml
roles:
  observer:
    description: "Passive participant (learning/oversight)"
    permissions:
      can_edit: false
      can_suggest: false
      can_comment: true
      can_view: true

    use_cases:
      - "Training new team members"
      - "Management oversight"
      - "Cross-team learning"
```

### Reviewer

Code review specialist:

```yaml
roles:
  reviewer:
    description: "Focused code reviewer"
    permissions:
      can_edit: false
      can_comment: true
      can_request_changes: true
      can_approve: true

    responsibilities:
      - "Review code quality"
      - "Check for bugs and issues"
      - "Ensure standards compliance"
      - "Approve or request changes"
```

---

## Role Configuration

### Session Roles

```yaml
collaboration:
  sessions:
    pair_programming:
      roles:
        - driver: 1
        - navigator: 1
      rotation: true

    mob_programming:
      roles:
        - driver: 1
        - navigator: "unlimited"
        - observer: "unlimited"
      rotation: true

    review_session:
      roles:
        - author: 1
        - reviewer: "1-3"
      rotation: false
```

### Role Assignment

```bash
# Assign role when joining
proagents collab join sess_abc123 --role navigator

# Change role during session
proagents collab role driver

# View current roles
proagents collab roles
```

---

## Role Rotation

### Automatic Rotation

```yaml
collaboration:
  rotation:
    enabled: true

    # Rotation interval
    interval: "25m"

    # Rotation style
    style: "round_robin"  # round_robin, random, volunteer

    # Notification
    notify_before: "2m"

    # Pause on
    pause_on:
      - "active_debugging"
      - "complex_implementation"
```

### Manual Rotation

```bash
# Trigger rotation
proagents collab rotate

# Skip rotation
proagents collab rotate --skip

# Extend current turn
proagents collab rotate --extend 10m
```

### Rotation Notification

```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Role Rotation in 2 minutes                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Current: Alice (driver) → Bob (navigator)                  │
│ Next:    Bob (driver) → Alice (navigator)                  │
│                                                             │
│ [Rotate Now]  [Extend 5m]  [Skip]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Permission Matrix

| Action | Driver | Navigator | Observer | Reviewer |
|--------|--------|-----------|----------|----------|
| View code | ✅ | ✅ | ✅ | ✅ |
| Edit code | ✅ | ❌ | ❌ | ❌ |
| Run commands | ✅ | ❌ | ❌ | ❌ |
| Suggest edits | ✅ | ✅ | ❌ | ✅ |
| Add comments | ✅ | ✅ | ✅ | ✅ |
| Commit | ✅ | ❌ | ❌ | ❌ |
| Approve | ❌ | ✅ | ❌ | ✅ |

---

## Custom Roles

### Define Custom Role

```yaml
collaboration:
  custom_roles:
    security_reviewer:
      description: "Security-focused reviewer"
      base: "reviewer"
      permissions:
        can_block_on_security: true
      focus_areas:
        - "authentication"
        - "authorization"
        - "data_handling"
        - "input_validation"

    documentation_writer:
      description: "Documentation specialist"
      permissions:
        can_edit: true
        scope: "docs/**"
      responsibilities:
        - "Write documentation"
        - "Update README"
        - "Add code comments"
```

---

## Role Best Practices

1. **Rotate Regularly**: Prevents fatigue, shares knowledge
2. **Clear Responsibilities**: Everyone knows their role
3. **Respect Permissions**: Driver drives, navigator navigates
4. **Communicate**: Constant dialogue between roles
5. **Take Breaks**: Rotate includes break opportunities
6. **Flexibility**: Adjust roles based on task needs

# Collaboration Sessions

Manage real-time collaboration sessions.

---

## Session Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Session Lifecycle                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Create ──► Active ──► Paused ──► Ended ──► Archived       │
│               │          │                                  │
│               └────◄─────┘                                  │
│            (Resume)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Starting Sessions

### Basic Session

```bash
# Start session for current feature
proagents collab start

# Start session for specific feature
proagents collab start --feature user-authentication

# Start with custom settings
proagents collab start \
  --feature user-auth \
  --mode pair \
  --max-participants 2
```

### Session Output

```
┌─────────────────────────────────────────────────────────────┐
│ Collaboration Session Started                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Session ID: sess_abc123xyz                                 │
│ Feature: user-authentication                               │
│ Mode: Pair Programming                                     │
│                                                             │
│ Join Link:                                                  │
│ https://proagents.io/collab/sess_abc123xyz                │
│                                                             │
│ Commands:                                                   │
│ • /invite <email> - Invite participant                     │
│ • /status - Show session status                            │
│ • /end - End session                                       │
│                                                             │
│ Waiting for participants...                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Session Modes

### Pair Programming

Two developers working together:

```yaml
session:
  mode: "pair"
  roles:
    driver:
      count: 1
      can_edit: true
      can_execute: true

    navigator:
      count: 1
      can_edit: false
      can_suggest: true

  rotation:
    enabled: true
    interval: "25m"  # Pomodoro-style rotation
```

### Mob Programming

Whole team on one feature:

```yaml
session:
  mode: "mob"
  roles:
    driver:
      count: 1
      can_edit: true

    navigators:
      count: unlimited
      can_suggest: true

    observers:
      count: unlimited

  rotation:
    enabled: true
    interval: "10m"
```

### Review Mode

Developer and reviewer:

```yaml
session:
  mode: "review"
  roles:
    author:
      can_edit: true
      can_respond: true

    reviewer:
      can_comment: true
      can_request_changes: true
      can_approve: true
```

---

## Session Management

### View Active Sessions

```bash
proagents collab list

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Active Collaboration Sessions                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ sess_abc123 | user-auth | Pair | 2 participants | 45m     │
│ sess_def456 | dashboard | Mob  | 4 participants | 1h 20m  │
│                                                             │
│ Total: 2 active sessions                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Session Status

```bash
proagents collab status

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Session: sess_abc123                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Feature: user-authentication                               │
│ Mode: Pair Programming                                     │
│ Duration: 45 minutes                                       │
│                                                             │
│ Participants:                                               │
│ ├── Alice (driver) - active                               │
│ └── Bob (navigator) - active                              │
│                                                             │
│ Current Phase: Implementation                              │
│ Current File: src/auth/AuthService.ts                     │
│                                                             │
│ Activity:                                                   │
│ ├── 12 files modified                                      │
│ ├── 45 decisions logged                                    │
│ └── Last activity: 2 min ago                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pause/Resume

```bash
# Pause session (preserves state)
proagents collab pause

# Resume session
proagents collab resume sess_abc123
```

### End Session

```bash
# End current session
proagents collab end

# End with summary
proagents collab end --summary

# Force end (as admin)
proagents collab end sess_abc123 --force
```

---

## Invitations

### Invite by Email

```bash
proagents collab invite alice@company.com

# With role
proagents collab invite alice@company.com --role navigator
```

### Invite by Link

```bash
# Generate shareable link
proagents collab invite-link

# Link with expiration
proagents collab invite-link --expires "1h"

# Link for specific role
proagents collab invite-link --role observer
```

### Manage Invitations

```bash
# List pending invitations
proagents collab invites

# Cancel invitation
proagents collab invite-cancel alice@company.com
```

---

## Session Recording

### Enable Recording

```yaml
collaboration:
  recording:
    enabled: true
    include:
      - decisions
      - file_changes
      - chat
      - commands
```

### Playback

```bash
# View session recording
proagents collab playback sess_abc123

# Export recording
proagents collab export sess_abc123 --format markdown
```

### Session Summary

```markdown
# Collaboration Session Summary

**Session:** sess_abc123
**Feature:** user-authentication
**Duration:** 2 hours 15 minutes
**Participants:** Alice (driver), Bob (navigator)

## Work Completed
- Implemented login form validation
- Added password strength checker
- Created auth service tests
- Fixed token refresh logic

## Decisions Made
1. Use Zustand for auth state (not Redux)
2. Store tokens in httpOnly cookies
3. Implement refresh token rotation

## Files Modified
- src/auth/AuthService.ts (created)
- src/auth/LoginForm.tsx (modified)
- src/auth/__tests__/auth.test.ts (created)

## Next Steps
- [ ] Add OAuth providers
- [ ] Implement MFA
- [ ] Add session management
```

---

## Communication

### In-Session Chat

```bash
# Send message (in session)
/chat Ready to switch roles?

# Send code reference
/chat Check line 45 in AuthService.ts

# React to message
/react 👍
```

### Voice/Video Integration

```yaml
collaboration:
  integrations:
    # Slack Huddle
    slack:
      enabled: true
      auto_create_huddle: true

    # Discord
    discord:
      enabled: true
      server_id: "..."
      channel_id: "..."

    # Zoom
    zoom:
      enabled: false
```

---

## Conflict Resolution

### File Conflicts

```yaml
collaboration:
  conflicts:
    # How to handle same-file edits
    resolution: "last_writer_wins"  # or "merge", "prompt"

    # Lock files during edit
    file_locking:
      enabled: true
      timeout: "5m"
```

### Merge Conflicts

```bash
# When conflict detected
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Conflict Detected                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ File: src/auth/AuthService.ts                              │
│                                                             │
│ Alice's version:                                           │
│   const token = await getToken()                           │
│                                                             │
│ Bob's version:                                             │
│   const token = await fetchToken()                         │
│                                                             │
│ [Keep Alice's] [Keep Bob's] [Merge] [Discuss]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Define Roles Clearly**: Everyone knows their responsibility
2. **Rotate Regularly**: Prevent fatigue, share knowledge
3. **Log Decisions**: Document why, not just what
4. **Take Breaks**: Collaboration is intensive
5. **Use Voice**: Faster than typing for discussion
6. **Set Time Limits**: Focused sessions are more effective

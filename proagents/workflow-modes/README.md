# Workflow Modes

Flexible entry points and workflow modes for different development scenarios.

---

## Overview

Not every task requires the full 10-phase workflow. ProAgents supports multiple entry modes:

| Mode | Use Case | Phases |
|------|----------|--------|
| **Full Workflow** | New features | All 10 phases |
| **Bug Fix (Fast Track)** | Bug fixes | Context → Fix → Test → Commit |
| **Quick Change** | Hotfixes, config | Change → Verify → Commit |
| **Resume Mode** | Continue work | Load context → Continue |

---

## Mode Selection

```
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Mode Selection                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Request                    Detected Mode              │
│  ────────────                    ─────────────              │
│                                                             │
│  "Add user authentication"    →  Full Workflow              │
│  "Fix login button not working" →  Bug Fix Mode             │
│  "Update API URL in config"   →  Quick Change               │
│  "Continue working on auth"   →  Resume Mode                │
│  "Refactor payment module"    →  Full Workflow              │
│  "Fix CSS alignment"          →  Bug Fix Mode               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Files in This Section

| File | Description |
|------|-------------|
| `README.md` | This overview |
| `entry-modes.md` | Detailed mode descriptions |
| `mode-detection.md` | Auto-detection logic |
| `mode-switching.md` | Switch modes mid-workflow |
| `guardrails.md` | Auto-upgrade triggers |
| `deferred-tracking.md` | Track skipped phases |

---

## Quick Start

### Start in Full Workflow Mode
```bash
pa:feature start "User Authentication"
```

### Start in Bug Fix Mode
```bash
/fix "Login button not responding"
```

### Start in Quick Change Mode
```bash
/quick "Update API endpoint URL"
```

### Resume Previous Work
```bash
/resume user-auth
```

---

## Mode Comparison

```
Full Workflow (10 phases)
═════════════════════════
Init → Analysis → Requirements → UI Design → Planning →
Implementation → Testing → Code Review → Documentation → Deployment

Bug Fix Mode (4 phases)
═══════════════════════
Context Scan → Fix Implementation → Verification → Commit

Quick Change Mode (3 phases)
════════════════════════════
Change → Verify → Commit

Resume Mode
═══════════
Load Context → Continue from Last Phase
```

---

## Configuration

```yaml
# proagents.config.yaml

workflow_modes:
  enabled: true

  # Allow different modes
  allow_full_workflow: true
  allow_bug_fix: true
  allow_quick_change: true
  allow_resume: true

  # Default mode
  default_mode: "auto_detect"  # auto_detect | full | bug_fix

  # Auto-detection settings
  detection:
    enabled: true
    confidence_threshold: 0.8
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:feature start [name]` | Start full workflow |
| `pa:fix [description]` | Start bug fix mode |
| `pa:quick [description]` | Start quick change mode |
| `pa:resume [feature]` | Resume previous work |
| `pa:mode` | Show current mode |
| `pa:mode switch [mode]` | Switch to different mode |

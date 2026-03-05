# Release Notes Template

Use this template to generate client-facing release notes.

**Output Location:** `./RELEASE_NOTES.md` (project root)
**Archive Location:** `./docs/releases/v[VERSION].md`

---

## Template

```markdown
# Release Notes - v[VERSION]

**Release Date:** [YYYY-MM-DD]
**Previous Version:** v[PREVIOUS_VERSION]

---

## Overview

[2-3 sentence executive summary describing this release. Focus on business value and user benefits, not technical details.]

---

## Highlights

| Feature | Description |
|---------|-------------|
| [Feature Name] | [One-line benefit] |
| [Feature Name] | [One-line benefit] |
| [Improvement] | [One-line benefit] |

---

## What's New

### [Feature 1 Name]

[Client-friendly description: What it does, why it matters, how to use it]

**How to use:**
1. [Step 1]
2. [Step 2]

### [Feature 2 Name]

[Client-friendly description]

---

## Improvements

- **[Area]:** [Improvement description and user benefit]
- **[Area]:** [Improvement description and user benefit]
- **Performance:** [Any performance improvements with metrics if available]

---

## Bug Fixes

- Fixed [issue in user-friendly terms]
- Resolved [issue in user-friendly terms]
- Corrected [issue in user-friendly terms]

---

## Breaking Changes

> **Important:** Please review these changes before upgrading.

### [Breaking Change 1]

**What changed:** [Description]
**Why:** [Reason for the change]
**Action required:** [What users need to do]

```
// Before
[old code/config]

// After
[new code/config]
```

---

## Upgrade Instructions

### From v[PREVIOUS_VERSION]

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Migration Script (if applicable)

```bash
# Run migration
[command]
```

---

## Known Issues

| Issue | Workaround | Status |
|-------|------------|--------|
| [Issue description] | [Workaround] | Investigating |

---

## Coming Soon

Preview of features planned for upcoming releases:

- [Upcoming feature 1]
- [Upcoming feature 2]

---

## Resources

- [Full Changelog](./CHANGELOG.md)
- [Documentation](#)
- [Support](#)
- [Feedback](#)

---

## Thank You

Thank you to everyone who contributed to this release!

[Optional: List contributors or community acknowledgments]
```

---

## Quick Release Notes (Lite Version)

For minor releases or quick updates:

```markdown
# v[VERSION] Release Notes

**Date:** [YYYY-MM-DD]

## Changes

- [Change 1]
- [Change 2]
- [Change 3]

## Fixes

- [Fix 1]
- [Fix 2]

---

See [CHANGELOG.md](./CHANGELOG.md) for full details.
```

---

## Release Announcement Template

For email, Slack, or social media:

```markdown
# [Product] v[VERSION] is here!

[One compelling sentence about the release]

## Key Updates

- [Update 1] - [Benefit]
- [Update 2] - [Benefit]
- [Update 3] - [Benefit]

## Get Started

[Link to release notes]
[Link to upgrade guide]
[Link to documentation]

Questions? [Contact/Support link]
```

---

## Version Archive Structure

```
docs/
└── releases/
    ├── README.md           # Release history index
    ├── v1.0.0.md          # Initial release
    ├── v1.1.0.md          # Feature release
    ├── v1.1.1.md          # Patch release
    └── v2.0.0.md          # Major release
```

---

## Slash Commands

| Command | Action |
|---------|--------|
| `pa:release` | Generate release notes for current version |
| `pa:doc-release [version]` | Generate notes for specific version |
| `pa:doc-release --announce` | Generate release announcement |
| `pa:doc-release --archive` | Archive current notes to docs/releases/ |

# pa:ai-remove - Remove AI Platform

Remove an AI platform configuration from this project.

## Steps

### 1. Show Installed Platforms

Read config and show what's installed:

```bash
cat ./proagents.config.yaml
```

Display:
```
Installed AI Platforms:
  1. claude  - Claude Code (CLAUDE.md)
  2. cursor  - Cursor (.cursorrules)

Which platform to remove?
```

### 2. Locate the File

Get file path from `.proagents/platforms.yaml`:
- claude → `CLAUDE.md`
- cursor → `.cursorrules`
- copilot → `.github/copilot-instructions.md`
- etc.

### 3. Remove ProAgents Content

**CRITICAL: Follow these rules carefully to avoid deleting user's config.**

#### Step 3a: Check for Markers

Look for these markers in the file:
```
<!-- PROAGENTS_START -->
...content...
<!-- PROAGENTS_END -->
```

#### Step 3b: If Markers Found

1. Remove ONLY the content between markers (including the markers)
2. Keep ALL other content in the file
3. Clean up extra blank lines
4. If file is empty after removal → delete the file
5. If file has remaining content → keep the file

**Example:**
```
# My Custom Rules        ← KEEP
Some user config         ← KEEP

<!-- PROAGENTS_START --> ← REMOVE
ProAgents content...     ← REMOVE
<!-- PROAGENTS_END -->   ← REMOVE

# More user config       ← KEEP
```

#### Step 3c: If NO Markers Found

**DO NOT DELETE THE FILE.**

The file may contain user's own configuration that predates ProAgents or was manually edited.

Action:
1. Warn user: "No ProAgents markers found in {file}"
2. Suggest: "Manual cleanup may be needed"
3. Skip file removal
4. Still update config (step 4)

### 4. Update Config

Remove platform from `ai_platforms` in `./proagents.config.yaml`:

```yaml
ai_platforms:
  - claude
  # - cursor  ← removed
```

### 5. Confirm

Success cases:
```
Removed {platform}:
  - Deleted: {file}  (file only had ProAgents content)
  OR
  - Cleaned: {file}  (kept your custom config)
```

Skip case:
```
Skipped {platform}:
  - No ProAgents markers in {file}
  - Manual cleanup may be needed
  - Config updated anyway
```

## Safety Summary

| Scenario | Action |
|----------|--------|
| File has markers, only ProAgents content | Delete file |
| File has markers + user content | Remove markers section, keep rest |
| File has no markers | **SKIP - don't delete** |
| File doesn't exist | Skip silently |

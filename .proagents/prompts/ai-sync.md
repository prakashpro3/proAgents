# pa:ai-sync - Sync AI Platform Config

Synchronize the config file with actual AI instruction files (fix mismatches).

## When to Use

- After manually adding/removing AI files
- When config is out of sync with files
- To detect and fix inconsistencies

## Steps

### 1. Read Current Config

```bash
cat ./proagents.config.yaml
```

Extract `ai_platforms` array.

### 2. Read Platform Definitions

```bash
cat .proagents/platforms.yaml
```

### 3. Scan for Existing Files

Check project root for each platform's file:

| Platform | File to Check |
|----------|---------------|
| claude | `CLAUDE.md` |
| cursor | `.cursorrules` |
| windsurf | `.windsurfrules` |
| copilot | `.github/copilot-instructions.md` |
| kiro | `KIRO.md` |
| gemini | `GEMINI.md` |
| replit | `REPLIT.md` |
| bolt | `BOLT.md` |
| lovable | `LOVABLE.md` |

### 4. Compare and Report

```
AI Platform Sync Status:

In Config + File Exists:
  [x] claude  - CLAUDE.md
  [x] cursor  - .cursorrules

In Config but File Missing:
  [!] windsurf - .windsurfrules NOT FOUND

File Exists but Not in Config:
  [?] gemini - GEMINI.md exists

Actions needed:
  1. Add windsurf file OR remove from config
  2. Add gemini to config OR delete file
```

### 5. Ask User for Action

For each mismatch:

**File missing:**
```
windsurf is in config but file doesn't exist.
  1. Create the file (copy from .proagents/)
  2. Remove from config
```

**File exists but not in config:**
```
GEMINI.md exists but gemini not in config.
  1. Add to config
  2. Delete the file
```

### 6. Apply Fixes

Based on user choice:
- Create missing files (use `pa:ai-add` logic)
- Remove orphaned entries from config
- Add discovered platforms to config
- Delete orphaned files (use `pa:ai-remove` logic)

### 7. Confirm

```
Sync complete!
  - Added: gemini to config
  - Created: .windsurfrules
  - Removed: kiro from config (file was missing)
```

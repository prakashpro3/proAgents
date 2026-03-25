# pa:ai-list - List AI Platforms

Show which AI platforms are configured for this project.

## Steps

1. **Read config file:**
   ```bash
   cat ./proagents.config.yaml
   ```

2. **Extract `ai_platforms` array** from the config

3. **Display installed platforms:**
   ```
   Installed AI Platforms:
   - Claude Code (CLAUDE.md)
   - Cursor (.cursorrules)
   - ...
   ```

4. **Show available platforms** (not yet installed):
   - Read `.proagents/platforms.yaml` for full list
   - Compare with installed list
   - Show what can be added

## Output Format

```
Installed AI Platforms:
  [x] claude - Claude Code
  [x] cursor - Cursor

Available to Add:
  [ ] windsurf - Windsurf
  [ ] copilot - GitHub Copilot
  [ ] gemini - Gemini
  ...

Use pa:ai-add to add more platforms.
```

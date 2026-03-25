# pa:ai-add - Add AI Platform

Add a new AI platform configuration to this project.

## Steps

### 1. Read Available Platforms

**IMPORTANT:** Always read the authoritative list first - do not hallucinate platforms.

```bash
cat .proagents/platforms.yaml
```

### 2. Show Options to User

Display platforms grouped by category:

```
IDE-based AI Assistants:
  1. claude    - Claude Code (CLAUDE.md)
  2. cursor    - Cursor (.cursorrules)
  3. windsurf  - Windsurf (.windsurfrules)
  4. copilot   - GitHub Copilot (.github/copilot-instructions.md)
  5. kiro      - AWS Kiro (KIRO.md)
  6. gemini    - Gemini (GEMINI.md)

Web-based AI Platforms:
  7. replit    - Replit AI (REPLIT.md)
  8. bolt      - Bolt.new (BOLT.md)
  9. lovable   - Lovable (LOVABLE.md)

Auto-handled (use AGENTS.md):
  - ChatGPT, Groq, Antigravity, Codex CLI, OpenAI API

Which platform to add?
```

### 3. Create the File

After user selects platform:

1. **Read source template** from `.proagents/{file}`
2. **Check if target file exists** in project root:
   - If exists: Merge using markers (append ProAgents section)
   - If not exists: Create new file with markers

3. **Wrap content with markers:**
   ```
   <!-- PROAGENTS_START -->
   {content from template}
   <!-- PROAGENTS_END -->
   ```

### 4. Update Config

Add platform to `ai_platforms` array in `./proagents.config.yaml`:

```yaml
ai_platforms:
  - claude
  - cursor
  - {new_platform}  # Add this
```

### 5. Confirm

```
Added {platform_name}!
  File: {file_path}
  Config updated: ./proagents.config.yaml
```

## Merge Rules

When target file already exists:

1. **Has PROAGENTS markers:** Update content between markers only
2. **No markers:** Append ProAgents section at end with markers
3. **Never overwrite** user's existing configuration

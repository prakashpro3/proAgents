# ProAgents Command Details

Detailed execution instructions for all `pa:` commands.

## Feature Commands

### pa:feature "name"

Start a new feature workflow:

1. Create feature folder: `./.proagents/active-features/feature-[name]/`
2. Create `status.json`:
   ```json
   {
     "name": "feature-name",
     "started": "2024-03-06T15:00:00Z",
     "phase": "analysis",
     "progress": 0,
     "branch": "feature/feature-name"
   }
   ```
3. Update `_index.json` to add feature to `active_features`
4. Create git branch if git enabled
5. Start analysis phase

### pa:feature-list

Read `./.proagents/active-features/_index.json` and display:
- Active features with their phases
- Paused features with reasons
- Recently completed features

### pa:feature-complete

1. Move feature from `active_features` to `completed_features` in `_index.json`
2. Update feature's `status.json` with completion timestamp
3. Generate changelog entry
4. Suggest PR creation if git enabled

### pa:fix "description"

Quick bug fix mode (bypasses full workflow):

1. Analyze the bug description
2. Search codebase for relevant code
3. Implement fix directly
4. Run relevant tests
5. Log fix in activity.log

---

## Workflow Phase Commands

### pa:analyze

1. Read `./.proagents/prompts/01-analysis.md`
2. Scan project structure
3. Identify:
   - Framework/tech stack
   - Code patterns
   - Dependencies
   - Architecture style
4. Cache results in `./.proagents/cache/`
5. Output analysis summary

### pa:requirements

1. Read `./.proagents/prompts/02-requirements.md`
2. If feature specified, focus on that feature
3. Document:
   - Functional requirements
   - Non-functional requirements
   - Acceptance criteria
4. Save to feature folder

### pa:design

1. Read `./.proagents/prompts/03-ui-design.md`
2. Create:
   - UI mockups/wireframes (if applicable)
   - Component structure
   - Architecture decisions
3. Document design decisions

### pa:plan

1. Read `./.proagents/prompts/04-planning.md`
2. Create implementation plan:
   - Files to create/modify
   - Order of implementation
   - Dependencies between tasks
   - Estimated complexity
3. Save plan to feature folder

### pa:implement

1. Read `./.proagents/prompts/05-implementation.md`
2. Follow the plan created in planning phase
3. Write code following project patterns
4. Create/update tests as you go
5. Update progress in status.json

### pa:test

1. Read `./.proagents/prompts/06-testing.md`
2. Check `proagents.config.yaml` for test commands
3. Run tests based on config:
   ```yaml
   testing:
     tools:
       unit:
         command: "npm test"
         framework: "jest"
   ```
4. Report results

### pa:review

1. Read `./.proagents/prompts/06.5-code-review.md`
2. Review all changes in current feature
3. Check:
   - Code quality
   - Test coverage
   - Security issues
   - Performance concerns
4. Generate review report

### pa:doc

1. Read `./.proagents/prompts/07-documentation.md`
2. Options:
   - `pa:doc-api` - Generate API docs
   - `pa:doc-component` - Component documentation
   - `pa:doc-readme` - Update README
3. Follow project doc standards

### pa:deploy

1. Read `./.proagents/prompts/08-deployment.md`
2. Run pre-deployment checks
3. Create deployment checklist
4. Generate release notes if needed

---

## Documentation Commands

### pa:release

Generate release notes:

1. Read recent commits/changes
2. Categorize changes (features, fixes, breaking)
3. Generate formatted release notes
4. Save to `./RELEASE_NOTES.md`

### pa:changelog

Update changelog:

1. Read changes since last entry
2. Format according to Keep a Changelog
3. Update `./CHANGELOG.md`

---

## Quality Commands

### pa:qa

Full quality assurance:

1. Run linters
2. Run all tests
3. Check code coverage
4. Security scan
5. Performance check
6. Generate QA report

### pa:qa-security

Security-focused audit:

1. Check for common vulnerabilities (OWASP)
2. Scan dependencies for known issues
3. Review auth/permissions code
4. Generate security report

### pa:lint

Run project linters:

1. Check `package.json` for lint commands
2. Run ESLint/Prettier/etc.
3. Fix auto-fixable issues
4. Report remaining issues

---

## Collaboration Commands

### pa:handoff

Create handoff notes for other AIs:

1. Summarize current work status
2. List completed items
3. List in-progress items
4. Document blockers
5. Save to `./.proagents/handoff.md`

### pa:feedback "description"

Log feedback for AI learning:

1. Append to `./.proagents/feedback.md`:
   ```markdown
   ## [DATE] Feedback
   **Type:** correction/preference/pattern
   **Description:** [user's feedback]
   **Action:** [what should be done differently]
   ```
2. Apply learning to current work

### pa:decision "title"

Log architectural decision:

1. Create ADR in `./.proagents/adr/`
2. Document:
   - Context
   - Decision
   - Consequences
3. Reference in current feature

### pa:activity

Show recent AI activity:

1. Read `./.proagents/activity.log`
2. Show last 20 entries
3. Highlight recent changes to current files

---

## Configuration Commands

### pa:config

Show current configuration:

1. Read `proagents.config.yaml`
2. Display key settings:
   - AI platforms
   - Checkpoints
   - Git settings
   - Testing config

### pa:checkpoint

Pause for user approval:

1. Summarize completed work
2. Show next steps
3. Wait for user confirmation
4. Log checkpoint in activity

### pa:skip-checkpoint

Skip the current checkpoint and continue.

---

## Session Commands

### pa:session-end

Generate session summary:

1. List all changes made
2. List files modified
3. List commands executed
4. Document any issues
5. Save to session history

### pa:lock

Show lock status:

1. Check `./.proagents/.lock`
2. Show who holds lock
3. Show what task is locked
4. Show expiration time

### pa:lock-release

Release lock if you hold it:

1. Verify you hold the lock
2. Delete `./.proagents/.lock`
3. Log release in activity

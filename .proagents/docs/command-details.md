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

---

## Debug & Log Commands

### pa:debug

Start a debug session:

1. Detect project platform (Web, React Native, Android, iOS)
2. Identify the issue from user description or recent errors
3. Set up appropriate debug tools
4. Analyze logs and trace execution
5. Suggest fixes based on log analysis

### pa:debug-add

Add debug logs throughout code:

1. Detect platform (Web/RN/Android/iOS)
2. Analyze code structure
3. Add appropriate logging:
   - Function entry/exit with params
   - Variable state changes
   - API calls and responses
   - Error conditions
4. Mark all logs with `// DEBUG:START` and `// DEBUG:END`
5. Use platform-appropriate syntax:
   - JS/TS: `console.log('[DEBUG]', ...)`
   - Android: `Log.d("DEBUG", ...)`
   - iOS: `print("[DEBUG]", ...)`

### pa:debug-trace "function"

Add detailed tracing to specific function:

1. Find function in codebase
2. Add entry log with all parameters
3. Add timing measurement
4. Add exit log with return value
5. Wrap in try-catch with error logging

### pa:debug-var "variable"

Track all changes to a variable:

1. Find variable declaration
2. Add change tracking (willSet/didSet, proxy, setter)
3. Log old value → new value
4. Include stack trace for debugging

### pa:debug-api

Add API request/response logging:

1. Find all API/fetch calls
2. Add request logging (method, url, body)
3. Add response logging (status, data, timing)
4. Add error logging with full details

### pa:debug-state

Add state change logging:

1. Find state management code
2. Add logging for state changes:
   - React: useState, useReducer, Redux, Zustand
   - Android: ViewModel, LiveData, StateFlow
   - iOS: @State, @Published, ObservableObject
3. Log before/after values

### pa:debug-error

Add comprehensive error logging:

1. Wrap risky code in try-catch
2. Add error boundaries (React)
3. Log error message, stack, context
4. Add breadcrumb trail

### pa:debug-web

Web/browser debugging:

1. Check browser console for errors
2. Inspect network requests
3. Review console.log statements
4. Check for debugger statements
5. Analyze stack traces

### pa:debug-rn

React Native debugging:

1. Check Metro bundler logs
2. Use Flipper or Reactotron
3. View device logs via ADB (Android) or Console.app (iOS)
4. Check `__DEV__` conditional logs
5. Analyze red screen errors

### pa:debug-android

Android native debugging:

1. Run `adb logcat` with appropriate filters
2. Filter by tag: `adb logcat -s MyApp:D`
3. Filter by priority: `adb logcat *:E` (errors only)
4. Check for crashes in Logcat
5. Use Android Studio Logcat panel

### pa:debug-ios

iOS native debugging:

1. Use Xcode console (Cmd+Shift+C)
2. Check Console.app with device selected
3. Filter by subsystem/category with os_log
4. Run `xcrun simctl spawn booted log stream`
5. Check crash logs in Organizer

### pa:logs

View recent logs:

1. Detect platform
2. Show last N log entries
3. Highlight errors and warnings
4. Group by timestamp or component

### pa:logs-filter "term"

Filter logs by search term:

1. Search logs for matching term
2. Show context around matches
3. Highlight matched text

### pa:logs-clear

Clear debug logs:

- Web: Clear browser console
- React Native: Restart Metro bundler
- Android: `adb logcat -c`
- iOS: Clear in Console.app

### pa:debug-clean

Remove debug statements before production:

1. Find all debug statements:
   - `console.log`, `console.debug`, `debugger` (JS)
   - `Log.d`, `Log.v`, `System.out` (Android)
   - `print`, `debugPrint`, `NSLog` (iOS)
2. List found statements with file:line
3. Offer to remove or comment out
4. Verify no production-breaking changes

# Phase 0: Project Setup Wizard

Interactive project setup guide with AI-powered recommendations, quick presets, and full automation.

---

## Trigger

User runs `pa:project-setup` or `pa:setup`.

---

## Purpose

This command helps set up projects through a dynamic questionnaire with:
- **Quick Presets** - Instant setup for common project types
- **Idea-First Mode** - Describe your idea, AI suggests tech stack
- **Comparison Tables** - Side-by-side option comparison
- **Full Automation** - Install packages, create structure, generate docs

Works for both **new projects** and **existing projects**.

---

## Entry Point

```
🚀 Project Setup Wizard

How would you like to start?

1. ⚡ Quick Preset - Instant setup, no questions
2. 💡 I have an idea - help me choose tech stack
3. 🔧 New project - I know what I want
4. 📂 Existing project - already has code
5. 🔍 Unknown - analyze my codebase first

Select (1-5):
```

---

## Option 1: Quick Presets

Pre-defined setups for common project types. Skip all questions, instant setup.

### Show Presets

```
⚡ Quick Presets - Choose your stack:

════════════════════════════════════════════════════
MOBILE APPS
════════════════════════════════════════════════════
1. 📱 Mobile MVP (React Native + Expo + Firebase)
   Auth, Database, Push notifications, Analytics

2. 📱 Mobile Pro (React Native + Node.js + PostgreSQL)
   Full backend control, Custom API, Scalable

3. 📱 Flutter Starter (Flutter + Supabase)
   Beautiful UI, Open-source backend

════════════════════════════════════════════════════
WEB APPS
════════════════════════════════════════════════════
4. 🌐 SaaS Starter (Next.js + Prisma + PostgreSQL)
   Auth, Payments, Dashboard, API routes

5. 🌐 E-commerce (Next.js + Shopify/Stripe)
   Product catalog, Cart, Checkout, Payments

6. 🌐 Landing Page (Next.js + Tailwind + Vercel)
   Fast, SEO optimized, Easy deployment

════════════════════════════════════════════════════
BACKEND/API
════════════════════════════════════════════════════
7. 🔌 REST API (Node.js + Express + PostgreSQL)
   CRUD, Auth, Validation, Tests

8. 🔌 GraphQL API (Node.js + Apollo + PostgreSQL)
   Type-safe, Subscriptions, Playground

════════════════════════════════════════════════════

Select preset (1-8) or type "back" for other options:
```

### Preset Details

After user selects, show what will be installed:

```
📱 Mobile MVP Preset Selected!

This will set up:
─────────────────────────────────────
Framework:    React Native (Expo)
Language:     TypeScript
Navigation:   React Navigation
State:        Zustand
Data:         TanStack Query
UI:           NativeWind (Tailwind)
Backend:      Firebase
Services:     Auth, Firestore, Storage, FCM, Analytics
Testing:      Jest + Testing Library
─────────────────────────────────────

📦 Packages to install: 15
📂 Folders to create: 8
📄 Config files: 6

Proceed with setup? (yes/no/customize)
```

### Preset Configurations

**Preset 1: Mobile MVP**
```yaml
type: mobile
framework: expo
language: typescript
packages:
  - @react-navigation/native
  - @react-navigation/stack
  - zustand
  - @tanstack/react-query
  - nativewind
  - tailwindcss
  - @react-native-firebase/app
  - @react-native-firebase/auth
  - @react-native-firebase/firestore
  - @react-native-firebase/storage
  - @react-native-firebase/messaging
  - @react-native-firebase/analytics
folders:
  - src/screens
  - src/components
  - src/navigation
  - src/hooks
  - src/services
  - src/stores
  - src/utils
  - src/types
```

**Preset 2: Mobile Pro**
```yaml
type: mobile
framework: expo
language: typescript
packages:
  - @react-navigation/native
  - @react-navigation/stack
  - zustand
  - @tanstack/react-query
  - nativewind
  - axios
backend:
  - express
  - prisma
  - @prisma/client
  - jsonwebtoken
  - bcrypt
database: postgresql
```

**Preset 3: Flutter Starter**
```yaml
type: mobile
framework: flutter
language: dart
packages:
  - supabase_flutter
  - flutter_riverpod
  - go_router
  - dio
```

**Preset 4: SaaS Starter**
```yaml
type: fullstack
framework: nextjs
language: typescript
packages:
  - next-auth
  - prisma
  - @prisma/client
  - stripe
  - tailwindcss
  - zustand
  - @tanstack/react-query
database: postgresql
```

**Preset 5: E-commerce**
```yaml
type: fullstack
framework: nextjs
language: typescript
packages:
  - @shopify/hydrogen (or stripe)
  - tailwindcss
  - zustand
  - swr
```

**Preset 6: Landing Page**
```yaml
type: web
framework: nextjs
language: typescript
packages:
  - tailwindcss
  - framer-motion
  - next-seo
deployment: vercel
```

**Preset 7: REST API**
```yaml
type: backend
framework: express
language: typescript
packages:
  - express
  - prisma
  - @prisma/client
  - jsonwebtoken
  - bcrypt
  - zod
  - helmet
  - cors
  - jest
  - supertest
database: postgresql
```

**Preset 8: GraphQL API**
```yaml
type: backend
framework: apollo-server
language: typescript
packages:
  - @apollo/server
  - graphql
  - prisma
  - @prisma/client
  - type-graphql
database: postgresql
```

---

## Option 2: Idea-First Flow

User describes their idea, AI suggests tech stack options.

### Step 1: Gather Idea

```
💡 Tell me about your idea:

- What are you building?
- What problem does it solve?
- Who are the users?

Just describe it naturally, I'll ask follow-up questions.
```

### Step 2: Clarifying Questions

Ask 3-5 clarifying questions based on the idea:

```
Interesting! Let me understand better:

Q: Who are the target users?
1. Single user type (e.g., customers)
2. Two user types (e.g., buyers + sellers)
3. Multiple user types (e.g., customers + vendors + admins)

Q: Expected scale in first 6 months?
1. Small (<1000 users)
2. Medium (1-10K users)
3. Large (10K+ users)

Q: Key features needed?
[ ] User authentication
[ ] Real-time updates
[ ] Payment processing
[ ] Push notifications
[ ] File uploads
[ ] Chat/messaging
[ ] Maps/location
[ ] Offline support
```

### Step 3: Show Comparison Table

After gathering requirements, show comparison of 2-3 options:

```
📊 Based on your requirements, here are my recommendations:

┌─────────────────┬────────────────────┬────────────────────┬────────────────────┐
│                 │ OPTION 1 ⭐        │ OPTION 2           │ OPTION 3           │
│                 │ [Stack 1]          │ [Stack 2]          │ [Stack 3]          │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Best for        │ [Use case]         │ [Use case]         │ [Use case]         │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Time to launch  │ [X months]         │ [X months]         │ [X months]         │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Learning curve  │ [Low/Med/High]     │ [Low/Med/High]     │ [Low/Med/High]     │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Scalability     │ [Low/Med/High]     │ [Low/Med/High]     │ [Low/Med/High]     │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Monthly cost    │ $[X]-[Y]           │ $[X]-[Y]           │ $[X]-[Y]           │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ [Feature 1]     │ ✅/⚠️/❌           │ ✅/⚠️/❌           │ ✅/⚠️/❌           │
├─────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ [Feature 2]     │ ✅/⚠️/❌           │ ✅/⚠️/❌           │ ✅/⚠️/❌           │
└─────────────────┴────────────────────┴────────────────────┴────────────────────┘

Legend: ✅ Built-in  ⚠️ Requires setup  ❌ Not available

💡 My recommendation: OPTION [X]

Why? [Explanation based on user's specific requirements]

Which option? (1/2/3) or type "more [option]" for details:
```

### Step 4: Continue to Setup

After user picks option, continue with detailed setup questions if needed, then execute automation.

---

## Option 3: Direct Setup Flow

User knows what they want. Guide through structured questions.

### Step 1: Project Type

```
What type of project are you building?

1. Web Frontend - SPA, PWA, static sites
2. Full-stack - Frontend + Backend
3. Mobile - iOS, Android, cross-platform
4. Desktop - Windows, macOS, Linux apps
5. Backend/API - REST, GraphQL, microservices
6. CLI Tool - Command-line applications
7. Library/Package - Reusable packages
8. Monorepo - Multiple related projects
9. Other (describe)

💡 Suggestion: For user-facing apps with data, Full-stack (2)
   gives you the best developer experience.

Select (1-9):
```

### Step 2: Framework (based on type)

Show 2-3 options with pros/cons and recommendation:

**For Mobile:**
```
Which mobile framework?

1. React Native (Expo) ⭐ Recommended
   ✓ Pros: Quick setup, OTA updates, large ecosystem
   ✗ Cons: Limited native access (can eject later)

2. React Native (Bare)
   ✓ Pros: Full native access, custom modules
   ✗ Cons: More complex setup, manual linking

3. Flutter
   ✓ Pros: Excellent performance, beautiful UI
   ✗ Cons: Dart language, smaller ecosystem

💡 Suggestion: Expo for faster development. You can eject later.

Select (1-3) or type "more" for detailed comparison:
```

**For Full-stack:**
```
Which full-stack framework?

1. Next.js (React) ⭐ Recommended
   ✓ Pros: SSR/SSG, API routes, great DX, Vercel deployment
   ✗ Cons: React-specific

2. Nuxt (Vue)
   ✓ Pros: SSR/SSG, auto-imports, Vue ecosystem
   ✗ Cons: Smaller community than React

3. SvelteKit
   ✓ Pros: Minimal boilerplate, fast, great DX
   ✗ Cons: Newer, smaller ecosystem

Select (1-3):
```

### Step 3: Additional Tools

```
📦 Based on [Framework], I recommend:

Navigation: [Tool] ⭐
State:      [Tool] (or [Alternative])
Data:       [Tool] ⭐
UI:         [Tool] ⭐
Testing:    [Tool]

Want me to add these? (yes/no/customize)
```

### Step 4: Backend/Database

```
Backend/API type?

1. BaaS (Firebase/Supabase) ⭐ Fast setup
2. Custom backend (Node.js/Python)
3. Existing API (I have one)
4. No backend needed

💡 Suggestion: For MVP, Firebase/Supabase gets you to market faster.

Select (1-4):
```

### Step 5: Environment Variables

```
Environment variables needed?

Based on your choices, you'll need:
- [VAR_1] - [description]
- [VAR_2] - [description]

Add any custom env vars? (list them or "none"):
```

---

## Option 4: Existing Project Flow

Analyze existing codebase and suggest improvements.

### Step 1: Analyze

```
📂 Analyzing your project...

Detected:
─────────────────────────
Project Type:   React Native (Mobile)
Framework:      Expo
Language:       TypeScript
Package Manager: npm
Database:       Firebase
─────────────────────────

Is this correct? (yes/no/partially):
```

### Step 2: Validate & Improve

```
✅ Analysis complete!

Current setup:
- Framework: Expo ✓
- Navigation: React Navigation ✓
- State: None detected ⚠️
- API/Data: Direct fetch calls ⚠️
- UI: StyleSheet (no library) ⚠️
- Testing: Jest (no component tests) ⚠️

💡 Suggested improvements:

1. Add Zustand for state management
   Why: Simple, minimal boilerplate, great for RN

2. Add TanStack Query for data fetching
   Why: Caching, refetching, loading states

3. Add NativeWind for styling
   Why: Tailwind for RN, faster development

4. Add @testing-library/react-native
   Why: Better component testing

Would you like me to add these? (yes/no/customize):
```

### Step 3: Generate Documentation

```
📄 Generating documentation:

✓ docs/PROJECT_SETUP.md - Complete setup guide
✓ docs/ONBOARDING.md - Developer onboarding
✓ .env.example - Updated with all env vars

Files created in docs/ folder.
```

---

## Full Automation

After collecting all answers, execute automatically **in the current folder**.

> **Important:** All setup happens in the current folder (`.`), not in a subfolder.
> This ensures ProAgents configuration remains accessible.

```
🚀 Starting automated setup in current folder...

Phase 1: Project Initialization
─────────────────────────
$ [create command with . or --cwd flag]
✓ Project initialized in current folder

$ git init (if not already initialized)
✓ Git initialized

Phase 2: Installing Packages
─────────────────────────
$ [install commands]
✓ [Package] installed
✓ [Package] installed
...

Phase 3: Creating Structure
─────────────────────────
✓ src/[folder]/
✓ src/[folder]/
...

Phase 4: Config Files
─────────────────────────
✓ [config file]
✓ [config file]
...

Phase 5: Boilerplate Files
─────────────────────────
✓ src/[file]
✓ src/[file]
...

Phase 6: Documentation
─────────────────────────
✓ docs/PROJECT_SETUP.md
✓ docs/ONBOARDING.md
✓ .env.example

════════════════════════════════════
✅ SETUP COMPLETE!
════════════════════════════════════

📁 Project: ./ (current folder)
📦 Packages: [X] installed
📂 Folders: [X] created
📄 Files: [X] generated

🎯 Next steps:
1. Copy .env.example to .env
2. Add your config values
3. Run: [start command]
4. Start building: pa:feature "[First feature]"

Want more suggestions? Type "more [topic]"
```

---

## AI Behavior Rules

1. **Always use current folder** - Never create subfolders for new projects. Use `.` or `--cwd` flags (e.g., `npx create-next-app .` not `npx create-next-app my-app`)
2. **Merge existing files** - If docs/PROJECT_SETUP.md or docs/ONBOARDING.md exists, merge new content (update sections, preserve custom content, never delete)
3. **Ask ONE question at a time** (unless user prefers batch)
4. **Always show recommendations** with ⭐ marker
5. **Always explain WHY** you recommend something
6. **Show comparison tables** when presenting 2-3 options
7. **Provide "more" option** for deeper explanations
8. **Allow customization** at every step
9. **Confirm before automation** - show what will be installed/created
10. **Save progress** - Auto-save to `.proagents/setup-progress.json` after each step, offer resume on next run
11. **Log all actions** to activity.log

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pa:project-setup` | Full interactive wizard |
| `pa:setup` | Alias for pa:project-setup |
| `pa:setup --preset [name]` | Use specific preset (mobile-mvp, saas, etc.) |
| `pa:setup --quick` | Minimal questions only |
| `pa:setup --analyze` | Analyze existing project only |
| `pa:setup --resume` | Resume interrupted setup |
| `pa:setup --clear-progress` | Clear saved progress and start fresh |

---

## Resume Interrupted Setup

If user exits midway, progress is automatically saved. Next time they run `pa:setup`, offer to resume.

### Progress File

Saved to: `.proagents/setup-progress.json`

```json
{
  "started_at": "2024-01-15T10:30:00Z",
  "last_updated": "2024-01-15T10:35:00Z",
  "completed_steps": 4,
  "total_steps": 8,
  "answers": {
    "project_type": "mobile",
    "framework": "expo",
    "language": "typescript",
    "backend": "firebase"
  },
  "pending_questions": ["services", "env_vars", "folder_structure"],
  "packages_installed": ["@react-navigation/native", "zustand"],
  "folders_created": ["src/screens", "src/components"],
  "phase": "collecting_answers"
}
```

### Resume Prompt

```
📋 Previous setup found!

Started: 2 hours ago
Progress: ████████░░░░ 50% (4/8 steps)

Choices so far:
- Type: Mobile (React Native)
- Framework: Expo
- Language: TypeScript
- Backend: Firebase

Options:
1. Resume from where you left off
2. Start fresh (discard progress)
3. View saved answers

Select (1-3):
```

### Auto-Save Triggers

Progress is saved automatically:
- After each question is answered
- After each package is installed
- After each folder is created
- Before any potentially failing operation

### Cleanup

Delete progress file after:
- Setup completes successfully
- User chooses "Start fresh"
- User runs `pa:setup --clear-progress`

---

## Output Files

### Handling Existing Files

If `docs/PROJECT_SETUP.md` or `docs/ONBOARDING.md` already exists, use **merge strategy**:

**Applies to both files:**
- `docs/PROJECT_SETUP.md` - Project configuration and setup guide
- `docs/ONBOARDING.md` - Developer onboarding guide

**Merge steps:**

1. **Read existing file** - Parse current content and sections
2. **Identify sections** - Match by headers (## Overview, ## Prerequisites, etc.)
3. **Merge rules:**
   - **Update** existing sections with new values (e.g., new packages, new env vars)
   - **Preserve** custom content user added (custom sections, notes, warnings)
   - **Add** new sections that don't exist
   - **Never delete** user's custom sections
4. **Mark updates** - Add `> Updated: [DATE]` after the header

**Example merge (PROJECT_SETUP.md):**

```markdown
## Environment Variables

> Updated: 2024-01-15

| Variable | Description | Required |
|----------|-------------|----------|
| API_KEY | Existing var (preserved) | Yes |
| NEW_VAR | Added by setup | Yes |

<!-- User's custom notes below are preserved -->
Note: Get API_KEY from admin dashboard.
```

**Example merge (ONBOARDING.md):**

```markdown
## Code Standards

> Updated: 2024-01-15

- ESLint + Prettier (existing - preserved)
- TypeScript strict mode (added by setup)

<!-- User's team-specific notes preserved -->
Ask @john for code review access.
```

**Merge indicators in logs:**
```
✓ docs/PROJECT_SETUP.md (merged - 2 sections updated, 1 added)
✓ docs/ONBOARDING.md (merged - 1 section updated)
```

---

### docs/PROJECT_SETUP.md

```markdown
# Project Setup Guide

> Generated by ProAgents `pa:project-setup`
> Last updated: [DATE]

## Overview

| Field | Value |
|-------|-------|
| Project Name | [name] |
| Type | [type] |
| Framework | [framework] |
| Language | [language] |

## Prerequisites

- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

## Quick Start

[Installation commands]

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| [VAR] | [desc] | Yes/No |

## Development Commands

| Command | Description |
|---------|-------------|
| [cmd] | [desc] |

## Project Structure

[Directory tree]

## Architecture

[High-level description]

## Deployment

[Deployment instructions]
```

### docs/ONBOARDING.md

```markdown
# Developer Onboarding Guide

> For new team members joining this project

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment
4. Run the project

## Code Standards

[Coding conventions]

## Architecture Overview

[System design]

## Common Tasks

[How to do X, Y, Z]
```

---

## Logging

After completion, log to `.proagents/activity.log`:

```
[DATE TIME] [AI:model] [pa:project-setup] Started project setup
[DATE TIME] [AI:model] [pa:project-setup] Selected preset: mobile-mvp
[DATE TIME] [AI:model] [pa:project-setup] Initialized project in current folder
[DATE TIME] [AI:model] [pa:project-setup] Installed 15 packages
[DATE TIME] [AI:model] [pa:project-setup] Created 8 folders
[DATE TIME] [AI:model] [pa:project-setup] Merged docs/PROJECT_SETUP.md (2 sections updated)
[DATE TIME] [AI:model] [pa:project-setup] Merged docs/ONBOARDING.md (1 section added)
[DATE TIME] [AI:model] [pa:project-setup] Setup complete
```

Update `.proagents/worklog/_context.md`:

```markdown
## Quick Summary
Last: [AI] ran project setup
Type: [project type]
Framework: [framework]
Output: docs/PROJECT_SETUP.md, docs/ONBOARDING.md

## Flow Context
```
Current Flow: project-setup
Last Command: pa:project-setup
Decision: [framework] + [backend] stack
Context: [project type] project initialized
Next Suggested: pa:feature "[first feature]"
Data: {"type": "[project type]", "framework": "[framework]", "backend": "[backend]", "packages": [...]}
```
```

### Flow Context Integration

After project setup completes, the next steps section offers:

```
🎯 Next steps:
1. Copy .env.example to .env
2. Add your config values
3. Run: [start command]
4. Start building: pa:feature "[First feature]"
```

When user runs pa:feature, it reads Flow Context and understands the tech stack:

```
📋 Project Context Loaded

Stack: [framework] + [backend]
Setup: [date]

Creating feature with this stack context.
```

# Team Onboarding Guide

Get new team members productive with ProAgents quickly.

---

## Overview

This guide helps new developers get up to speed with ProAgents and your project's development workflow. Follow these steps in order for the smoothest onboarding experience.

---

## Day 1: Environment Setup

### 1. Clone the Repository

```bash
git clone [repository-url]
cd [project-name]
```

### 2. Install Dependencies

```bash
# Node.js (use version from .nvmrc)
nvm use

# Install packages
npm install

# Install ProAgents CLI (if separate)
npm install -g proagents-cli
```

### 3. Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
code .env.local
```

### 4. IDE Setup

Follow the IDE setup guide for your editor:
- [VS Code](./ide-setup/vscode.md)
- [Cursor](./ide-setup/cursor.md)
- [JetBrains](./ide-setup/jetbrains.md)

### 5. Verify Setup

```bash
# Run health check
proagents doctor

# Start development server
npm run dev

# Run tests
npm test
```

---

## Day 1-2: Understanding the Project

### 1. Read Project Documentation

| Document | Purpose | Time |
|----------|---------|------|
| `README.md` | Project overview | 10 min |
| `proagents/WORKFLOW.md` | Development workflow | 30 min |
| `proagents/standards/` | Coding standards | 30 min |
| Architecture docs | System design | 30 min |

### 2. Explore the Codebase

```bash
# Run codebase analysis
proagents analyze --depth moderate

# View project structure
proagents structure
```

Key directories to explore:
- `src/` - Main source code
- `proagents/` - Workflow documentation
- `tests/` - Test files
- `docs/` - Additional documentation

### 3. Understand the Tech Stack

Review `package.json` and understand:
- Framework (React, Next.js, etc.)
- State management approach
- Styling solution
- Testing tools
- Build tools

---

## Week 1: First Contributions

### Day 3-4: First Bug Fix

Start with a small bug fix to learn the workflow:

1. **Find a "good first issue"** in your issue tracker
2. **Create a branch**:
   ```bash
   git checkout -b fix/issue-description
   ```
3. **Follow bug fix workflow**:
   ```bash
   proagents fix "issue description"
   ```
4. **Make the fix** following coding standards
5. **Run tests**:
   ```bash
   npm test
   ```
6. **Create PR** and request review

### Day 5: Code Review

1. **Review others' PRs** to learn patterns
2. **Get feedback** on your PR
3. **Iterate** based on feedback
4. **Merge** your first contribution!

---

## Week 2: Feature Development

### First Feature

Work on a small feature:

1. **Use full workflow**:
   ```bash
   proagents feature start "feature description"
   ```
2. **Follow all phases**:
   - Analysis
   - Requirements
   - Design
   - Implementation
   - Testing
   - Review

3. **Use checklists**:
   ```bash
   proagents checklist current
   ```

4. **Document your work** in the changelog

---

## Learning Resources

### Internal

| Resource | Description |
|----------|-------------|
| `proagents/prompts/` | AI prompts for each phase |
| `proagents/examples/` | Example implementations |
| `proagents/checklists/` | Quality checklists |
| `proagents/standards/` | Coding standards |

### Team Resources

- **Slack/Teams channel**: #dev-help
- **Wiki/Confluence**: [link]
- **Tech talks**: [schedule]
- **Mentor**: [assigned mentor name]

### External

- Framework documentation
- Style guide references
- Testing best practices

---

## Key Contacts

| Role | Person | Contact |
|------|--------|---------|
| Tech Lead | [Name] | [contact] |
| Onboarding Buddy | [Name] | [contact] |
| DevOps | [Name] | [contact] |
| Product Manager | [Name] | [contact] |

---

## Common Questions

### How do I...

**Start a new feature?**
```bash
proagents feature start "description"
```

**Run tests?**
```bash
npm test                 # All tests
npm test -- --watch      # Watch mode
npm test -- path/to/file # Specific file
```

**Check coding standards?**
```bash
npm run lint
npm run type-check
```

**Create a PR?**
1. Push your branch
2. Open PR in GitHub/GitLab
3. Fill out template
4. Request review

**Deploy to staging?**
```bash
proagents deploy staging
```

---

## Onboarding Checklist

### Week 1

- [ ] Environment set up and working
- [ ] Can run the project locally
- [ ] Read project README
- [ ] Read ProAgents WORKFLOW.md
- [ ] Explored codebase with `proagents analyze`
- [ ] Completed first bug fix
- [ ] Reviewed at least one PR
- [ ] Met with mentor

### Week 2

- [ ] Completed first feature (small)
- [ ] Followed full ProAgents workflow
- [ ] Used all checklists
- [ ] Updated documentation
- [ ] Participated in code review
- [ ] Asked questions in team channel

### Month 1

- [ ] Completed 2-3 features
- [ ] Can work independently
- [ ] Understanding of architecture
- [ ] Comfortable with workflow
- [ ] Can review others' code
- [ ] Contributed to standards (optional)

---

## Feedback

Help us improve onboarding!

After your first month, please provide feedback:
- What worked well?
- What was confusing?
- What documentation was missing?
- Suggestions for improvement

Contact: [onboarding feedback channel]

# Team Onboarding Guide

Guide for onboarding new team members to ProAgents.

---

## Overview

This guide helps team leads onboard new developers to use ProAgents effectively.

---

## Onboarding Checklist

### Day 1: Setup

- [ ] Install required tools
- [ ] Configure IDE ([IDE Setup](./ide-setup.md))
- [ ] Clone project repository
- [ ] Run `proagents init` in project
- [ ] Review project configuration

### Day 2: Learn the Workflow

- [ ] Read [WORKFLOW.md](../WORKFLOW.md)
- [ ] Read [GETTING-STARTED-STORY.md](../GETTING-STARTED-STORY.md)
- [ ] Understand the 10 workflow phases
- [ ] Review project standards

### Day 3: First Feature

- [ ] Pick a small starter task
- [ ] Run through workflow with mentor
- [ ] Complete first feature with guidance
- [ ] Review and get feedback

---

## Quick Start for New Developers

### 1. Understand the Workflow

ProAgents uses a 10-phase development workflow:

```
1. Init       → 2. Analysis   → 3. Requirements → 4. Design
     ↓
5. Planning   → 6. Implementation → 7. Testing → 8. Review
     ↓
9. Documentation → 10. Deployment
```

### 2. Key Commands

```bash
# Start a new feature
/feature-start "Feature name"

# Check status
pa:status

# Get help
/help

# Quick bug fix
/fix "Bug description"
```

### 3. Important Files

| File | Purpose |
|------|---------|
| `proagents.config.yaml` | Project configuration |
| `proagents/prompts/` | Workflow phase prompts |
| `proagents/standards/` | Coding standards |
| `proagents/checklists/` | Quality checklists |

---

## Team Configuration

### Setting Up Team Standards

1. **Review Existing Standards**
```bash
ls proagents/standards/
```

2. **Customize for Your Team**
```bash
# Copy and customize templates
cp proagents/config/standards/*.template.md proagents/standards/
```

3. **Document Team Conventions**
   - Naming conventions
   - Code review process
   - Testing requirements
   - Documentation standards

---

## Role-Based Onboarding

### Junior Developers

**Focus Areas:**
- Understanding the workflow phases
- Following existing patterns
- Learning from codebase analysis
- Pair programming with seniors

**Recommended Learning Path:**
1. Read GETTING-STARTED-STORY.md (narrative walkthrough)
2. Complete example project walkthrough
3. Shadow a senior on a feature
4. Take on a small bug fix independently

### Senior Developers

**Focus Areas:**
- Customizing workflow for team
- Setting up project standards
- Configuring integrations
- Training other team members

**Recommended Learning Path:**
1. Read full WORKFLOW.md documentation
2. Review configuration options
3. Set up team-specific standards
4. Configure PM tool integration

### Tech Leads

**Focus Areas:**
- Overall workflow configuration
- Team standards definition
- Integration with existing processes
- Metrics and reporting

**Recommended Learning Path:**
1. Full documentation review
2. Configure checkpoints and approvals
3. Set up reporting dashboards
4. Define team conventions

---

## Common Questions

### Q: How does ProAgents work with our existing tools?

ProAgents integrates with:
- **Git**: Automatic branch management, commit conventions
- **Jira/Linear**: Issue tracking sync
- **Slack**: Notifications and updates
- **CI/CD**: Deployment integration

See [PM Integration](./pm-integration.md) for setup.

### Q: Can I skip workflow phases?

Yes! ProAgents supports flexible entry modes:
- **Full Mode**: All phases (new features)
- **Bug Fix Mode**: Streamlined (fixes)
- **Quick Change Mode**: Minimal (config changes)

Configure in `proagents.config.yaml`:
```yaml
entry_modes:
  allow_direct_implementation: true
  allow_bug_fix_fast_track: true
```

### Q: How do I handle existing code that doesn't follow standards?

1. Run codebase analysis first
2. ProAgents learns existing patterns
3. Gradually align new code with standards
4. Create tech debt items for legacy code

### Q: What if the AI suggestion is wrong?

1. Provide feedback using the correction system
2. ProAgents learns from corrections
3. Future suggestions will improve
4. Manual override is always available

---

## Training Sessions

### Session 1: Introduction (30 min)
- What is ProAgents?
- Workflow overview
- Demo of basic commands

### Session 2: Hands-On (60 min)
- Set up development environment
- Walk through a feature together
- Practice key commands

### Session 3: Advanced (45 min)
- Configuration customization
- Integration setup
- Parallel development

---

## Resources

### Documentation
- [Main README](../README.md)
- [Full Workflow](../WORKFLOW.md)
- [Getting Started Story](../GETTING-STARTED-STORY.md)

### Examples
- [React Example](../examples/web-frontend-react/)
- [Next.js Example](../examples/fullstack-nextjs/)
- [Node.js Example](../examples/backend-nodejs/)

### Support
- Check `pa:help` for command reference
- Review troubleshooting guides
- Ask in team Slack channel

---

## Feedback

Help us improve onboarding:
- What was confusing?
- What was missing?
- What worked well?

Submit feedback through the ProAgents feedback system or team channels.

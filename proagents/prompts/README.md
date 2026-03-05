# AI Prompts

Universal prompts for each workflow phase.

---

## Overview

These prompts work with any AI platform (Claude, ChatGPT, Gemini, Copilot, etc.) and guide the workflow through each phase.

## Phase Prompts

| Phase | Prompt File | Description |
|-------|-------------|-------------|
| 0 | [00-init.md](./00-init.md) | Initialize workflow |
| 0 | [00-init-wizard.md](./00-init-wizard.md) | Interactive setup wizard |
| 1 | [01-analysis.md](./01-analysis.md) | Codebase analysis |
| 2 | [02-requirements.md](./02-requirements.md) | Requirements gathering |
| 3 | [03-ui-design.md](./03-ui-design.md) | UI/UX design integration |
| 4 | [04-planning.md](./04-planning.md) | Implementation planning |
| 5 | [05-implementation.md](./05-implementation.md) | Code implementation |
| 6 | [06-testing.md](./06-testing.md) | Testing phase |
| 6.5 | [06.5-code-review.md](./06.5-code-review.md) | Code review |
| 7 | [07-documentation.md](./07-documentation.md) | Documentation |
| 8 | [08-deployment.md](./08-deployment.md) | Deployment preparation |
| 9 | [09-rollback.md](./09-rollback.md) | Rollback procedures |

## Usage

### With Slash Commands

```
/init           → Uses 00-init.md
/feature-start  → Uses full workflow
/doc            → Uses 07-documentation.md
```

### Manual Copy-Paste

Copy the prompt content and paste into your AI chat.

## Customizing Prompts

Override prompts in your project:

```
your-project/
└── .proagents/
    └── prompts/
        └── 01-analysis.md  # Your custom version
```

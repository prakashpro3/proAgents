# Refactoring Prompts

AI-assisted code refactoring workflows.

---

## Available Prompts

| Prompt | Use Case |
|--------|----------|
| [code-smells.md](./code-smells.md) | Identify and fix code smells |
| [extract-patterns.md](./extract-patterns.md) | Extract reusable patterns |
| [modernize.md](./modernize.md) | Update to modern patterns |
| [simplify.md](./simplify.md) | Reduce complexity |

---

## Quick Commands

```bash
pa:refactor identify    # Find refactoring opportunities
pa:refactor plan        # Create refactoring plan
pa:refactor execute     # Perform refactoring
pa:refactor validate    # Verify refactoring
```

---

## Refactoring Workflow

```
1. Identify Opportunities
   - Code smells
   - Duplications
   - Complex functions

2. Plan Refactoring
   - Prioritize changes
   - Identify risks
   - Plan tests

3. Execute Incrementally
   - Small, focused changes
   - Maintain tests
   - Preserve behavior

4. Validate
   - Run tests
   - Compare behavior
   - Review changes
```

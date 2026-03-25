# Debugging Prompts

AI-assisted debugging workflows.

---

## Available Prompts

| Prompt | Use Case |
|--------|----------|
| [systematic.md](./systematic.md) | Systematic debugging approach |
| [error-analysis.md](./error-analysis.md) | Analyze error messages |
| [performance.md](./performance.md) | Debug performance issues |
| [memory.md](./memory.md) | Debug memory leaks |

---

## Quick Commands

```bash
pa:debug analyze <error>     # Analyze error message
pa:debug trace <issue>       # Trace issue through code
pa:debug suggest <symptom>   # Get fix suggestions
pa:debug test <hypothesis>   # Test a hypothesis
```

---

## Debugging Workflow

```
1. Reproduce
   - Consistent steps
   - Minimal reproduction
   - Environment details

2. Isolate
   - Narrow scope
   - Binary search
   - Remove variables

3. Identify
   - Root cause analysis
   - Trace execution
   - Check assumptions

4. Fix
   - Minimal change
   - Test fix
   - Prevent regression
```

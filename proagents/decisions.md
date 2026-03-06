# Decision Log

> Track important architectural and technical decisions made during development.
> This helps future AIs (and humans) understand WHY certain choices were made.

## How to Log Decisions

Use `pa:decision "title"` or add manually:

```markdown
### [DATE] Decision Title
**Status:** Accepted | Rejected | Superseded
**Decided by:** AI/Human name
**Context:** Why was this decision needed?
**Decision:** What was decided?
**Alternatives Considered:**
- Option A: ...
- Option B: ...
**Consequences:** What are the implications?
```

---

## Decisions

<!-- Add new decisions below this line -->

### [TEMPLATE] Example Decision
**Status:** Accepted
**Decided by:** Claude (opus-4)
**Context:** Needed to choose a state management solution for the React app.
**Decision:** Use Zustand over Redux
**Alternatives Considered:**
- Redux: Too much boilerplate for our needs
- Context API: Not powerful enough for complex state
- Jotai: Good but team less familiar with it
**Consequences:**
- Simpler codebase
- Faster development
- Team needs to learn Zustand patterns

---


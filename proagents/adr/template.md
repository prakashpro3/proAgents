# ADR-NNNN: [Short Title of Decision]

<!--
Instructions:
1. Copy this template to create a new ADR
2. Name the file: NNNN-short-title.md (e.g., 0001-use-postgresql.md)
3. Fill in all sections below
4. Submit for review
5. Update status when decision is made
-->

## Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | YYYY-MM-DD |
| **Author** | @username |
| **Reviewers** | @reviewer1, @reviewer2 |
| **Tags** | tag1, tag2 |
| **Supersedes** | [ADR-NNNN](./NNNN-title.md) (if applicable) |
| **Superseded by** | [ADR-NNNN](./NNNN-title.md) (if applicable) |

---

## Context

<!--
Describe the situation that requires a decision:
- What is the current state?
- What problem or opportunity does this address?
- What constraints exist?
- Who are the stakeholders?

Be specific about the technical and business context.
Example: "Our application is experiencing slow response times for dashboard
queries. Investigation shows the current SQLite database cannot handle our
scale of 10M+ records with complex joins."
-->

[Describe the context and problem statement here]

---

## Decision

<!--
State the decision clearly and concisely:
- What did we decide to do?
- Be specific about the choice made
- Include key implementation details

Example: "We will migrate from SQLite to PostgreSQL for our primary database.
We will use Amazon RDS for hosting with a db.m5.large instance size."
-->

[State the decision here]

---

## Rationale

<!--
Explain why this decision was made:
- What factors influenced the decision?
- How does it address the problem?
- Why is it better than alternatives?
- What principles or values guided the choice?
-->

[Explain the reasoning behind the decision]

---

## Consequences

### Positive

<!--
List the benefits and positive outcomes:
- What improvements will result?
- What new capabilities does this enable?
- How does it help the team/product?
-->

- [Positive consequence 1]
- [Positive consequence 2]
- [Positive consequence 3]

### Negative

<!--
Be honest about downsides and tradeoffs:
- What new challenges does this create?
- What costs are involved?
- What risks should we monitor?
-->

- [Negative consequence 1]
- [Negative consequence 2]
- [Negative consequence 3]

### Neutral

<!--
Note neutral effects or changes:
- What changes but isn't clearly positive or negative?
- What stays the same?
-->

- [Neutral consequence 1]
- [Neutral consequence 2]

---

## Alternatives Considered

### Alternative 1: [Name]

<!--
Describe each alternative considered:
- What was the option?
- Pros and cons
- Why was it not chosen?
-->

**Description:** [Brief description]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Why not chosen:** [Explanation]

### Alternative 2: [Name]

**Description:** [Brief description]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Why not chosen:** [Explanation]

### Alternative 3: Do Nothing

<!--
Always consider the option of not making a change
-->

**Description:** Maintain the current approach.

**Pros:**
- No migration effort
- No risk of introducing new issues

**Cons:**
- [Problems that would persist]
- [Opportunities that would be missed]

**Why not chosen:** [Explanation]

---

## Implementation

<!--
Provide guidance for implementation:
- Key steps or phases
- Timeline considerations
- Dependencies
- Risks and mitigations
-->

### Approach

[Describe the implementation approach]

### Phases

1. **Phase 1:** [Description] - [Timeline]
2. **Phase 2:** [Description] - [Timeline]
3. **Phase 3:** [Description] - [Timeline]

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | Medium | High | [Mitigation strategy] |
| [Risk 2] | Low | Medium | [Mitigation strategy] |

---

## Validation

<!--
How will we know this decision was correct?
- What metrics will we track?
- What does success look like?
- When will we review this decision?
-->

### Success Criteria

- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

### Review Date

This decision will be reviewed on [DATE] to assess its effectiveness.

---

## References

<!--
Link to related resources:
- Related ADRs
- Documentation
- External resources
- Meeting notes
- Research
-->

- [Related ADR](./NNNN-related-title.md)
- [External documentation](https://example.com)
- [Internal discussion](link-to-discussion)
- [Research document](link-to-research)

---

## Changelog

<!--
Track significant updates to this ADR:
-->

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |
| YYYY-MM-DD | @author | Updated based on review feedback |
| YYYY-MM-DD | @author | Status changed to Accepted |

---

<!--
## Status Definitions

- **Proposed**: Decision is being discussed
- **Accepted**: Decision has been made and is in effect
- **Deprecated**: Decision is still valid but discouraged for new work
- **Superseded**: Decision has been replaced by another ADR
- **Rejected**: Decision was considered but not adopted

## Tips for Good ADRs

1. Write ADRs early - don't wait until after implementation
2. Keep them short - aim for a 5-minute read
3. Be specific about the decision
4. Be honest about tradeoffs
5. Link to related decisions
6. Update status when it changes
7. Never delete - mark as superseded instead
-->

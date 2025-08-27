# ADR-[number]: [Short Title]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-[number]]

## Context

[Describe the context and problem statement. What is the issue that we're seeing that is motivating this decision or change? Include any relevant background information, constraints, or requirements that influence this decision.]

### Current Situation

[Describe how things work currently, if applicable]

### Problem Statement

[Clearly state the problem that needs to be solved]

### Requirements and Constraints

- [List any specific requirements]
- [List any constraints (technical, business, regulatory)]
- [List any assumptions being made]

## Decision

[Describe the change that we're proposing and/or doing. This should be a clear, concise statement of what has been decided.]

### Chosen Solution

[Detailed description of the chosen solution]

### Implementation Approach

[High-level implementation details]

## Consequences

[Describe the resulting context after applying the decision. All architectural decisions come with trade-offs. What are the positive and negative consequences of this decision?]

### Positive Consequences

- [List the benefits and positive outcomes]
- [Include improvements in maintainability, performance, security, etc.]
- [Note any new capabilities enabled]

### Negative Consequences

- [List the drawbacks and negative outcomes]
- [Include any technical debt introduced]
- [Note any limitations or restrictions imposed]

### Neutral Consequences

- [List changes that are neither positive nor negative]
- [Include any migration requirements]
- [Note any learning curve or training needs]

## Alternatives Considered

### Alternative 1: [Name]

**Description**: [Brief description of the alternative]

**Pros**:
- [Advantage 1]
- [Advantage 2]

**Cons**:
- [Disadvantage 1]
- [Disadvantage 2]

**Reason for Rejection**: [Why this wasn't chosen]

### Alternative 2: [Name]

**Description**: [Brief description of the alternative]

**Pros**:
- [Advantage 1]
- [Advantage 2]

**Cons**:
- [Disadvantage 1]
- [Disadvantage 2]

**Reason for Rejection**: [Why this wasn't chosen]

### Alternative 3: Do Nothing

**Description**: Keep the current approach without changes

**Pros**:
- No implementation effort required
- No risk of introducing new issues

**Cons**:
- [Current problems remain unresolved]
- [Missed opportunities for improvement]

**Reason for Rejection**: [Why status quo is not acceptable]

## Implementation

### Migration Strategy

[If applicable, describe how to migrate from the current state to the new state]

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Plan

[Describe how to revert this decision if needed]

### Timeline

- **Decision Date**: [Date when decision was made]
- **Implementation Start**: [Planned start date]
- **Implementation Complete**: [Target completion date]
- **Review Date**: [When to review the effectiveness]

## Validation

### Success Criteria

[How will we know if this decision was successful?]

- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

### Metrics

| Metric | Current Value | Target Value | Measurement Method |
|--------|--------------|--------------|-------------------|
| [Metric name] | [Current] | [Target] | [How to measure] |

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk description] | [Low/Medium/High] | [Low/Medium/High] | [Mitigation strategy] |

## Related Decisions

- [ADR-XXX](link): [How it relates]
- [ADR-YYY](link): [How it relates]
- [Design Doc](link): [Related design documentation]

## References

- [Link to relevant documentation]
- [Link to research or benchmarks]
- [Link to similar decisions in other projects]
- [Link to discussions or RFCs]

## Notes

[Any additional notes, discussions, or clarifications that don't fit in the sections above]

---

## Metadata

- **ADR Number**: ADR-[number]
- **Title**: [Full descriptive title]
- **Decision Date**: [YYYY-MM-DD]
- **Author(s)**: [Name(s)]
- **Reviewers**: [Name(s)]
- **Status**: [Current status]
- **Supersedes**: [ADR-XXX if applicable]
- **Superseded By**: [ADR-YYY if applicable]
- **Tags**: [architecture, security, performance, etc.]

## Review History

| Date | Reviewer | Comment | Action |
|------|----------|---------|--------|
| [Date] | [Name] | [Comment] | [Approved/Changes Requested] |

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| [Date] | [Name] | Initial draft |
| [Date] | [Name] | [Description of changes] |

---

*Template Version: 1.0.0*
*Last Updated: August 2025*

## Template Usage Notes

When using this template:

1. **Number Assignment**: Use sequential numbering (ADR-001, ADR-002, etc.)
2. **Title**: Keep it short but descriptive (5-10 words)
3. **Status**: Start with "Proposed", update as decision progresses
4. **Context**: Provide enough background for future readers
5. **Decision**: Be explicit and unambiguous
6. **Consequences**: Be honest about trade-offs
7. **Alternatives**: Include at least 2-3 alternatives considered
8. **References**: Link to supporting materials

Remember: ADRs are immutable once accepted. If a decision needs to be changed, create a new ADR that supersedes the old one rather than editing the existing ADR.
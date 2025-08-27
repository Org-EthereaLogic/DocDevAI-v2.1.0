# Documentation Naming Conventions

## Overview

This document establishes naming conventions for all documentation files, directories, and internal references within the DevDocAI project. Consistent naming improves discoverability, maintains organization, and reduces confusion.

## General Principles

1. **Descriptive**: Names should clearly indicate content
2. **Consistent**: Follow patterns without exceptions
3. **Searchable**: Use keywords that users would search for
4. **Versioned**: Include version information when relevant
5. **Hierarchical**: Reflect the documentation structure

## File Naming Conventions

### Basic Rules

- Use **lowercase** with hyphens for word separation
- No spaces or special characters except hyphens and underscores
- Keep names concise but descriptive
- Include file type prefix when applicable
- Always use `.md` extension for Markdown files

### File Type Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `DESIGN-` | Design specifications | `DESIGN-authentication-system.md` |
| `ADR-` | Architectural Decision Records | `ADR-001-database-selection.md` |
| `GUIDE-` | How-to guides | `GUIDE-plugin-development.md` |
| `REF-` | Reference documentation | `REF-api-endpoints.md` |
| `TEMPLATE-` | Document templates | `TEMPLATE-design-spec.md` |
| `TEST-` | Test documentation | `TEST-integration-plan.md` |
| `RELEASE-` | Release notes | `RELEASE-v3.2.0.md` |

### Component-Specific Naming

```
[PREFIX]-[component]-[aspect]-[version].[extension]

Examples:
DESIGN-auth-api-v2.md
GUIDE-database-migration.md
REF-cli-commands.md
```

### Date-Based Naming

For time-sensitive documents:
```
[YYYY-MM-DD]-[type]-[description].[extension]

Examples:
2025-08-15-meeting-architecture-review.md
2025-07-20-postmortem-api-outage.md
```

## Directory Naming Conventions

### Structure Rules

- Use **lowercase** exclusively
- Use hyphens for multi-word names
- Keep names short (preferably single word)
- Use numbered prefixes for ordered sections

### Standard Directory Names

```
docs/
├── 00-meta/              # Numbered for order
├── 01-specifications/    # Clear purpose
├── 02-implementation/    # Logical grouping
├── 03-guides/           # User-focused
├── 04-reference/        # Lookup documentation
├── 05-quality/          # Quality assurance
└── 06-archives/         # Historical records
```

### Subdirectory Patterns

```
[category]/
├── [subcategory]/
│   ├── [specific-topic]/
│   └── [version]/        # When versioning needed
```

## Document Section Naming

### Heading Hierarchy

```markdown
# Document Title (Title Case)
## Major Section (Title Case)
### Subsection (Title Case)
#### Minor Section (Title Case)
##### Detail Level (Sentence case)
###### Lowest Level (Sentence case)
```

### Standard Section Names

Common sections across document types:

- **Overview** or **Introduction**
- **Prerequisites** or **Requirements**
- **Installation** or **Setup**
- **Configuration**
- **Usage** or **How to Use**
- **Examples**
- **API Reference**
- **Troubleshooting**
- **FAQ** or **Common Questions**
- **Related Resources** or **See Also**
- **Appendix** or **Additional Information**

## Version Naming

### Semantic Versioning

```
v[MAJOR].[MINOR].[PATCH]

Examples:
v1.0.0 - Initial release
v1.1.0 - New features
v1.1.1 - Bug fixes
v2.0.0 - Breaking changes
```

### Document Versions

```
[document-name]-v[version].[extension]

Examples:
api-specification-v2.1.md
user-guide-v1.5.md
```

## Link and Anchor Naming

### Internal Links

```markdown
[Link Text](../relative/path/to/file.md)
[Section Link](#section-heading)
[External Doc](https://example.com/docs)
```

### Anchor IDs

- Auto-generated from headings
- Use lowercase with hyphens
- Remove special characters

```markdown
## API Authentication -> #api-authentication
### OAuth 2.0 Flow -> #oauth-20-flow
```

## Code and Variable Naming

### Code Blocks

````markdown
```language
// Code here
```

Examples:
```javascript
```python
```bash
````

### Inline Code

```markdown
Use `variableName` for inline code
Commands like `npm install`
File paths like `/usr/local/bin`
```

## Image and Asset Naming

### Image Files

```
[type]-[description]-[version].[extension]

Examples:
diagram-architecture-overview-v2.png
screenshot-login-page.jpg
logo-devdocai-dark.svg
chart-performance-metrics.png
```

### Asset Organization

```
assets/
├── images/
│   ├── diagrams/
│   ├── screenshots/
│   └── logos/
├── videos/
└── downloads/
```

## Table and Figure Naming

### Tables

```markdown
Table 1: Database Comparison
Table 2: Performance Metrics
```

### Figures

```markdown
Figure 1: System Architecture
Figure 2: Data Flow Diagram
```

## Special Cases

### Deprecated Content

```
DEPRECATED-[original-name].[extension]
[original-name]-DEPRECATED.[extension]

Examples:
DEPRECATED-old-api.md
auth-system-v1-DEPRECATED.md
```

### Draft Documents

```
DRAFT-[document-name].[extension]
WIP-[document-name].[extension]

Examples:
DRAFT-new-feature-spec.md
WIP-migration-guide.md
```

### Archive Naming

```
[date]-ARCHIVE-[original-name].[extension]

Examples:
2025-01-15-ARCHIVE-v1-documentation.md
2024-12-31-ARCHIVE-legacy-api.md
```

## Anti-Patterns to Avoid

### Don't Use

- ❌ Spaces in file names: `user guide.md`
- ❌ Special characters: `api@v2.md`, `guide#1.md`
- ❌ Uppercase extensions: `.MD`, `.TXT`
- ❌ Unclear abbreviations: `ug.md`, `apidoc.md`
- ❌ Generic names: `document.md`, `notes.md`
- ❌ Personal names: `johns-notes.md`
- ❌ Dates in mixed formats: `15-08-2025.md`, `Aug-15-25.md`

### Use Instead

- ✅ Hyphens: `user-guide.md`
- ✅ Clear names: `api-v2.md`, `guide-authentication.md`
- ✅ Lowercase extensions: `.md`, `.txt`
- ✅ Full words: `user-guide.md`, `api-documentation.md`
- ✅ Descriptive names: `deployment-guide.md`, `troubleshooting.md`
- ✅ Role-based names: `developer-notes.md`
- ✅ ISO dates: `2025-08-15.md`

## Naming Convention Checklist

Before finalizing a document name:

- [ ] Is it descriptive and clear?
- [ ] Does it follow the established pattern?
- [ ] Is it lowercase with proper separators?
- [ ] Does it include necessary prefixes?
- [ ] Is versioning included if needed?
- [ ] Will it sort correctly in file listings?
- [ ] Is it easily searchable?
- [ ] Does it avoid anti-patterns?

## Enforcement

### Automated Checks

- CI/CD pipeline validates naming conventions
- Pre-commit hooks check file names
- Linting tools verify link formats

### Manual Review

- PR reviews include naming convention check
- Regular audits of documentation structure
- Team training on conventions

## Exceptions

Exceptions to these conventions require:
1. Documentation of the reason
2. Team approval
3. Update to this guide if becoming a pattern

## Migration Guide

When renaming existing documents:

1. Create new file with correct name
2. Copy content to new file
3. Update all internal links
4. Add redirect from old location
5. Mark old file as deprecated
6. Remove old file after grace period

---

*Last Updated: August 2025*
*Version: 1.0.0*

For questions or suggestions about naming conventions, please open an issue or contact the documentation team.
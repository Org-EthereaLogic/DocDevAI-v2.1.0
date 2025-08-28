# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevDocAI v2.0.0 is an AI-powered documentation system undergoing a **complete fresh start** with zero technical debt policy.

**Current Status**: Fresh Start Implementation
- Start Date: August 26, 2025
- Methodology: TDD/ADD with Anti-Shortcut Enforcement
- All modules starting from scratch
- **Latest**: ✅ Core/Logger Interface complete (100% coverage, 32 tests)

## Development Philosophy

### Core Principles

1. **Complete Implementations Only**
   - NO TODOs, FIXMEs, or placeholders
   - NO mock implementations or stubs
   - NO commented-out code
   - Every function must be fully implemented

2. **Test-Driven Development (TDD)**
   - Write tests FIRST
   - Tests must fail initially
   - Implement to make tests pass
   - Never modify tests to pass - fix the implementation

3. **Zero Technical Debt**
   - No shortcuts allowed
   - No "temporary" solutions
   - No "we'll fix it later" code
   - Quality from day one

4. **Anti-Shortcut Enforcement**
   - Scripts detect incomplete code
   - Commits blocked if shortcuts found
   - AI must provide complete solutions

## Implementation Pattern

### Block-by-Block Development

Each implementation follows 15-30 minute focused blocks:

```
Block X-001: [Feature] Interface (15 min)
├── Write complete test suite
├── Define interfaces/types
├── Run tests (must fail)
└── Implement completely

Block X-002: [Feature] Core Logic (20 min)
├── Write complete test suite
├── Run tests (must fail)
├── Implement all logic
└── Verify all tests pass

Block X-003: [Feature] Integration (25 min)
├── Write integration tests
├── Connect components
├── Verify end-to-end
└── Document if needed
```

### Multi-Pass Refinement

Each module goes through systematic passes:

1. **Implementation Pass** - Complete functionality
2. **Refactoring Pass** - Code quality and structure
3. **Performance Pass** - Optimization with benchmarks
4. **Security Pass** - Hardening and validation
5. **Documentation Pass** - Complete documentation

## Quality Requirements

### TypeScript Configuration

```typescript
// tsconfig.json strict settings - DO NOT CHANGE
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noUncheckedIndexedAccess": true
}
```

### Code Standards

- **NO `any` types** - Use proper types or `unknown`
- **NO `console.log`** - Use Logger service
- **NO disabled linting** - Fix the code, not the linter
- **NO skipped tests** - Fix the implementation
- **NO partial features** - Complete or don't start

### Testing Requirements

- Minimum 90% coverage required
- All edge cases must be tested
- Integration tests for all APIs
- No test skipping or disabling

## Module Implementation Order

Start with core utilities before modules:

1. **Core/Logger** - Logging service (replaces console.log)
2. **Core/Errors** - Error classes and handling
3. **Core/Config** - Configuration types and validation
4. **M001** - Configuration Manager
5. **M002** - Storage System (Security-First)
6. **M003** - MIAIR Engine
7. **M004** - Document Generator

## Working with AI Assistants

### When Requesting Code

Always specify:
1. Complete implementation required
2. No placeholders or TODOs
3. All error cases handled
4. Full test coverage

### Example Request

```
"Implement the Logger service with:
- Complete ILogger interface
- ConsoleTransport with all log levels
- FileTransport with rotation
- Full test suite with 100% coverage
- NO TODOs or incomplete parts"
```

## Pre-Commit Validation

The following checks run automatically:

1. **TypeScript** - Zero errors allowed
2. **ESLint** - Zero violations allowed
3. **Tests** - Must pass with 90% coverage
4. **Shortcuts** - No TODOs, FIXMEs, or any
5. **Format** - Prettier formatting required

## Common Pitfalls to Avoid

❌ **DON'T**:
- Leave TODO comments
- Use `any` type
- Skip error handling
- Implement partially
- Disable linting rules
- Mock temporarily
- Comment out code

✅ **DO**:
- Implement completely
- Handle all cases
- Write tests first
- Use proper types
- Fix root causes
- Provide full solutions
- Keep code clean

## Git Workflow

1. Create feature branch
2. Implement with TDD
3. Run all quality checks
4. Commit with conventional format
5. Push only when complete

## Resources

- Design Specs: `/docs/01-specifications/`
- Implementation Tracking: `/docs/02-implementation/`
- Testing Guidelines: `/docs/05-quality/`

---

**Remember**: This is a fresh start. No legacy code, no technical debt, no shortcuts.
Every line of code must meet our quality standards from day one.

## Codacy Integration Rules

### After ANY File Modification
- **MANDATORY**: Run `codacy_cli_analyze` for each edited file
- If issues found: Fix immediately before continuing
- This is non-negotiable for maintaining code quality

### After ANY Dependency Installation
- **IMMEDIATE**: Run `codacy_cli_analyze` with tool="trivy"
- Check for security vulnerabilities in new packages
- **STOP** all operations if vulnerabilities found
- Fix security issues before any other work

### Repository Setup
- Use `git remote -v` to determine provider/organization/repository
- Provider mapping: GitHub="gh", Bitbucket="bb", GitLab="gl"
- If repository not found in Codacy, offer to run `codacy_setup_repository`

### Quality Gates
- All code must pass Codacy analysis before commits
- Security issues take priority over features
- No bypassing or disabling Codacy checks
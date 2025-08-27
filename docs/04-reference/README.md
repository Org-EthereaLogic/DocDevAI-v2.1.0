# Reference Documentation

## Overview

This directory contains comprehensive reference documentation for DevDocAI, including API references, configuration options, command-line interfaces, and technical specifications. Reference documentation provides detailed, factual information optimized for quick lookup rather than learning.

## Purpose

Reference documentation serves as the authoritative source for:
- API endpoints, parameters, and responses
- Configuration options and their effects
- Command-line arguments and options
- Error codes and their meanings
- Data models and schemas
- Environment variables and system requirements

## Directory Structure

```
04-reference/
├── README.md                 # This file - Reference documentation overview
├── api/                      # API reference documentation
│   ├── rest-api-v1.md       # REST API v1 reference
│   ├── plugin-api.md        # Plugin API reference
│   ├── websocket-api.md     # WebSocket API reference
│   └── graphql-schema.md    # GraphQL schema reference
├── cli/                      # Command-line interface reference
│   ├── commands.md          # CLI commands reference
│   ├── options.md           # Global options and flags
│   └── examples.md          # CLI usage examples
├── configuration/            # Configuration reference
│   ├── config-file.md       # Configuration file format
│   ├── env-variables.md     # Environment variables
│   └── defaults.md          # Default values and behaviors
├── schemas/                  # Data schemas and models
│   ├── database-schema.md   # Database schema reference
│   ├── api-models.md        # API request/response models
│   └── event-schemas.md     # Event and message schemas
└── errors/                   # Error reference
    ├── error-codes.md       # Complete error code listing
    ├── http-status.md       # HTTP status code usage
    └── troubleshooting.md   # Error diagnosis guide
```

## Reference Documentation Types

### API Documentation

**Location**: `/api`

API documentation includes:
- Endpoint URLs and methods
- Request parameters and headers
- Request/response body schemas
- Authentication requirements
- Rate limits and quotas
- Example requests and responses
- Error responses

**Format Example**:
```markdown
## GET /api/v1/documents/{id}

Retrieves a single document by ID.

### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Document UUID |

### Response
Status: 200 OK
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "created_at": "timestamp"
}
```

### CLI Documentation

**Location**: `/cli`

CLI documentation covers:
- Command syntax and structure
- Available subcommands
- Options and flags
- Environment variable overrides
- Configuration file locations
- Output formats

**Format Example**:
```markdown
## devdocai generate

Generate documentation from source code.

### Syntax
devdocai generate [options] <source>

### Options
| Flag | Long Form | Description | Default |
|------|-----------|-------------|---------|
| -o | --output | Output directory | ./docs |
| -f | --format | Output format | markdown |
```

### Configuration Documentation

**Location**: `/configuration`

Configuration documentation details:
- Configuration file structure
- Available settings
- Value types and constraints
- Default values
- Precedence rules
- Migration guides

### Schema Documentation

**Location**: `/schemas`

Schema documentation provides:
- Database table definitions
- Field types and constraints
- Relationships and foreign keys
- Indexes and performance considerations
- Data model diagrams
- Validation rules

### Error Documentation

**Location**: `/errors`

Error documentation includes:
- Complete error code listings
- Error message formats
- Troubleshooting steps
- Common causes
- Resolution procedures

## Documentation Standards

### API Documentation Standards

1. **OpenAPI Specification**: Use OpenAPI 3.0+ for REST APIs
2. **Examples**: Provide runnable examples for every endpoint
3. **Versioning**: Clearly indicate API version and deprecations
4. **Authentication**: Document all authentication methods
5. **Rate Limits**: Specify rate limits and quota headers
6. **Errors**: Document all possible error responses

### Code Documentation Links

Reference documentation should link to:
- Source code implementations
- Related guides and tutorials
- Architecture documentation
- Issue tracking for known problems

### Versioning

Reference documentation must:
- Indicate the version it applies to
- Note breaking changes between versions
- Provide migration guides for upgrades
- Maintain previous version documentation

## Update Procedures

### When to Update

Update reference documentation:
- **Immediately** when APIs change
- **Before release** for any user-facing changes
- **After implementation** of new features
- **When bugs are fixed** that change behavior

### Update Process

1. **Development Phase**
   - Developer updates reference with implementation
   - Technical writer reviews for clarity
   - QA verifies accuracy

2. **Review Phase**
   - API changes reviewed by API team
   - Breaking changes flagged for release notes
   - Migration guides prepared if needed

3. **Release Phase**
   - Documentation published with release
   - Previous version archived if needed
   - Change log updated

### Automation

Where possible, generate reference documentation:
- API docs from OpenAPI specifications
- CLI docs from command definitions
- Schema docs from database migrations
- Error docs from error definition files

## Quality Standards

### Completeness Checklist

- [ ] All public APIs documented
- [ ] All configuration options listed
- [ ] All error codes defined
- [ ] All commands described
- [ ] Examples provided for common use cases
- [ ] Edge cases and limitations noted

### Accuracy Requirements

- Information must match current implementation
- Examples must be executable
- Default values must be current
- Deprecation notices must be accurate
- Version requirements must be specified

### Clarity Guidelines

- Use consistent terminology
- Define technical terms
- Provide context where needed
- Use tables for structured data
- Include diagrams for complex relationships

## Search Optimization

Reference documentation should be optimized for search:

1. **Clear Titles**: Use descriptive, searchable titles
2. **Keywords**: Include relevant keywords naturally
3. **Structure**: Use headers for scannability
4. **Cross-References**: Link related topics
5. **Index**: Maintain searchable index of terms

## Examples

### Good Reference Documentation

```markdown
## POST /api/v1/auth/login

Authenticates a user and returns an access token.

### Request
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

### Success Response
Status: 200 OK

{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def502..."
}

### Error Responses
Status: 401 Unauthorized
{
  "error": "invalid_credentials",
  "message": "The provided credentials are incorrect"
}

Status: 429 Too Many Requests
{
  "error": "rate_limit_exceeded",
  "message": "Too many login attempts",
  "retry_after": 300
}
```

## Quick Links

- [REST API Reference](api/rest-api-v1.md)
- [CLI Command Reference](cli/commands.md)
- [Configuration Options](configuration/config-file.md)
- [Error Code Listing](errors/error-codes.md)
- [Database Schema](schemas/database-schema.md)

## Tools and Generation

### Documentation Generation Tools

- **OpenAPI**: Generate from OpenAPI specs
- **TypeDoc**: Generate from TypeScript
- **JSDoc**: Generate from JavaScript
- **Sphinx**: Generate from Python
- **Swagger**: Interactive API documentation

### Validation Tools

- **API Contract Testing**: Validate examples
- **Schema Validators**: Check JSON schemas
- **Link Checkers**: Verify all links work
- **Spell Checkers**: Check for typos

---

*Last Updated: August 2025*
*Version: 1.0.0*
# Changelog

All notable changes to this project are documented here and in the dated entries.

---

## [Unreleased]

### In Progress
- Push Notifications feature (paused, waiting on auth)

---

## January 2024

### 2024-01-15

#### Added
- **User Authentication** - Full OAuth support with Google and GitHub
  - [Full details](./2024/01/2024-01-15-user-auth-feature.md)
  - NextAuth.js integration
  - Session management with JWT
  - Protected route middleware

### 2024-01-12

#### Fixed
- **Login Button State** - Fixed infinite loading on OAuth rejection
  - [Full details](./2024/01/2024-01-12-login-bug-fix.md)

### 2024-01-10

#### Changed
- **API URL** - Updated to new production endpoint
  - [Full details](./2024/01/2024-01-10-api-url-config.md)

### 2024-01-09

#### Added
- **Dark Mode** - Theme switching support
  - CSS variables for theming
  - System preference detection
  - Persistent user preference

---

## Summary Statistics

| Month | Features | Bug Fixes | Config Changes |
|-------|----------|-----------|----------------|
| Jan 2024 | 2 | 1 | 1 |

---

## Quick Links

- [All January 2024 changes](./2024/01/)
- [Entry Template](./entry-template.md)
- [Changelog Guidelines](./README.md)

---

## Changelog Format

Each entry follows the template in [entry-template.md](./entry-template.md) and includes:

- **Summary**: Brief description of the change
- **Details**: Implementation specifics
- **Verification**: Testing performed
- **Related**: Links to issues and related changes
- **Search Tags**: Keywords for searchability

---

## Auto-Generation

This changelog is automatically updated when:
- Features are completed
- Bug fixes are merged
- Configuration changes are deployed

Manual entries can be added for non-automated changes.

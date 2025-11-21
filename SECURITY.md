# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

We take the security of PM Kit CLI seriously. If you discover a security vulnerability, please report it to us privately.

### How to Report

**DO NOT** report security vulnerabilities through public GitHub issues.

Instead, please email: security@your-domain.com (or use your preferred contact method)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is released
- You will be credited in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

**Protect Your Tokens**:
- Never commit `.pm-kit/config.json` to git
- Never share your GitHub Personal Access Token
- Never share your API keys
- Use environment variables for CI/CD

**File Permissions**:
- PM Kit automatically sets restrictive permissions (0600) on config files
- Verify: `ls -la .pm-kit/config.json` should show `-rw-------`

**Update Regularly**:
```bash
# Check for updates frequently
pm-kit update

# Enable auto-update notifications (future feature)
```

**Audit Your Installation**:
```bash
# Run diagnostics regularly
pm-kit doctor

# Check for unexpected files
find .claude -type f -name "*.sh"  # Should return nothing
```

### For Developers

**Code Security**:
- Never log sensitive data (tokens, keys)
- Always validate user input
- Use parameterized queries (if applicable)
- Avoid eval() and similar dangerous functions
- Use secure dependencies (run npm audit)

**Dependency Security**:
```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Auto-fix vulnerabilities
pnpm audit fix
```

**GitHub Token Scopes**:
- Request minimal scopes needed
- Currently requires: `repo` (for private repository access)
- Never request `admin` scopes

## Security Features

### Implemented

- [x] Config files stored with restrictive permissions (0600)
- [x] Sensitive values masked in console output
- [x] GitHub token never logged or displayed
- [x] API keys never logged or displayed
- [x] Automatic .gitignore updates for sensitive files
- [x] Input validation on all commands
- [x] Error messages don't leak sensitive info

### Planned

- [ ] Encrypted credential storage
- [ ] Token expiration warnings
- [ ] Automatic security updates
- [ ] Signed releases
- [ ] Supply chain security (Sigstore)

## Known Issues

None currently. Check our [Security Advisories](https://github.com/your-org/pm-kit-cli/security/advisories) for updates.

## Security Updates

Security updates will be released as patch versions (0.1.X) and communicated via:
- GitHub Security Advisories
- CHANGELOG.md
- npm package metadata
- Email notification (if subscribed)

To stay informed:
- Watch this repository for releases
- Enable GitHub security alerts
- Subscribe to our mailing list (if available)

## Threat Model

### Assets

- GitHub Personal Access Token
- API keys (Brave, Perplexity, Gemini)
- User-generated documents
- MCP configuration

### Threats

1. **Token Exposure**
   - Mitigation: Restrictive file permissions, .gitignore
   - Detection: File permission checks in `pm-kit doctor`

2. **Dependency Vulnerabilities**
   - Mitigation: Regular npm audit, automated Dependabot
   - Detection: GitHub security alerts

3. **Code Injection**
   - Mitigation: Input validation, no eval()
   - Detection: Code review, linting

4. **Man-in-the-Middle**
   - Mitigation: HTTPS for all API calls
   - Detection: Certificate validation

5. **Supply Chain Attack**
   - Mitigation: Lockfiles, verified dependencies
   - Detection: npm audit, code review

### Out of Scope

- Social engineering attacks
- Physical access to developer machines
- Compromised npm registry
- Malicious Claude CLI installations

## Responsible Disclosure

We believe in coordinated disclosure and will work with security researchers to:
- Verify and reproduce the issue
- Develop and test a fix
- Release the fix
- Publicly disclose the vulnerability

We appreciate responsible disclosure and will:
- Credit you in security advisories
- Consider bug bounties (if program established)
- Respond promptly and professionally

## Security Hall of Fame

We will recognize security researchers who responsibly disclose vulnerabilities:

<!-- To be updated as vulnerabilities are reported and fixed -->

*No vulnerabilities reported yet.*

## Contact

Security Team: security@your-domain.com
PGP Key: [Link to public key] (if applicable)

For non-security issues, use [GitHub Issues](https://github.com/your-org/pm-kit-cli/issues).

---

Thank you for helping keep PM Kit CLI secure!

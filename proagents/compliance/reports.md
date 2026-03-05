# Compliance Reports

Generate compliance reports and evidence packages.

---

## Overview

ProAgents generates compliance reports for auditors, internal reviews, and regulatory submissions.

```
┌─────────────────────────────────────────────────────────────┐
│                    Report Generation                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Audit Logs ────┐                                          │
│                 │                                          │
│  Evidence ──────┼───► Report Generator ───► Reports        │
│                 │            │                              │
│  Controls ──────┘            │                              │
│                              ▼                              │
│                    ┌─────────────────┐                      │
│                    │  Output Formats  │                      │
│                    ├─────────────────┤                      │
│                    │ • PDF           │                      │
│                    │ • HTML          │                      │
│                    │ • JSON          │                      │
│                    │ • CSV           │                      │
│                    └─────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Report Types

### Executive Summary

High-level compliance status for management:

```bash
proagents compliance report --type executive
```

**Contents:**
- Overall compliance status
- Key metrics
- Risk areas
- Recommendations

### Detailed Audit Report

Complete evidence for auditors:

```bash
proagents compliance report --type audit --framework soc2
```

**Contents:**
- Control mapping
- Evidence collection
- Test results
- Exception documentation

### Control Evidence Package

Specific control evidence:

```bash
proagents compliance report --type evidence --control access-control
```

**Contents:**
- Control description
- Implementation details
- Supporting evidence
- Test results

### Compliance Gap Analysis

Identify gaps in compliance:

```bash
proagents compliance report --type gap-analysis
```

**Contents:**
- Current state assessment
- Required controls
- Gap identification
- Remediation plan

---

## Generating Reports

### Basic Report Generation

```bash
# Generate SOC 2 report
proagents compliance report --framework soc2

# Generate for specific period
proagents compliance report --framework soc2 --period 2024-Q1

# Generate all frameworks
proagents compliance report --all
```

### Advanced Options

```bash
proagents compliance report \
  --framework soc2 \
  --type audit \
  --period 2024-Q1 \
  --format pdf \
  --output ./reports/soc2-q1-2024.pdf \
  --include-evidence \
  --sign
```

### Report Options

| Option | Description |
|--------|-------------|
| `--framework` | Target compliance framework |
| `--type` | Report type (executive, audit, evidence, gap) |
| `--period` | Reporting period (YYYY-MM, YYYY-QN, YYYY) |
| `--format` | Output format (pdf, html, json, csv) |
| `--output` | Output file path |
| `--include-evidence` | Include full evidence attachments |
| `--sign` | Digitally sign the report |
| `--encrypt` | Encrypt the report |

---

## Report Templates

### SOC 2 Report Template

```markdown
# SOC 2 Type II Compliance Report

**Organization:** [Company Name]
**Period:** [Start Date] to [End Date]
**Generated:** [Date]

## Executive Summary

[Overall compliance status and key findings]

## Trust Service Criteria Coverage

### CC1: Control Environment
- Status: [Compliant/Non-Compliant]
- Controls Tested: [Count]
- Exceptions: [Count]

[Details for each criterion...]

## Control Testing Results

| Control ID | Description | Status | Evidence |
|------------|-------------|--------|----------|
| CC1.1 | ... | Pass | [Link] |
| CC1.2 | ... | Pass | [Link] |

## Evidence Summary

[List of evidence collected]

## Exceptions and Remediation

[Any exceptions found and remediation plans]

## Appendices

- Appendix A: Complete Evidence Package
- Appendix B: Test Procedures
- Appendix C: Exception Details
```

### GDPR Report Template

```markdown
# GDPR Compliance Report

**Organization:** [Company Name]
**Data Protection Officer:** [DPO Name]
**Report Date:** [Date]

## Data Protection Status

### Processing Activities (Art. 30)
[Record of processing activities]

### Legal Basis (Art. 6)
[Documentation of legal basis for processing]

### Data Subject Rights (Art. 15-22)
[Summary of rights fulfillment]

### Security Measures (Art. 32)
[Technical and organizational measures]

### Data Breaches (Art. 33-34)
[Breach notification procedures and history]

## Risk Assessment

[Current data protection risks]

## Recommendations

[Improvement recommendations]
```

---

## Automated Report Scheduling

### Configuration

```yaml
# proagents.config.yaml

compliance:
  reports:
    auto_generate: true

    schedules:
      - name: "Monthly Executive Summary"
        type: "executive"
        frameworks: ["all"]
        frequency: "monthly"
        day: 1
        recipients:
          - "executives@company.com"

      - name: "Quarterly SOC 2 Report"
        type: "audit"
        frameworks: ["soc2"]
        frequency: "quarterly"
        recipients:
          - "compliance@company.com"
          - "audit@company.com"

      - name: "Weekly Security Summary"
        type: "security"
        frequency: "weekly"
        day: "monday"
        recipients:
          - "security@company.com"

    delivery:
      method: "email"
      encrypt: true
      sign: true
```

### Manual Scheduling

```bash
# Schedule a report
proagents compliance schedule \
  --framework soc2 \
  --frequency monthly \
  --recipients "audit@company.com"

# List scheduled reports
proagents compliance schedule list

# Cancel scheduled report
proagents compliance schedule cancel report_123
```

---

## Evidence Collection

### Automatic Evidence

ProAgents automatically collects evidence for:

| Evidence Type | Source | Format |
|---------------|--------|--------|
| Access Logs | Audit trail | JSON/CSV |
| Change Records | Git history | Git log |
| Review Records | PR history | JSON |
| Test Results | CI/CD | JSON |
| Deployment Logs | Deploy system | JSON |
| Security Scans | Scanning tools | JSON/PDF |

### Manual Evidence Upload

```bash
# Upload manual evidence
proagents compliance evidence upload \
  --control access-control \
  --type screenshot \
  --file ./evidence/access-review.png \
  --description "Q1 Access Review Meeting"
```

### Evidence Package

```bash
# Generate evidence package
proagents compliance evidence package --framework soc2 --period 2024-Q1

# Output structure:
evidence-package-2024-Q1/
├── index.json              # Evidence index
├── access-control/
│   ├── logs/
│   │   └── access-logs-2024-Q1.jsonl
│   └── screenshots/
│       └── access-review.png
├── change-management/
│   ├── commit-history.json
│   └── pr-records.json
├── testing/
│   ├── test-results.json
│   └── coverage-reports/
└── security/
    ├── vulnerability-scans/
    └── penetration-tests/
```

---

## Report Distribution

### Email Distribution

```yaml
reports:
  distribution:
    email:
      enabled: true
      smtp_server: "smtp.company.com"
      from: "compliance@company.com"
      encrypt: true
      templates:
        subject: "Compliance Report: {framework} - {period}"
        body: |
          Please find attached the {framework} compliance report
          for {period}.

          Summary:
          - Status: {status}
          - Controls Tested: {controls_tested}
          - Exceptions: {exceptions}

          Please contact compliance@company.com with questions.
```

### Secure Distribution

```bash
# Generate encrypted report
proagents compliance report \
  --framework soc2 \
  --encrypt \
  --recipient "auditor@audit-firm.com"

# Generate signed report
proagents compliance report \
  --framework soc2 \
  --sign \
  --key ./signing-key.pem
```

### Audit Portal Upload

```yaml
reports:
  distribution:
    audit_portal:
      enabled: true
      type: "vanta"  # or drata, secureframe
      api_key: "${AUDIT_PORTAL_API_KEY}"
      auto_upload: true
```

---

## Custom Reports

### Report Builder

```bash
# Interactive report builder
proagents compliance report build

# Or via config
proagents compliance report build --config ./custom-report.yaml
```

### Custom Report Configuration

```yaml
# custom-report.yaml

report:
  name: "Quarterly Security Review"
  type: "custom"

  sections:
    - title: "Executive Summary"
      type: "summary"
      metrics:
        - "total_events"
        - "security_incidents"
        - "vulnerability_count"

    - title: "Security Events"
      type: "audit_events"
      filter:
        category: "security"
        period: "last_quarter"

    - title: "Vulnerability Analysis"
      type: "vulnerability_report"
      include:
        - "critical"
        - "high"

    - title: "Access Review"
      type: "access_analysis"
      include:
        - "privileged_access"
        - "new_permissions"

    - title: "Recommendations"
      type: "recommendations"
      auto_generate: true

  output:
    formats: ["pdf", "html"]
    include_charts: true
    include_evidence: false
```

---

## Report Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Compliance Reports Dashboard                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Recent Reports:                                             │
│                                                             │
│ • SOC 2 Q1 2024 (Jan 15)                                   │
│   Status: ✅ Complete | 45 controls | 0 exceptions         │
│   [View] [Download] [Share]                                │
│                                                             │
│ • GDPR Assessment (Jan 10)                                 │
│   Status: ✅ Complete | All articles compliant             │
│   [View] [Download] [Share]                                │
│                                                             │
│ • PCI-DSS SAQ (Dec 20)                                     │
│   Status: ⚠️ 2 items pending                               │
│   [View] [Download] [Edit]                                 │
│                                                             │
│ Scheduled Reports:                                          │
│ • Monthly Executive - Feb 1                                │
│ • Weekly Security - Every Monday                           │
│ • Quarterly SOC 2 - Apr 1                                  │
│                                                             │
│ [Generate New Report] [Schedule Report] [Settings]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Regular Generation**: Generate reports on schedule
2. **Review Before Distribution**: Review reports before sharing
3. **Secure Storage**: Store reports securely with encryption
4. **Version Control**: Track report versions
5. **Evidence Links**: Include links to supporting evidence
6. **Clear Remediation**: Document clear remediation for findings
7. **Auditor Access**: Provide read-only access to auditors
8. **Automate**: Automate routine reports to reduce manual work

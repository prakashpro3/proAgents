# Compliance Frameworks

Support for regulatory compliance standards.

---

## Supported Frameworks

| Framework | Description | Industries |
|-----------|-------------|------------|
| **SOC 2** | Service Organization Control | SaaS, Cloud Services |
| **GDPR** | General Data Protection Regulation | EU Operations |
| **HIPAA** | Health Insurance Portability | Healthcare |
| **PCI-DSS** | Payment Card Industry | Payment Processing |
| **ISO 27001** | Information Security Management | Enterprise |

---

## SOC 2 Type II

### Trust Service Criteria

```yaml
soc2:
  criteria:
    security:          # CC1-CC9
      enabled: true
      controls:
        - access_control
        - change_management
        - risk_assessment
        - monitoring

    availability:      # A1
      enabled: true
      controls:
        - uptime_monitoring
        - disaster_recovery
        - capacity_planning

    processing_integrity:  # PI1
      enabled: true
      controls:
        - data_validation
        - error_handling
        - audit_trails

    confidentiality:   # C1
      enabled: true
      controls:
        - encryption
        - access_restrictions
        - data_classification

    privacy:           # P1-P8
      enabled: true
      controls:
        - data_collection_notice
        - consent_management
        - data_retention
```

### SOC 2 Evidence Collection

ProAgents automatically collects evidence for:

| Control | Evidence Type | Auto-Collected |
|---------|---------------|----------------|
| Access Control | Access logs, permission changes | ✅ |
| Change Management | Commit history, PR reviews | ✅ |
| Code Review | Review records, approvals | ✅ |
| Testing | Test results, coverage reports | ✅ |
| Deployment | Deployment logs, rollback records | ✅ |
| Monitoring | Alert history, incident logs | ⚠️ External |

### SOC 2 Report Generation

```bash
# Generate SOC 2 evidence package
proagents compliance report --framework soc2 --period 2024-Q1

# Output includes:
# - Access control evidence
# - Change management log
# - Code review records
# - Deployment history
# - Security scan results
```

---

## GDPR

### Requirements Mapping

| GDPR Article | Requirement | ProAgents Feature |
|--------------|-------------|-------------------|
| Art. 5 | Data Processing Principles | Data flow tracking |
| Art. 6 | Lawful Basis | Consent logging |
| Art. 7 | Conditions for Consent | Consent audit trail |
| Art. 17 | Right to Erasure | Data deletion logs |
| Art. 30 | Records of Processing | Activity logging |
| Art. 32 | Security of Processing | Security controls |
| Art. 33 | Data Breach Notification | Incident tracking |

### GDPR Configuration

```yaml
gdpr:
  enabled: true

  # Data subject tracking
  data_subjects:
    track_access: true
    track_modifications: true
    track_deletions: true

  # Consent management
  consent:
    track_changes: true
    require_evidence: true

  # Breach detection
  breach_detection:
    enabled: true
    notify_threshold_hours: 72
    notification_contacts:
      - "dpo@company.com"

  # Retention
  retention:
    default_days: 365
    deletion_logging: true
```

### GDPR Compliance Checks

```bash
# Check GDPR compliance
proagents compliance check --framework gdpr

# Output:
┌─────────────────────────────────────────────────────────────┐
│ GDPR Compliance Check                                       │
├─────────────────────────────────────────────────────────────┤
│ ✅ Art. 5: Data processing principles documented           │
│ ✅ Art. 30: Processing records maintained                  │
│ ✅ Art. 32: Security measures in place                     │
│ ⚠️ Art. 33: Breach notification plan needs review          │
│ ✅ Art. 35: Impact assessments up to date                  │
└─────────────────────────────────────────────────────────────┘
```

---

## HIPAA

### Security Rule Compliance

```yaml
hipaa:
  enabled: true

  # Administrative Safeguards
  administrative:
    risk_analysis: true
    workforce_security: true
    information_access: true
    security_awareness: true
    contingency_plan: true

  # Physical Safeguards
  physical:
    facility_access: true
    workstation_security: true
    device_controls: true

  # Technical Safeguards
  technical:
    access_control: true
    audit_controls: true
    integrity_controls: true
    transmission_security: true

  # PHI Tracking
  phi:
    track_access: true
    log_retention_years: 6
    encryption_required: true
```

### HIPAA Evidence

| Safeguard | Evidence Required | Auto-Generated |
|-----------|-------------------|----------------|
| Access Control | Authentication logs | ✅ |
| Audit Controls | Complete audit trail | ✅ |
| Integrity Controls | Hash verification | ✅ |
| Transmission Security | Encryption logs | ✅ |
| Contingency Plan | Backup/recovery logs | ✅ |

---

## PCI-DSS

### Requirements Mapping

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| 1 | Install firewall | External verification |
| 2 | No vendor defaults | Config scanning |
| 3 | Protect stored data | Encryption audit |
| 4 | Encrypt transmission | TLS verification |
| 5 | Anti-malware | Security scanning |
| 6 | Secure systems | Vulnerability scanning |
| 7 | Restrict access | Access control logs |
| 8 | Identify users | Authentication logs |
| 9 | Restrict physical | External verification |
| 10 | Track access | Comprehensive audit |
| 11 | Test security | Security scan results |
| 12 | Security policy | Policy documentation |

### PCI-DSS Configuration

```yaml
pci_dss:
  enabled: true
  level: 1  # 1, 2, 3, or 4

  # Requirement tracking
  requirements:
    req_1_firewall: external
    req_2_defaults: automated
    req_3_stored_data: automated
    req_4_encryption: automated
    req_5_antimalware: external
    req_6_secure_systems: automated
    req_7_access_restrict: automated
    req_8_identify_users: automated
    req_9_physical: external
    req_10_track_access: automated
    req_11_test_security: automated
    req_12_policy: manual

  # Cardholder data
  cardholder_data:
    environments:
      - "src/payment/**"
      - "src/billing/**"
    scan_for_pan: true
    alert_on_detection: true
```

### PCI-DSS Scanning

```bash
# Run PCI-DSS compliance scan
proagents compliance scan --framework pci-dss

# Check for cardholder data
proagents compliance check-pan

# Generate SAQ
proagents compliance report --framework pci-dss --type saq
```

---

## ISO 27001

### Control Mapping

```yaml
iso27001:
  enabled: true

  # Annex A Controls
  controls:
    a5_policies:
      status: implemented
      evidence: policy_documents

    a6_organization:
      status: implemented
      evidence: org_structure

    a7_human_resources:
      status: partial
      evidence: hr_procedures

    a8_asset_management:
      status: implemented
      evidence: asset_inventory

    a9_access_control:
      status: automated
      evidence: access_logs

    a10_cryptography:
      status: implemented
      evidence: encryption_audit

    a12_operations:
      status: automated
      evidence: operational_logs

    a14_development:
      status: automated
      evidence: sdlc_evidence

    a16_incident:
      status: implemented
      evidence: incident_logs

    a18_compliance:
      status: ongoing
      evidence: compliance_reports
```

### ISO 27001 Report

```bash
# Generate ISO 27001 evidence
proagents compliance report --framework iso27001

# Statement of Applicability
proagents compliance soa --framework iso27001
```

---

## Multi-Framework Compliance

### Unified Configuration

```yaml
compliance:
  enabled: true

  frameworks:
    soc2:
      enabled: true
      auto_evidence: true

    gdpr:
      enabled: true
      data_region: "eu"

    hipaa:
      enabled: false  # Enable if handling PHI

    pci_dss:
      enabled: true
      level: 2

  # Unified controls
  unified_controls:
    access_control:
      satisfies: ["soc2.cc6", "gdpr.32", "pci.7", "iso.a9"]

    audit_logging:
      satisfies: ["soc2.cc7", "gdpr.30", "pci.10", "iso.a12"]

    encryption:
      satisfies: ["gdpr.32", "pci.3", "pci.4", "iso.a10"]
```

### Cross-Framework Report

```bash
# Generate unified compliance report
proagents compliance report --all

# Output includes:
# - SOC 2 evidence package
# - GDPR compliance status
# - PCI-DSS requirements matrix
# - Unified control mapping
```

---

## Compliance Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Compliance Overview                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Active Frameworks:                                          │
│                                                             │
│ SOC 2 Type II                                              │
│ ├── Status: ✅ Compliant                                   │
│ ├── Last Audit: 2024-01-15                                 │
│ ├── Controls Met: 45/45                                    │
│ └── Next Review: 2024-04-15                                │
│                                                             │
│ GDPR                                                        │
│ ├── Status: ✅ Compliant                                   │
│ ├── DPO: dpo@company.com                                   │
│ ├── Data Regions: EU (Frankfurt)                           │
│ └── Last Assessment: 2024-01-10                            │
│                                                             │
│ PCI-DSS Level 2                                            │
│ ├── Status: ⚠️ Review Needed                               │
│ ├── Open Items: 2                                          │
│ │   • Req 6.5: Update security training                   │
│ │   • Req 11.2: Schedule vulnerability scan               │
│ └── Next SAQ Due: 2024-03-01                               │
│                                                             │
│ Upcoming:                                                   │
│ • Feb 1: Annual access review                              │
│ • Feb 15: Penetration test scheduled                       │
│ • Mar 1: PCI SAQ submission                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Start with Assessment**: Run compliance check before enabling
2. **Single Source**: Let ProAgents be the central audit log
3. **Automate Evidence**: Configure auto-collection for all frameworks
4. **Regular Reviews**: Schedule quarterly compliance reviews
5. **Train Team**: Ensure team understands compliance requirements
6. **Document Exceptions**: Record and justify any control exceptions
7. **Test Controls**: Regularly verify controls are working

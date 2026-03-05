# Cost Estimation Template

Standardized template for estimating feature and infrastructure costs.

---

## Feature Cost Estimation

```markdown
# Cost Estimate: [Feature Name]

## Summary

| Category | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Compute | $XXX | $X,XXX |
| Storage | $XXX | $X,XXX |
| Network | $XXX | $X,XXX |
| Third-party | $XXX | $X,XXX |
| **Total** | **$XXX** | **$X,XXX** |

## Assumptions

- Expected users: [X,XXX]
- Requests per user/day: [XX]
- Average request size: [X KB]
- Data retention: [X months]
- Growth rate: [X% monthly]

---

## Detailed Breakdown

### Compute Costs

| Resource | Quantity | Unit Cost | Monthly Total |
|----------|----------|-----------|---------------|
| Lambda invocations | X,XXX,XXX | $0.20/1M | $XX |
| Lambda compute (GB-s) | XXX,XXX | $0.0000166667 | $XX |
| EC2 instances | X | $XX/month | $XX |
| ECS Fargate | X vCPU, X GB | $XX/month | $XX |
| **Compute Total** | | | **$XXX** |

### Storage Costs

| Resource | Quantity | Unit Cost | Monthly Total |
|----------|----------|-----------|---------------|
| RDS PostgreSQL | X GB | $0.115/GB | $XX |
| RDS IOPS | X,XXX | $0.10/IOPS | $XX |
| S3 Standard | X GB | $0.023/GB | $XX |
| S3 Requests | X,XXX | $0.005/1000 | $XX |
| ElastiCache | X GB | $XX/GB | $XX |
| **Storage Total** | | | **$XXX** |

### Network Costs

| Resource | Quantity | Unit Cost | Monthly Total |
|----------|----------|-----------|---------------|
| Data transfer out | X GB | $0.09/GB | $XX |
| CloudFront | X TB | $0.085/GB | $XX |
| NAT Gateway | X GB | $0.045/GB | $XX |
| API Gateway | X M requests | $3.50/M | $XX |
| **Network Total** | | | **$XXX** |

### Third-Party Services

| Service | Tier/Plan | Monthly Cost |
|---------|-----------|--------------|
| Auth0 | Professional | $XX |
| SendGrid | Pro 100K | $XX |
| Twilio | Pay-as-you-go | $XX |
| Sentry | Team | $XX |
| **Third-Party Total** | | **$XXX** |

---

## Cost by Scale

### Current (1,000 users)

| Category | Cost |
|----------|------|
| Compute | $50 |
| Storage | $30 |
| Network | $20 |
| Third-party | $100 |
| **Total** | **$200** |

### Growth (10,000 users)

| Category | Cost |
|----------|------|
| Compute | $200 |
| Storage | $150 |
| Network | $100 |
| Third-party | $300 |
| **Total** | **$750** |

### Scale (100,000 users)

| Category | Cost |
|----------|------|
| Compute | $1,500 |
| Storage | $800 |
| Network | $600 |
| Third-party | $1,000 |
| **Total** | **$3,900** |

---

## Cost Optimization Opportunities

### Immediate Savings

| Optimization | Current Cost | Optimized Cost | Savings |
|--------------|-------------|----------------|---------|
| Reserved instances | $500/mo | $300/mo | $200/mo |
| S3 lifecycle policies | $100/mo | $60/mo | $40/mo |
| CloudFront caching | $200/mo | $150/mo | $50/mo |
| **Total Savings** | | | **$290/mo** |

### Recommendations

1. **Use Reserved Instances**
   - Current: On-demand EC2
   - Recommendation: 1-year reserved
   - Savings: 40%

2. **Implement Caching**
   - Add Redis for API responses
   - Reduce database queries by 60%
   - Cost: $50/mo, Saves: $150/mo

3. **Optimize Storage**
   - Move old data to S3 Glacier
   - Implement S3 lifecycle policies
   - Savings: 30%

---

## ROI Analysis

### Investment

| Item | Cost |
|------|------|
| Development | $XX,XXX |
| Infrastructure (Year 1) | $X,XXX |
| Third-party setup | $XXX |
| **Total Investment** | **$XX,XXX** |

### Expected Returns

| Metric | Value |
|--------|-------|
| New revenue/month | $XX,XXX |
| Cost savings/month | $X,XXX |
| Payback period | X months |
| First year ROI | XXX% |

---

## Risk Factors

| Risk | Impact | Mitigation |
|------|--------|------------|
| Higher traffic than expected | +50% costs | Auto-scaling with budget alerts |
| Third-party price increase | +20% costs | Multi-vendor strategy |
| Data growth exceeds estimate | +30% storage | Early archival policies |

---

## Approval

| Level | Monthly Increase | Required Approval |
|-------|-----------------|-------------------|
| < $100 | Auto-approved | - |
| $100 - $500 | Team Lead | [Name] |
| $500 - $2,000 | Manager | [Name] |
| > $2,000 | Director | [Name] |

**Estimated Monthly Cost:** $XXX
**Approval Required:** [Level]
**Approved By:** _____________
**Date:** _____________
```

---

## Quick Estimate Calculator

```yaml
# quick-estimate.yaml
# Fill in your estimates for quick cost calculation

feature_name: "User Dashboard"

# Traffic Estimates
traffic:
  daily_active_users: 1000
  requests_per_user: 20
  average_request_size_kb: 5
  peak_multiplier: 3  # Peak vs average

# Compute
compute:
  type: "serverless"  # serverless | container | vm
  estimated_duration_ms: 100
  memory_mb: 256

# Storage
storage:
  database_gb: 10
  file_storage_gb: 50
  cache_gb: 1

# Third-party
third_party:
  - name: "Auth Provider"
    monthly_cost: 50
  - name: "Email Service"
    monthly_cost: 25

# Calculated Results (auto-generated)
results:
  monthly_requests: 600000  # users * requests * 30
  lambda_cost: 12           # $0.20/M * 0.6M
  lambda_compute: 25        # GB-s * cost
  storage_cost: 15          # RDS + S3
  network_cost: 5           # Data transfer
  third_party_cost: 75
  total_monthly: 132
  total_annual: 1584
```

---

## Cost Tracking Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    Cost Dashboard - January 2024             │
├──────────────────┬──────────────────┬───────────────────────┤
│   Budget: $500   │   Actual: $423   │   Remaining: $77      │
│                  │   (85%)          │   15% under budget    │
├──────────────────┴──────────────────┴───────────────────────┤
│                                                             │
│  Cost Trend (Last 6 Months)                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     ╭─╮                                              │   │
│  │    ╭╯ ╰╮  ╭──╮     ╭─╮                              │   │
│  │ ──╯    ╰──╯  ╰─────╯ ╰─────────────────────         │   │
│  │ Aug  Sep  Oct  Nov  Dec  Jan                        │   │
│  │ $380 $420 $450 $480 $445 $423                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  By Category                      │  Top Costs             │
│  ┌───────────────────────┐       │  ┌──────────────────┐   │
│  │ Compute    ████  42%  │       │  │ RDS      $150    │   │
│  │ Storage    ███   30%  │       │  │ Lambda   $100    │   │
│  │ Network    ██    15%  │       │  │ Auth0    $50     │   │
│  │ Third-party█     13%  │       │  │ S3       $45     │   │
│  └───────────────────────┘       │  └──────────────────┘   │
│                                                             │
│  Alerts                                                     │
│  ⚠️  Lambda usage up 25% - consider optimization           │
│  ✅  Storage costs stable                                  │
│  ℹ️  New feature estimated +$75/month                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/cost-estimate` | Start cost estimation wizard |
| `/cost-estimate --template` | Get blank template |
| `/cost-estimate --quick` | Quick estimate calculator |
| `/cost-report` | Generate cost report |
| `/cost-compare` | Compare actual vs estimated |

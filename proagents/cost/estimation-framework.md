# Cost Estimation Framework

Estimate infrastructure and operational costs for new features.

---

## Cost Categories

### 1. Compute Costs

**Serverless Functions:**
```yaml
compute:
  serverless:
    provider: "aws_lambda"  # aws_lambda | vercel | cloudflare_workers

    estimate:
      invocations_per_month: 1000000
      avg_duration_ms: 200
      memory_mb: 256

    calculation:
      # AWS Lambda pricing (example)
      request_cost: "$0.20 per 1M requests"
      duration_cost: "$0.0000166667 per GB-second"

      monthly_estimate:
        requests: "$0.20"
        duration: "$0.83"  # 1M × 0.2s × 0.25GB × $0.0000166667
        total: "$1.03"
```

**Container/Server:**
```yaml
compute:
  containers:
    provider: "aws_ecs"  # aws_ecs | gcp_cloud_run | azure_container

    estimate:
      instances: 2
      vcpu: 0.5
      memory_gb: 1
      hours_per_month: 730

    monthly_estimate: "$30"
```

---

### 2. Storage Costs

**Database:**
```yaml
storage:
  database:
    provider: "aws_rds"  # aws_rds | planetscale | supabase

    estimate:
      storage_gb: 20
      iops: 1000
      backup_retention_days: 7

    monthly_estimate:
      storage: "$2.30"
      iops: "$10.00"
      backup: "$1.00"
      total: "$13.30"
```

**File Storage:**
```yaml
storage:
  files:
    provider: "aws_s3"  # aws_s3 | cloudflare_r2 | gcp_storage

    estimate:
      storage_gb: 100
      requests_per_month: 100000
      bandwidth_gb: 50

    monthly_estimate:
      storage: "$2.30"
      requests: "$0.04"
      bandwidth: "$4.50"
      total: "$6.84"
```

---

### 3. Network Costs

```yaml
network:
  cdn:
    provider: "cloudflare"  # cloudflare | aws_cloudfront | vercel

    estimate:
      bandwidth_gb: 100
      requests_per_month: 10000000

    monthly_estimate:
      cloudflare_free: "$0"
      cloudflare_pro: "$20"
      aws_cloudfront: "$8.50"

  api_gateway:
    provider: "aws_api_gateway"

    estimate:
      requests_per_month: 1000000

    monthly_estimate: "$3.50"
```

---

### 4. Third-Party Services

```yaml
third_party:
  auth:
    provider: "auth0"
    estimate:
      monthly_active_users: 1000
    monthly_estimate: "$0 (free tier)"  # Up to 7000 MAU

  email:
    provider: "sendgrid"
    estimate:
      emails_per_month: 10000
    monthly_estimate: "$0 (free tier)"  # Up to 100/day

  monitoring:
    provider: "datadog"
    estimate:
      hosts: 2
      custom_metrics: 100
    monthly_estimate: "$30"

  search:
    provider: "algolia"
    estimate:
      records: 10000
      searches_per_month: 100000
    monthly_estimate: "$0 (free tier)"
```

---

## Cost Estimation Template

```markdown
# Feature Cost Estimate

## Feature: [Feature Name]
## Date: [YYYY-MM-DD]
## Estimated By: [Name]

---

## Summary

| Category | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Compute | $XX | $XXX |
| Storage | $XX | $XXX |
| Network | $XX | $XXX |
| Third-party | $XX | $XXX |
| **Total** | **$XX** | **$XXX** |

---

## Detailed Breakdown

### Compute
| Resource | Specs | Cost |
|----------|-------|------|
| Lambda functions | 1M invocations, 256MB | $1.03 |
| ECS containers | 2 × 0.5 vCPU | $30.00 |
| **Subtotal** | | **$31.03** |

### Storage
| Resource | Specs | Cost |
|----------|-------|------|
| RDS PostgreSQL | 20GB, db.t3.micro | $13.30 |
| S3 bucket | 100GB, standard | $6.84 |
| **Subtotal** | | **$20.14** |

### Network
| Resource | Specs | Cost |
|----------|-------|------|
| CloudFront | 100GB bandwidth | $8.50 |
| API Gateway | 1M requests | $3.50 |
| **Subtotal** | | **$12.00** |

### Third-Party Services
| Service | Tier | Cost |
|---------|------|------|
| Auth0 | Free | $0 |
| SendGrid | Free | $0 |
| Datadog | Pro | $30 |
| **Subtotal** | | **$30.00** |

---

## Assumptions
- Traffic estimates based on [source]
- Growth rate: [X]% monthly
- Peak traffic: [X]× average

## Scaling Projections

| Users | Monthly Cost |
|-------|-------------|
| 1,000 | $93 |
| 10,000 | $250 |
| 100,000 | $1,200 |

## Cost Optimization Recommendations
1. Use reserved instances for predictable workloads
2. Implement caching to reduce database calls
3. Use CDN for static assets
```

---

## Approval Thresholds

```yaml
cost_approval:
  thresholds:
    - range: "$0-100"
      approver: "auto_approved"

    - range: "$100-500"
      approver: "tech_lead"
      requires: "cost_estimate_doc"

    - range: "$500-2000"
      approver: "engineering_manager"
      requires:
        - "cost_estimate_doc"
        - "scaling_projections"

    - range: "$2000+"
      approver: "director"
      requires:
        - "cost_estimate_doc"
        - "scaling_projections"
        - "roi_analysis"
```

---

## Cost Monitoring

```yaml
monitoring:
  alerts:
    - threshold: "80% of budget"
      action: "notify"
      recipients: ["team-lead"]

    - threshold: "100% of budget"
      action: "notify_urgent"
      recipients: ["team-lead", "manager"]

    - threshold: "120% of budget"
      action: "auto_scale_down"
      notify: ["all"]

  reports:
    daily: true
    weekly_summary: true
    monthly_detailed: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:cost-estimate` | Generate cost estimate for feature |
| `pa:cost-compare` | Compare costs across providers |
| `pa:cost-report` | View current costs |
| `pa:cost-optimize` | Get optimization suggestions |

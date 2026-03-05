# Webhook Security

Authentication, verification, and security best practices.

---

## Signature Verification

### HMAC Signatures

ProAgents signs webhook payloads using HMAC-SHA256:

```yaml
webhooks:
  endpoints:
    - name: "secure-webhook"
      url: "https://api.example.com/webhooks"
      signature:
        enabled: true
        algorithm: "sha256"
        secret_env: "WEBHOOK_SECRET"
        header: "X-ProAgents-Signature"
```

### Signature Header Format

```
X-ProAgents-Signature: sha256=a1b2c3d4e5f6...
```

### Verification Examples

**Node.js:**
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = 'sha256=' +
    crypto.createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express middleware
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-proagents-signature'];
  const payload = req.body.toString();

  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  const event = JSON.parse(payload);
  // ...
});
```

**Python:**
```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected)

# Flask example
@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-ProAgents-Signature')
    payload = request.get_data()

    if not verify_webhook(payload, signature, os.environ['WEBHOOK_SECRET']):
        abort(401)

    event = request.get_json()
    # Process webhook
```

**Go:**
```go
import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
)

func verifyWebhook(payload []byte, signature, secret string) bool {
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(payload)
    expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))

    return hmac.Equal([]byte(signature), []byte(expected))
}
```

---

## Timestamp Validation

### Prevent Replay Attacks

```yaml
webhooks:
  endpoints:
    - name: "replay-protected"
      url: "https://api.example.com/webhooks"
      security:
        include_timestamp: true
        timestamp_header: "X-ProAgents-Timestamp"
        max_age: 300  # 5 minutes
```

**Validation Example:**
```javascript
function validateTimestamp(timestampHeader, maxAgeSeconds = 300) {
  const timestamp = parseInt(timestampHeader, 10);
  const now = Math.floor(Date.now() / 1000);
  const age = now - timestamp;

  if (age > maxAgeSeconds) {
    throw new Error('Webhook timestamp too old');
  }

  if (age < -60) {
    throw new Error('Webhook timestamp in future');
  }

  return true;
}
```

### Signed Timestamp

```
X-ProAgents-Signature: sha256=<signature>
X-ProAgents-Timestamp: 1705329000

Signature computed over: timestamp.payload
```

---

## IP Allowlisting

### Configure Allowed IPs

```yaml
webhooks:
  security:
    ip_allowlist:
      enabled: true
      # ProAgents IP ranges (example)
      ranges:
        - "192.168.1.0/24"
        - "10.0.0.0/8"

      # Or fetch from endpoint
      dynamic_list:
        url: "https://proagents.dev/api/webhook-ips"
        refresh: "1h"
```

### Firewall Configuration

```bash
# Example iptables rules
iptables -A INPUT -p tcp --dport 443 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j DROP
```

---

## TLS Requirements

### Enforce HTTPS

```yaml
webhooks:
  security:
    tls:
      required: true
      min_version: "1.2"
      verify_certificate: true
```

### Certificate Pinning

```yaml
webhooks:
  endpoints:
    - name: "pinned-webhook"
      url: "https://api.example.com/webhooks"
      tls:
        pin_certificates: true
        pins:
          - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="
```

---

## Authentication Methods

### Bearer Token

```yaml
webhooks:
  endpoints:
    - name: "bearer-auth"
      url: "https://api.example.com/webhooks"
      auth:
        type: "bearer"
        token_env: "WEBHOOK_TOKEN"
```

**Request:**
```
POST /webhooks HTTP/1.1
Authorization: Bearer <token>
```

### API Key

```yaml
webhooks:
  endpoints:
    - name: "api-key-auth"
      url: "https://api.example.com/webhooks"
      auth:
        type: "api_key"
        key_env: "WEBHOOK_API_KEY"
        header: "X-API-Key"
```

### Mutual TLS (mTLS)

```yaml
webhooks:
  endpoints:
    - name: "mtls-webhook"
      url: "https://api.example.com/webhooks"
      auth:
        type: "mtls"
        client_cert: "/path/to/client.crt"
        client_key: "/path/to/client.key"
        ca_cert: "/path/to/ca.crt"
```

---

## Secret Management

### Environment Variables

```yaml
webhooks:
  endpoints:
    - name: "secure-webhook"
      url: "${WEBHOOK_URL}"
      auth:
        type: "bearer"
        token_env: "WEBHOOK_TOKEN"
      signature:
        secret_env: "WEBHOOK_SECRET"
```

### Secret Rotation

```yaml
webhooks:
  secrets:
    rotation:
      enabled: true
      interval: "30d"
      overlap_period: "24h"

    # Support multiple secrets during rotation
    active_secrets:
      - env: "WEBHOOK_SECRET"
      - env: "WEBHOOK_SECRET_OLD"
```

**Rotation Process:**
```
1. Generate new secret
2. Add new secret to config (WEBHOOK_SECRET_NEW)
3. Update receiving endpoint to accept both
4. Make new secret primary (WEBHOOK_SECRET)
5. Wait overlap period
6. Remove old secret
```

---

## Audit Logging

### Security Events

```yaml
webhooks:
  security:
    audit:
      enabled: true
      log_level: "info"

      events:
        - "signature_verification_failed"
        - "authentication_failed"
        - "ip_blocked"
        - "timestamp_expired"
        - "delivery_success"
        - "delivery_failed"
```

### Audit Log Format

```json
{
  "timestamp": "2024-01-15T14:30:00Z",
  "event": "signature_verification_failed",
  "webhook_id": "evt_abc123",
  "endpoint": "secure-webhook",
  "url": "https://api.example.com/webhooks",
  "ip_address": "192.168.1.100",
  "reason": "Invalid HMAC signature",
  "request_id": "req_xyz789"
}
```

---

## Security Checklist

### Sending Webhooks

- [ ] Use HTTPS only
- [ ] Sign all payloads with HMAC
- [ ] Include timestamps
- [ ] Use strong secrets (32+ bytes)
- [ ] Rotate secrets regularly
- [ ] Log all deliveries

### Receiving Webhooks

- [ ] Verify signatures before processing
- [ ] Validate timestamps
- [ ] Use IP allowlisting if possible
- [ ] Process webhooks idempotently
- [ ] Respond quickly, process async
- [ ] Log all received webhooks
- [ ] Handle failures gracefully

---

## Commands

```bash
# Generate webhook secret
proagents webhooks secret generate

# Rotate secrets
proagents webhooks secret rotate

# Test signature verification
proagents webhooks verify --signature <sig> --payload <file>

# View security audit log
proagents webhooks audit --last 24h
```

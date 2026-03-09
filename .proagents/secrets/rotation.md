# Secret Rotation

Automated and manual secret rotation procedures.

---

## Rotation Strategy

| Secret Type | Rotation Frequency | Method |
|-------------|-------------------|--------|
| API Keys | 90 days | Automated |
| Database Passwords | 30 days | Automated |
| JWT Signing Keys | 7 days | Automated (graceful) |
| Encryption Keys | 365 days | Manual + automated |
| Service Account Keys | 90 days | Automated |

---

## Automated Rotation

### Configuration

```yaml
# proagents.config.yaml
secrets:
  rotation:
    enabled: true

    # Default schedule
    default_schedule: "90d"

    # Secret-specific schedules
    schedules:
      database_password:
        frequency: "30d"
        method: "automated"
        pre_rotation_hook: "prepare-database"
        post_rotation_hook: "verify-connection"

      jwt_signing_key:
        frequency: "7d"
        method: "graceful"
        overlap_period: "24h"

      api_keys:
        frequency: "90d"
        method: "automated"
        notify_before: "7d"

    # Notifications
    notifications:
      before_rotation:
        channels: ["slack"]
        lead_time: "24h"

      after_rotation:
        channels: ["slack", "email"]

      on_failure:
        channels: ["pagerduty", "slack"]
```

### AWS Secrets Manager Rotation

```yaml
secrets:
  rotation:
    aws:
      # Lambda rotation function
      lambda:
        function_name: "secret-rotation-function"
        runtime: "nodejs18.x"

      # Rotation configuration
      config:
        database_secrets:
          rotation_lambda_arn: "arn:aws:lambda:us-east-1:123456789:function:rotate-db"
          automatically_after_days: 30

        api_keys:
          rotation_lambda_arn: "arn:aws:lambda:us-east-1:123456789:function:rotate-api"
          automatically_after_days: 90
```

### Vault Dynamic Secrets

```yaml
secrets:
  rotation:
    vault:
      # Database dynamic credentials
      database:
        enabled: true
        mount: "database"
        role: "myapp"
        ttl: "1h"
        max_ttl: "24h"

      # Automatic renewal
      renewal:
        enabled: true
        threshold: "15m"  # Renew when 15 min left
```

---

## Graceful Key Rotation

### JWT Key Rotation

```typescript
// rotation/jwtKeys.ts
interface KeyPair {
  id: string;
  privateKey: string;
  publicKey: string;
  createdAt: Date;
  expiresAt: Date;
}

class JWTKeyManager {
  private keys: KeyPair[] = [];

  async rotate(): Promise<void> {
    // Generate new key pair
    const newKey = await this.generateKeyPair();

    // Add to active keys
    this.keys.push(newKey);

    // Update secrets store
    await this.storeKeys();

    // Schedule old key removal
    const oldKey = this.keys[0];
    if (oldKey && this.keys.length > 2) {
      await this.scheduleKeyRemoval(oldKey.id, '24h');
    }
  }

  // Sign with newest key
  sign(payload: object): string {
    const currentKey = this.keys[this.keys.length - 1];
    return jwt.sign(payload, currentKey.privateKey, {
      algorithm: 'RS256',
      keyid: currentKey.id,
    });
  }

  // Verify with any valid key
  verify(token: string): object {
    const decoded = jwt.decode(token, { complete: true });
    const key = this.keys.find(k => k.id === decoded.header.kid);

    if (!key) {
      throw new Error('Invalid key ID');
    }

    return jwt.verify(token, key.publicKey);
  }
}
```

### Encryption Key Rotation

```typescript
// rotation/encryptionKeys.ts
interface EncryptionKey {
  id: string;
  key: Buffer;
  version: number;
  status: 'active' | 'decrypt-only' | 'disabled';
  createdAt: Date;
}

class EncryptionKeyManager {
  private keys: Map<string, EncryptionKey> = new Map();
  private activeKeyId: string;

  async rotate(): Promise<void> {
    // Mark current key as decrypt-only
    const currentKey = this.keys.get(this.activeKeyId);
    if (currentKey) {
      currentKey.status = 'decrypt-only';
    }

    // Generate new key
    const newKey: EncryptionKey = {
      id: crypto.randomUUID(),
      key: crypto.randomBytes(32),
      version: (currentKey?.version || 0) + 1,
      status: 'active',
      createdAt: new Date(),
    };

    this.keys.set(newKey.id, newKey);
    this.activeKeyId = newKey.id;

    // Store in secrets manager
    await this.persistKeys();

    logger.info('Encryption key rotated', {
      newKeyId: newKey.id,
      version: newKey.version,
    });
  }

  encrypt(data: Buffer): { keyId: string; ciphertext: Buffer } {
    const key = this.keys.get(this.activeKeyId)!;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key.key, iv);
    const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      keyId: key.id,
      ciphertext: Buffer.concat([iv, authTag, ciphertext]),
    };
  }

  decrypt(keyId: string, ciphertext: Buffer): Buffer {
    const key = this.keys.get(keyId);
    if (!key || key.status === 'disabled') {
      throw new Error('Invalid or disabled key');
    }

    const iv = ciphertext.slice(0, 16);
    const authTag = ciphertext.slice(16, 32);
    const encrypted = ciphertext.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key.key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}
```

---

## Database Password Rotation

### Rotation Procedure

```yaml
secrets:
  rotation:
    database:
      procedure:
        steps:
          - name: "Create new credentials"
            action: |
              CREATE USER 'myapp_new' IDENTIFIED BY '{{new_password}}';
              GRANT ALL ON mydb.* TO 'myapp_new';

          - name: "Update application"
            action: "update_secret"
            target: "DATABASE_URL"
            value: "postgresql://myapp_new:{{new_password}}@host/db"

          - name: "Verify connectivity"
            action: "health_check"
            timeout: "30s"
            retries: 3

          - name: "Remove old credentials"
            action: |
              DROP USER 'myapp_old';
            delay: "5m"

        rollback:
          - name: "Restore old credentials"
            action: "revert_secret"
            target: "DATABASE_URL"
```

### Implementation

```typescript
// rotation/database.ts
async function rotateDatabasePassword(
  secretName: string
): Promise<void> {
  // Generate new password
  const newPassword = generateSecurePassword();

  // Create new database user
  await db.query(`
    CREATE USER 'app_new' IDENTIFIED BY '${newPassword}';
    GRANT ALL PRIVILEGES ON mydb.* TO 'app_new';
    FLUSH PRIVILEGES;
  `);

  // Update secret in secrets manager
  await secretsManager.update(secretName, {
    username: 'app_new',
    password: newPassword,
  });

  // Wait for applications to pick up new credentials
  await sleep(60000);

  // Verify new credentials work
  const testConnection = await testDatabaseConnection(newPassword);
  if (!testConnection.success) {
    throw new Error('New credentials failed verification');
  }

  // Remove old user
  await db.query(`DROP USER IF EXISTS 'app_old'`);

  logger.info('Database password rotated successfully');
}
```

---

## Rotation Monitoring

### Metrics

```yaml
secrets:
  rotation:
    monitoring:
      metrics:
        - name: "secret_rotation_age_days"
          type: "gauge"
          labels: ["secret_name", "secret_type"]

        - name: "secret_rotation_total"
          type: "counter"
          labels: ["secret_name", "status"]

        - name: "secret_rotation_duration_seconds"
          type: "histogram"

      alerts:
        - name: "SecretRotationOverdue"
          condition: "secret_rotation_age_days > secret_max_age_days"
          severity: "warning"

        - name: "SecretRotationFailed"
          condition: "secret_rotation_total{status='failed'} > 0"
          severity: "critical"
```

### Audit Logging

```yaml
secrets:
  rotation:
    audit:
      enabled: true

      log_events:
        - "rotation_started"
        - "rotation_completed"
        - "rotation_failed"
        - "secret_accessed"

      retention: "2 years"

      destinations:
        - type: "cloudwatch"
          log_group: "/security/secret-rotation"
```

---

## Commands

```bash
# Rotate specific secret
proagents secrets rotate DATABASE_PASSWORD

# Rotate all secrets due for rotation
proagents secrets rotate --all-due

# Check rotation status
proagents secrets rotation-status

# View rotation history
proagents secrets rotation-history --secret API_KEY

# Schedule rotation
proagents secrets schedule-rotation JWT_SECRET --in 7d

# Test rotation procedure
proagents secrets test-rotation DATABASE_PASSWORD --dry-run
```

---

## Best Practices

1. **Automate Everything**: Manual rotation is error-prone
2. **Graceful Rotation**: Overlap validity periods for zero downtime
3. **Test Procedures**: Regularly test rotation in staging
4. **Monitor Age**: Alert on secrets approaching rotation date
5. **Audit Trail**: Log all rotation events
6. **Rollback Plan**: Have a plan if rotation fails
7. **Verify After**: Always verify new credentials work

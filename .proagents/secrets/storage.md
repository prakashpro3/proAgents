# Secret Storage

Secure storage solutions for sensitive data.

---

## Storage Options

| Solution | Use Case | Pros | Cons |
|----------|----------|------|------|
| **Environment Variables** | Simple deployments | Easy, universal | Limited security |
| **AWS Secrets Manager** | AWS infrastructure | Integrated, rotation | AWS lock-in |
| **HashiCorp Vault** | Multi-cloud | Powerful, flexible | Complex setup |
| **Azure Key Vault** | Azure infrastructure | Integrated | Azure lock-in |
| **Google Secret Manager** | GCP infrastructure | Integrated | GCP lock-in |

---

## Environment Variables

### Basic Usage

```yaml
# proagents.config.yaml
secrets:
  storage:
    provider: "env"

    # Environment variable naming
    naming:
      prefix: ""
      style: "UPPER_SNAKE_CASE"

    # .env file handling
    dotenv:
      enabled: true
      files:
        - ".env"
        - ".env.${NODE_ENV}"
        - ".env.local"

    # Required secrets
    required:
      - "DATABASE_URL"
      - "JWT_SECRET"
      - "API_KEY"
```

### .env Files

```bash
# .env (base, committed)
NODE_ENV=development
LOG_LEVEL=debug

# .env.development (environment-specific)
DATABASE_URL=postgresql://localhost:5432/dev

# .env.local (local overrides, gitignored)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=local-development-secret
```

---

## AWS Secrets Manager

### Configuration

```yaml
secrets:
  storage:
    provider: "aws-secrets-manager"

    aws:
      region: "us-east-1"

      # Secret naming
      naming:
        prefix: "myapp/"
        separator: "/"

      # Caching
      cache:
        enabled: true
        ttl: "300s"

      # Secret mappings
      mappings:
        DATABASE_URL: "myapp/database/url"
        JWT_SECRET: "myapp/auth/jwt-secret"
        STRIPE_KEY: "myapp/payments/stripe-key"
```

### Usage

```typescript
// secrets/aws.ts
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);

  if (response.SecretString) {
    return response.SecretString;
  }

  throw new Error(`Secret ${secretName} not found`);
}

// With caching
const secretCache = new Map<string, { value: string; expires: number }>();

export async function getSecretCached(
  secretName: string,
  ttl = 300000
): Promise<string> {
  const cached = secretCache.get(secretName);
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  const value = await getSecret(secretName);
  secretCache.set(secretName, { value, expires: Date.now() + ttl });
  return value;
}
```

---

## HashiCorp Vault

### Configuration

```yaml
secrets:
  storage:
    provider: "vault"

    vault:
      address: "https://vault.company.com"

      # Authentication
      auth:
        method: "kubernetes"  # or "token", "approle", "aws"
        role: "myapp"
        mount_path: "auth/kubernetes"

      # Secret engines
      engines:
        kv:
          mount: "secret"
          version: 2

        database:
          mount: "database"
          role: "myapp-db"

      # Secret paths
      paths:
        database: "secret/data/myapp/database"
        api_keys: "secret/data/myapp/api-keys"
```

### Usage

```typescript
// secrets/vault.ts
import Vault from 'node-vault';

const vault = Vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
});

// Kubernetes auth
async function authenticate() {
  const jwt = await fs.readFile(
    '/var/run/secrets/kubernetes.io/serviceaccount/token',
    'utf8'
  );

  await vault.kubernetesLogin({
    role: 'myapp',
    jwt,
  });
}

// Get secret
export async function getSecret(path: string): Promise<Record<string, string>> {
  const response = await vault.read(path);
  return response.data.data;
}

// Dynamic database credentials
export async function getDatabaseCredentials(): Promise<{
  username: string;
  password: string;
}> {
  const response = await vault.read('database/creds/myapp-db');
  return {
    username: response.data.username,
    password: response.data.password,
  };
}
```

---

## Azure Key Vault

### Configuration

```yaml
secrets:
  storage:
    provider: "azure-key-vault"

    azure:
      vault_url: "https://myapp-vault.vault.azure.net"

      # Authentication
      auth:
        method: "managed_identity"  # or "service_principal"

      # Secret mappings
      mappings:
        DATABASE_URL: "database-connection-string"
        JWT_SECRET: "jwt-signing-key"
```

### Usage

```typescript
// secrets/azure.ts
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const client = new SecretClient(
  'https://myapp-vault.vault.azure.net',
  credential
);

export async function getSecret(secretName: string): Promise<string> {
  const secret = await client.getSecret(secretName);
  return secret.value!;
}
```

---

## Google Secret Manager

### Configuration

```yaml
secrets:
  storage:
    provider: "gcp-secret-manager"

    gcp:
      project_id: "my-project"

      # Secret paths
      paths:
        database: "projects/my-project/secrets/database-url/versions/latest"
        jwt: "projects/my-project/secrets/jwt-secret/versions/latest"
```

### Usage

```typescript
// secrets/gcp.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(secretPath: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: secretPath,
  });

  return version.payload!.data!.toString();
}
```

---

## Secret Injection

### Application Startup

```typescript
// config/secrets.ts
import { loadSecrets } from '@proagents/secrets';

export async function initializeSecrets() {
  const secrets = await loadSecrets({
    provider: process.env.SECRETS_PROVIDER || 'env',
    required: ['DATABASE_URL', 'JWT_SECRET'],
  });

  // Inject into process.env
  Object.entries(secrets).forEach(([key, value]) => {
    process.env[key] = value;
  });

  return secrets;
}

// index.ts
async function main() {
  await initializeSecrets();
  await startServer();
}
```

### Kubernetes Integration

```yaml
# kubernetes/deployment.yaml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: app
      env:
        # From Kubernetes secret
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url

        # From AWS Secrets Manager (with external-secrets)
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: external-secrets
              key: api-key

  # Mount secrets as files
  volumes:
    - name: secrets
      secret:
        secretName: app-secrets
  volumeMounts:
    - name: secrets
      mountPath: /etc/secrets
      readOnly: true
```

---

## Commands

```bash
# List secrets
proagents secrets list

# Get secret value
proagents secrets get DATABASE_URL

# Set secret
proagents secrets set API_KEY "new-value" --env production

# Sync secrets to Kubernetes
proagents secrets sync --to kubernetes

# Validate required secrets
proagents secrets validate

# Export secrets (encrypted)
proagents secrets export --encrypted > secrets.enc
```

---

## Best Practices

1. **Never Commit Secrets**: Use .gitignore and pre-commit hooks
2. **Least Privilege**: Grant minimal access to secrets
3. **Encryption at Rest**: Always encrypt stored secrets
4. **Audit Access**: Log all secret access
5. **Rotate Regularly**: Implement secret rotation
6. **Use Namespaces**: Organize secrets by environment/service
7. **Validate on Startup**: Fail fast if required secrets are missing

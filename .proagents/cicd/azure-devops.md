# Azure DevOps Pipeline Templates

Azure Pipelines YAML configurations.

---

## Complete Pipeline

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    exclude:
      - README.md
      - docs/*

pr:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '20.x'
  npm_config_cache: $(Pipeline.Workspace)/.npm

stages:
  - stage: Validate
    displayName: 'Validate'
    jobs:
      - job: Lint
        displayName: 'Lint & Type Check'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
            displayName: 'Install Node.js'

          - task: Cache@2
            inputs:
              key: 'npm | "$(Agent.OS)" | package-lock.json'
              restoreKeys: |
                npm | "$(Agent.OS)"
              path: $(npm_config_cache)
            displayName: 'Cache npm'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run lint
            displayName: 'Run ESLint'

          - script: npm run type-check
            displayName: 'Run TypeScript check'

  - stage: Test
    displayName: 'Test'
    dependsOn: Validate
    jobs:
      - job: UnitTests
        displayName: 'Unit Tests'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run test:unit -- --coverage
            displayName: 'Run unit tests'

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/junit.xml'
            condition: always()

          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'Cobertura'
              summaryFileLocation: '$(System.DefaultWorkingDirectory)/coverage/cobertura-coverage.xml'

      - job: IntegrationTests
        displayName: 'Integration Tests'
        services:
          postgres:
            image: postgres:15
            ports:
              - 5432:5432
            env:
              POSTGRES_DB: test_db
              POSTGRES_USER: test
              POSTGRES_PASSWORD: test
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run test:integration
            displayName: 'Run integration tests'
            env:
              DATABASE_URL: postgresql://test:test@localhost:5432/test_db

  - stage: Security
    displayName: 'Security'
    dependsOn: Validate
    jobs:
      - job: SecurityScan
        displayName: 'Security Scan'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm audit --audit-level=high
            displayName: 'NPM Audit'
            continueOnError: true

  - stage: Build
    displayName: 'Build'
    dependsOn:
      - Test
      - Security
    jobs:
      - job: Build
        displayName: 'Build Application'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run build
            displayName: 'Build'

          - publish: $(System.DefaultWorkingDirectory)/dist
            artifact: build
            displayName: 'Publish build artifact'

  - stage: DeployStaging
    displayName: 'Deploy to Staging'
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
    jobs:
      - deployment: DeployStaging
        displayName: 'Deploy to Staging'
        environment: 'staging'
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: build

                - script: |
                    npx proagents deploy --env staging
                  displayName: 'Deploy to staging'
                  env:
                    DEPLOY_TOKEN: $(STAGING_DEPLOY_TOKEN)

  - stage: DeployProduction
    displayName: 'Deploy to Production'
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployProduction
        displayName: 'Deploy to Production'
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: build

                - script: |
                    npx proagents deploy --env production
                  displayName: 'Deploy to production'
                  env:
                    DEPLOY_TOKEN: $(PROD_DEPLOY_TOKEN)
```

---

## Template Usage

```yaml
# azure-pipelines.yml
resources:
  repositories:
    - repository: templates
      type: git
      name: MyProject/pipeline-templates

extends:
  template: node-app.yml@templates
  parameters:
    nodeVersion: '20.x'
    runIntegrationTests: true
    deployToStaging: true
```

---

## Multi-Stage with Approvals

```yaml
stages:
  - stage: DeployProduction
    jobs:
      - deployment: Production
        environment: 'production'  # Requires approval in Azure DevOps
        strategy:
          runOnce:
            deploy:
              steps:
                - script: echo "Deploying..."
```

---

## Matrix Strategy

```yaml
jobs:
  - job: Test
    strategy:
      matrix:
        Node18:
          nodeVersion: '18.x'
        Node20:
          nodeVersion: '20.x'
        Node22:
          nodeVersion: '22.x'
    steps:
      - task: NodeTool@0
        inputs:
          versionSpec: $(nodeVersion)
      - script: npm test
```

---

## Best Practices

1. **Use Stages**: Organize pipeline into logical stages
2. **Caching**: Cache npm dependencies
3. **Environments**: Use environments for deployment approvals
4. **Templates**: Use templates for reusable pipelines
5. **Service Containers**: Use for database/service dependencies
6. **Variable Groups**: Store secrets in variable groups

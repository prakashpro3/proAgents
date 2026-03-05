# Jenkins Pipeline Templates

Declarative Jenkins pipeline configurations.

---

## Complete Jenkinsfile

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    tools {
        nodejs 'NodeJS-20'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Validate') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        sh 'npm run type-check'
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit -- --coverage'
                    }
                    post {
                        always {
                            junit 'junit.xml'
                            publishCoverage adapters: [
                                coberturaAdapter('coverage/cobertura-coverage.xml')
                            ]
                        }
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    deployToEnvironment('staging')
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
                submitter "admin,deploy-team"
            }
            steps {
                script {
                    deployToEnvironment('production')
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                color: 'good',
                message: "Build succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
    }
}

def deployToEnvironment(String environment) {
    withCredentials([string(credentialsId: "${environment}-deploy-token", variable: 'DEPLOY_TOKEN')]) {
        sh "npx proagents deploy --env ${environment}"
    }
}
```

---

## Multibranch Pipeline

```groovy
// Jenkinsfile for multibranch
pipeline {
    agent any

    stages {
        stage('Build & Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    def environment = env.BRANCH_NAME == 'main' ? 'production' : 'staging'
                    deployToEnvironment(environment)
                }
            }
        }
    }
}
```

---

## Shared Library

```groovy
// vars/nodePipeline.groovy
def call(Map config = [:]) {
    pipeline {
        agent any

        tools {
            nodejs config.nodeVersion ?: 'NodeJS-20'
        }

        stages {
            stage('Install') {
                steps {
                    sh 'npm ci'
                }
            }

            stage('Test') {
                steps {
                    sh 'npm test'
                }
            }

            stage('Build') {
                steps {
                    sh 'npm run build'
                }
            }

            stage('Deploy') {
                when {
                    expression { config.deploy == true }
                }
                steps {
                    sh "npx proagents deploy --env ${config.environment}"
                }
            }
        }
    }
}

// Usage in Jenkinsfile
@Library('my-shared-lib') _

nodePipeline(
    nodeVersion: 'NodeJS-20',
    deploy: true,
    environment: 'staging'
)
```

---

## Docker Agent

```groovy
pipeline {
    agent {
        docker {
            image 'node:20'
            args '-v $HOME/.npm:/root/.npm'
        }
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}
```

---

## Kubernetes Agent

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:20
    command:
    - sleep
    args:
    - infinity
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
'''
        }
    }

    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                container('docker') {
                    sh 'docker build -t myapp:latest .'
                }
            }
        }
    }
}
```

---

## Best Practices

1. **Use Declarative Pipelines**: Easier to read and maintain
2. **Shared Libraries**: DRY with shared pipeline code
3. **Parallel Stages**: Run independent stages in parallel
4. **Input Gates**: Require approval for production
5. **Clean Workspace**: Always clean up after builds
6. **Credentials Management**: Use Jenkins credentials store

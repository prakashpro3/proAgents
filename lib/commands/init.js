import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { selectPlatforms, copyPlatformFiles, savePlatformConfig, loadPlatformConfig } from './ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Files/folders to preserve during update (user customizations)
const PRESERVE_PATHS = [
  'active-features',           // User's work in progress
  '.learning',                 // Learned patterns
  'cache',                     // Cached analysis
];

// Config file is handled specially - merged not preserved
const CONFIG_FILE = 'proagents.config.yaml';

// Files that should always be updated (framework files)
const FRAMEWORK_FOLDERS = [
  'prompts',
  'templates',
  'checklists',
  'standards',
  'examples',
  'git',
  'ui-integration',
  'workflow-modes',
  'security',
  'performance',
  'testing-standards',
  'patterns',
  'scaffolding',
  'cli',
  'adr',
  'ai-models',
  'ai-training',
  'api-versioning',
  'approval-workflows',
  'automation',
  'changelog',
  'cicd',
  'collaboration',
  'compliance',
  'config-versioning',
  'config',
  'contract-testing',
  'cost',
  'database',
  'dependency-management',
  'disaster-recovery',
  'environments',
  'existing-projects',
  'feature-flags',
  'getting-started',
  'i18n',
  'ide-integration',
  'integrations',
  'learning',
  'logging',
  'mcp',
  'metrics',
  'migrations',
  'monitoring',
  'multi-project',
  'notifications',
  'offline-mode',
  'parallel-features',
  'plugins',
  'pm-integration',
  'reporting',
  'reverse-engineering',
  'rules',
  'runbooks',
  'secrets',
  'team',
  'troubleshooting',
  'webhooks',
];

// Root files to always update (AI files handled separately via platform selection)
const FRAMEWORK_FILES = [
  'README.md',
  'WORKFLOW.md',
  'PROAGENTS.md',
  'GETTING-STARTED-STORY.md',
  'slash-commands.json',
  'AI_INSTRUCTIONS.md',  // Universal instructions kept for reference
];

// Project type definitions for detection
const PROJECT_TYPES = [
  {
    id: 'nextjs',
    name: 'Next.js (Full-stack)',
    detect: {
      files: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
      deps: ['next']
    }
  },
  {
    id: 'react',
    name: 'React (Frontend)',
    detect: {
      deps: ['react', 'react-dom'],
      notDeps: ['next', 'react-native']
    }
  },
  {
    id: 'vue',
    name: 'Vue.js (Frontend)',
    detect: {
      files: ['vue.config.js', 'vite.config.ts', 'vite.config.js'],
      deps: ['vue']
    }
  },
  {
    id: 'angular',
    name: 'Angular (Frontend)',
    detect: {
      files: ['angular.json'],
      deps: ['@angular/core']
    }
  },
  {
    id: 'react-native',
    name: 'React Native (Mobile)',
    detect: {
      deps: ['react-native']
    }
  },
  {
    id: 'express',
    name: 'Express.js (Backend)',
    detect: {
      deps: ['express']
    }
  },
  {
    id: 'nestjs',
    name: 'NestJS (Backend)',
    detect: {
      files: ['nest-cli.json'],
      deps: ['@nestjs/core']
    }
  },
  {
    id: 'fastify',
    name: 'Fastify (Backend)',
    detect: {
      deps: ['fastify']
    }
  },
  {
    id: 'nodejs',
    name: 'Node.js (Backend)',
    detect: {
      files: ['package.json'],
      notDeps: ['react', 'vue', '@angular/core', 'next']
    }
  },
  {
    id: 'python',
    name: 'Python',
    detect: {
      files: ['requirements.txt', 'pyproject.toml', 'setup.py', 'Pipfile']
    }
  },
  {
    id: 'django',
    name: 'Django (Python)',
    detect: {
      files: ['manage.py'],
      patterns: ['django']
    }
  },
  {
    id: 'flask',
    name: 'Flask (Python)',
    detect: {
      patterns: ['flask']
    }
  },
  {
    id: 'other',
    name: 'Other / Custom',
    detect: {}
  }
];

// Project templates - pre-configured settings for common stacks
const PROJECT_TEMPLATES = {
  'nextjs-saas': {
    name: 'Next.js SaaS Starter',
    description: 'Full-stack SaaS with authentication, database, and payments',
    project: { type: 'nextjs' },
    techStack: {
      api_style: 'rest',
      state_management: 'zustand',
      styling: 'tailwind',
      database: 'postgresql',
      orm: 'prisma',
      auth_method: 'nextauth',
      test_framework: 'vitest'
    },
    platforms: ['claude', 'cursor', 'copilot']
  },
  'react-spa': {
    name: 'React Single Page App',
    description: 'Frontend-focused React application with modern tooling',
    project: { type: 'react' },
    techStack: {
      api_style: 'rest',
      state_management: 'zustand',
      styling: 'tailwind',
      database: 'none',
      orm: 'none',
      auth_method: 'jwt',
      test_framework: 'vitest'
    },
    platforms: ['claude', 'cursor']
  },
  'react-native-app': {
    name: 'React Native Mobile App',
    description: 'Cross-platform mobile app with Expo',
    project: { type: 'react-native' },
    techStack: {
      api_style: 'rest',
      state_management: 'zustand',
      styling: 'tailwind',
      database: 'supabase',
      orm: 'none',
      auth_method: 'supabase',
      test_framework: 'jest'
    },
    platforms: ['claude', 'cursor']
  },
  'express-api': {
    name: 'Express.js REST API',
    description: 'Backend API with Express, PostgreSQL, and JWT auth',
    project: { type: 'express' },
    techStack: {
      api_style: 'rest',
      state_management: 'none',
      styling: 'none',
      database: 'postgresql',
      orm: 'prisma',
      auth_method: 'jwt',
      test_framework: 'jest'
    },
    platforms: ['claude', 'cursor']
  },
  'nestjs-api': {
    name: 'NestJS Enterprise API',
    description: 'Enterprise-grade API with NestJS and TypeORM',
    project: { type: 'nestjs' },
    techStack: {
      api_style: 'rest',
      state_management: 'none',
      styling: 'none',
      database: 'postgresql',
      orm: 'typeorm',
      auth_method: 'jwt',
      test_framework: 'jest'
    },
    platforms: ['claude', 'cursor']
  },
  'vue-spa': {
    name: 'Vue.js Single Page App',
    description: 'Vue 3 with Composition API and Pinia',
    project: { type: 'vue' },
    techStack: {
      api_style: 'rest',
      state_management: 'none',
      styling: 'tailwind',
      database: 'none',
      orm: 'none',
      auth_method: 'jwt',
      test_framework: 'vitest'
    },
    platforms: ['claude', 'cursor']
  },
  'python-fastapi': {
    name: 'Python FastAPI',
    description: 'Modern Python API with FastAPI and SQLAlchemy',
    project: { type: 'python' },
    techStack: {
      api_style: 'rest',
      state_management: 'none',
      styling: 'none',
      database: 'postgresql',
      orm: 'none',
      auth_method: 'jwt',
      test_framework: 'pytest'
    },
    platforms: ['claude', 'cursor']
  }
};

// Tech stack configuration options
const TECH_STACK_OPTIONS = {
  api_style: {
    label: 'API Style',
    options: [
      { id: 'rest', name: 'REST' },
      { id: 'graphql', name: 'GraphQL' },
      { id: 'grpc', name: 'gRPC' },
      { id: 'trpc', name: 'tRPC' }
    ],
    detect: {
      'graphql': ['@apollo/client', 'graphql', 'apollo-server', 'urql'],
      'grpc': ['@grpc/grpc-js', 'grpc'],
      'trpc': ['@trpc/client', '@trpc/server']
    },
    default: 'rest'
  },
  state_management: {
    label: 'State Management',
    options: [
      { id: 'zustand', name: 'Zustand' },
      { id: 'redux', name: 'Redux' },
      { id: 'jotai', name: 'Jotai' },
      { id: 'recoil', name: 'Recoil' },
      { id: 'mobx', name: 'MobX' },
      { id: 'context', name: 'React Context' },
      { id: 'none', name: 'None / Other' }
    ],
    detect: {
      'zustand': ['zustand'],
      'redux': ['redux', '@reduxjs/toolkit', 'react-redux'],
      'jotai': ['jotai'],
      'recoil': ['recoil'],
      'mobx': ['mobx', 'mobx-react']
    },
    default: 'zustand'
  },
  styling: {
    label: 'Styling',
    options: [
      { id: 'tailwind', name: 'Tailwind CSS' },
      { id: 'css-modules', name: 'CSS Modules' },
      { id: 'styled-components', name: 'Styled Components' },
      { id: 'emotion', name: 'Emotion' },
      { id: 'sass', name: 'Sass/SCSS' },
      { id: 'css', name: 'Plain CSS' }
    ],
    detect: {
      'tailwind': ['tailwindcss'],
      'styled-components': ['styled-components'],
      'emotion': ['@emotion/react', '@emotion/styled'],
      'sass': ['sass', 'node-sass']
    },
    default: 'tailwind'
  },
  database: {
    label: 'Database',
    options: [
      { id: 'postgresql', name: 'PostgreSQL' },
      { id: 'mysql', name: 'MySQL' },
      { id: 'mongodb', name: 'MongoDB' },
      { id: 'sqlite', name: 'SQLite' },
      { id: 'supabase', name: 'Supabase' },
      { id: 'firebase', name: 'Firebase' },
      { id: 'none', name: 'None / Other' }
    ],
    detect: {
      'postgresql': ['pg', '@prisma/client', 'postgres'],
      'mysql': ['mysql', 'mysql2'],
      'mongodb': ['mongoose', 'mongodb'],
      'sqlite': ['better-sqlite3', 'sqlite3'],
      'supabase': ['@supabase/supabase-js'],
      'firebase': ['firebase', 'firebase-admin']
    },
    default: 'postgresql'
  },
  orm: {
    label: 'ORM',
    options: [
      { id: 'prisma', name: 'Prisma' },
      { id: 'drizzle', name: 'Drizzle' },
      { id: 'typeorm', name: 'TypeORM' },
      { id: 'sequelize', name: 'Sequelize' },
      { id: 'mongoose', name: 'Mongoose' },
      { id: 'none', name: 'None / Raw SQL' }
    ],
    detect: {
      'prisma': ['@prisma/client', 'prisma'],
      'drizzle': ['drizzle-orm'],
      'typeorm': ['typeorm'],
      'sequelize': ['sequelize'],
      'mongoose': ['mongoose']
    },
    default: 'prisma'
  },
  auth_method: {
    label: 'Authentication',
    options: [
      { id: 'jwt', name: 'JWT' },
      { id: 'session', name: 'Session-based' },
      { id: 'oauth', name: 'OAuth' },
      { id: 'nextauth', name: 'NextAuth.js' },
      { id: 'clerk', name: 'Clerk' },
      { id: 'auth0', name: 'Auth0' },
      { id: 'supabase', name: 'Supabase Auth' },
      { id: 'none', name: 'None / Custom' }
    ],
    detect: {
      'nextauth': ['next-auth'],
      'clerk': ['@clerk/nextjs', '@clerk/clerk-react'],
      'auth0': ['@auth0/auth0-react', 'auth0'],
      'supabase': ['@supabase/auth-helpers-nextjs']
    },
    default: 'jwt'
  },
  test_framework: {
    label: 'Test Framework',
    options: [
      { id: 'vitest', name: 'Vitest' },
      { id: 'jest', name: 'Jest' },
      { id: 'mocha', name: 'Mocha' },
      { id: 'playwright', name: 'Playwright' },
      { id: 'cypress', name: 'Cypress' },
      { id: 'pytest', name: 'Pytest (Python)' },
      { id: 'none', name: 'None' }
    ],
    detect: {
      'vitest': ['vitest'],
      'jest': ['jest'],
      'mocha': ['mocha'],
      'playwright': ['@playwright/test', 'playwright'],
      'cypress': ['cypress'],
      'pytest': ['pytest']
    },
    default: 'vitest'
  }
};

/**
 * Detect tech stack from dependencies
 */
function detectTechStack(targetDir) {
  const { allDeps = [] } = getPackageDeps(targetDir);
  const pythonDeps = getPythonDeps(targetDir);
  const allProjectDeps = [...allDeps, ...pythonDeps.map(d => d.toLowerCase())];

  const detected = {};

  for (const [key, config] of Object.entries(TECH_STACK_OPTIONS)) {
    detected[key] = null;

    if (config.detect) {
      for (const [optionId, detectDeps] of Object.entries(config.detect)) {
        const hasMatch = detectDeps.some(dep => allProjectDeps.includes(dep));
        if (hasMatch) {
          detected[key] = optionId;
          break;
        }
      }
    }

    // Use default if not detected
    if (!detected[key]) {
      detected[key] = config.default;
    }
  }

  return detected;
}

/**
 * Detect project name from package.json or folder name
 */
function detectProjectName(targetDir) {
  const packageJsonPath = join(targetDir, 'package.json');

  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.name) {
        return packageJson.name;
      }
    } catch {
      // Fall through to folder name
    }
  }

  // Fallback to folder name
  return basename(targetDir);
}

/**
 * Read package.json dependencies
 */
function getPackageDeps(targetDir) {
  const packageJsonPath = join(targetDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return { deps: [], devDeps: [] };
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    return { deps, devDeps, allDeps: [...deps, ...devDeps] };
  } catch {
    return { deps: [], devDeps: [], allDeps: [] };
  }
}

/**
 * Read requirements.txt for Python projects
 */
function getPythonDeps(targetDir) {
  const requirementsPath = join(targetDir, 'requirements.txt');

  if (!existsSync(requirementsPath)) {
    return [];
  }

  try {
    const content = readFileSync(requirementsPath, 'utf-8');
    return content.split('\n')
      .map(line => line.trim().split('==')[0].split('>=')[0].split('<=')[0])
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Detect project type based on files and dependencies
 */
function detectProjectType(targetDir) {
  const { allDeps = [] } = getPackageDeps(targetDir);
  const pythonDeps = getPythonDeps(targetDir);
  const allProjectDeps = [...allDeps, ...pythonDeps.map(d => d.toLowerCase())];

  const detectedTypes = [];

  for (const projectType of PROJECT_TYPES) {
    if (projectType.id === 'other') continue;

    const { detect } = projectType;
    let matches = true;
    let score = 0;

    // Check for required files
    if (detect.files) {
      const hasFile = detect.files.some(file => existsSync(join(targetDir, file)));
      if (hasFile) {
        score += 10;
      }
    }

    // Check for required dependencies
    if (detect.deps) {
      const hasDep = detect.deps.some(dep => allProjectDeps.includes(dep));
      if (hasDep) {
        score += 5;
      } else if (detect.deps.length > 0 && !detect.files) {
        matches = false;
      }
    }

    // Check for excluded dependencies
    if (detect.notDeps && matches) {
      const hasExcluded = detect.notDeps.some(dep => allProjectDeps.includes(dep));
      if (hasExcluded) {
        matches = false;
      }
    }

    // Check for patterns in requirements.txt
    if (detect.patterns && pythonDeps.length > 0) {
      const hasPattern = detect.patterns.some(pattern =>
        pythonDeps.some(dep => dep.toLowerCase().includes(pattern))
      );
      if (hasPattern) {
        score += 5;
      }
    }

    if (matches && score > 0) {
      detectedTypes.push({ ...projectType, score });
    }
  }

  // Sort by score descending
  detectedTypes.sort((a, b) => b.score - a.score);

  return detectedTypes;
}

/**
 * Interactive prompt for project configuration
 */
async function promptProjectConfig(targetDir) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  // Detect project name
  const detectedName = detectProjectName(targetDir);

  // Detect project types
  const detectedTypes = detectProjectType(targetDir);
  const topDetectedType = detectedTypes.length > 0 ? detectedTypes[0] : null;

  // Detect tech stack
  const detectedTechStack = detectTechStack(targetDir);

  console.log(chalk.bold('\nProject Configuration'));
  console.log(chalk.gray('─'.repeat(40) + '\n'));

  // Project Name
  console.log(chalk.cyan('Project Name'));
  if (detectedName) {
    console.log(chalk.gray(`  Detected: ${detectedName}`));
  }
  const nameInput = await question(chalk.yellow(`  Enter name (press Enter for "${detectedName}"): `));
  const projectName = nameInput.trim() || detectedName;

  console.log('');

  // Project Type
  console.log(chalk.cyan('Project Type'));
  if (topDetectedType) {
    console.log(chalk.green(`  Detected: ${topDetectedType.name}`));
  }

  console.log(chalk.gray('\n  Available types:'));
  PROJECT_TYPES.forEach((type, index) => {
    const isDetected = topDetectedType && type.id === topDetectedType.id;
    const marker = isDetected ? chalk.green(' ✓ (detected)') : '';
    console.log(chalk.white(`    ${index + 1}. ${type.name}`) + marker);
  });

  const defaultTypeIndex = topDetectedType
    ? PROJECT_TYPES.findIndex(t => t.id === topDetectedType.id) + 1
    : PROJECT_TYPES.length;

  const typeInput = await question(chalk.yellow(`\n  Enter number (press Enter for ${defaultTypeIndex}): `));
  const typeIndex = parseInt(typeInput.trim()) || defaultTypeIndex;
  const projectType = PROJECT_TYPES[Math.min(Math.max(typeIndex - 1, 0), PROJECT_TYPES.length - 1)];

  console.log('');
  console.log(chalk.green(`✓ Project: ${projectName} (${projectType.name})`));

  // Tech Stack Configuration
  console.log(chalk.bold('\nTech Stack Configuration'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.gray('Press Enter to accept detected/default values\n'));

  const techStack = {};

  for (const [key, config] of Object.entries(TECH_STACK_OPTIONS)) {
    const detected = detectedTechStack[key];
    const detectedOption = config.options.find(o => o.id === detected);
    const detectedName = detectedOption ? detectedOption.name : config.default;

    console.log(chalk.cyan(config.label));
    config.options.forEach((option, index) => {
      const isDetected = option.id === detected;
      const marker = isDetected ? chalk.green(' ✓') : '';
      console.log(chalk.white(`  ${index + 1}. ${option.name}`) + marker);
    });

    const defaultIndex = config.options.findIndex(o => o.id === detected) + 1 || 1;
    const input = await question(chalk.yellow(`  Select (Enter for ${defaultIndex}): `));
    const selectedIndex = parseInt(input.trim()) || defaultIndex;
    const selectedOption = config.options[Math.min(Math.max(selectedIndex - 1, 0), config.options.length - 1)];
    techStack[key] = selectedOption.id;
    console.log('');
  }

  rl.close();

  // Summary
  console.log(chalk.bold('\nConfiguration Summary'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.white(`  Project: ${projectName} (${projectType.name})`));
  for (const [key, value] of Object.entries(techStack)) {
    const config = TECH_STACK_OPTIONS[key];
    const option = config.options.find(o => o.id === value);
    console.log(chalk.white(`  ${config.label}: ${option ? option.name : value}`));
  }
  console.log('');

  return {
    name: projectName,
    type: projectType.id,
    typeName: projectType.name,
    techStack
  };
}

/**
 * List available templates
 */
export function listTemplates() {
  console.log(chalk.bold('\nAvailable Project Templates'));
  console.log(chalk.gray('─'.repeat(50)));

  for (const [id, template] of Object.entries(PROJECT_TEMPLATES)) {
    console.log(`\n  ${chalk.cyan(id)}`);
    console.log(`    ${template.name}`);
    console.log(chalk.gray(`    ${template.description}`));
  }

  console.log(chalk.gray('\n\nUsage: npx proagents init --template <name>\n'));
}

/**
 * Apply a project template
 */
function applyTemplate(templateId, targetDir) {
  const template = PROJECT_TEMPLATES[templateId];
  if (!template) {
    return null;
  }

  // Return config object that matches what promptProjectConfig returns
  return {
    name: basename(targetDir),
    type: template.project.type,
    typeName: PROJECT_TYPES.find(t => t.id === template.project.type)?.name || template.project.type,
    techStack: template.techStack,
    platforms: template.platforms
  };
}

/**
 * Save project config to proagents.config.yaml
 */
function saveProjectConfig(projectConfig, configPath) {
  let config = {};

  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      config = yaml.load(content) || {};
    } catch {
      config = {};
    }
  }

  // Save project info
  config.project = {
    name: projectConfig.name,
    type: projectConfig.type
  };

  // Save tech stack under automation.decisions
  if (projectConfig.techStack) {
    if (!config.automation) {
      config.automation = {};
    }
    if (!config.automation.decisions) {
      config.automation.decisions = {};
    }

    // Architecture decisions
    config.automation.decisions.architecture = {
      api_style: projectConfig.techStack.api_style,
      state_management: projectConfig.techStack.state_management,
      styling: projectConfig.techStack.styling,
      database: projectConfig.techStack.database,
      orm: projectConfig.techStack.orm,
      auth_method: projectConfig.techStack.auth_method
    };

    // Testing decisions
    config.automation.decisions.testing = {
      framework: projectConfig.techStack.test_framework,
      coverage_target: 80,
      location: 'colocated'
    };
  }

  // Save platforms
  if (projectConfig.platforms && projectConfig.platforms.length > 0) {
    config.platforms = projectConfig.platforms;
  }

  const yamlContent = yaml.dump(config, { indent: 2, lineWidth: 120 });
  writeFileSync(configPath, yamlContent);
}

/**
 * Initialize ProAgents in the current project
 */
export async function initCommand(options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');
  const sourceDir = join(__dirname, '..', '..', 'proagents');

  console.log('\n' + chalk.bold.blue('ProAgents Initialization'));
  console.log(chalk.blue('========================\n'));

  // Check if already initialized
  const alreadyInitialized = existsSync(proagentsDir);

  if (alreadyInitialized && !options.force) {
    // Smart update mode - preserve user files, update framework
    console.log(chalk.cyan('ℹ️  ProAgents detected. Running smart update...'));
    console.log(chalk.gray('   (Preserving your customizations)\n'));

    try {
      await smartUpdate(sourceDir, proagentsDir);
      console.log(chalk.green('\n✓ ProAgents updated successfully!\n'));
      console.log(chalk.gray('Preserved:'));
      console.log(chalk.gray('  • active-features/ (your work in progress)'));
      console.log(chalk.gray('  • proagents.config.yaml (your values + new options merged)'));
      console.log(chalk.gray('  • .learning/ (learned patterns)'));
      console.log(chalk.gray('  • cache/ (analysis cache)\n'));
      return;
    } catch (error) {
      console.error(chalk.red('\n✗ Error updating ProAgents:'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  try {
    if (options.force && alreadyInitialized) {
      console.log(chalk.yellow('⚠️  Force mode: Overwriting all files...'));
    }

    // Fresh install or force overwrite
    console.log(chalk.gray('Copying framework files...'));
    cpSync(sourceDir, proagentsDir, { recursive: true, force: true });
    console.log(chalk.green('✓ Framework files copied to ./proagents/'));

    // Create config if not skipped
    if (!options.skipConfig) {
      const configPath = join(targetDir, 'proagents.config.yaml');
      if (!existsSync(configPath)) {
        const configSource = join(sourceDir, 'proagents.config.yaml');
        if (existsSync(configSource)) {
          cpSync(configSource, configPath);
          console.log(chalk.green('✓ Created proagents.config.yaml'));
        }
      }
    }

    // Create docs folder structure for client-facing documentation
    const docsDir = join(targetDir, 'docs');
    const releasesDir = join(docsDir, 'releases');
    const apiDocsDir = join(docsDir, 'api');

    if (!existsSync(docsDir)) {
      mkdirSync(docsDir, { recursive: true });
    }
    if (!existsSync(releasesDir)) {
      mkdirSync(releasesDir, { recursive: true });
      writeFileSync(join(releasesDir, 'README.md'),
`# Release History

This folder contains version-specific release notes.

| Version | Date | Description |
|---------|------|-------------|
| v1.0.0 | TBD | Initial release |

---

Generated by [ProAgents](https://github.com/prakashpro3/proAgents)
`);
    }
    if (!existsSync(apiDocsDir)) {
      mkdirSync(apiDocsDir, { recursive: true });
    }
    console.log(chalk.green('✓ Created docs/ folder structure'));

    // Create placeholder CHANGELOG.md if not exists
    const changelogPath = join(targetDir, 'CHANGELOG.md');
    if (!existsSync(changelogPath)) {
      writeFileSync(changelogPath,
`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

---

*Generated by [ProAgents](https://github.com/prakashpro3/proAgents)*
`);
      console.log(chalk.green('✓ Created CHANGELOG.md'));
    }

    // Create placeholder RELEASE_NOTES.md if not exists
    const releaseNotesPath = join(targetDir, 'RELEASE_NOTES.md');
    if (!existsSync(releaseNotesPath)) {
      writeFileSync(releaseNotesPath,
`# Release Notes

**Current Version:** Unreleased
**Last Updated:** ${new Date().toISOString().split('T')[0]}

## Overview

This document contains release notes for client and stakeholder communication.

## Latest Release

No releases yet. Use \`pa:release\` to generate release notes.

---

*Generated by [ProAgents](https://github.com/prakashpro3/proAgents)*
`);
      console.log(chalk.green('✓ Created RELEASE_NOTES.md'));
    }

    // Project configuration - either from template or interactive prompt
    let projectConfig;

    if (options.listTemplates) {
      listTemplates();
      return;
    }

    if (options.template) {
      // Use template
      projectConfig = applyTemplate(options.template, targetDir);
      if (!projectConfig) {
        console.log(chalk.red(`\nError: Template "${options.template}" not found.`));
        listTemplates();
        return;
      }
      console.log(chalk.green(`\n✓ Using template: ${PROJECT_TEMPLATES[options.template].name}`));
    } else {
      // Interactive prompts
      projectConfig = await promptProjectConfig(targetDir);
    }

    // Add ProAgents section to README.md (AI tools auto-read this)
    const readmePath = join(targetDir, 'README.md');
    const proagentsSection = `
<!-- PROAGENTS:START - AI Development Commands -->
## AI Commands (ProAgents)

This project uses [ProAgents](https://github.com/prakashpro3/proAgents). Commands use \`pa:\` prefix:

| Command | Description |
|---------|-------------|
| \`pa:help\` | Show all commands |
| \`pa:feature "name"\` | Start new feature |
| \`pa:fix "bug"\` | Quick bug fix |
| \`pa:status\` | Show progress |
| \`pa:release\` | Generate release notes |

For detailed commands, see \`./proagents/PROAGENTS.md\`
<!-- PROAGENTS:END -->

`;

    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      if (!readmeContent.includes('PROAGENTS:START')) {
        writeFileSync(readmePath, proagentsSection + readmeContent);
        console.log(chalk.green('✓ Added ProAgents commands to README.md'));
      }
    } else {
      writeFileSync(readmePath, proagentsSection + `# ${projectConfig.name}\n\nProject description.\n`);
      console.log(chalk.green('✓ Created README.md with ProAgents commands'));
    }

    // AI platform selection - from template or interactive
    let selectedPlatforms;
    if (options.template && projectConfig.platforms) {
      selectedPlatforms = projectConfig.platforms;
      console.log(chalk.gray(`  Using template platforms: ${selectedPlatforms.join(', ')}`));
    } else {
      selectedPlatforms = await selectPlatforms();
    }

    // Copy AI instruction files for selected platforms (merges with existing files)
    const aiResults = copyPlatformFiles(selectedPlatforms, sourceDir, targetDir);

    if (aiResults.created.length > 0) {
      console.log(chalk.green(`✓ Created AI files: ${aiResults.created.join(', ')}`));
    }
    if (aiResults.updated.length > 0) {
      console.log(chalk.green(`✓ Updated AI files: ${aiResults.updated.join(', ')}`));
    }
    if (aiResults.merged.length > 0) {
      console.log(chalk.green(`✓ Merged with existing: ${aiResults.merged.join(', ')}`));
    }

    // Save project and platform config to ROOT config (not proagents/ folder)
    const configPath = join(targetDir, 'proagents.config.yaml');
    saveProjectConfig(projectConfig, configPath);
    savePlatformConfig(selectedPlatforms, configPath);

    // Success message
    console.log(chalk.green('\n✓ ProAgents initialized successfully!\n'));

    // Simple next steps
    console.log(chalk.bold('Usage:'));
    console.log(chalk.white('──────'));
    console.log('Type commands in any AI (prefix: pa:)');
    console.log(chalk.cyan('  pa:help              ') + chalk.gray('Show all commands'));
    console.log(chalk.cyan('  pa:feature "name"    ') + chalk.gray('Start new feature'));
    console.log(chalk.cyan('  pa:fix "bug"         ') + chalk.gray('Quick bug fix'));
    console.log(chalk.cyan('  pa:status            ') + chalk.gray('Show progress'));
    console.log(chalk.cyan('  pa:release           ') + chalk.gray('Generate release notes'));
    console.log('\n' + chalk.gray('Commands added to README.md - AI tools will see them automatically.\n'));

  } catch (error) {
    console.error(chalk.red('\n✗ Error initializing ProAgents:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Smart update - preserves user files, updates framework files
 */
async function smartUpdate(sourceDir, targetDir) {
  // Backup preserved paths
  const backups = {};
  for (const path of PRESERVE_PATHS) {
    const fullPath = join(targetDir, path);
    if (existsSync(fullPath)) {
      backups[path] = fullPath;
    }
  }

  // Before updating, migrate any modified template files
  const migrationResult = migrateModifiedTemplates(sourceDir, targetDir);
  if (migrationResult.migrated.length > 0) {
    console.log(chalk.green(`✓ Migrated ${migrationResult.migrated.length} modified template(s) to user files`));
    for (const file of migrationResult.migrated) {
      console.log(chalk.gray(`  • ${file}`));
    }
  }
  if (migrationResult.backedUp.length > 0) {
    console.log(chalk.yellow(`⚠️  Backed up ${migrationResult.backedUp.length} modified template(s)`));
    for (const file of migrationResult.backedUp) {
      console.log(chalk.gray(`  • ${file}`));
    }
  }

  // Update framework folders
  let updatedCount = 0;
  for (const folder of FRAMEWORK_FOLDERS) {
    const sourcePath = join(sourceDir, folder);
    const targetPath = join(targetDir, folder);

    if (existsSync(sourcePath)) {
      // Remove old folder and copy new
      if (existsSync(targetPath)) {
        rmSync(targetPath, { recursive: true, force: true });
      }
      cpSync(sourcePath, targetPath, { recursive: true });
      updatedCount++;
    }
  }
  console.log(chalk.green(`✓ Updated ${updatedCount} framework folders`));

  // Restore user files that were migrated (they were saved before folder deletion)
  restoreUserFiles(targetDir, migrationResult);

  // Update framework root files
  let filesUpdated = 0;
  for (const file of FRAMEWORK_FILES) {
    const sourcePath = join(sourceDir, file);
    const targetPath = join(targetDir, file);

    if (existsSync(sourcePath)) {
      cpSync(sourcePath, targetPath, { force: true });
      filesUpdated++;
    }
  }
  console.log(chalk.green(`✓ Updated ${filesUpdated} framework files`));

  // Merge config file - keep user values, add new options
  const userConfigPath = join(targetDir, CONFIG_FILE);
  const newConfigPath = join(sourceDir, CONFIG_FILE);

  if (existsSync(newConfigPath)) {
    const mergeResult = mergeConfigs(userConfigPath, newConfigPath);
    if (mergeResult.newOptions > 0) {
      console.log(chalk.green(`✓ Config merged: ${mergeResult.newOptions} new options added`));
      if (mergeResult.newKeys.length > 0 && mergeResult.newKeys.length <= 5) {
        console.log(chalk.gray(`  New: ${mergeResult.newKeys.join(', ')}`));
      }
    } else {
      console.log(chalk.green(`✓ Config up to date`));
    }
  }

  // Ensure preserved paths still exist (they should, but just in case)
  for (const [path, fullPath] of Object.entries(backups)) {
    if (!existsSync(fullPath)) {
      console.log(chalk.yellow(`⚠️  ${path} was removed during update, restoring...`));
      // The backup reference is the same as the original, so if it doesn't exist
      // it means we need to recreate the structure
      if (path === 'active-features') {
        mkdirSync(fullPath, { recursive: true });
        writeFileSync(join(fullPath, '.gitkeep'), '');
      }
    }
  }

  // Copy AI instruction files for configured platforms (merges with existing files)
  const projectRoot = join(targetDir, '..');
  const configPath = join(targetDir, 'proagents.config.yaml');
  const selectedPlatforms = loadPlatformConfig(configPath);

  if (selectedPlatforms.length > 0) {
    const aiResults = copyPlatformFiles(selectedPlatforms, sourceDir, projectRoot);

    if (aiResults.created.length > 0) {
      console.log(chalk.green(`✓ Created new AI files: ${aiResults.created.join(', ')}`));
    }
    if (aiResults.updated.length > 0) {
      console.log(chalk.green(`✓ Updated AI files: ${aiResults.updated.join(', ')}`));
    }
    if (aiResults.merged.length > 0) {
      console.log(chalk.green(`✓ Merged with existing: ${aiResults.merged.join(', ')}`));
    }
  }

  console.log(chalk.gray('\nTip: Use "proagents ai add" to add more AI platforms'));
}

/**
 * Deep merge two objects - source values override target, but target values are preserved
 * Returns the merged object and list of new keys added
 */
function deepMerge(target, source, path = '') {
  const result = { ...target };
  const newKeys = [];

  for (const key of Object.keys(source)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in target)) {
      // New key - add it
      result[key] = source[key];
      newKeys.push(currentPath);
    } else if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      // Both are objects - recurse
      const merged = deepMerge(target[key], source[key], currentPath);
      result[key] = merged.result;
      newKeys.push(...merged.newKeys);
    }
    // If key exists in target and is not an object, keep target value
  }

  return { result, newKeys };
}

/**
 * Merge user config with new framework config
 * Preserves user values, adds new options from framework
 */
function mergeConfigs(userConfigPath, newConfigPath) {
  try {
    const newConfigContent = readFileSync(newConfigPath, 'utf-8');
    const newConfig = yaml.load(newConfigContent);

    if (!existsSync(userConfigPath)) {
      // No user config - just copy the new one
      writeFileSync(userConfigPath, newConfigContent);
      return { newOptions: Object.keys(newConfig).length, newKeys: ['(new config created)'] };
    }

    const userConfigContent = readFileSync(userConfigPath, 'utf-8');
    const userConfig = yaml.load(userConfigContent);

    if (!userConfig || typeof userConfig !== 'object') {
      // User config is empty or invalid - use new config
      writeFileSync(userConfigPath, newConfigContent);
      return { newOptions: Object.keys(newConfig).length, newKeys: ['(config replaced)'] };
    }

    // Deep merge - user values take precedence, new keys added
    const { result: mergedConfig, newKeys } = deepMerge(userConfig, newConfig);

    if (newKeys.length > 0) {
      // Write merged config with comment
      const header = `# ProAgents Configuration\n# User values preserved, new options added during update\n# Last updated: ${new Date().toISOString().split('T')[0]}\n\n`;
      const mergedYaml = yaml.dump(mergedConfig, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
        sortKeys: false
      });
      writeFileSync(userConfigPath, header + mergedYaml);
    }

    return { newOptions: newKeys.length, newKeys };
  } catch (error) {
    // If merge fails, don't break the update - just warn
    console.log(chalk.yellow(`⚠️  Could not merge config: ${error.message}`));
    return { newOptions: 0, newKeys: [] };
  }
}

/**
 * Find all template files in a directory recursively
 * Template files have '.template.' in their name
 */
function findTemplateFiles(dir, baseDir = dir) {
  const templates = [];

  if (!existsSync(dir)) return templates;

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = fullPath.replace(baseDir + '/', '');

    if (entry.isDirectory()) {
      templates.push(...findTemplateFiles(fullPath, baseDir));
    } else if (entry.name.includes('.template.')) {
      templates.push(relativePath);
    }
  }

  return templates;
}

/**
 * Get the user file path for a template file
 * e.g., 'config/rules/custom-rules.template.yaml' -> 'config/rules/custom-rules.yaml'
 */
function getUserFilePath(templatePath) {
  return templatePath.replace('.template.', '.');
}

/**
 * Check if a file has been modified by comparing with source
 */
function isFileModified(sourcePath, targetPath) {
  if (!existsSync(targetPath)) return false;
  if (!existsSync(sourcePath)) return true; // File exists in target but not source = modified/custom

  try {
    const sourceContent = readFileSync(sourcePath, 'utf-8');
    const targetContent = readFileSync(targetPath, 'utf-8');
    return sourceContent !== targetContent;
  } catch {
    return false;
  }
}

/**
 * Migrate modified template files to user files before update
 * Returns info about migrated and backed up files
 */
function migrateModifiedTemplates(sourceDir, targetDir) {
  const result = {
    migrated: [],      // Templates copied to user files
    backedUp: [],      // Templates backed up (user file already existed)
    userFiles: {}      // Map of user file paths to their content (for restoration)
  };

  // Find all template files in target directory
  const templateFiles = findTemplateFiles(targetDir);

  for (const templateRelPath of templateFiles) {
    const templateTargetPath = join(targetDir, templateRelPath);
    const templateSourcePath = join(sourceDir, templateRelPath);
    const userFileRelPath = getUserFilePath(templateRelPath);
    const userFilePath = join(targetDir, userFileRelPath);

    // Check if template was modified by user
    if (isFileModified(templateSourcePath, templateTargetPath)) {
      try {
        const modifiedContent = readFileSync(templateTargetPath, 'utf-8');

        if (existsSync(userFilePath)) {
          // User file already exists - backup the modified template
          const backupPath = templateTargetPath + '.backup';
          writeFileSync(backupPath, modifiedContent);
          result.backedUp.push(templateRelPath);
          // Save backup content for restoration after folder deletion
          result.userFiles[templateRelPath + '.backup'] = modifiedContent;
        } else {
          // No user file - migrate template to user file
          result.userFiles[userFileRelPath] = modifiedContent;
          result.migrated.push(`${templateRelPath} → ${userFileRelPath}`);
        }
      } catch (error) {
        // Skip files that can't be read
        continue;
      }
    }

    // Also preserve existing user files (non-template versions)
    if (existsSync(userFilePath)) {
      try {
        const userContent = readFileSync(userFilePath, 'utf-8');
        result.userFiles[userFileRelPath] = userContent;
      } catch {
        // Skip files that can't be read
      }
    }
  }

  return result;
}

/**
 * Restore user files after framework folders have been updated
 */
function restoreUserFiles(targetDir, migrationResult) {
  for (const [relativePath, content] of Object.entries(migrationResult.userFiles)) {
    const fullPath = join(targetDir, relativePath);
    const dirPath = dirname(fullPath);

    try {
      // Ensure directory exists
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      // Write the user file
      writeFileSync(fullPath, content);
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not restore ${relativePath}: ${error.message}`));
    }
  }
}

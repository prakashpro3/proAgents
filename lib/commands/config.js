import { existsSync, readdirSync, readFileSync, writeFileSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import chalk from 'chalk';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Command: proagents config list
 * Shows all configurable options
 */
export function configListCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');

  console.log('\n' + chalk.bold.blue('ProAgents Configuration Options'));
  console.log(chalk.blue('================================\n'));

  // Check if ProAgents is initialized
  if (!existsSync(proagentsDir)) {
    console.log(chalk.yellow('ProAgents not initialized. Run "proagents init" first.\n'));
    return;
  }

  // 1. Main Config
  console.log(chalk.cyan.bold('1. Main Configuration'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));
  const configPath = join(proagentsDir, 'proagents.config.yaml');
  if (existsSync(configPath)) {
    console.log(chalk.green('   ✓ ') + chalk.white('proagents/proagents.config.yaml'));
    console.log(chalk.gray('     Checkpoints, git settings, parallel features, etc.\n'));
  } else {
    console.log(chalk.yellow('   ○ ') + chalk.white('proagents/proagents.config.yaml') + chalk.gray(' (not created)\n'));
  }

  // 2. AI Platforms
  console.log(chalk.cyan.bold('2. AI Platforms'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));
  console.log(chalk.gray('   Manage with: ') + chalk.cyan('proagents ai list/add/remove'));

  try {
    const config = yaml.load(readFileSync(configPath, 'utf-8'));
    if (config.ai_platforms && config.ai_platforms.length > 0) {
      console.log(chalk.green('   ✓ ') + chalk.white(`Installed: ${config.ai_platforms.join(', ')}`));
    } else {
      console.log(chalk.yellow('   ○ ') + chalk.white('No platforms configured'));
    }
  } catch {
    console.log(chalk.yellow('   ○ ') + chalk.white('No platforms configured'));
  }
  console.log('');

  // 3. Integration Templates
  console.log(chalk.cyan.bold('3. Integration Configs'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));
  console.log(chalk.gray('   Copy template and remove ".template." to customize:\n'));

  const integrations = [
    { template: 'jira.template.yaml', user: 'jira.yaml', desc: 'Jira integration' },
    { template: 'github.template.yaml', user: 'github.yaml', desc: 'GitHub integration' },
    { template: 'slack.template.yaml', user: 'slack.yaml', desc: 'Slack notifications' },
    { template: 'linear.template.yaml', user: 'linear.yaml', desc: 'Linear integration' },
    { template: 'notion.template.yaml', user: 'notion.yaml', desc: 'Notion integration' },
  ];

  for (const item of integrations) {
    const userPath = join(proagentsDir, 'config', 'integrations', item.user);
    const templatePath = join(proagentsDir, 'config', 'integrations', item.template);

    if (existsSync(userPath)) {
      console.log(chalk.green('   ✓ ') + chalk.white(item.user) + chalk.gray(` - ${item.desc} (customized)`));
    } else if (existsSync(templatePath)) {
      console.log(chalk.yellow('   ○ ') + chalk.white(item.template) + chalk.gray(` - ${item.desc}`));
    }
  }
  console.log('');

  // 4. Standards Templates
  console.log(chalk.cyan.bold('4. Coding Standards'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));
  console.log(chalk.gray('   Copy template and remove ".template." to customize:\n'));

  const standards = [
    { template: 'coding-standards.template.md', user: 'coding-standards.md', desc: 'Code style rules' },
    { template: 'architecture-rules.template.md', user: 'architecture-rules.md', desc: 'Architecture patterns' },
    { template: 'naming-conventions.template.md', user: 'naming-conventions.md', desc: 'Naming rules' },
    { template: 'testing-standards.template.md', user: 'testing-standards.md', desc: 'Testing requirements' },
  ];

  for (const item of standards) {
    const userPath = join(proagentsDir, 'config', 'standards', item.user);
    const templatePath = join(proagentsDir, 'config', 'standards', item.template);

    if (existsSync(userPath)) {
      console.log(chalk.green('   ✓ ') + chalk.white(item.user) + chalk.gray(` - ${item.desc} (customized)`));
    } else if (existsSync(templatePath)) {
      console.log(chalk.yellow('   ○ ') + chalk.white(item.template) + chalk.gray(` - ${item.desc}`));
    }
  }
  console.log('');

  // 5. Custom Rules
  console.log(chalk.cyan.bold('5. Custom Rules'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));
  console.log(chalk.gray('   Copy template and remove ".template." to customize:\n'));

  const rules = [
    { template: 'custom-rules.template.yaml', user: 'custom-rules.yaml', desc: 'Custom validation rules' },
    { template: 'validation-rules.template.yaml', user: 'validation-rules.yaml', desc: 'Code validation rules' },
  ];

  for (const item of rules) {
    const userPath = join(proagentsDir, 'config', 'rules', item.user);
    const templatePath = join(proagentsDir, 'config', 'rules', item.template);

    if (existsSync(userPath)) {
      console.log(chalk.green('   ✓ ') + chalk.white(item.user) + chalk.gray(` - ${item.desc} (customized)`));
    } else if (existsSync(templatePath)) {
      console.log(chalk.yellow('   ○ ') + chalk.white(item.template) + chalk.gray(` - ${item.desc}`));
    }
  }
  console.log('');

  // 6. Code Templates
  console.log(chalk.cyan.bold('6. Code Templates'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));
  console.log(chalk.gray('   Copy template and remove ".template." to customize:\n'));

  const codeTemplates = [
    { template: 'component.template.tsx', user: 'component.tsx', desc: 'React component template' },
    { template: 'hook.template.ts', user: 'hook.ts', desc: 'React hook template' },
    { template: 'api-route.template.ts', user: 'api-route.ts', desc: 'API route template' },
    { template: 'test.template.ts', user: 'test.ts', desc: 'Test file template' },
  ];

  for (const item of codeTemplates) {
    const userPath = join(proagentsDir, 'config', 'templates', item.user);
    const templatePath = join(proagentsDir, 'config', 'templates', item.template);

    if (existsSync(userPath)) {
      console.log(chalk.green('   ✓ ') + chalk.white(item.user) + chalk.gray(` - ${item.desc} (customized)`));
    } else if (existsSync(templatePath)) {
      console.log(chalk.yellow('   ○ ') + chalk.white(item.template) + chalk.gray(` - ${item.desc}`));
    }
  }
  console.log('');

  // 7. Preserved Folders
  console.log(chalk.cyan.bold('7. User Data (Never Overwritten)'));
  console.log(chalk.gray('   ─────────────────────────────────────────'));

  const preserved = [
    { path: 'active-features', desc: 'Your work in progress' },
    { path: '.learning', desc: 'Learned patterns' },
    { path: 'cache', desc: 'Analysis cache' },
  ];

  for (const item of preserved) {
    const fullPath = join(proagentsDir, item.path);
    if (existsSync(fullPath)) {
      console.log(chalk.green('   ✓ ') + chalk.white(`proagents/${item.path}/`) + chalk.gray(` - ${item.desc}`));
    } else {
      console.log(chalk.yellow('   ○ ') + chalk.white(`proagents/${item.path}/`) + chalk.gray(` - ${item.desc} (empty)`));
    }
  }
  console.log('');

  // Summary
  console.log(chalk.gray('─────────────────────────────────────────────'));
  console.log(chalk.white('Legend: ') + chalk.green('✓ customized  ') + chalk.yellow('○ using default'));
  console.log('');
  console.log(chalk.gray('To customize a template:'));
  console.log(chalk.cyan('  cp proagents/config/standards/coding-standards.template.md \\'));
  console.log(chalk.cyan('     proagents/config/standards/coding-standards.md'));
  console.log(chalk.gray('\nThen edit the new file with your settings.\n'));
}

/**
 * Command: proagents config show
 * Shows current config values
 */
export function configShowCommand() {
  const targetDir = process.cwd();
  const configPath = join(targetDir, 'proagents', 'proagents.config.yaml');

  console.log('\n' + chalk.bold.blue('ProAgents Current Configuration'));
  console.log(chalk.blue('================================\n'));

  if (!existsSync(configPath)) {
    console.log(chalk.yellow('Config file not found. Run "proagents init" first.\n'));
    return;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = yaml.load(content);

    console.log(chalk.cyan('File: ') + chalk.white('proagents/proagents.config.yaml\n'));
    console.log(chalk.gray('─────────────────────────────────────────────\n'));
    console.log(content);
  } catch (error) {
    console.log(chalk.red('Error reading config: ' + error.message + '\n'));
  }
}

/**
 * Command: proagents config edit
 * Opens config in default editor
 */
export function configEditCommand() {
  const targetDir = process.cwd();
  const configPath = join(targetDir, 'proagents', 'proagents.config.yaml');

  if (!existsSync(configPath)) {
    console.log(chalk.yellow('\nConfig file not found. Run "proagents init" first.\n'));
    return;
  }

  console.log(chalk.cyan('\nTo edit configuration:\n'));
  console.log(chalk.white('  Open: ') + chalk.green('proagents/proagents.config.yaml'));
  console.log(chalk.white('  Docs: ') + chalk.green('proagents/config/README.md\n'));
}

/**
 * Helper: Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Helper: Set nested value in object using dot notation
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Helper: Parse value to appropriate type
 */
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (!isNaN(value) && value !== '') return Number(value);
  return value;
}

/**
 * Command: proagents config set <key> <value>
 * Set a single config value
 */
export function configSetCommand(key, value) {
  const targetDir = process.cwd();
  const configPath = join(targetDir, 'proagents', 'proagents.config.yaml');

  console.log('');

  if (!existsSync(configPath)) {
    console.log(chalk.yellow('Config file not found. Run "proagents init" first.\n'));
    return;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = yaml.load(content) || {};

    const oldValue = getNestedValue(config, key);
    const newValue = parseValue(value);

    setNestedValue(config, key, newValue);

    const header = `# ProAgents Configuration\n# Last updated: ${new Date().toISOString().split('T')[0]}\n\n`;
    const yamlContent = yaml.dump(config, { indent: 2, lineWidth: 120 });
    writeFileSync(configPath, header + yamlContent);

    console.log(chalk.green('✓ Configuration updated'));
    console.log(chalk.gray(`  ${key}: `) + chalk.yellow(String(oldValue ?? '(not set)')) + chalk.gray(' → ') + chalk.green(String(newValue)));
    console.log('');
  } catch (error) {
    console.log(chalk.red('Error updating config: ' + error.message + '\n'));
  }
}

/**
 * Command: proagents config get <key>
 * Get a single config value
 */
export function configGetCommand(key) {
  const targetDir = process.cwd();
  const configPath = join(targetDir, 'proagents', 'proagents.config.yaml');

  console.log('');

  if (!existsSync(configPath)) {
    console.log(chalk.yellow('Config file not found. Run "proagents init" first.\n'));
    return;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = yaml.load(content) || {};
    const value = getNestedValue(config, key);

    if (value === undefined) {
      console.log(chalk.yellow(`${key}: `) + chalk.gray('(not set)\n'));
    } else if (typeof value === 'object') {
      console.log(chalk.cyan(`${key}:`));
      console.log(yaml.dump(value, { indent: 2 }));
    } else {
      console.log(chalk.cyan(`${key}: `) + chalk.white(String(value)) + '\n');
    }
  } catch (error) {
    console.log(chalk.red('Error reading config: ' + error.message + '\n'));
  }
}

/**
 * Command: proagents config setup
 * Interactive wizard for main configuration
 */
export async function configSetupCommand() {
  const targetDir = process.cwd();
  const configPath = join(targetDir, 'proagents', 'proagents.config.yaml');

  console.log('\n' + chalk.bold.blue('ProAgents Configuration Wizard'));
  console.log(chalk.blue('===============================\n'));

  if (!existsSync(join(targetDir, 'proagents'))) {
    console.log(chalk.yellow('ProAgents not initialized. Run "proagents init" first.\n'));
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt, defaultVal) => new Promise(resolve => {
    const defaultStr = defaultVal !== undefined ? ` (${defaultVal})` : '';
    rl.question(chalk.white(prompt) + chalk.gray(defaultStr) + chalk.white(': '), (answer) => {
      resolve(answer || defaultVal);
    });
  });

  const yesNo = async (prompt, defaultVal = true) => {
    const defaultStr = defaultVal ? 'Y/n' : 'y/N';
    const answer = await question(prompt + ` (${defaultStr})`, '');
    if (answer === '') return defaultVal;
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
  };

  try {
    // Load existing config or create new
    let config = {};
    if (existsSync(configPath)) {
      config = yaml.load(readFileSync(configPath, 'utf-8')) || {};
    }

    console.log(chalk.cyan('Project Settings\n'));

    // Project settings
    config.project = config.project || {};
    config.project.name = await question('Project name', config.project.name || 'My Project');

    const projectTypes = ['web-frontend', 'fullstack', 'mobile', 'backend'];
    console.log(chalk.gray('  Types: ' + projectTypes.join(', ')));
    config.project.type = await question('Project type', config.project.type || 'fullstack');

    console.log('\n' + chalk.cyan('Checkpoints (pause for approval)\n'));

    // Checkpoints
    config.checkpoints = config.checkpoints || {};
    config.checkpoints.after_analysis = await yesNo('Pause after analysis?', config.checkpoints.after_analysis ?? true);
    config.checkpoints.after_requirements = await yesNo('Pause after requirements?', config.checkpoints.after_requirements ?? false);
    config.checkpoints.after_design = await yesNo('Pause after design?', config.checkpoints.after_design ?? true);
    config.checkpoints.after_implementation = await yesNo('Pause after implementation?', config.checkpoints.after_implementation ?? false);
    config.checkpoints.after_testing = await yesNo('Pause after testing?', config.checkpoints.after_testing ?? false);
    config.checkpoints.before_deployment = await yesNo('Pause before deployment?', config.checkpoints.before_deployment ?? true);

    console.log('\n' + chalk.cyan('Git Settings\n'));

    // Git settings
    config.git = config.git || {};
    config.git.enabled = await yesNo('Enable git integration?', config.git.enabled ?? true);

    if (config.git.enabled) {
      config.git.branch_prefix = await question('Branch prefix', config.git.branch_prefix || 'feature/');

      const conventions = ['conventional', 'simple', 'custom'];
      console.log(chalk.gray('  Conventions: ' + conventions.join(', ')));
      config.git.commit_convention = await question('Commit convention', config.git.commit_convention || 'conventional');
      config.git.require_pr = await yesNo('Require pull requests?', config.git.require_pr ?? true);
    }

    console.log('\n' + chalk.cyan('Parallel Features\n'));

    // Parallel features
    config.parallel_features = config.parallel_features || {};
    config.parallel_features.enabled = await yesNo('Enable parallel features?', config.parallel_features.enabled ?? true);

    if (config.parallel_features.enabled) {
      const maxStr = await question('Max concurrent features', String(config.parallel_features.max_concurrent || 3));
      config.parallel_features.max_concurrent = parseInt(maxStr) || 3;
    }

    rl.close();

    // Save config
    const header = `# ProAgents Configuration\n# Generated by setup wizard\n# Last updated: ${new Date().toISOString().split('T')[0]}\n\n`;
    const yamlContent = yaml.dump(config, { indent: 2, lineWidth: 120 });
    writeFileSync(configPath, header + yamlContent);

    console.log(chalk.green('\n✓ Configuration saved to proagents/proagents.config.yaml\n'));

  } catch (error) {
    rl.close();
    console.log(chalk.red('\nError: ' + error.message + '\n'));
  }
}

// All customizable templates
const CUSTOMIZABLE_TEMPLATES = {
  integrations: {
    label: 'Integrations',
    path: 'config/integrations',
    items: [
      { template: 'jira.template.yaml', user: 'jira.yaml', desc: 'Jira project management' },
      { template: 'github.template.yaml', user: 'github.yaml', desc: 'GitHub integration' },
      { template: 'slack.template.yaml', user: 'slack.yaml', desc: 'Slack notifications' },
      { template: 'linear.template.yaml', user: 'linear.yaml', desc: 'Linear project management' },
      { template: 'notion.template.yaml', user: 'notion.yaml', desc: 'Notion documentation' },
    ]
  },
  standards: {
    label: 'Coding Standards',
    path: 'config/standards',
    items: [
      { template: 'coding-standards.template.md', user: 'coding-standards.md', desc: 'Code style rules' },
      { template: 'architecture-rules.template.md', user: 'architecture-rules.md', desc: 'Architecture patterns' },
      { template: 'naming-conventions.template.md', user: 'naming-conventions.md', desc: 'Naming conventions' },
      { template: 'testing-standards.template.md', user: 'testing-standards.md', desc: 'Testing requirements' },
    ]
  },
  rules: {
    label: 'Custom Rules',
    path: 'config/rules',
    items: [
      { template: 'custom-rules.template.yaml', user: 'custom-rules.yaml', desc: 'Custom validation rules' },
      { template: 'validation-rules.template.yaml', user: 'validation-rules.yaml', desc: 'Code validation rules' },
    ]
  },
  templates: {
    label: 'Code Templates',
    path: 'config/templates',
    items: [
      { template: 'component.template.tsx', user: 'component.tsx', desc: 'React component template' },
      { template: 'hook.template.ts', user: 'hook.ts', desc: 'React hook template' },
      { template: 'api-route.template.ts', user: 'api-route.ts', desc: 'API route template' },
      { template: 'test.template.ts', user: 'test.ts', desc: 'Test file template' },
    ]
  }
};

/**
 * Command: proagents config customize
 * Interactive template customization
 */
export async function configCustomizeCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');

  console.log('\n' + chalk.bold.blue('ProAgents Template Customization'));
  console.log(chalk.blue('=================================\n'));

  if (!existsSync(proagentsDir)) {
    console.log(chalk.yellow('ProAgents not initialized. Run "proagents init" first.\n'));
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  // Show categories
  console.log(chalk.cyan('Select a category to customize:\n'));

  const categories = Object.entries(CUSTOMIZABLE_TEMPLATES);
  let index = 1;
  const categoryMap = {};

  for (const [key, category] of categories) {
    console.log(chalk.white(`  ${index}. ${category.label}`));
    categoryMap[index] = key;
    index++;
  }

  console.log('');
  const categoryAnswer = await question(chalk.yellow('Category number (or "q" to quit): '));

  if (categoryAnswer.toLowerCase() === 'q') {
    rl.close();
    console.log('');
    return;
  }

  const categoryKey = categoryMap[parseInt(categoryAnswer)];
  if (!categoryKey) {
    rl.close();
    console.log(chalk.red('\nInvalid selection.\n'));
    return;
  }

  const category = CUSTOMIZABLE_TEMPLATES[categoryKey];

  // Show templates in category
  console.log('\n' + chalk.cyan(`${category.label} Templates:\n`));

  index = 1;
  const templateMap = {};
  const availableTemplates = [];

  for (const item of category.items) {
    const userPath = join(proagentsDir, category.path, item.user);
    const templatePath = join(proagentsDir, category.path, item.template);

    if (existsSync(userPath)) {
      console.log(chalk.green(`  ${index}. ✓ ${item.user}`) + chalk.gray(` - ${item.desc} (already customized)`));
    } else if (existsSync(templatePath)) {
      console.log(chalk.yellow(`  ${index}. ○ ${item.template}`) + chalk.gray(` - ${item.desc}`));
      availableTemplates.push(index);
    }
    templateMap[index] = item;
    index++;
  }

  if (availableTemplates.length === 0) {
    rl.close();
    console.log(chalk.green('\nAll templates in this category are already customized!\n'));
    return;
  }

  console.log('');
  const templateAnswer = await question(chalk.yellow('Template number(s) to customize (e.g., 1,2 or "all"): '));
  rl.close();

  if (templateAnswer.toLowerCase() === 'q' || templateAnswer === '') {
    console.log('');
    return;
  }

  let selectedIndices = [];
  if (templateAnswer.toLowerCase() === 'all') {
    selectedIndices = availableTemplates;
  } else {
    selectedIndices = templateAnswer.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && availableTemplates.includes(n));
  }

  if (selectedIndices.length === 0) {
    console.log(chalk.yellow('\nNo valid templates selected.\n'));
    return;
  }

  // Copy selected templates
  console.log('');
  for (const idx of selectedIndices) {
    const item = templateMap[idx];
    if (!item) continue;

    const templatePath = join(proagentsDir, category.path, item.template);
    const userPath = join(proagentsDir, category.path, item.user);

    if (existsSync(templatePath) && !existsSync(userPath)) {
      try {
        cpSync(templatePath, userPath);
        console.log(chalk.green(`✓ Created ${category.path}/${item.user}`));
      } catch (error) {
        console.log(chalk.red(`✗ Failed to create ${item.user}: ${error.message}`));
      }
    }
  }

  console.log(chalk.gray('\nEdit the created files to customize your settings.\n'));
}

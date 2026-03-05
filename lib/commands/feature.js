import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/**
 * Feature development commands
 */
export async function featureCommand(action, name = '') {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');
  const activeFeaturesDir = join(proagentsDir, 'active-features');

  // Check if initialized
  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('\n✗ ProAgents is not initialized in this project.'));
    console.log(chalk.gray('  Run: proagents init\n'));
    return;
  }

  switch (action) {
    case 'start':
      startFeature(name, activeFeaturesDir);
      break;
    case 'status':
      showFeatureStatus(activeFeaturesDir);
      break;
    case 'list':
      listFeatures(activeFeaturesDir);
      break;
    case 'complete':
      completeFeature(activeFeaturesDir);
      break;
    default:
      console.log(chalk.yellow(`Unknown action: ${action}`));
  }
}

function startFeature(name, activeFeaturesDir) {
  if (!name) {
    console.log(chalk.red('\n✗ Feature name is required.'));
    console.log(chalk.gray('  Usage: proagents feature start "feature name"\n'));
    return;
  }

  console.log('\n' + chalk.bold.blue('Starting Feature: ' + name));
  console.log(chalk.blue('─'.repeat(40)) + '\n');

  // Create feature directory
  const featureSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const featureDir = join(activeFeaturesDir, `feature-${featureSlug}`);

  if (!existsSync(activeFeaturesDir)) {
    mkdirSync(activeFeaturesDir, { recursive: true });
  }

  if (existsSync(featureDir)) {
    console.log(chalk.yellow('⚠️  A feature with this name already exists.'));
    console.log(chalk.gray('   Use a different name or complete the existing feature.\n'));
    return;
  }

  mkdirSync(featureDir, { recursive: true });

  // Create status file
  const status = {
    id: `feature-${featureSlug}`,
    name: name,
    current_phase: 'init',
    phase_progress: 0,
    started: new Date().toISOString(),
    last_updated: new Date().toISOString()
  };

  writeFileSync(join(featureDir, 'status.json'), JSON.stringify(status, null, 2));

  console.log(chalk.green('✓ Feature created: ' + featureSlug));
  console.log('\n' + chalk.bold('Now use your AI assistant with this prompt:'));
  console.log(chalk.cyan('─'.repeat(50)));
  console.log(chalk.white(`
/feature-start "${name}"

Or paste this to your AI:

I want to start a new feature: "${name}"
Please follow the ProAgents workflow in ./proagents/
Start with Phase 1: Analysis
`));
  console.log(chalk.cyan('─'.repeat(50)) + '\n');
}

function showFeatureStatus(activeFeaturesDir) {
  console.log('\n' + chalk.bold.blue('Feature Status'));
  console.log(chalk.blue('─'.repeat(40)) + '\n');

  if (!existsSync(activeFeaturesDir)) {
    console.log(chalk.gray('No active features.\n'));
    return;
  }

  const features = readdirSync(activeFeaturesDir).filter(f => f.startsWith('feature-'));

  if (features.length === 0) {
    console.log(chalk.gray('No active features.\n'));
    return;
  }

  features.forEach(feature => {
    const statusFile = join(activeFeaturesDir, feature, 'status.json');
    if (existsSync(statusFile)) {
      const status = JSON.parse(readFileSync(statusFile, 'utf-8'));
      console.log(chalk.white(`• ${status.name}`));
      console.log(chalk.gray(`  Phase: ${status.current_phase} | Progress: ${status.phase_progress}%`));
      console.log(chalk.gray(`  Started: ${new Date(status.started).toLocaleDateString()}\n`));
    }
  });
}

function listFeatures(activeFeaturesDir) {
  showFeatureStatus(activeFeaturesDir);
}

function completeFeature(activeFeaturesDir) {
  console.log(chalk.yellow('\n⚠️  Feature completion should be done through your AI assistant.'));
  console.log(chalk.gray('   The AI will handle documentation, testing, and deployment steps.\n'));
}

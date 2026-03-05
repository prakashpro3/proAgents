import { existsSync, mkdirSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  if (existsSync(proagentsDir) && !options.force) {
    console.log(chalk.yellow('⚠️  ProAgents is already initialized in this project.'));
    console.log(chalk.gray('   Use --force to overwrite.\n'));
    return;
  }

  try {
    // Copy proagents folder
    console.log(chalk.gray('Copying framework files...'));
    cpSync(sourceDir, proagentsDir, { recursive: true, force: options.force || false });
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

    // Success message
    console.log(chalk.green('\n✓ ProAgents initialized successfully!\n'));

    // Next steps
    console.log(chalk.bold('Next Steps:'));
    console.log(chalk.white('───────────'));
    console.log('1. Open your AI assistant (Claude, ChatGPT, Cursor, etc.)');
    console.log('2. Start a feature:');
    console.log(chalk.cyan('   /feature-start "your feature name"'));
    console.log('3. Or use the CLI:');
    console.log(chalk.cyan('   proagents feature start "your feature name"'));
    console.log('\n' + chalk.gray('Documentation: ./proagents/README.md'));
    console.log(chalk.gray('Full Workflow: ./proagents/WORKFLOW.md\n'));

  } catch (error) {
    console.error(chalk.red('\n✗ Error initializing ProAgents:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

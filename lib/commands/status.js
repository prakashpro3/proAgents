import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/**
 * Show ProAgents status in current project
 */
export async function statusCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');

  console.log('\n' + chalk.bold.blue('ProAgents Status'));
  console.log(chalk.blue('═'.repeat(40)) + '\n');

  // Check initialization
  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('Status: Not Initialized'));
    console.log(chalk.gray('\nRun: proagents init\n'));
    return;
  }

  console.log(chalk.green('Status: Initialized ✓'));
  console.log(chalk.gray(`Location: ${proagentsDir}\n`));

  // Check for config file
  const configFile = join(targetDir, 'proagents.config.yaml');
  if (existsSync(configFile)) {
    console.log(chalk.white('Config: proagents.config.yaml ✓'));
  } else {
    console.log(chalk.yellow('Config: Not found (using defaults)'));
  }

  // Check active features
  const activeFeaturesDir = join(proagentsDir, 'active-features');
  if (existsSync(activeFeaturesDir)) {
    try {
      const features = readdirSync(activeFeaturesDir).filter(f => f.startsWith('feature-'));

      if (features.length > 0) {
        console.log(chalk.white(`\nActive Features: ${features.length}`));
        console.log(chalk.gray('─'.repeat(30)));

        features.forEach(feature => {
          const statusFile = join(activeFeaturesDir, feature, 'status.json');
          if (existsSync(statusFile)) {
            try {
              const status = JSON.parse(readFileSync(statusFile, 'utf-8'));
              const phaseEmoji = getPhaseEmoji(status.current_phase);
              console.log(`${phaseEmoji} ${status.name}`);
              console.log(chalk.gray(`   Phase: ${status.current_phase} | ${status.phase_progress}%`));
            } catch (e) {
              console.log(chalk.gray(`• ${feature}`));
            }
          }
        });
      } else {
        console.log(chalk.gray('\nNo active features.'));
      }
    } catch (e) {
      console.log(chalk.gray('\nNo active features.'));
    }
  } else {
    console.log(chalk.gray('\nNo active features.'));
  }

  // Quick commands reference
  console.log('\n' + chalk.bold('Quick Commands:'));
  console.log(chalk.gray('─'.repeat(30)));
  console.log(chalk.cyan('proagents feature start "name"') + ' - Start feature');
  console.log(chalk.cyan('proagents fix "description"') + '    - Quick bug fix');
  console.log(chalk.cyan('proagents docs') + '                  - Open docs');
  console.log(chalk.cyan('proagents commands') + '              - All commands');
  console.log('');
}

function getPhaseEmoji(phase) {
  const emojis = {
    'init': '🔵',
    'analysis': '🔍',
    'requirements': '📋',
    'design': '🎨',
    'planning': '📝',
    'implementation': '💻',
    'testing': '🧪',
    'review': '👀',
    'documentation': '📚',
    'deployment': '🚀',
    'complete': '✅'
  };
  return emojis[phase] || '⏳';
}

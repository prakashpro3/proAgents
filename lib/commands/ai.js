import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import chalk from 'chalk';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// AI Platform definitions grouped by type
export const AI_PLATFORMS = {
  ide: {
    label: 'IDE-based AI Assistants',
    platforms: [
      { id: 'claude', name: 'Claude Code', file: 'CLAUDE.md', desc: 'Anthropic Claude in terminal/IDE' },
      { id: 'cursor', name: 'Cursor', file: '.cursorrules', desc: 'Cursor AI IDE' },
      { id: 'windsurf', name: 'Windsurf', file: '.windsurfrules', desc: 'Codeium Windsurf IDE' },
      { id: 'copilot', name: 'GitHub Copilot', file: '.github/copilot-instructions.md', desc: 'GitHub Copilot' },
      { id: 'kiro', name: 'AWS Kiro', file: 'KIRO.md', desc: 'AWS Kiro IDE' },
      { id: 'antigravity', name: 'Antigravity', file: 'ANTIGRAVITY.md', desc: 'Antigravity IDE (Gemini/Claude)' },
    ]
  },
  web: {
    label: 'Web-based AI Platforms',
    platforms: [
      { id: 'chatgpt', name: 'ChatGPT / Codex', file: 'CHATGPT.md', desc: 'OpenAI ChatGPT' },
      { id: 'gemini', name: 'Gemini', file: 'GEMINI.md', desc: 'Google Gemini' },
      { id: 'replit', name: 'Replit AI', file: 'REPLIT.md', desc: 'Replit Ghostwriter' },
      { id: 'bolt', name: 'Bolt.new', file: 'BOLT.md', desc: 'StackBlitz Bolt' },
      { id: 'lovable', name: 'Lovable', file: 'LOVABLE.md', desc: 'Lovable (GPT Engineer)' },
      { id: 'groq', name: 'Groq', file: 'GROQ.md', desc: 'Groq fast inference' },
    ]
  }
};

// Get all platforms as flat array
export function getAllPlatforms() {
  return [
    ...AI_PLATFORMS.ide.platforms,
    ...AI_PLATFORMS.web.platforms,
  ];
}

// Get platform by ID
export function getPlatformById(id) {
  return getAllPlatforms().find(p => p.id === id);
}

/**
 * Interactive platform selection using readline
 */
export async function selectPlatforms() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log('\n' + chalk.bold('Which AI platform(s) do you use?'));
  console.log(chalk.gray('(Enter numbers separated by commas, or "all" for all platforms)\n'));

  let index = 1;
  const indexMap = {};

  // IDE-based platforms
  console.log(chalk.cyan.bold(`  ${AI_PLATFORMS.ide.label}:`));
  for (const platform of AI_PLATFORMS.ide.platforms) {
    console.log(chalk.white(`    ${index}. ${platform.name}`) + chalk.gray(` - ${platform.desc}`));
    indexMap[index] = platform.id;
    index++;
  }

  console.log('');

  // Web-based platforms
  console.log(chalk.cyan.bold(`  ${AI_PLATFORMS.web.label}:`));
  for (const platform of AI_PLATFORMS.web.platforms) {
    console.log(chalk.white(`    ${index}. ${platform.name}`) + chalk.gray(` - ${platform.desc}`));
    indexMap[index] = platform.id;
    index++;
  }

  console.log('');

  const answer = await question(chalk.yellow('Your selection (e.g., 1,2,3 or "all"): '));
  rl.close();

  if (answer.toLowerCase() === 'all') {
    return getAllPlatforms().map(p => p.id);
  }

  const selected = [];
  const numbers = answer.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  for (const num of numbers) {
    if (indexMap[num]) {
      selected.push(indexMap[num]);
    }
  }

  return selected.length > 0 ? selected : ['claude']; // Default to Claude if nothing selected
}

// ProAgents section markers
const PROAGENTS_START = '<!-- PROAGENTS:START -->';
const PROAGENTS_END = '<!-- PROAGENTS:END -->';

/**
 * Wrap ProAgents content with markers
 */
function wrapWithMarkers(content) {
  return `${PROAGENTS_START}\n${content}\n${PROAGENTS_END}`;
}

/**
 * Extract ProAgents section from content
 */
function extractProagentsSection(content) {
  const startIdx = content.indexOf(PROAGENTS_START);
  const endIdx = content.indexOf(PROAGENTS_END);

  if (startIdx !== -1 && endIdx !== -1) {
    return {
      before: content.substring(0, startIdx),
      proagents: content.substring(startIdx, endIdx + PROAGENTS_END.length),
      after: content.substring(endIdx + PROAGENTS_END.length)
    };
  }
  return null;
}

/**
 * Merge ProAgents instructions with existing file content
 * - If file doesn't exist: create with ProAgents content
 * - If file exists without ProAgents section: append ProAgents section
 * - If file exists with ProAgents section: update only ProAgents section
 */
function mergeAIInstructions(sourcePath, targetPath) {
  const sourceContent = readFileSync(sourcePath, 'utf-8');
  const wrappedSource = wrapWithMarkers(sourceContent);

  if (!existsSync(targetPath)) {
    // File doesn't exist - create new with wrapped content
    writeFileSync(targetPath, wrappedSource);
    return 'created';
  }

  const existingContent = readFileSync(targetPath, 'utf-8');
  const sections = extractProagentsSection(existingContent);

  if (sections) {
    // ProAgents section exists - update it only
    const newContent = sections.before + wrappedSource + sections.after;
    writeFileSync(targetPath, newContent);
    return 'updated';
  } else {
    // No ProAgents section - append to existing content
    const newContent = existingContent.trim() + '\n\n' + wrappedSource + '\n';
    writeFileSync(targetPath, newContent);
    return 'merged';
  }
}

/**
 * Copy AI instruction files for selected platforms
 * Merges with existing files instead of replacing them
 * @param {string[]} selectedIds - Platform IDs to copy
 * @param {string} sourceDir - Source directory (proagents folder)
 * @param {string} targetDir - Target directory (project root)
 */
export function copyPlatformFiles(selectedIds, sourceDir, targetDir) {
  const results = { created: [], updated: [], merged: [], failed: [] };

  for (const id of selectedIds) {
    const platform = getPlatformById(id);
    if (!platform) continue;

    const sourcePath = join(sourceDir, platform.file);
    let targetPath;

    // Handle .github/copilot-instructions.md specially
    if (platform.file.startsWith('.github/')) {
      const githubDir = join(targetDir, '.github');
      targetPath = join(targetDir, platform.file);

      if (!existsSync(githubDir)) {
        mkdirSync(githubDir, { recursive: true });
      }
    } else {
      targetPath = join(targetDir, platform.file);
    }

    try {
      if (existsSync(sourcePath)) {
        const result = mergeAIInstructions(sourcePath, targetPath);
        if (result === 'created') {
          results.created.push(platform.name);
        } else if (result === 'updated') {
          results.updated.push(platform.name);
        } else if (result === 'merged') {
          results.merged.push(platform.name);
        }
      }
    } catch (error) {
      results.failed.push(platform.name);
    }
  }

  return results;
}

/**
 * Save selected platforms to config
 */
export function savePlatformConfig(selectedIds, configPath) {
  let config = {};

  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      config = yaml.load(content) || {};
    } catch {
      config = {};
    }
  }

  config.ai_platforms = selectedIds;

  const yamlContent = yaml.dump(config, { indent: 2, lineWidth: 120 });
  writeFileSync(configPath, yamlContent);
}

/**
 * Load selected platforms from config
 */
export function loadPlatformConfig(configPath) {
  if (!existsSync(configPath)) return [];

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = yaml.load(content) || {};
    return config.ai_platforms || [];
  } catch {
    return [];
  }
}

/**
 * Show available platforms that can be added
 */
export function showAvailablePlatforms(currentIds) {
  console.log('\n' + chalk.bold('Available AI Platforms:\n'));

  let index = 1;
  const available = [];

  // IDE-based platforms
  console.log(chalk.cyan.bold(`  ${AI_PLATFORMS.ide.label}:`));
  for (const platform of AI_PLATFORMS.ide.platforms) {
    const status = currentIds.includes(platform.id)
      ? chalk.green(' ✓ (installed)')
      : chalk.gray(' (not installed)');
    console.log(chalk.white(`    ${index}. ${platform.name}`) + status);
    if (!currentIds.includes(platform.id)) {
      available.push({ index, platform });
    }
    index++;
  }

  console.log('');

  // Web-based platforms
  console.log(chalk.cyan.bold(`  ${AI_PLATFORMS.web.label}:`));
  for (const platform of AI_PLATFORMS.web.platforms) {
    const status = currentIds.includes(platform.id)
      ? chalk.green(' ✓ (installed)')
      : chalk.gray(' (not installed)');
    console.log(chalk.white(`    ${index}. ${platform.name}`) + status);
    if (!currentIds.includes(platform.id)) {
      available.push({ index, platform });
    }
    index++;
  }

  return available;
}

/**
 * Command: proagents ai add
 */
export async function aiAddCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');
  const sourceDir = join(__dirname, '..', '..', 'proagents');
  const configPath = join(proagentsDir, 'proagents.config.yaml');

  // Check if proagents is initialized
  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('\n✗ ProAgents not initialized. Run "proagents init" first.\n'));
    return;
  }

  // Load current platforms
  const currentIds = loadPlatformConfig(configPath);

  console.log(chalk.bold.blue('\nProAgents - Add AI Platform'));
  console.log(chalk.blue('===========================\n'));

  // Show available platforms
  const available = showAvailablePlatforms(currentIds);

  if (available.length === 0) {
    console.log(chalk.green('\n✓ All AI platforms are already installed!\n'));
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log('');
  const answer = await question(chalk.yellow('Enter platform number(s) to add (e.g., 1,2,3): '));
  rl.close();

  const numbers = answer.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const toAdd = [];

  for (const num of numbers) {
    const found = available.find(a => a.index === num);
    if (found) {
      toAdd.push(found.platform.id);
    }
  }

  if (toAdd.length === 0) {
    console.log(chalk.yellow('\nNo platforms selected.\n'));
    return;
  }

  // Copy files for new platforms
  const results = copyPlatformFiles(toAdd, sourceDir, targetDir);

  // Update config
  const newIds = [...currentIds, ...toAdd];
  savePlatformConfig(newIds, configPath);

  // Show results
  if (results.created.length > 0) {
    console.log(chalk.green(`\n✓ Created: ${results.created.join(', ')}`));
  }
  if (results.updated.length > 0) {
    console.log(chalk.green(`✓ Updated: ${results.updated.join(', ')}`));
  }
  if (results.merged.length > 0) {
    console.log(chalk.green(`✓ Merged with existing: ${results.merged.join(', ')}`));
  }

  console.log(chalk.gray('\nAI instruction files added to project root.'));
  console.log(chalk.gray('Config updated in proagents/proagents.config.yaml\n'));
}

/**
 * Command: proagents ai list
 */
export function aiListCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');
  const configPath = join(proagentsDir, 'proagents.config.yaml');

  const currentIds = loadPlatformConfig(configPath);

  console.log(chalk.bold.blue('\nProAgents - AI Platforms'));
  console.log(chalk.blue('========================\n'));

  showAvailablePlatforms(currentIds);
  console.log('');
}

/**
 * Command: proagents ai remove
 */
export async function aiRemoveCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');
  const configPath = join(proagentsDir, 'proagents.config.yaml');

  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('\n✗ ProAgents not initialized.\n'));
    return;
  }

  const currentIds = loadPlatformConfig(configPath);

  if (currentIds.length === 0) {
    console.log(chalk.yellow('\nNo AI platforms configured.\n'));
    return;
  }

  console.log(chalk.bold.blue('\nProAgents - Remove AI Platform'));
  console.log(chalk.blue('==============================\n'));

  console.log(chalk.cyan('Currently installed platforms:\n'));

  let index = 1;
  const indexMap = {};

  for (const id of currentIds) {
    const platform = getPlatformById(id);
    if (platform) {
      console.log(chalk.white(`  ${index}. ${platform.name}`));
      indexMap[index] = id;
      index++;
    }
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log('');
  const answer = await question(chalk.yellow('Enter platform number(s) to remove (e.g., 1,2): '));
  rl.close();

  const numbers = answer.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const toRemove = [];

  for (const num of numbers) {
    if (indexMap[num]) {
      toRemove.push(indexMap[num]);
    }
  }

  if (toRemove.length === 0) {
    console.log(chalk.yellow('\nNo platforms selected.\n'));
    return;
  }

  // Remove from config (don't delete files - user might have customized them)
  const newIds = currentIds.filter(id => !toRemove.includes(id));
  savePlatformConfig(newIds, configPath);

  const removedNames = toRemove.map(id => getPlatformById(id)?.name).filter(Boolean);
  console.log(chalk.green(`\n✓ Removed from config: ${removedNames.join(', ')}`));
  console.log(chalk.gray('Note: AI instruction files in project root were not deleted.'));
  console.log(chalk.gray('You can manually delete them if needed.\n'));
}

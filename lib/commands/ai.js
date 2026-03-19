import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
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
      { id: 'gemini', name: 'Gemini', file: 'GEMINI.md', desc: 'Google Gemini / AI Studio' },
    ]
  },
  web: {
    label: 'Web-based AI Platforms',
    platforms: [
      { id: 'replit', name: 'Replit AI', file: 'REPLIT.md', desc: 'Replit Ghostwriter' },
      { id: 'bolt', name: 'Bolt.new', file: 'BOLT.md', desc: 'StackBlitz Bolt' },
      { id: 'lovable', name: 'Lovable', file: 'LOVABLE.md', desc: 'Lovable (GPT Engineer)' },
    ]
  }
};

// Auto-handled platforms (use AGENTS.md, no separate file needed)
export const AUTO_HANDLED_PLATFORMS = ['ChatGPT', 'Groq', 'Antigravity', 'Codex CLI', 'OpenAI API'];

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
 * Detect current IDE from environment variables
 * Returns platform ID if detected and it's in our AI_PLATFORMS config, null otherwise
 * Note: VS Code is NOT an AI platform, so we skip it even if detected
 */
export function detectIDE() {
  // Cursor IDE - check for Cursor-specific env vars
  if (process.env.CURSOR_TRACE_ID || process.env.CURSOR_CHANNEL || process.env.CURSOR_SESSION_ID) {
    return 'cursor';
  }

  // Windsurf IDE - Codeium's IDE
  if (process.env.WINDSURF_SESSION_ID || process.env.CODEIUM_API_KEY ||
      (process.env.TERM_PROGRAM && process.env.TERM_PROGRAM.toLowerCase().includes('windsurf'))) {
    return 'windsurf';
  }

  // AWS Kiro IDE
  if (process.env.KIRO_SESSION || process.env.KIRO_API_KEY ||
      (process.env.TERM_PROGRAM && process.env.TERM_PROGRAM.toLowerCase().includes('kiro'))) {
    return 'kiro';
  }

  // VS Code - NOT an AI platform, explicitly return null
  // This prevents accidental detection as we don't want to create files for plain VS Code
  if (process.env.TERM_PROGRAM === 'vscode' || process.env.VSCODE_GIT_IPC_HANDLE) {
    return null;
  }

  // No AI-powered IDE detected
  return null;
}

/**
 * Interactive platform selection using readline
 * @param {string[]} previouslySelected - Previously selected platforms (from interrupted setup)
 */
export async function selectPlatforms(previouslySelected = []) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  // Auto-detect IDE and pre-select it
  const detectedIDE = detectIDE();
  let autoSelected = [];

  if (detectedIDE) {
    const platform = getPlatformById(detectedIDE);
    if (platform) {
      console.log(chalk.green(`\n✓ Detected ${platform.name} IDE - auto-selected`));
      autoSelected = [detectedIDE];
    }
  }

  // Merge auto-detected with previously selected
  const preselected = [...new Set([...autoSelected, ...(previouslySelected || [])])];

  console.log('\n' + chalk.bold('Which AI platform(s) do you use?'));
  console.log(chalk.gray('(Enter numbers separated by commas, or "all" for all platforms)'));

  // Show auto-handled platforms info
  console.log(chalk.cyan.bold('\n  Auto-handled (via AGENTS.md):'));
  console.log(chalk.gray('    ' + AUTO_HANDLED_PLATFORMS.join(', ')));
  console.log(chalk.gray('    → These work automatically, no installation needed\n'));

  let index = 1;
  const indexMap = {};
  const preSelectedIndices = [];

  // IDE-based platforms
  console.log(chalk.cyan.bold(`  ${AI_PLATFORMS.ide.label}:`));
  for (const platform of AI_PLATFORMS.ide.platforms) {
    const isAutoDetected = autoSelected.includes(platform.id);
    const wasPreviouslySelected = previouslySelected && previouslySelected.includes(platform.id);
    const isPreselected = preselected.includes(platform.id);
    let marker = '';
    if (isAutoDetected) {
      marker = chalk.green(' ✓ (auto-detected)');
    } else if (wasPreviouslySelected) {
      marker = chalk.green(' ✓ (previously selected)');
    }
    console.log(chalk.white(`    ${index}. ${platform.name}`) + chalk.gray(` - ${platform.desc}`) + marker);
    indexMap[index] = platform.id;
    if (isPreselected) preSelectedIndices.push(index);
    index++;
  }

  console.log('');

  // Web-based platforms
  console.log(chalk.cyan.bold(`  ${AI_PLATFORMS.web.label}:`));
  for (const platform of AI_PLATFORMS.web.platforms) {
    const wasPreviouslySelected = previouslySelected && previouslySelected.includes(platform.id);
    const isPreselected = preselected.includes(platform.id);
    const marker = wasPreviouslySelected ? chalk.green(' ✓ (previously selected)') : '';
    console.log(chalk.white(`    ${index}. ${platform.name}`) + chalk.gray(` - ${platform.desc}`) + marker);
    indexMap[index] = platform.id;
    if (isPreselected) preSelectedIndices.push(index);
    index++;
  }

  console.log('');

  // Show default based on preselected (auto-detected + previously selected)
  const defaultHint = preSelectedIndices.length > 0
    ? `Enter for selected: ${preSelectedIndices.join(',')}`
    : 'e.g., 1,2,3 or "all"';

  const answer = await question(chalk.yellow(`Your selection (${defaultHint}): `));
  rl.close();

  // If user just pressed enter and we have preselected platforms, use them
  if (answer.trim() === '' && preSelectedIndices.length > 0) {
    return preselected;
  }

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
 * Remove only ProAgents section from a file, keep user's original content
 * Returns: 'deleted' (file removed), 'cleaned' (section removed), 'skipped' (no ProAgents section)
 */
function removeProagentsSectionFromFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    const startIndex = content.indexOf(PROAGENTS_START);
    const endIndex = content.indexOf(PROAGENTS_END);

    if (startIndex !== -1 && endIndex !== -1) {
      // Has ProAgents section - remove it, keep the rest
      const before = content.substring(0, startIndex).trim();
      const after = content.substring(endIndex + PROAGENTS_END.length).trim();
      const remaining = (before + '\n\n' + after).trim();

      if (remaining.length === 0) {
        // File only had ProAgents content - delete it
        rmSync(filePath, { force: true });
        return 'deleted';
      } else {
        // File has other content - keep it, remove only ProAgents section
        writeFileSync(filePath, remaining + '\n');
        return 'cleaned';
      }
    } else {
      // No ProAgents markers - file was created by ProAgents (not merged)
      // Check if it's a ProAgents-generated file by looking for ProAgents reference
      if (content.includes('proagents') || content.includes('ProAgents') || content.includes('.proagents/')) {
        rmSync(filePath, { force: true });
        return 'deleted';
      }
      return 'skipped';
    }
  } catch (error) {
    return 'skipped';
  }
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
 * Copy universal AGENTS.md file (always present, not a selectable platform)
 * @param {string} sourceDir - Source directory (.proagents folder in npm package)
 * @param {string} targetDir - Target directory (project root)
 * @returns {string} - 'created', 'updated', or 'skipped'
 */
export function copyUniversalAIFile(sourceDir, targetDir) {
  const sourcePath = join(sourceDir, 'AGENTS.md');
  const targetPath = join(targetDir, 'AGENTS.md');

  if (!existsSync(sourcePath)) {
    return 'skipped';
  }

  const result = mergeAIInstructions(sourcePath, targetPath);
  return result;
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
 * Check if a file contains ProAgents content
 */
function hasProagentsContent(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Check for ProAgents markers or references
    return content.includes(PROAGENTS_START) ||
           content.includes('.proagents/') ||
           content.includes('ProAgents Commands');
  } catch {
    return false;
  }
}

/**
 * Detect installed platforms by checking for actual files with ProAgents content
 * Only counts as installed if the file has ProAgents-related content
 */
export function detectInstalledPlatforms(targetDir) {
  const installed = [];

  for (const platform of getAllPlatforms()) {
    const filePath = join(targetDir, platform.file);
    if (existsSync(filePath) && hasProagentsContent(filePath)) {
      installed.push(platform.id);
    }
  }

  return installed;
}

/**
 * Get installed platforms - combines config and file detection
 * Returns platforms that are either in config OR have files present
 */
export function getInstalledPlatforms(targetDir, configPath) {
  const fromConfig = loadPlatformConfig(configPath);
  const fromFiles = detectInstalledPlatforms(targetDir);

  // Merge both sources, remove duplicates
  const combined = [...new Set([...fromConfig, ...fromFiles])];
  return combined;
}

/**
 * Show available platforms that can be added
 */
export function showAvailablePlatforms(currentIds) {
  // Show auto-handled platforms info
  console.log(chalk.cyan.bold('\n  Auto-handled (via AGENTS.md):'));
  console.log(chalk.gray('    ' + AUTO_HANDLED_PLATFORMS.join(', ')));
  console.log(chalk.gray('    → These work automatically, no installation needed'));
  console.log(chalk.yellow('    ⚠️  Do not remove AGENTS.md - required for these platforms'));

  // Show user's installed platforms
  const installedNames = currentIds
    .map(id => getPlatformById(id)?.name)
    .filter(Boolean);
  if (installedNames.length > 0) {
    console.log(chalk.green('\n  Your platforms: ') + chalk.white(installedNames.join(', ')));
  }

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
  const proagentsDir = join(targetDir, '.proagents');
  const sourceDir = join(__dirname, '..', '..', '.proagents');
  const configPath = join(targetDir, 'proagents.config.yaml');

  // Check if proagents is initialized
  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('\n✗ ProAgents not initialized. Run "proagents init" first.\n'));
    return;
  }

  // Detect from both config AND actual files
  const currentIds = getInstalledPlatforms(targetDir, configPath);

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

  // Ensure universal AGENTS.md exists (auto-handled platforms)
  const agentsResult = copyUniversalAIFile(sourceDir, targetDir);
  if (agentsResult === 'created') {
    results.created.push('AGENTS.md (auto-handled)');
  }

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
  console.log(chalk.gray('Config updated in proagents.config.yaml\n'));
}

/**
 * Command: proagents ai list
 */
export function aiListCommand() {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, '.proagents');
  const configPath = join(targetDir, 'proagents.config.yaml');

  // Detect from both config AND actual files
  const currentIds = getInstalledPlatforms(targetDir, configPath);

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
  const proagentsDir = join(targetDir, '.proagents');
  const configPath = join(targetDir, 'proagents.config.yaml');

  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('\n✗ ProAgents not initialized.\n'));
    return;
  }

  // Detect from both config AND actual files
  const currentIds = getInstalledPlatforms(targetDir, configPath);

  if (currentIds.length === 0) {
    console.log(chalk.yellow('\nNo AI platforms installed.\n'));
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

  // Remove from config
  const newIds = currentIds.filter(id => !toRemove.includes(id));
  savePlatformConfig(newIds, configPath);

  // Remove ProAgents sections from AI files (smart removal - keeps user content)
  const results = { deleted: [], cleaned: [], skipped: [] };

  for (const id of toRemove) {
    const platform = getPlatformById(id);
    if (!platform) continue;

    const filePath = join(targetDir, platform.file);
    if (existsSync(filePath)) {
      const result = removeProagentsSectionFromFile(filePath);
      if (result === 'deleted') {
        results.deleted.push(platform.name);
      } else if (result === 'cleaned') {
        results.cleaned.push(platform.name);
      }
    }
  }

  // Show results
  console.log('');
  if (results.deleted.length > 0) {
    console.log(chalk.green(`✓ Removed: ${results.deleted.join(', ')}`));
  }
  if (results.cleaned.length > 0) {
    console.log(chalk.green(`✓ Cleaned ProAgents section from: ${results.cleaned.join(', ')} (kept your custom config)`));
  }

  console.log(chalk.gray('\nConfig updated in proagents.config.yaml\n'));
}

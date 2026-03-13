import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Count files in directory recursively
 */
function countFiles(dir, extension = null) {
  let count = 0;
  if (!existsSync(dir)) return 0;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        count += countFiles(fullPath, extension);
      } else if (!extension || entry.name.endsWith(extension)) {
        count++;
      }
    }
  } catch {
    // Directory not accessible
  }
  return count;
}

/**
 * Get AI stats from worklog
 */
function getAIStats(proagentsDir) {
  const statsPath = join(proagentsDir, 'worklog', 'ai-stats.json');
  if (existsSync(statsPath)) {
    try {
      return JSON.parse(readFileSync(statsPath, 'utf-8'));
    } catch {
      // Stats file unreadable
    }
  }
  return null;
}

/**
 * Count features from active-features
 */
function getFeatureStats(proagentsDir) {
  const featuresDir = join(proagentsDir, 'active-features');
  const stats = { active: 0, completed: 0, total: 0 };

  if (!existsSync(featuresDir)) return stats;

  try {
    const indexPath = join(featuresDir, '_index.json');
    if (existsSync(indexPath)) {
      const index = JSON.parse(readFileSync(indexPath, 'utf-8'));
      stats.active = (index.active_features || []).length;
      stats.completed = (index.completed_features || []).length;
      stats.total = stats.active + stats.completed;
    }
  } catch {
    // Index not readable
  }

  return stats;
}

/**
 * Get changelog stats
 */
function getChangelogStats(proagentsDir) {
  const changelogDir = join(proagentsDir, 'changelog');
  const stats = { total: 0, features: 0, modules: 0 };

  if (!existsSync(changelogDir)) return stats;

  // Count feature changelogs
  const featuresDir = join(changelogDir, 'features');
  if (existsSync(featuresDir)) {
    stats.features = countFiles(featuresDir, '.md');
  }

  // Count module changelogs
  const modulesDir = join(changelogDir, 'modules');
  if (existsSync(modulesDir)) {
    stats.modules = countFiles(modulesDir, '.md');
  }

  // Count year folders
  try {
    const entries = readdirSync(changelogDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && /^20[2-9][0-9]$/.test(entry.name)) {
        stats.total += countFiles(join(changelogDir, entry.name), '.md');
      }
    }
  } catch {
    // Directory not readable
  }

  return stats;
}

/**
 * Get git stats
 */
function getGitStats() {
  const stats = { commits: 0, branches: 0, tags: 0, contributors: 0 };

  try {
    // Total commits
    const commits = execSync('git rev-list --count HEAD 2>/dev/null', { encoding: 'utf-8' });
    stats.commits = parseInt(commits.trim()) || 0;
  } catch {
    // Git not available or not a repo
  }

  try {
    // Branches
    const branches = execSync('git branch -a 2>/dev/null', { encoding: 'utf-8' });
    stats.branches = branches.split('\n').filter(b => b.trim()).length;
  } catch {
    // Git not available
  }

  try {
    // Tags
    const tags = execSync('git tag 2>/dev/null', { encoding: 'utf-8' });
    stats.tags = tags.split('\n').filter(t => t.trim()).length;
  } catch {
    // Git not available
  }

  try {
    // Contributors
    const contributors = execSync('git shortlog -sn --all 2>/dev/null', { encoding: 'utf-8' });
    stats.contributors = contributors.split('\n').filter(c => c.trim()).length;
  } catch {
    // Git not available
  }

  return stats;
}

/**
 * Get activity log stats
 */
function getActivityStats(proagentsDir) {
  const activityPath = join(proagentsDir, 'activity.log');
  const stats = { total: 0, byAI: {}, byAction: {} };

  if (!existsSync(activityPath)) return stats;

  try {
    const content = readFileSync(activityPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    stats.total = lines.length;

    // Parse activity entries
    for (const line of lines) {
      // Extract AI platform (look for common patterns)
      const aiMatch = line.match(/\[(claude|chatgpt|gemini|cursor|copilot|windsurf|bolt|kiro)\]/i);
      if (aiMatch) {
        const ai = aiMatch[1].toLowerCase();
        stats.byAI[ai] = (stats.byAI[ai] || 0) + 1;
      }

      // Extract action type
      const actionMatch = line.match(/\b(feature|fix|test|doc|deploy|review|refactor)\b/i);
      if (actionMatch) {
        const action = actionMatch[1].toLowerCase();
        stats.byAction[action] = (stats.byAction[action] || 0) + 1;
      }
    }
  } catch {
    // Activity log not readable
  }

  return stats;
}

/**
 * Get worklog session stats
 */
function getSessionStats(proagentsDir) {
  const worklogDir = join(proagentsDir, 'worklog');
  const stats = { sessions: 0, lastSession: null };

  if (!existsSync(worklogDir)) return stats;

  try {
    const entries = readdirSync(worklogDir);
    const sessionFiles = entries.filter(e => e.match(/^\d{4}-\d{2}-\d{2}.*\.md$/));
    stats.sessions = sessionFiles.length;

    if (sessionFiles.length > 0) {
      // Get most recent
      sessionFiles.sort().reverse();
      stats.lastSession = sessionFiles[0].replace('.md', '');
    }
  } catch {
    // Worklog not readable
  }

  return stats;
}

/**
 * Stats command - show project and AI usage statistics
 */
export async function statsCommand(options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, '.proagents');

  // Check if ProAgents is installed
  if (!existsSync(proagentsDir)) {
    console.log(chalk.yellow('\nProAgents is not installed in this project.'));
    console.log(chalk.gray('Run `npx proagents init` to initialize.\n'));
    return;
  }

  console.log(chalk.bold('\nProAgents Statistics'));
  console.log(chalk.gray('====================\n'));

  // Gather all stats
  const aiStats = getAIStats(proagentsDir);
  const featureStats = getFeatureStats(proagentsDir);
  const changelogStats = getChangelogStats(proagentsDir);
  const gitStats = getGitStats();
  const activityStats = getActivityStats(proagentsDir);
  const sessionStats = getSessionStats(proagentsDir);

  // JSON output
  if (options.json) {
    const result = {
      features: featureStats,
      changelog: changelogStats,
      git: gitStats,
      activity: activityStats,
      sessions: sessionStats,
      aiStats: aiStats
    };
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Feature Stats
  console.log(chalk.bold.cyan('Features'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`  Active:     ${chalk.yellow(featureStats.active)}`);
  console.log(`  Completed:  ${chalk.green(featureStats.completed)}`);
  console.log(`  Total:      ${chalk.white(featureStats.total)}`);
  console.log('');

  // Changelog Stats
  console.log(chalk.bold.cyan('Changelog'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`  Total entries:    ${chalk.white(changelogStats.total)}`);
  console.log(`  Feature logs:     ${chalk.white(changelogStats.features)}`);
  console.log(`  Module logs:      ${chalk.white(changelogStats.modules)}`);
  console.log('');

  // Git Stats
  console.log(chalk.bold.cyan('Git'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`  Commits:       ${chalk.white(gitStats.commits)}`);
  console.log(`  Branches:      ${chalk.white(gitStats.branches)}`);
  console.log(`  Tags:          ${chalk.white(gitStats.tags)}`);
  console.log(`  Contributors:  ${chalk.white(gitStats.contributors)}`);
  console.log('');

  // AI Activity Stats
  console.log(chalk.bold.cyan('AI Activity'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`  Total actions:  ${chalk.white(activityStats.total)}`);
  console.log(`  Sessions:       ${chalk.white(sessionStats.sessions)}`);
  if (sessionStats.lastSession) {
    console.log(`  Last session:   ${chalk.gray(sessionStats.lastSession)}`);
  }
  console.log('');

  // AI Platform breakdown
  if (Object.keys(activityStats.byAI).length > 0) {
    console.log(chalk.bold.cyan('AI Platforms'));
    console.log(chalk.gray('─'.repeat(40)));
    const sortedAI = Object.entries(activityStats.byAI).sort((a, b) => b[1] - a[1]);
    for (const [ai, count] of sortedAI) {
      const bar = '█'.repeat(Math.min(Math.ceil(count / 5), 20));
      console.log(`  ${ai.padEnd(12)} ${chalk.blue(bar)} ${count}`);
    }
    console.log('');
  }

  // Action breakdown
  if (Object.keys(activityStats.byAction).length > 0) {
    console.log(chalk.bold.cyan('Actions'));
    console.log(chalk.gray('─'.repeat(40)));
    const sortedActions = Object.entries(activityStats.byAction).sort((a, b) => b[1] - a[1]);
    for (const [action, count] of sortedActions) {
      const bar = '█'.repeat(Math.min(Math.ceil(count / 3), 20));
      console.log(`  ${action.padEnd(12)} ${chalk.green(bar)} ${count}`);
    }
    console.log('');
  }

  // AI Stats from worklog (if available)
  if (aiStats && Object.keys(aiStats).length > 0) {
    console.log(chalk.bold.cyan('AI Performance'));
    console.log(chalk.gray('─'.repeat(40)));
    for (const [ai, data] of Object.entries(aiStats)) {
      if (typeof data === 'object' && data !== null) {
        console.log(`  ${chalk.white(ai)}:`);
        if (data.sessions) console.log(`    Sessions: ${data.sessions}`);
        if (data.tasks) console.log(`    Tasks: ${data.tasks}`);
        if (data.reverts) console.log(`    Reverts: ${data.reverts}`);
      }
    }
    console.log('');
  }
}

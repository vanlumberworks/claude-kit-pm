/**
 * Run diagnostics on PM Kit installation
 */

const pc = require('picocolors');
const { exec } = require('child_process');
const { promisify } = require('util');
const logger = require('../utils/logger');
const fileManager = require('../utils/file-manager');
const mcpService = require('../services/mcp-service');
const githubService = require('../services/github-service');
const { PMKitError, ErrorCodes } = require('../utils/error-handler');
const constants = require('../constants');

const execAsync = promisify(exec);

async function doctorCommand(options = {}) {
  try {
    logger.header('PM Kit Diagnostics');

    if (!options.json) {
      logger.log('Running comprehensive diagnostics...');
      logger.newline();
    }

    const results = {
      fileStructure: await checkFileStructure(),
      apiConfiguration: await checkAPIConfiguration(),
      claudeCLI: await checkClaudeCLI(),
      permissions: await checkPermissions(),
      connectivity: await checkConnectivity()
    };

    // Display results
    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      displayResults(results);
    }

    // Auto-fix if requested
    if (options.fix) {
      await performAutoFix(results);
    }

    // Exit with appropriate code
    const hasErrors = countIssues(results) > 0;
    if (hasErrors && !options.fix) {
      process.exit(1);
    }

  } catch (error) {
    logger.newline();
    logger.error('Diagnostics failed');
    throw error;
  }
}

/**
 * Check file structure
 */
async function checkFileStructure() {
  const checks = [];

  // Check CLAUDE.md
  checks.push({
    name: 'CLAUDE.md',
    passed: fileManager.exists('CLAUDE.md'),
    message: fileManager.exists('CLAUDE.md') ? 'Present' : 'Missing'
  });

  // Check .claude directory
  checks.push({
    name: '.claude/ directory',
    passed: fileManager.exists('.claude'),
    message: fileManager.exists('.claude') ? 'Present' : 'Missing'
  });

  // Check .mcp.json
  checks.push({
    name: '.mcp.json',
    passed: fileManager.exists('.mcp.json'),
    message: fileManager.exists('.mcp.json') ? 'Present' : 'Missing'
  });

  // Check workflows count
  const workflowCount = fileManager.countFiles('.claude/workflows', '.md');
  checks.push({
    name: 'Workflows',
    passed: workflowCount >= constants.EXPECTED_FILES.workflows,
    message: `${workflowCount}/${constants.EXPECTED_FILES.workflows} files`
  });

  // Check agents count
  const agentCount = fileManager.countFiles('.claude/agents', '.md');
  checks.push({
    name: 'Agents',
    passed: agentCount >= constants.EXPECTED_FILES.agents,
    message: `${agentCount}/${constants.EXPECTED_FILES.agents} files`
  });

  // Check commands count
  const commandCount = fileManager.countFiles('.claude/commands', '.md');
  checks.push({
    name: 'Commands',
    passed: commandCount >= constants.EXPECTED_FILES.commands,
    message: `${commandCount}/${constants.EXPECTED_FILES.commands} files`
  });

  // Check skills directory
  const skillsExist = fileManager.exists('.claude/skills');
  const skillCount = skillsExist ? fileManager.countFiles('.claude/skills', '.md') : 0;
  checks.push({
    name: 'Skills',
    passed: skillCount >= constants.EXPECTED_FILES.skills,
    message: `${skillCount}/${constants.EXPECTED_FILES.skills} files${!skillsExist ? ' (directory missing)' : ''}`
  });

  // Check output directories
  const outputDirs = constants.REQUIRED_DIRS.filter(d => d.startsWith('outputs/'));
  const outputDirsExist = outputDirs.every(d => fileManager.exists(d));
  checks.push({
    name: 'Output directories',
    passed: outputDirsExist,
    message: outputDirsExist ? 'All present' : 'Some missing'
  });

  return {
    category: 'File Structure',
    checks,
    passed: checks.every(c => c.passed)
  };
}

/**
 * Check API configuration
 */
async function checkAPIConfiguration() {
  const checks = [];

  // Check if .mcp.json exists
  if (!fileManager.exists('.mcp.json')) {
    checks.push({
      name: 'MCP Configuration',
      passed: false,
      message: '.mcp.json not found'
    });
    return {
      category: 'API Configuration',
      checks,
      passed: false
    };
  }

  // Read and validate .mcp.json
  try {
    const config = mcpService.readConfig();

    if (!mcpService.validateConfig(config)) {
      checks.push({
        name: 'MCP Configuration',
        passed: false,
        message: 'Invalid structure'
      });
    } else {
      checks.push({
        name: 'MCP Configuration',
        passed: true,
        message: 'Valid'
      });
    }

    // Check each API server
    for (const [serverName, serverConfig] of Object.entries(constants.MCP_SERVERS)) {
      const result = await mcpService.testServer(serverName);

      checks.push({
        name: serverName,
        passed: result.success,
        message: result.message,
        required: serverConfig.required
      });
    }

  } catch (error) {
    checks.push({
      name: 'MCP Configuration',
      passed: false,
      message: error.message
    });
  }

  return {
    category: 'API Configuration',
    checks,
    passed: checks.filter(c => c.required !== false).every(c => c.passed)
  };
}

/**
 * Check Claude CLI
 */
async function checkClaudeCLI() {
  const checks = [];

  try {
    const { stdout } = await execAsync('claude --version');
    const version = stdout.trim();

    checks.push({
      name: 'Claude CLI',
      passed: true,
      message: `Installed (${version})`
    });

    // Check if in PATH
    checks.push({
      name: 'Claude CLI in PATH',
      passed: true,
      message: 'Accessible'
    });

  } catch (error) {
    checks.push({
      name: 'Claude CLI',
      passed: false,
      message: 'Not found'
    });

    checks.push({
      name: 'Installation',
      passed: false,
      message: 'Install from https://claude.ai/code'
    });
  }

  return {
    category: 'Claude CLI',
    checks,
    passed: checks.every(c => c.passed),
    warning: !checks.every(c => c.passed) // Claude CLI is recommended but not required
  };
}

/**
 * Check permissions
 */
async function checkPermissions() {
  const checks = [];

  const dirsToCheck = [
    { path: '.claude', name: '.claude/ directory' },
    { path: 'docs', name: 'docs/ directory', createIfMissing: true },
    { path: 'outputs', name: 'outputs/ directory', createIfMissing: true },
    { path: '.', name: 'Current directory' }
  ];

  for (const { path, name, createIfMissing } of dirsToCheck) {
    if (createIfMissing && !fileManager.exists(path)) {
      try {
        fileManager.createDir(path);
      } catch (error) {
        // Ignore creation errors for now
      }
    }

    if (fileManager.exists(path)) {
      const readable = fileManager.isReadable(path);
      const writable = fileManager.isWritable(path);

      checks.push({
        name,
        passed: readable && writable,
        message: `${readable ? 'R' : '-'}${writable ? 'W' : '-'}`
      });
    } else {
      checks.push({
        name,
        passed: false,
        message: 'Does not exist'
      });
    }
  }

  return {
    category: 'Permissions',
    checks,
    passed: checks.every(c => c.passed)
  };
}

/**
 * Check connectivity
 */
async function checkConnectivity() {
  const checks = [];

  const endpoints = [
    { name: 'GitHub API', url: 'https://api.github.com' },
    { name: 'Brave Search API', url: 'https://api.search.brave.com', optional: true }
  ];

  for (const { name, url, optional } of endpoints) {
    try {
      const fetch = require('node-fetch');
      const response = await fetch(url, { timeout: 5000 });

      checks.push({
        name,
        passed: response.ok || response.status === 401, // 401 means reachable but needs auth
        message: response.ok ? 'Reachable' : `Status ${response.status}`,
        optional
      });
    } catch (error) {
      checks.push({
        name,
        passed: false,
        message: error.code || 'Unreachable',
        optional
      });
    }
  }

  return {
    category: 'Connectivity',
    checks,
    passed: checks.filter(c => !c.optional).every(c => c.passed)
  };
}

/**
 * Display results
 */
function displayResults(results) {
  const categories = Object.values(results);

  for (const category of categories) {
    logger.header(category.category);

    for (const check of category.checks) {
      const icon = check.passed
        ? pc.green('✔')
        : check.optional || category.warning
        ? pc.yellow('⚠')
        : pc.red('✖');

      const status = check.passed
        ? pc.green('OK')
        : check.optional || category.warning
        ? pc.yellow('WARNING')
        : pc.red('FAILED');

      const requiredLabel = check.required === false ? pc.gray('(optional)') : '';

      console.log(
        `${icon}  ${check.name} ${requiredLabel}: ${status} - ${pc.gray(check.message)}`
      );
    }

    logger.newline();
  }

  // Summary
  const totalIssues = countIssues(results);
  const totalWarnings = countWarnings(results);

  logger.header('Summary');

  if (totalIssues === 0 && totalWarnings === 0) {
    logger.success('All checks passed! ✨');
  } else {
    if (totalIssues > 0) {
      logger.error(`${totalIssues} issue(s) found`);
    }
    if (totalWarnings > 0) {
      logger.warn(`${totalWarnings} warning(s)`);
    }

    logger.newline();
    logger.log(pc.yellow('To fix issues automatically, run:'), pc.cyan('pm-kit doctor --fix'));
  }

  logger.newline();
}

/**
 * Count issues
 */
function countIssues(results) {
  let count = 0;

  for (const category of Object.values(results)) {
    if (category.warning) continue; // Skip warnings

    for (const check of category.checks) {
      if (!check.passed && !check.optional) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Count warnings
 */
function countWarnings(results) {
  let count = 0;

  for (const category of Object.values(results)) {
    if (category.warning) {
      count += category.checks.filter(c => !c.passed).length;
      continue;
    }

    for (const check of category.checks) {
      if (!check.passed && check.optional) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Perform auto-fix
 */
async function performAutoFix(results) {
  logger.header('Auto-fix Issues');

  let fixCount = 0;

  // Fix missing directories
  if (!results.fileStructure.passed) {
    logger.log('Creating missing directories...');

    for (const dir of constants.REQUIRED_DIRS) {
      if (!fileManager.exists(dir)) {
        try {
          fileManager.createDir(dir);
          logger.success(`Created ${dir}`);
          fixCount++;
        } catch (error) {
          logger.error(`Failed to create ${dir}: ${error.message}`);
        }
      }
    }
  }

  // Fix permissions (if possible)
  if (!results.permissions.passed) {
    logger.warn('Permission issues detected');
    logger.log('You may need to run with appropriate permissions');
  }

  logger.newline();

  if (fixCount > 0) {
    logger.success(`Fixed ${fixCount} issue(s)`);
    logger.log('Run', pc.cyan('pm-kit doctor'), 'again to verify');
  } else {
    logger.info('No issues could be auto-fixed');
    logger.log('You may need to run', pc.cyan('pm-kit init'), 'to reinstall');
  }
}

module.exports = doctorCommand;

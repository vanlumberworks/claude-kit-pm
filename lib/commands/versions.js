/**
 * List available PM Kit versions
 */

const pc = require('picocolors');
const logger = require('../utils/logger');
const githubService = require('../services/github-service');
const constants = require('../constants');

async function versionsCommand(options = {}) {
  try {
    logger.header('Available Versions');

    // Authenticate with GitHub
    await githubService.authenticate();

    // Get releases
    const spinner = logger.startSpinner('Fetching versions...');
    const releases = await getReleases(options);

    if (releases.length === 0) {
      logger.failSpinner('No releases found');
      logger.info('The repository may not have any releases yet.');
      return;
    }

    logger.succeedSpinner(`Found ${releases.length} version(s)`);
    logger.newline();

    // Display releases
    displayReleases(releases, options);

    // Show current version
    logger.newline();
    logger.log(pc.gray('─'.repeat(50)));
    logger.log(
      `${pc.bold('Installed version:')} ${pc.cyan(constants.CLI_VERSION)}`
    );

    // Show help
    logger.newline();
    logger.log(pc.gray('Update to a specific version:'));
    logger.log(pc.cyan('  pm-kit update --version <version>'));
  } catch (error) {
    logger.newline();
    logger.error('Failed to fetch versions');
    throw error;
  }
}

/**
 * Get releases from GitHub
 */
async function getReleases(options) {
  const repository = constants.KIT_REPOSITORY;
  const [owner, repo] = repository.split('/');
  const limit = options.limit || 30;

  const params = {
    owner,
    repo,
    per_page: Math.min(limit, 100),
    page: 1
  };

  const { data: releases } = await githubService.octokit.repos.listReleases(params);

  // Filter based on options
  let filtered = releases;

  if (!options.all) {
    // Exclude prereleases and drafts by default
    filtered = releases.filter(r => !r.prerelease && !r.draft);
  }

  return filtered.slice(0, limit).map(release => ({
    version: release.tag_name,
    name: release.name || release.tag_name,
    publishedAt: release.published_at,
    prerelease: release.prerelease,
    draft: release.draft,
    body: release.body,
    url: release.html_url
  }));
}

/**
 * Display releases in a formatted list
 */
function displayReleases(releases, options) {
  const currentVersion = constants.CLI_VERSION;

  for (let i = 0; i < releases.length; i++) {
    const release = releases[i];
    const isLatest = i === 0;
    const isCurrent = release.version === currentVersion ||
                      release.version === `v${currentVersion}`;

    // Version line
    let versionLine = '';

    // Version number
    if (isLatest) {
      versionLine += pc.bold(pc.green(release.version));
    } else {
      versionLine += pc.white(release.version);
    }

    // Tags
    const tags = [];
    if (isLatest) tags.push(pc.green('latest'));
    if (isCurrent) tags.push(pc.cyan('installed'));
    if (release.prerelease) tags.push(pc.yellow('prerelease'));
    if (release.draft) tags.push(pc.gray('draft'));

    if (tags.length > 0) {
      versionLine += ' ' + tags.join(' ');
    }

    // Date
    const date = new Date(release.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    versionLine += pc.gray(` • ${date}`);

    logger.log(versionLine);

    // Show description if verbose
    if (options.verbose && release.body) {
      const summary = release.body.split('\n')[0].slice(0, 80);
      logger.log(pc.gray(`    ${summary}${release.body.length > 80 ? '...' : ''}`));
    }
  }
}

module.exports = versionsCommand;

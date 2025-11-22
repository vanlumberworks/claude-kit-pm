/**
 * ASCII Animation for PM Kit CLI
 * Beautiful animated onboarding screen with oh-my-logo
 */

const pc = require('picocolors');

// Color functions using picocolors basic colors
const colors = {
  primary: pc.green,
  secondary: pc.blue,
  accent: pc.yellow,
  sunset: pc.red,
  sunsetOrange: pc.yellow,
  muted: pc.gray,
  white: pc.white,
  bold: pc.bold
};

/**
 * Render the PM KIT logo using oh-my-logo with filled blocks
 * @returns {Promise<string>} The rendered logo
 */
async function renderLogo() {
  try {
    const { render } = await import('oh-my-logo');
    const logo = await render('PM KIT', {
      palette: 'sunset',  // Warm sunset colors: #ff9966 → #ff5e62 → #ffa34e
      font: 'ANSI Shadow',
      direction: 'horizontal'
    });
    return logo;
  } catch (error) {
    // Fallback to bold ASCII art if oh-my-logo fails
    return colors.sunset(`
██████╗ ███╗   ███╗    ██╗  ██╗██╗████████╗
██╔══██╗████╗ ████║    ██║ ██╔╝██║╚══██╔══╝
██████╔╝██╔████╔██║    █████╔╝ ██║   ██║
██╔═══╝ ██║╚██╔╝██║    ██╔═██╗ ██║   ██║
██║     ██║ ╚═╝ ██║    ██║  ██╗██║   ██║
╚═╝     ╚═╝     ╚═╝    ╚═╝  ╚═╝╚═╝   ╚═╝
`);
  }
}

/**
 * Display welcome banner with big logo
 */
async function showWelcomeBanner() {
  const version = require('../../package.json').version;

  // Clear console for clean start
  console.clear();

  // Render the big logo
  const logo = await renderLogo();
  console.log(logo);

  // Show info box below logo with sunset theme
  const infoBox = `
${colors.sunsetOrange('╭────────────────────────────────────────────────────────────────╮')}
${colors.sunsetOrange('│')}                                                                ${colors.sunsetOrange('│')}
${colors.sunsetOrange('│')}   ${colors.bold(colors.white('Product Managers Claude Kit'))}                                 ${colors.sunsetOrange('│')}
${colors.sunsetOrange('│')}   ${colors.muted('Version')} ${colors.accent(version)}  ${colors.muted('•')}  ${colors.muted('AI-Powered PM Toolkit')}                    ${colors.sunsetOrange('│')}
${colors.sunsetOrange('│')}                                                                ${colors.sunsetOrange('│')}
${colors.sunsetOrange('╰────────────────────────────────────────────────────────────────╯')}
`;
  console.log(infoBox);
}

/**
 * Display welcome banner synchronously (fallback)
 */
function showWelcomeBannerSync() {
  const version = require('../../package.json').version;

  const fallbackLogo = colors.sunset(`
██████╗ ███╗   ███╗    ██╗  ██╗██╗████████╗
██╔══██╗████╗ ████║    ██║ ██╔╝██║╚══██╔══╝
██████╔╝██╔████╔██║    █████╔╝ ██║   ██║
██╔═══╝ ██║╚██╔╝██║    ██╔═██╗ ██║   ██║
██║     ██║ ╚═╝ ██║    ██║  ██╗██║   ██║
╚═╝     ╚═╝     ╚═╝    ╚═╝  ╚═╝╚═╝   ╚═╝
`);

  console.clear();
  console.log(fallbackLogo);

  const infoBox = `
${colors.sunsetOrange('╭────────────────────────────────────────────────────────────────╮')}
${colors.sunsetOrange('│')}                                                                ${colors.sunsetOrange('│')}
${colors.sunsetOrange('│')}   ${colors.bold(colors.white('Product Managers Claude Kit'))}                                 ${colors.sunsetOrange('│')}
${colors.sunsetOrange('│')}   ${colors.muted('Version')} ${colors.accent(version)}  ${colors.muted('•')}  ${colors.muted('AI-Powered PM Toolkit')}                    ${colors.sunsetOrange('│')}
${colors.sunsetOrange('│')}                                                                ${colors.sunsetOrange('│')}
${colors.sunsetOrange('╰────────────────────────────────────────────────────────────────╯')}
`;
  console.log(infoBox);
}

/**
 * Play the logo animation (shows the banner with logo)
 * @param {Object} options - Animation options
 * @returns {Promise<void>}
 */
async function playLogoAnimation(options = {}) {
  if (options.skipAnimation || process.env.NO_ANIMATION) {
    showWelcomeBannerSync();
    return;
  }

  await showWelcomeBanner();
}

module.exports = {
  playLogoAnimation,
  showWelcomeBanner,
  showWelcomeBannerSync,
  renderLogo,
  colors,
};

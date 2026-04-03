// Template Generator
// Takes an ExplorerConfig and injects values into the HTML template
// Returns the modified HTML string ready to serve

import type { ExplorerConfig } from './config-schema';

/**
 * Generate CSS variable block from config colors
 */
function generateCSSVariables(config: ExplorerConfig): string {
  const { colors } = config.branding;
  return `
    :root {
      --cyan: ${colors.primary};
      --teal: ${colors.teal};
      --blue: ${colors.blue};
      --deep-blue: ${colors.deepBlue};
      --navy: ${colors.navy};
      --midnight: ${colors.midnight};
      --plum: ${colors.plum};
      --bg-dark: ${colors.bgDark};
      --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    [data-theme="dark"] {
      --bg: ${colors.dark.bg};
      --bg-gradient: ${colors.dark.bgGradient};
      --surface: ${colors.dark.surface};
      --surface-hover: ${colors.dark.surfaceHover};
      --border: ${colors.dark.border};
      --border-focus: ${colors.dark.borderFocus};
      --text-1: ${colors.dark.text1};
      --text-2: ${colors.dark.text2};
      --text-3: ${colors.dark.text3};
      --input-bg: ${colors.dark.inputBg};
      --input-text: ${colors.dark.inputText};
      --input-placeholder: ${colors.dark.inputPlaceholder};
      --logo-text: ${colors.dark.text1};
      --focus-ring: ${colors.dark.focusRing};
    }

    [data-theme="light"] {
      --bg: ${colors.light.bg};
      --bg-gradient: ${colors.light.bgGradient};
      --surface: ${colors.light.surface};
      --surface-hover: ${colors.light.surfaceHover};
      --border: ${colors.light.border};
      --border-focus: ${colors.light.borderFocus};
      --text-1: ${colors.light.text1};
      --text-2: ${colors.light.text2};
      --text-3: ${colors.light.text3};
      --input-bg: ${colors.light.inputBg};
      --input-text: ${colors.light.inputText};
      --input-placeholder: ${colors.light.inputPlaceholder};
      --logo-text: ${colors.light.text1};
      --focus-ring: ${colors.light.focusRing};
    }
  `;
}

/**
 * Generate the welcome screen HTML
 */
function generateSplashHTML(config: ExplorerConfig): string {
  return `
    <div class="step step-0">
      <div class="welcome-content">
        <div class="welcome-title">${config.splash.title}<br><span class="gradient-word">${config.splash.gradientWord}</span></div>
        <div class="welcome-subtitle">${config.splash.subtitle}</div>
        <button class="btn-tap-begin" onclick="goToStep(1)">
          ${config.splash.buttonText}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * Generate registration form fields HTML
 */
function generateFormFieldsHTML(config: ExplorerConfig): string {
  const fields = config.registration.fields;
  let html = '';
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];
    const nextField = fields[i + 1];

    if (field.halfWidth && nextField?.halfWidth) {
      html += `<div class="form-row">
        <div class="form-field">
          <label>${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>
          <input type="${field.type}" placeholder="${field.placeholder}"${field.required ? ' required' : ''} />
        </div>
        <div class="form-field">
          <label>${nextField.label}${nextField.required ? ' <span class="required">*</span>' : ''}</label>
          <input type="${nextField.type}" placeholder="${nextField.placeholder}"${nextField.required ? ' required' : ''} />
        </div>
      </div>`;
      i += 2;
    } else {
      html += `<div class="form-row">
        <div class="form-field">
          <label>${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>
          <input type="${field.type}" placeholder="${field.placeholder}"${field.required ? ' required' : ''} />
        </div>
        <div class="form-field"></div>
      </div>`;
      i += 1;
    }
  }

  return html;
}

/**
 * Generate trait selection step HTML
 */
function generateTraitStepHTML(step: ExplorerConfig['steps'][number], stepNum: string): string {
  const optionsHTML = step.options.map(opt => `
    <div class="trait-card"${step.selectionMode === 'single' ? ` data-role="${opt.value}" onclick="selectTrait(this)"` : ' onclick="toggleTrait(this)"'}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">${opt.icon}</svg>
      <span class="trait-card-label">${opt.label}</span>
    </div>
  `).join('');

  const selectAllHTML = step.showSelectAll ? `
    <div style="position:relative;max-width:820px;width:100%;margin:0 auto;height:0;">
      <button class="btn-select-all" id="btn-select-all-${stepNum}" onclick="toggleSelectAll${stepNum}()" style="position:absolute;bottom:12px;right:0;">Select All</button>
    </div>
  ` : '';

  return `
    <div class="step step-${stepNum} trait-view">
      <div class="trait-header">
        <div class="selection-summary" id="step${stepNum}-summary"></div>
        <h1 class="trait-title">${step.title}</h1>
        <p class="trait-subtitle">${step.subtitle}</p>
      </div>
      ${selectAllHTML}
      <div class="trait-grid">
        ${optionsHTML}
      </div>
    </div>
  `;
}

/**
 * Generate OUTCOMES JS object from config
 */
function generateOutcomesJS(config: ExplorerConfig): string {
  const entries = config.content.outcomes.map(o => `
    '${o.key}': {
      title: '${escapeJS(o.title)}',
      icon: '${escapeJS(o.icon)}',
      desc: { small: '${escapeJS(o.description.small)}', medium: '${escapeJS(o.description.medium)}', large: '${escapeJS(o.description.large)}', overlay: '${escapeJS(o.description.overlay)}' }
    }`);
  return `const OUTCOMES = {${entries.join(',')}};`;
}

/**
 * Generate LEARN_CARDS JS array from config
 */
function generateLearnCardsJS(config: ExplorerConfig): string {
  const entries = config.content.learnCards.map(lc => `
    { title: '${escapeJS(lc.title)}', type: '${lc.type}', roles: ${JSON.stringify(lc.roles)}, objectives: ${JSON.stringify(lc.objectives)}, url: '${escapeJS(lc.url)}', desc: { small: '${escapeJS(lc.description.small)}', medium: '${escapeJS(lc.description.medium)}', large: '${escapeJS(lc.description.large)}', overlay: '${escapeJS(lc.description.overlay)}' } }`);
  return `const LEARN_CARDS = [${entries.join(',')}];`;
}

/**
 * Generate SOLUTIONS JS array from config
 */
function generateSolutionsJS(config: ExplorerConfig): string {
  const entries = config.content.solutions.map(s => `
    { id: '${escapeJS(s.id)}', title: '${escapeJS(s.title)}', icon: '${escapeJS(s.icon)}', industries: '${escapeJS(s.industries)}', desc: { small: '${escapeJS(s.description.small)}', medium: '${escapeJS(s.description.medium)}', large: '${escapeJS(s.description.large)}', overlay: '${escapeJS(s.description.overlay)}' } }`);
  return `const SOLUTIONS = [${entries.join(',')}];`;
}

/**
 * Generate branching config JS
 */
function generateBranchingJS(config: ExplorerConfig): string {
  return `
    const topRoles = ${JSON.stringify(config.branching.topRoles)};
    const topPathSteps = ${JSON.stringify(config.branching.topPathSteps)};
    const bottomPathSteps = ${JSON.stringify(config.branching.bottomPathSteps)};
  `;
}

/**
 * Escape single quotes and newlines for JS strings
 */
function escapeJS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

/**
 * Apply config to a template HTML string
 * Replaces placeholder markers with generated content
 */
export function applyConfigToTemplate(templateHTML: string, config: ExplorerConfig): string {
  let html = templateHTML;

  // Replace CSS variables block
  const cssVars = generateCSSVariables(config);
  // The template has :root { ... } block - replace it
  html = html.replace(/:root\s*\{[^}]+\}/, cssVars.split('\n').find(l => l.includes(':root'))?.trim() || '');

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${config.name}</title>`);

  // Replace welcome screen text
  html = html.replace(/Empower Every/, config.splash.title);
  html = html.replace(/Moment\./, config.splash.gradientWord);
  html = html.replace(
    /Discover personalized outcomes, content, and solutions tailored to your needs\./,
    config.splash.subtitle
  );

  // Replace company name in logo alt
  html = html.replace(/alt="Momentify"/g, `alt="${config.branding.companyName}"`);

  // Replace logo URLs
  html = html.replace(
    /src="assets\/Momentify-Logo_Reverse\.svg"/g,
    `src="${config.branding.logo.dark}"`
  );
  html = html.replace(
    /src="assets\/Momentify-Logo\.svg"/g,
    `src="${config.branding.logo.light}"`
  );

  return html;
}

export { generateCSSVariables, generateSplashHTML, generateFormFieldsHTML, generateTraitStepHTML, generateOutcomesJS, generateLearnCardsJS, generateSolutionsJS, generateBranchingJS };

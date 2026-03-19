/* ═══════════════════════════════════════════════════════════════
   Brand Kit — Shared Navigation Logic
   Injects top nav, handles theme toggle, dropdown, mobile menu
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────
  var pages = [
    { label: 'Brand Guidelines', href: 'index.html',         match: ['index.html', '/brand/', '/brand'] },
    { label: 'Design System',    href: 'design-system.html',  match: ['design-system.html'] },
    { label: 'Backgrounds',      href: 'backgrounds.html',    match: ['backgrounds.html'] },
    { label: 'Social Toolkit',   href: '/social-toolkit',     match: ['/social-toolkit'], external: true }
  ];

  var prototypes = [
    { label: 'Explorer Dashboard',  href: '/prototypes/explorer',        external: true },
    { label: 'Explorer (PHIL)',     href: 'explorer-prototype_phil.html' },
    { label: 'Explorer (CAT)',      href: 'explorer-prototype_cat.html' },
    { label: 'Explorer Prototype',  href: 'explorer-prototype.html' },
    { label: 'Web Dashboard',       href: '/dashboard',                  external: true },
    { label: 'Fan Gallery',         href: '/fan-gallery/admin',          external: true },
    { label: 'Email Signature',     href: 'email-signature.html' },
    { label: 'LinkedIn CONEXPO',    href: 'linkedin-conexpo.html' },
    { label: 'ROX Infographic',     href: 'rox-infographic.html' }
  ];

  // ── Detect active page ────────────────────────────────────
  var path = window.location.pathname;
  var file = window.location.pathname.split('/').pop() || 'index.html';
  // If path ends with / or /brand or /brand/, treat as index.html
  if (file === '' || file === 'brand') file = 'index.html';

  function isActive(page) {
    return page.match.some(function (m) {
      if (m.indexOf('/') === 0) return path === m || path === m + '/';
      return file === m;
    });
  }

  // ── Build nav HTML ────────────────────────────────────────
  var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  var toggleLabel = isDark ? 'Light Mode' : 'Dark Mode';

  var linksHtml = pages.map(function (p) {
    var cls = isActive(p) ? ' class="active"' : '';
    var target = p.external ? ' target="_self"' : '';
    return '<a href="' + p.href + '"' + cls + target + '>' + p.label + '</a>';
  }).join('');

  var dropdownItemsHtml = prototypes.map(function (p) {
    return '<a href="' + p.href + '">' + p.label + '</a>';
  }).join('');

  // Check if any prototype is currently open
  var protoActive = prototypes.some(function (p) { return file === p.href; });

  var mobileLinksHtml = pages.map(function (p) {
    var cls = isActive(p) ? ' class="active"' : '';
    return '<a href="' + p.href + '"' + cls + '>' + p.label + '</a>';
  }).join('');

  var mobileProtosHtml = prototypes.map(function (p) {
    var cls = file === p.href ? ' class="active"' : '';
    return '<a href="' + p.href + '"' + cls + '>' + p.label + '</a>';
  }).join('');

  var navHtml = '' +
    '<nav class="brand-topnav">' +
      '<div class="brand-topnav-inner">' +

        /* Logo */
        '<a href="index.html" class="brand-topnav-logo">' +
          '<img class="logo-dark" src="assets/Momentify-Logo_Reverse.svg" alt="Momentify" />' +
          '<img class="logo-light" src="assets/Momentify-Logo.svg" alt="Momentify" />' +
        '</a>' +

        '<div class="brand-topnav-divider"></div>' +

        /* Page links */
        '<div class="brand-topnav-links">' +
          linksHtml +

          /* Prototypes dropdown */
          '<div class="brand-topnav-dropdown" id="brand-dropdown">' +
            '<button class="brand-topnav-dropdown-trigger' + (protoActive ? ' active' : '') + '" id="brand-dropdown-trigger">' +
              'Prototypes' +
              '<svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<div class="brand-topnav-dropdown-menu">' +
              dropdownItemsHtml +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Controls */
        '<div class="brand-topnav-controls">' +
          '<button class="theme-toggle" id="topnav-theme-toggle">' +
            '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>' +
            '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
            '<span class="topnav-toggle-label">' + toggleLabel + '</span>' +
          '</button>' +
        '</div>' +

        /* Hamburger (mobile) */
        '<button class="brand-topnav-hamburger" id="brand-hamburger" aria-label="Menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
        '</button>' +

      '</div>' +
    '</nav>' +

    /* Mobile full-screen menu */
    '<div class="brand-topnav-mobile-menu" id="brand-mobile-menu">' +
      mobileLinksHtml +
      '<div class="mobile-menu-label">Prototypes</div>' +
      mobileProtosHtml +
    '</div>';

  // ── Inject nav ────────────────────────────────────────────
  var mount = document.getElementById('brand-topnav-mount');
  if (mount) {
    mount.innerHTML = navHtml;
  } else {
    // Fallback: insert at start of body
    document.body.insertAdjacentHTML('afterbegin', navHtml);
  }

  // ── Theme toggle ──────────────────────────────────────────
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mk-theme', theme); } catch (e) {}

    var label = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    // Update all toggle labels on page
    var labels = document.querySelectorAll('.topnav-toggle-label, #toggle-label, #header-toggle-label, #nav-toggle-label');
    labels.forEach(function (el) { el.textContent = label; });
  }

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Bind top nav toggle
  var topnavToggle = document.getElementById('topnav-theme-toggle');
  if (topnavToggle) topnavToggle.addEventListener('click', window.toggleTheme);

  // Sync label on load (theme may have been set by head script)
  var savedTheme = localStorage.getItem('mk-theme');
  if (savedTheme) setTheme(savedTheme);

  // ── Dropdown behavior ─────────────────────────────────────
  var dropdown = document.getElementById('brand-dropdown');
  var trigger = document.getElementById('brand-dropdown-trigger');

  if (dropdown && trigger) {
    // Toggle on click
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dropdown.classList.remove('open');
    });
  }

  // ── Mobile hamburger menu ─────────────────────────────────
  var hamburger = document.getElementById('brand-hamburger');
  var mobileMenu = document.getElementById('brand-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      // Swap icon between hamburger and X
      hamburger.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });
  }

})();

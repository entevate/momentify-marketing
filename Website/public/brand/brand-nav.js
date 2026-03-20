/* ═══════════════════════════════════════════════════════════════
   Brand Kit — Shared Navigation Logic + Password Gate
   Injects password protection, top nav, handles theme toggle,
   dropdown, mobile menu
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Password Gate ───────────────────────────────────────────
  var BRAND_PASSWORD = 'momentify2026';
  var AUTH_KEY = 'mk-brand-auth';

  function isAuthenticated() {
    try { return localStorage.getItem(AUTH_KEY) === 'true'; } catch (e) { return false; }
  }

  function showPasswordGate() {
    var gateHtml = '' +
      '<div id="brand-pw-gate">' +
        '<div class="pw-box">' +
          '<div class="pw-logo">' +
            '<img src="assets/Momentify-Logo_Reverse.svg" alt="Momentify" style="height:32px;width:auto;" />' +
          '</div>' +
          '<div class="pw-label">Enter password to continue</div>' +
          '<div class="pw-input-row">' +
            '<input type="password" class="pw-input" id="brand-pw-input" placeholder="Password" autocomplete="off" autofocus />' +
            '<button class="pw-submit" id="brand-pw-submit">Enter</button>' +
          '</div>' +
          '<div class="pw-error-msg" id="brand-pw-error">Incorrect password. Please try again.</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('afterbegin', gateHtml);

    var input = document.getElementById('brand-pw-input');
    var error = document.getElementById('brand-pw-error');
    var gate = document.getElementById('brand-pw-gate');

    function tryAuth() {
      if (input.value === BRAND_PASSWORD) {
        try { localStorage.setItem(AUTH_KEY, 'true'); } catch (e) {}
        gate.classList.add('hidden');
        setTimeout(function () { gate.style.display = 'none'; }, 400);
      } else {
        input.classList.add('error');
        error.classList.add('visible');
        setTimeout(function () { input.classList.remove('error'); }, 400);
        input.select();
      }
    }

    document.getElementById('brand-pw-submit').addEventListener('click', tryAuth);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryAuth();
      error.classList.remove('visible');
    });

    // Focus input after a tick (in case of autofocus race)
    setTimeout(function () { input.focus(); }, 50);
  }

  // Pages can set window.BRAND_SKIP_AUTH = true before loading this script
  // to use their own password gate instead of the brand-wide one
  if (!window.BRAND_SKIP_AUTH && !isAuthenticated()) {
    showPasswordGate();
  }

  // ── Configuration ──────────────────────────────────────────
  var pages = [
    { label: 'Brand Guidelines', href: 'index.html',         match: ['index.html', '/brand/', '/brand'] },
    { label: 'Design System',    href: 'design-system.html',  match: ['design-system.html'] },
    { label: 'Backgrounds',      href: 'backgrounds.html',    match: ['backgrounds.html'] },
    { label: 'Social Toolkit',   href: 'https://www.momentifyapp.com/social-toolkit', match: [], external: true }
  ];

  var graphicLibrary = [
    { label: 'Email Signature',  href: 'email-signature.html' },
    { label: 'ROX Infographic',  href: 'rox-infographic.html' }
  ];

  var prototypes = [
    { label: 'Momentify Web',           href: 'https://www.momentifyapp.com/dashboard/events', external: true },
    { label: 'Momentify Explorer',      href: 'explorer-prototype.html' },
    { label: 'Momentify Fan',           href: 'https://www.momentifyapp.com/fan-gallery/admin', external: true }
  ];

  // ── Detect active page ────────────────────────────────────
  var path = window.location.pathname;
  var file = window.location.pathname.split('/').pop() || 'index.html';
  if (file === '' || file === 'brand') file = 'index.html';

  function isActive(page) {
    return page.match.some(function (m) {
      if (m.indexOf('/') === 0) return path === m || path === m + '/';
      return file === m;
    });
  }

  function isInGroup(items) {
    return items.some(function (item) {
      if (item.children) {
        return item.children.some(function (c) { return file === c.href; });
      }
      return file === item.href;
    });
  }

  // ── Build nav HTML ────────────────────────────────────────
  var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  var toggleLabel = isDark ? 'Light Mode' : 'Dark Mode';

  var linksHtml = pages.map(function (p) {
    var cls = isActive(p) ? ' class="active"' : '';
    var target = p.external ? ' target="_blank" rel="noopener"' : '';
    return '<a href="' + p.href + '"' + cls + target + '>' + p.label + '</a>';
  }).join('');

  // Graphic Library dropdown items
  var glItemsHtml = graphicLibrary.map(function (p) {
    var cls = file === p.href ? ' class="active"' : '';
    return '<a href="' + p.href + '"' + cls + '>' + p.label + '</a>';
  }).join('');

  var glActive = isInGroup(graphicLibrary);

  // Prototypes dropdown items (with nested sub-menu for Explorer)
  var protoItemsHtml = prototypes.map(function (p) {
    if (p.children) {
      var subItems = p.children.map(function (c) {
        var attrs = '';
        if (c.comingSoon) {
          attrs = ' class="coming-soon" onclick="return false"';
        } else if (file === c.href) {
          attrs = ' class="active"';
        }
        var badge = c.comingSoon ? '<span class="coming-soon-badge">Coming Soon</span>' : '';
        return '<a href="' + c.href + '"' + attrs + '>' + c.label + badge + '</a>';
      }).join('');
      var subActive = p.children.some(function (c) { return file === c.href; });
      return '<div class="dropdown-submenu">' +
        '<div class="dropdown-submenu-label' + (subActive ? ' active' : '') + '">' + p.label +
          '<svg viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</div>' +
        '<div class="dropdown-submenu-items">' + subItems + '</div>' +
      '</div>';
    }
    var target = p.external ? ' target="_blank" rel="noopener"' : '';
    var extIcon = p.external ? '<svg class="ext-icon" viewBox="0 0 12 12" fill="none"><path d="M4.5 2H2.5a1 1 0 00-1 1v6.5a1 1 0 001 1H9a1 1 0 001-1V7.5M7 1.5h3.5m0 0V5m0-3.5L6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '';
    return '<a href="' + p.href + '"' + target + '>' + p.label + extIcon + '</a>';
  }).join('');

  var protoActive = isInGroup(prototypes);

  // Dropdown builder helper
  function buildDropdown(id, label, itemsHtml, active) {
    return '<div class="brand-topnav-dropdown" id="' + id + '">' +
      '<button class="brand-topnav-dropdown-trigger' + (active ? ' active' : '') + '" data-dropdown="' + id + '">' +
        label +
        '<svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<div class="brand-topnav-dropdown-menu">' +
        itemsHtml +
      '</div>' +
    '</div>';
  }

  // Mobile links
  var mobileLinksHtml = pages.map(function (p) {
    var cls = isActive(p) ? ' class="active"' : '';
    var target = p.external ? ' target="_blank" rel="noopener"' : '';
    return '<a href="' + p.href + '"' + cls + target + '>' + p.label + '</a>';
  }).join('');

  var mobileGlHtml = graphicLibrary.map(function (p) {
    var cls = file === p.href ? ' class="active"' : '';
    return '<a href="' + p.href + '"' + cls + '>' + p.label + '</a>';
  }).join('');

  var mobileProtosHtml = prototypes.map(function (p) {
    if (p.children) {
      return p.children.map(function (c) {
        if (c.comingSoon) {
          return '<a href="#" class="coming-soon" onclick="return false">' + c.label + '<span class="coming-soon-badge">Coming Soon</span></a>';
        }
        var cls = file === c.href ? ' class="active"' : '';
        return '<a href="' + c.href + '"' + cls + '>' + p.label + ': ' + c.label + '</a>';
      }).join('');
    }
    var cls = file === p.href ? ' class="active"' : '';
    var target = p.external ? ' target="_blank" rel="noopener"' : '';
    return '<a href="' + p.href + '"' + cls + target + '>' + p.label + '</a>';
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
          buildDropdown('dropdown-gl', 'Graphic Library', glItemsHtml, glActive) +
          buildDropdown('dropdown-proto', 'Prototypes', protoItemsHtml, protoActive) +
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
      '<div class="mobile-menu-label">Graphic Library</div>' +
      mobileGlHtml +
      '<div class="mobile-menu-label">Prototypes</div>' +
      mobileProtosHtml +
    '</div>';

  // ── Inject nav ────────────────────────────────────────────
  var mount = document.getElementById('brand-topnav-mount');
  if (mount) {
    mount.innerHTML = navHtml;
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHtml);
  }

  // ── Theme toggle ──────────────────────────────────────────
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mk-theme', theme); } catch (e) {}

    var label = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    var labels = document.querySelectorAll('.topnav-toggle-label, #toggle-label, #header-toggle-label, #nav-toggle-label');
    labels.forEach(function (el) { el.textContent = label; });
  }

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  var topnavToggle = document.getElementById('topnav-theme-toggle');
  if (topnavToggle) topnavToggle.addEventListener('click', window.toggleTheme);

  var savedTheme = localStorage.getItem('mk-theme');
  if (savedTheme) setTheme(savedTheme);

  // ── Dropdown behavior (supports multiple dropdowns) ──────
  var allDropdowns = document.querySelectorAll('.brand-topnav-dropdown');

  allDropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.brand-topnav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = dropdown.classList.contains('open');
      // Close all dropdowns first
      allDropdowns.forEach(function (d) { d.classList.remove('open'); });
      if (!wasOpen) dropdown.classList.toggle('open');
    });
  });

  document.addEventListener('click', function (e) {
    allDropdowns.forEach(function (d) {
      if (!d.contains(e.target)) d.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      allDropdowns.forEach(function (d) { d.classList.remove('open'); });
    }
  });

  // ── Mobile hamburger menu ─────────────────────────────────
  var hamburger = document.getElementById('brand-hamburger');
  var mobileMenu = document.getElementById('brand-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });
  }

})();

(function () {
  'use strict';

  var state = {
    projects: [],
    filters: { status: 'active', theme: 'all', search: '' },
  };

  function inr(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function formatMonth(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
  }

  function load() {
    return fetch('/data/projects.json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        state.projects = (json.projects || []).filter(function (p) {
          if (p.disabled) return false;
          if (p.hiddenFromPublic) return false;
          if (p.enabled === false) return false; // dashboard toggle off
          return true;
        });
        renderHero();
        renderFeatured();
        bindFilters();
        renderGrid();
        renderFuture();
        renderCompleted();
      })
      .catch(function (e) {
        console.error('Failed to load projects', e);
        var grid = document.querySelector('[data-projects-grid]');
        if (grid) grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--color-gray-600);">Projects unavailable. Please try again later.</p>';
      });
  }

  function renderHero() {
    var totals = state.projects.reduce(function (acc, p) {
      (p.impact_metrics || []).forEach(function (m) {
        var lbl = String(m.label || '').toLowerCase();
        var val = Number(m.value || 0);
        if (lbl.indexOf('tree') !== -1) acc.trees += val;
        if (lbl.indexOf('farmer') !== -1) acc.farmers += val;
        if (lbl.indexOf('village') !== -1) acc.villages += val;
      });
      acc.raised += Number((p.fundraising || {}).raised_amount || 0);
      return acc;
    }, { trees: 0, farmers: 0, villages: 0, raised: 0 });
    setText('[data-metric="trees"]',    totals.trees.toLocaleString('en-IN'));
    setText('[data-metric="farmers"]',  totals.farmers.toLocaleString('en-IN'));
    setText('[data-metric="villages"]', totals.villages.toLocaleString('en-IN'));
    setText('[data-metric="raised"]',   inr(totals.raised));
  }
  function setText(sel, val) {
    var el = document.querySelector(sel);
    if (el) el.textContent = val;
  }

  function renderFeatured() {
    var rail = document.querySelector('[data-featured-rail]');
    var track = document.getElementById('featured-track');
    if (!rail || !track) return;
    var featured = state.projects.filter(function (p) { return p.featured && p.status === 'active'; });
    if (featured.length === 0) { rail.hidden = true; return; }
    rail.hidden = false;
    track.innerHTML = featured.map(featuredCard).join('');
    if (featured.length > 1) startCarousel(track, featured.length);
  }

  function featuredCard(p) {
    return (
      '<article class="featured-card">' +
        (p.hero_image_url ? '<img src="' + esc(p.hero_image_url) + '" alt="" loading="lazy">' : '') +
        '<div class="featured-body">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.objective) + '</p>' +
          progressBar(p) +
          '<a class="btn btn-secondary" href="/projects/' + encodeURIComponent(p.slug) + '">Read the full story →</a>' +
        '</div>' +
      '</article>'
    );
  }

  function startCarousel(track, count) {
    var idx = 0;
    setInterval(function () {
      idx = (idx + 1) % count;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    }, 7000);
  }

  function bindFilters() {
    document.querySelectorAll('[data-status-pills] button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('[data-status-pills] button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        state.filters.status = b.dataset.status;
        renderGrid();
      });
    });
    document.querySelectorAll('[data-theme-pills] button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('[data-theme-pills] button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        state.filters.theme = b.dataset.theme;
        renderGrid();
      });
    });
    var search = document.querySelector('[data-search]');
    if (search) {
      search.addEventListener('input', function () {
        state.filters.search = String(search.value || '').toLowerCase();
        renderGrid();
      });
    }
  }

  function renderGrid() {
    var grid = document.querySelector('[data-projects-grid]');
    if (!grid) return;
    var filtered = state.projects.filter(function (p) {
      if (state.filters.status !== 'all' && p.status !== state.filters.status) return false;
      if (state.filters.theme !== 'all' && p.theme !== state.filters.theme) return false;
      if (state.filters.search) {
        var hay = (p.name + ' ' + p.objective).toLowerCase();
        if (hay.indexOf(state.filters.search) === -1) return false;
      }
      return true;
    });
    grid.innerHTML = filtered.length
      ? filtered.map(projectCard).join('')
      : '<p style="text-align:center;grid-column:1/-1;color:var(--color-gray-600);">No projects match these filters.</p>';
  }

  function projectCard(p) {
    var metrics = p.impact_metrics || [];
    var m1 = metrics[0], m2 = metrics[1];
    return (
      '<article class="project-card" data-theme="' + esc(p.theme) + '">' +
        '<a href="/projects/' + encodeURIComponent(p.slug) + '" class="project-card-img-link">' +
          (p.hero_image_url ? '<img src="' + esc(p.hero_image_url) + '" alt="" loading="lazy">' : '<div class="project-card-img-placeholder"></div>') +
        '</a>' +
        '<div class="project-card-body">' +
          '<div class="project-card-meta">' +
            '<span class="chip chip-theme theme-' + esc(p.theme) + '">' + esc(p.theme) + '</span>' +
            '<span class="chip chip-status status-' + esc(p.status) + '">' + esc(p.status) + '</span>' +
          '</div>' +
          '<h3><a href="/projects/' + encodeURIComponent(p.slug) + '">' + esc(p.name) + '</a></h3>' +
          '<p class="project-card-objective">' + esc(p.objective) + '</p>' +
          '<p class="project-card-where">' + esc(p.location) + ' · Started ' + esc(formatMonth(p.start_date)) + '</p>' +
          metricsBlock(m1, m2) +
          progressBar(p) +
          '<div class="project-card-cta">' +
            '<a href="donate.html?project=' + encodeURIComponent(p.slug) + '" class="btn btn-primary">Donate to this project</a>' +
            '<a href="/projects/' + encodeURIComponent(p.slug) + '" class="btn btn-outline">Read the full story →</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function metricsBlock(m1, m2) {
    if (!m1 && !m2) return '';
    function row(m) {
      if (!m) return '';
      var v = Number(m.value || 0).toLocaleString('en-IN');
      var unit = m.unit ? ' ' + esc(m.unit) : '';
      return '<li><strong>' + v + unit + '</strong><span>' + esc(m.label) + '</span></li>';
    }
    return '<ul class="project-card-metrics">' + row(m1) + row(m2) + '</ul>';
  }

  function progressBar(p) {
    var f = p.fundraising || {};
    if (!f.show_progress || !f.target_amount) return '';
    var pct = Math.min(100, Math.round((Number(f.raised_amount || 0) / Number(f.target_amount)) * 100));
    return (
      '<div class="progress" aria-label="Funding progress"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
      '<p class="progress-meta">' + inr(f.raised_amount) + ' of ' + inr(f.target_amount) + ' · ' + (Number(f.donor_count) || 0) + ' donors · ' + pct + '% funded</p>'
    );
  }

  function renderFuture() {
    var section = document.querySelector('[data-future-section]');
    var grid = document.querySelector('[data-future-grid]');
    if (!section || !grid) return;
    var future = state.projects.filter(function (p) { return p.status === 'planning'; });
    if (future.length === 0) { section.hidden = true; return; }
    section.hidden = false;
    grid.innerHTML = future.map(futureCard).join('');
  }

  function futureCard(p) {
    var rows = [];
    if (p.proposed_budget) rows.push('<li><strong>' + inr(p.proposed_budget) + '</strong> proposed budget</li>');
    if (p.expected_beneficiaries) rows.push('<li><strong>' + esc(p.expected_beneficiaries) + '</strong> expected beneficiaries</li>');
    if (p.required_volunteers) rows.push('<li><strong>' + p.required_volunteers + '</strong> volunteers needed</li>');
    if (p.start_date) rows.push('<li>Target start: ' + esc(formatMonth(p.start_date)) + '</li>');
    return (
      '<article class="project-card project-card-future" data-theme="' + esc(p.theme) + '">' +
        (p.hero_image_url ? '<img src="' + esc(p.hero_image_url) + '" alt="" loading="lazy">' : '') +
        '<div class="project-card-body">' +
          '<span class="chip chip-theme theme-' + esc(p.theme) + '">' + esc(p.theme) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="project-card-objective">' + esc(p.objective) + '</p>' +
          (rows.length ? '<ul class="future-meta">' + rows.join('') + '</ul>' : '') +
          progressBar(p) +
          '<div class="project-card-cta">' +
            '<a href="contact.html?subject=' + encodeURIComponent('Sponsor ' + p.name) + '" class="btn btn-primary">Become a sponsor</a>' +
            '<a href="/projects/' + encodeURIComponent(p.slug) + '" class="btn btn-outline">Read more →</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCompleted() {
    var section = document.querySelector('[data-completed-section]');
    var list = document.querySelector('[data-completed-list]');
    var countEl = document.querySelector('[data-completed-count]');
    if (!section || !list) return;
    var completed = state.projects.filter(function (p) { return p.status === 'completed'; });
    if (completed.length === 0) { section.hidden = true; return; }
    section.hidden = false;
    if (countEl) countEl.textContent = '(' + completed.length + ')';
    list.innerHTML = completed.map(function (p) {
      var headline = (p.impact_metrics || [])[0];
      var headlineStr = headline ? Number(headline.value).toLocaleString('en-IN') + ' ' + esc(headline.label) : '';
      var endStr = p.end_date ? formatMonth(p.end_date) : 'ongoing';
      return (
        '<li><a href="/projects/' + encodeURIComponent(p.slug) + '">' +
          '<strong>' + esc(p.name) + '</strong>' +
          '<span class="completed-dates">' + esc(formatMonth(p.start_date)) + ' – ' + esc(endStr) + '</span>' +
          '<span class="completed-stat">' + headlineStr + '</span>' +
          '<span class="completed-link">View results →</span>' +
        '</a></li>'
      );
    }).join('');
  }

  load();
})();

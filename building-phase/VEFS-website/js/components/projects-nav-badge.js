(function () {
  var PROJECTS_LAUNCH_DATE = '2026-06-20';
  var PROJECTS_BADGE_DAYS = 60;

  function init() {
    var launchTs = new Date(PROJECTS_LAUNCH_DATE + 'T00:00:00Z').getTime();
    var ageDays = (Date.now() - launchTs) / (24 * 60 * 60 * 1000);
    if (ageDays < 0 || ageDays >= PROJECTS_BADGE_DAYS) return;

    var slots = document.querySelectorAll('#projects-nav-new, .projects-nav-new-slot');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (slot.dataset.injected) continue;
      slot.dataset.injected = '1';
      slot.innerHTML = '<span class="badge-new">NEW</span>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

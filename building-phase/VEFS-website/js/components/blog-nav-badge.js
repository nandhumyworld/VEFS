(function () {
  var BLOG_LAUNCH_DATE = '2026-06-05';
  var BLOG_BADGE_DAYS = 60;

  function init() {
    var launchTs = new Date(BLOG_LAUNCH_DATE + 'T00:00:00Z').getTime();
    var ageDays = (Date.now() - launchTs) / (24 * 60 * 60 * 1000);
    if (ageDays < 0 || ageDays >= BLOG_BADGE_DAYS) return;

    var slots = document.querySelectorAll('#blog-nav-new, .blog-nav-new-slot');
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

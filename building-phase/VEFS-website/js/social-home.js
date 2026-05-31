(async function() {
    const PER_BATCH = 9;
    const grid = document.getElementById('home-social-grid');
    const more = document.getElementById('social-load-more');
    if (!grid) return;

    let posts;
    try {
        const res = await fetch('/data/social.json?v=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        posts = (data.posts || []).filter(p => p.enabled !== false).slice().sort((a, b) => (a.order ?? 9e9) - (b.order ?? 9e9));
    } catch (e) {
        grid.closest('section').hidden = true; return;
    }
    if (posts.length === 0) { grid.closest('section').hidden = true; return; }

    const ICONS = {
        youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" aria-label="YouTube"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
        instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#E4405F" aria-label="Instagram"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.3.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.3-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.3-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.3.2-.6.5-1 1-1.5s.9-.8 1.5-1c.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.4a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm5.6-.7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>',
        facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" aria-label="Facebook"><path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 3h-2.3v6.9A10 10 0 0 0 22 12z"/></svg>',
    };

    let shown = 0;
    function renderBatch() {
        const batch = posts.slice(shown, shown + PER_BATCH);
        const cld = (u) => (typeof u === 'string' && u.includes('res.cloudinary.com')) ? u.replace('/upload/', '/upload/f_auto,q_auto,w_500/') : u;
        const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const html = batch.map(p => `
            <a class="social-card social-card-${esc(p.platform)}" href="${esc(p.post_url)}" target="_blank" rel="noopener noreferrer">
                <div class="social-card-thumb-wrap">
                    <img class="social-card-thumb" src="${cld(p.thumbnail_url)}" alt="" loading="lazy">
                    <span class="social-card-badge">${ICONS[p.platform] || ''}</span>
                </div>
                <p class="social-card-caption">${esc(p.caption || '')}</p>
            </a>`).join('');
        grid.insertAdjacentHTML('beforeend', html);
        shown += batch.length;
        if (shown < posts.length) more.hidden = false; else more.hidden = true;
    }
    renderBatch();
    more.addEventListener('click', renderBatch);
})();

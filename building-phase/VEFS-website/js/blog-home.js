(async function() {
    const grid = document.getElementById('home-blog-grid');
    if (!grid) return;
    try {
        const res = await fetch('/data/blog.json?v=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        const posts = (data.posts || []).filter(p => p.enabled !== false).slice().sort((a, b) => (a.order ?? 9e9) - (b.order ?? 9e9)).slice(0, 3);
        if (posts.length === 0) { grid.closest('section').hidden = true; return; }
        const cld = (u) => (typeof u === 'string' && u.includes('res.cloudinary.com')) ? u.replace('/upload/', '/upload/f_auto,q_auto,w_600/') : u;
        const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        grid.innerHTML = posts.map(p => `
            <article class="blog-card">
                <a class="blog-card-link" href="/blog/${encodeURIComponent(p.id)}">
                    ${p.cover_image_url ? `<img class="blog-card-cover" src="${cld(p.cover_image_url)}" alt="" loading="lazy" width="600" height="375">` : ''}
                    <div class="blog-card-body">
                        <h3 class="blog-card-title">${esc(p.title || '')}${renderNewBadge(p)}</h3>
                        ${p.subtitle ? `<p class="blog-card-subtitle">${esc(p.subtitle)}</p>` : ''}
                    </div>
                </a>
            </article>`).join('');
    } catch (e) { grid.closest('section').hidden = true; }
})();

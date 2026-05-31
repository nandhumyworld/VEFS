(async function() {
    const PER_PAGE = 6;
    const grid = document.getElementById('blog-grid');
    const pagi = document.getElementById('blog-pagination');
    const empty = document.getElementById('blog-empty');

    const params = new URLSearchParams(location.search);
    const page = Math.max(1, parseInt(params.get('page') || '1', 10));

    let data;
    try {
        const res = await fetch('/data/blog.json?v=' + Date.now(), { cache: 'no-store' });
        data = await res.json();
    } catch (e) {
        empty.textContent = 'Could not load blog posts.';
        empty.hidden = false;
        return;
    }

    const posts = (data.posts || []).filter(p => p.enabled !== false).slice().sort((a, b) => (a.order ?? 9e9) - (b.order ?? 9e9));
    if (posts.length === 0) { empty.hidden = false; return; }

    const totalPages = Math.ceil(posts.length / PER_PAGE);
    const safePage = Math.min(page, totalPages);
    const slice = posts.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    function cldOpt(url) {
        if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
        return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
    }

    grid.innerHTML = slice.map(p => `
        <article class="blog-card">
            <a class="blog-card-link" href="/blog/${encodeURIComponent(p.id)}">
                ${p.cover_image_url ? `<img class="blog-card-cover" src="${cldOpt(p.cover_image_url)}" alt="" loading="lazy" width="800" height="500">` : ''}
                <div class="blog-card-body">
                    <h2 class="blog-card-title">${escapeHtml(p.title || '')}</h2>
                    ${p.subtitle ? `<p class="blog-card-subtitle">${escapeHtml(p.subtitle)}</p>` : ''}
                    <p class="blog-card-meta">${formatDate(p.published_at)}</p>
                    <span class="blog-card-cta">Read more →</span>
                </div>
            </a>
        </article>
    `).join('');

    // Pagination
    if (totalPages > 1) {
        const links = [];
        for (let i = 1; i <= totalPages; i++) {
            links.push(`<a href="?page=${i}" class="${i===safePage?'active':''}">${i}</a>`);
        }
        pagi.innerHTML = links.join('');
    }

    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function formatDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return ''; }
    }
})();

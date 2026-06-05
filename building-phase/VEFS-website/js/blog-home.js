(function () {
    const PUBLISH_FIELD = 'published_at';

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
    const escAttr = esc;

    const cld = (u) => (typeof u === 'string' && u.includes('res.cloudinary.com'))
        ? u.replace('/upload/', '/upload/f_auto,q_auto,w_800/')
        : u;

    function formatDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function renderBadge(p) {
        if (typeof window.renderNewBadge === 'function') {
            try { return window.renderNewBadge(p) || ''; } catch (e) { return ''; }
        }
        return '';
    }

    async function loadBlogSlider() {
        const track = document.getElementById('blog-slider-track');
        if (!track) return;

        let posts = [];
        try {
            const res = await fetch('/data/blog.json?v=' + Date.now(), { cache: 'no-store' });
            const data = await res.json();
            posts = (data.posts || [])
                .filter(p => !p.disabled && !p.hiddenFromPublic && p.enabled !== false)
                .sort((a, b) => new Date(b[PUBLISH_FIELD] || 0) - new Date(a[PUBLISH_FIELD] || 0))
                .slice(0, 10);
        } catch (e) {
            const section = track.closest('section');
            if (section) section.hidden = true;
            return;
        }

        if (posts.length === 0) {
            const section = track.closest('section');
            if (section) section.hidden = true;
            return;
        }

        track.innerHTML = posts.map(p => `
            <article class="blog-slider__slide">
                <a href="/blog/${encodeURIComponent(p.slug || p.id)}">
                    ${p.cover_image_url ? `<img src="${escAttr(cld(p.cover_image_url))}" alt="" loading="lazy">` : ''}
                    <h3>${esc(p.title || '')}${renderBadge(p)}</h3>
                    <p class="date">${esc(formatDate(p[PUBLISH_FIELD]))}</p>
                </a>
            </article>
        `).join('');

        wireSlider(track, posts.length);
    }

    function wireSlider(track, total) {
        const frame = track.parentElement;
        const prev = frame.querySelector('.blog-slider__arrow--prev');
        const next = frame.querySelector('.blog-slider__arrow--next');
        let i = 0;

        function go(delta) {
            i = Math.max(0, Math.min(total - 1, i + delta));
            track.style.transform = `translateX(-${i * 100}%)`;
            if (prev) prev.disabled = (i === 0);
            if (next) next.disabled = (i === total - 1);
        }
        go(0);

        if (prev) prev.addEventListener('click', () => go(-1));
        if (next) next.addEventListener('click', () => go(+1));

        frame.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); }
        });

        let startX = null;
        frame.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        frame.addEventListener('touchend', e => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) go(dx < 0 ? +1 : -1);
            startX = null;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBlogSlider);
    } else {
        loadBlogSlider();
    }
})();

(function () {
    const PUBLISH_FIELD = 'published_at';
    const VISIBLE = 3;
    const AUTO_MS = 5000;

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
    const escAttr = esc;

    const cld = (u) => (typeof u === 'string' && u.includes('res.cloudinary.com'))
        ? u.replace('/upload/', '/upload/f_auto,q_auto,w_600,h_400,c_fill/')
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

    function slideMarkup(p) {
        return `
            <article class="blog-slider__slide">
                <a href="/blog/${encodeURIComponent(p.slug || p.id)}">
                    ${p.cover_image_url ? `<img src="${escAttr(cld(p.cover_image_url))}" alt="${escAttr(p.title || '')}" loading="lazy">` : ''}
                    <div class="blog-slider__slide-body">
                        <h3>${esc(p.title || '')}${renderBadge(p)}</h3>
                        <p class="date">${esc(formatDate(p[PUBLISH_FIELD]))}</p>
                    </div>
                </a>
            </article>
        `;
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

        // If we have <= VISIBLE posts, no carousel — render as static row.
        if (posts.length <= VISIBLE) {
            track.innerHTML = posts.map(slideMarkup).join('');
            const frame = track.parentElement;
            frame.querySelectorAll('.blog-slider__arrow').forEach(b => b.style.display = 'none');
            return;
        }

        // Clone the first VISIBLE posts at the end for seamless wrap.
        const carouselPosts = posts.concat(posts.slice(0, VISIBLE));
        track.innerHTML = carouselPosts.map(slideMarkup).join('');

        wireCarousel(track, posts.length);
    }

    function wireCarousel(track, realCount) {
        const frame = track.parentElement;
        const prev = frame.querySelector('.blog-slider__arrow--prev');
        const next = frame.querySelector('.blog-slider__arrow--next');
        let i = 0;
        let timer = null;
        let paused = false;

        function stepWidth() {
            // Width of one slide + gap (computed from rendered DOM for accuracy).
            const slide = track.querySelector('.blog-slider__slide');
            if (!slide) return 0;
            const style = getComputedStyle(track);
            const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
            return slide.getBoundingClientRect().width + gap;
        }

        function applyTransform(animated) {
            track.style.transition = animated ? 'transform 0.5s ease' : 'none';
            track.style.transform = `translateX(-${i * stepWidth()}px)`;
        }

        function go(delta) {
            i += delta;
            applyTransform(true);

            // After reaching cloned tail, snap back to real start (no animation).
            if (i >= realCount) {
                // Wait for transition, then snap.
                setTimeout(() => {
                    i = i - realCount;
                    applyTransform(false);
                }, 520);
            } else if (i < 0) {
                // Going backwards past the start — jump to end first (without animation),
                // then animate to the previous real index.
                i = i + realCount;
                applyTransform(false);
                // Force reflow then re-animate from the new position.
                void track.offsetWidth;
            }
        }

        function startAuto() {
            stopAuto();
            timer = setInterval(() => { if (!paused) go(+1); }, AUTO_MS);
        }
        function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

        // Initial position
        applyTransform(false);

        if (prev) prev.addEventListener('click', () => { go(-1); startAuto(); });
        if (next) next.addEventListener('click', () => { go(+1); startAuto(); });

        // Pause on hover / focus / hidden tab.
        ['mouseenter', 'focusin'].forEach(ev =>
            frame.addEventListener(ev, () => { paused = true; }));
        ['mouseleave', 'focusout'].forEach(ev =>
            frame.addEventListener(ev, () => { paused = false; }));
        document.addEventListener('visibilitychange',
            () => { paused = document.visibilityState !== 'visible'; });

        // Keyboard arrow keys when frame focused.
        frame.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); startAuto(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(+1); startAuto(); }
        });

        // Touch swipe.
        let startX = null;
        frame.addEventListener('touchstart', e => { startX = e.touches[0].clientX; paused = true; }, { passive: true });
        frame.addEventListener('touchend', e => {
            if (startX !== null) {
                const dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 40) go(dx < 0 ? +1 : -1);
                startX = null;
            }
            paused = false;
        });

        // Recompute on resize so the transform uses the new card width.
        window.addEventListener('resize', () => applyTransform(false));

        startAuto();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBlogSlider);
    } else {
        loadBlogSlider();
    }
})();

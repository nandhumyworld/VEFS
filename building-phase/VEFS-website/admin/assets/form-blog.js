(function() {
    const { wireImagePicker, uploadToCloudinary, postJSON, toast } = window.VEFS;

    function slugify(s) {
        return s.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    const titleEl = document.getElementById('title');
    const slugEl = document.getElementById('slug');
    const shareEl = document.getElementById('share-url');
    const originalIdEl = document.querySelector('[name=original_id]');
    let userEditedSlug = !!originalIdEl.value;

    slugEl.addEventListener('input', () => { userEditedSlug = true; shareEl.textContent = '/blog/' + slugEl.value; });
    titleEl.addEventListener('input', () => {
        if (!userEditedSlug) {
            slugEl.value = slugify(titleEl.value);
            shareEl.textContent = '/blog/' + slugEl.value;
        }
    });

    document.getElementById('copy-share').addEventListener('click', () => {
        navigator.clipboard.writeText(location.origin + shareEl.textContent);
        toast('Link copied');
    });

    // Cover image
    wireImagePicker(
        document.getElementById('cover-picker'),
        document.getElementById('cover-url'),
        document.getElementById('cover-preview'),
        document.getElementById('cover-status'),
    );

    // Body toolbar
    const body = document.getElementById('body');
    function wrap(beforeAfter) {
        const [before, after] = beforeAfter.split('|');
        const start = body.selectionStart, end = body.selectionEnd;
        const sel = body.value.slice(start, end);
        body.value = body.value.slice(0, start) + before + sel + after + body.value.slice(end);
        body.focus();
        body.selectionStart = start + before.length;
        body.selectionEnd = end + before.length;
        refreshPreview();
    }
    document.querySelectorAll('.toolbar [data-wrap]').forEach(b => b.addEventListener('click', () => wrap(b.dataset.wrap.replace(/\\n/g, '\n'))));
    document.getElementById('link-btn').addEventListener('click', () => {
        const url = prompt('Link URL (https://…)');
        if (!url) return;
        wrap('<a href="' + url + '">|</a>');
    });

    // Inline image
    const inlinePicker = document.getElementById('inline-img-picker');
    const inlineStatus = document.getElementById('inline-status');
    document.getElementById('insert-img-btn').addEventListener('click', () => inlinePicker.click());
    inlinePicker.addEventListener('change', async () => {
        const file = inlinePicker.files[0]; if (!file) return;
        try {
            const url = await uploadToCloudinary(file, inlineStatus);
            const start = body.selectionStart;
            const tag = '<img src="' + url + '" alt="">';
            body.value = body.value.slice(0, start) + tag + body.value.slice(start);
            refreshPreview();
            setTimeout(() => { inlineStatus.textContent = ''; }, 2000);
        } catch (e) { toast(e.message, true); }
        inlinePicker.value = '';
    });

    // Live preview
    const preview = document.getElementById('preview');
    function refreshPreview() { preview.innerHTML = body.value; }
    body.addEventListener('input', refreshPreview);
    refreshPreview();

    // Reference links
    const refs = document.getElementById('ref-rows');
    function addRef(label = '', url = '') {
        const row = document.createElement('div');
        row.className = 'repeat-row';
        row.innerHTML = '<input type="text" placeholder="Label"><input type="url" placeholder="https://…"><button type="button" class="btn btn-ghost">×</button>';
        const [labelEl, urlEl, rmBtn] = row.children;
        labelEl.value = label; urlEl.value = url;
        rmBtn.addEventListener('click', () => row.remove());
        refs.appendChild(row);
    }
    (window.VEFS_INITIAL_REFS || []).forEach(r => addRef(r.label || '', r.url || ''));
    document.getElementById('add-ref').addEventListener('click', () => addRef());

    // Submit
    document.getElementById('blog-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const refLinks = Array.from(refs.querySelectorAll('.repeat-row')).map(row => ({
            label: row.children[0].value.trim(),
            url: row.children[1].value.trim(),
        })).filter(r => r.label || r.url);

        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'blog',
            original_id: originalIdEl.value || null,
            data: {
                id: slugEl.value || slugify(titleEl.value),
                order: parseInt(document.getElementById('order').value, 10) || 0,
                title: titleEl.value,
                subtitle: document.getElementById('subtitle').value,
                cover_image_url: document.getElementById('cover-url').value,
                body_html: body.value,
                reference_links: refLinks,
                cta_text: document.getElementById('cta_text').value,
                cta_url: document.getElementById('cta_url').value,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=blog';
        } catch (e) { toast(e.message, true); }
    });
})();

(function() {
    const { wireImagePicker, postJSON, toast } = window.VEFS;

    wireImagePicker(
        document.getElementById('thumb-picker'),
        document.getElementById('thumb-url'),
        document.getElementById('thumb-preview'),
        document.getElementById('thumb-status'),
    );

    const platformEl = document.getElementById('platform');
    const ytBtn = document.getElementById('yt-thumb-btn');
    const thumbHint = document.getElementById('thumb-hint');
    function syncPlatformUI() {
        const isYT = platformEl.value === 'youtube';
        ytBtn.style.display = isYT ? '' : 'none';
        thumbHint.style.display = isYT ? 'none' : 'block';
    }
    platformEl.addEventListener('change', syncPlatformUI);
    syncPlatformUI();

    ytBtn.addEventListener('click', () => {
        const url = document.getElementById('post_url').value;
        const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
        if (!m) { toast('Could not detect YouTube video id from Post URL', true); return; }
        const thumb = 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg';
        document.getElementById('thumb-url').value = thumb;
        const img = document.getElementById('thumb-preview');
        img.src = thumb; img.style.display = 'block';
        document.getElementById('thumb-status').textContent = 'YouTube thumbnail loaded';
    });

    document.getElementById('social-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'social',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                platform: document.getElementById('platform').value,
                post_url: document.getElementById('post_url').value,
                thumbnail_url: document.getElementById('thumb-url').value,
                caption: document.getElementById('caption').value,
                order: parseInt(document.getElementById('order').value, 10) || 0,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=social';
        } catch (e) { toast(e.message, true); }
    });
})();

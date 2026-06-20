(function () {
    const { wireImagePicker, uploadToCloudinary, postJSON, toast, repeatableRows } = window.VEFS;

    wireImagePicker(
        document.getElementById('hero-picker'),
        document.getElementById('hero-url'),
        document.getElementById('hero-preview'),
        document.getElementById('hero-status'),
    );

    // Objective char counter
    const objective = document.getElementById('objective');
    const objectiveCount = document.getElementById('objective-count');
    const updateCount = () => { objectiveCount.textContent = String(objective.value.length); };
    objective.addEventListener('input', updateCount);
    updateCount();

    // Status-driven visibility toggle
    const statusSel = document.getElementById('status');
    function applyStatusVisibility() {
        document.querySelectorAll('[data-show-when]').forEach((el) => {
            const [field, val] = el.dataset.showWhen.split('=');
            const node = document.getElementById(field);
            el.style.display = node && node.value === val ? '' : 'none';
        });
    }
    statusSel.addEventListener('change', applyStatusVisibility);
    applyStatusVisibility();

    // Impact metrics — repeatable rows via existing helper
    const metrics = repeatableRows(
        document.getElementById('metrics-rows'),
        [
            { name: 'label', placeholder: 'Label (e.g. Trees planted)' },
            { name: 'value', placeholder: 'Value (numeric)' },
            { name: 'unit',  placeholder: 'Unit (optional)' },
            { name: 'icon',  placeholder: 'Icon (optional)' },
        ],
        window.VEFS_INITIAL.impact_metrics || [],
        document.getElementById('add-metric'),
    );

    // Photos — custom multi-upload manager (Cloudinary once, caption per row)
    const photosContainer = document.getElementById('photos-rows');
    const photosState = (window.VEFS_INITIAL.photos || []).map((p) => ({
        url: p.url || '',
        caption: p.caption || '',
    }));

    function renderPhotos() {
        photosContainer.innerHTML = '';
        photosState.forEach((row, i) => {
            const div = document.createElement('div');
            div.className = 'photo-row';
            div.innerHTML = `
                <img src="${row.url}" alt="" style="max-width:140px;display:block;margin:0.5rem 0">
                <input type="text" placeholder="Caption" value="${escapeAttr(row.caption)}" data-photo-caption="${i}">
                <button type="button" class="btn btn-ghost" data-photo-remove="${i}">Remove</button>
            `;
            photosContainer.appendChild(div);
        });
        photosContainer.querySelectorAll('[data-photo-caption]').forEach((inp) => {
            inp.addEventListener('input', () => {
                photosState[Number(inp.dataset.photoCaption)].caption = inp.value;
            });
        });
        photosContainer.querySelectorAll('[data-photo-remove]').forEach((btn) => {
            btn.addEventListener('click', () => {
                photosState.splice(Number(btn.dataset.photoRemove), 1);
                renderPhotos();
            });
        });
    }
    function escapeAttr(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    renderPhotos();

    document.getElementById('add-photo').addEventListener('click', () => {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = 'image/jpeg,image/png,image/webp';
        picker.addEventListener('change', async () => {
            const file = picker.files[0];
            if (!file) return;
            try {
                const url = await uploadToCloudinary(file, null);
                photosState.push({ url, caption: '' });
                renderPhotos();
            } catch (e) { toast(e.message, true); }
        });
        picker.click();
    });

    function numOrNull(v) {
        const s = String(v).trim();
        if (s === '') return null;
        const n = Number(s);
        return Number.isFinite(n) ? n : null;
    }
    function intOrNull(v) {
        const s = String(v).trim();
        if (s === '') return null;
        const n = parseInt(s, 10);
        return Number.isFinite(n) ? n : null;
    }

    document.getElementById('project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = statusSel.value;
        const isPlanning = status === 'planning';
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'project',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value.trim(),
                name: document.getElementById('name').value.trim(),
                objective: document.getElementById('objective').value.trim(),
                story: document.getElementById('story').value,
                theme: document.getElementById('theme').value,
                status: status,
                location: document.getElementById('location').value.trim(),
                start_date: document.getElementById('start_date').value,
                end_date: document.getElementById('end_date').value,
                hero_image_url: document.getElementById('hero-url').value,
                photos: photosState.filter((p) => p.url).map((p) => ({ url: p.url, caption: p.caption })),
                impact_metrics: metrics.readAll()
                    .filter((m) => (m.label || '').trim() !== '' || String(m.value || '').trim() !== '')
                    .map((m) => ({
                        label: m.label || '',
                        value: numOrNull(m.value),
                        unit: m.unit || '',
                        icon: m.icon || '',
                    })),
                fundraising: {
                    target_amount: numOrNull(document.getElementById('target_amount').value) || 0,
                    raised_amount: numOrNull(document.getElementById('raised_amount').value) || 0,
                    donor_count: intOrNull(document.getElementById('donor_count').value) || 0,
                    show_progress: document.getElementById('show_progress').checked,
                },
                proposed_budget: isPlanning ? numOrNull(document.getElementById('proposed_budget').value) : null,
                expected_beneficiaries: isPlanning ? (document.getElementById('expected_beneficiaries').value || null) : null,
                required_volunteers: isPlanning ? intOrNull(document.getElementById('required_volunteers').value) : null,
                sponsorship_opportunities: isPlanning ? (document.getElementById('sponsorship_opportunities').value || null) : null,
                featured: document.getElementById('featured').checked,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                disabled: document.getElementById('disabled').checked,
                hiddenFromPublic: document.getElementById('hiddenFromPublic').checked,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=project';
        } catch (e) { toast(e.message, true); }
    });
})();

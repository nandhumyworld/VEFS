// VEFS admin client. Vanilla JS, no dependencies.
// Cloudinary cloud_name + preset are injected via window.VEFS_CONFIG by the page.

const cfg = window.VEFS_CONFIG || {};

function toast(msg, isError = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (isError ? ' error' : '');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

async function uploadToCloudinary(file, statusEl) {
    if (!cfg.cloudinary || !cfg.cloudinary.cloud_name || !cfg.cloudinary.upload_preset) {
        throw new Error('Cloudinary not configured');
    }
    if (statusEl) statusEl.textContent = 'Uploading…';
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', cfg.cloudinary.upload_preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudinary.cloud_name}/image/upload`, {
        method: 'POST',
        body: form,
    });
    if (!res.ok) {
        if (statusEl) statusEl.textContent = '';
        const errText = await res.text();
        throw new Error('Cloudinary upload failed: ' + errText.slice(0, 200));
    }
    const json = await res.json();
    if (statusEl) statusEl.textContent = 'Uploaded ✓';
    return json.secure_url;
}

function wireImagePicker(pickerInput, urlInput, previewImg, statusEl) {
    pickerInput.addEventListener('change', async () => {
        const file = pickerInput.files[0];
        if (!file) return;
        try {
            const url = await uploadToCloudinary(file, statusEl);
            urlInput.value = url;
            if (previewImg) { previewImg.src = url; previewImg.style.display = 'block'; }
        } catch (e) {
            toast(e.message, true);
        }
    });
}

function postJSON(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
    }).then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || ('HTTP ' + r.status));
        return data;
    });
}

// Dashboard wiring
function wireDashboard() {
    const table = document.querySelector('.admin-table');
    if (!table) return;
    const csrf = table.dataset.csrf;
    const type = table.dataset.type;

    table.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('tr');
            const id = row.dataset.id;
            if (!confirm('Delete this post? This cannot be undone (but a backup is kept).')) return;
            try {
                await postJSON('/admin/api/delete.php', { csrf, type, id });
                row.remove();
                toast('Deleted');
            } catch (e) { toast(e.message, true); }
        });
    });

    table.querySelectorAll('.order-input').forEach(input => {
        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                const row = input.closest('tr');
                try {
                    await postJSON('/admin/api/reorder.php', {
                        csrf, type, id: row.dataset.id, order: parseInt(input.value, 10) || 0,
                    });
                    toast('Order updated');
                } catch (e) { toast(e.message, true); }
            }, 600);
        });
    });

    table.querySelectorAll('.arrow-up, .arrow-down').forEach(btn => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('tr');
            const otherRow = btn.classList.contains('arrow-up') ? row.previousElementSibling : row.nextElementSibling;
            if (!otherRow) return;
            try {
                await postJSON('/admin/api/reorder.php', {
                    csrf, type,
                    swap: [row.dataset.id, otherRow.dataset.id],
                });
                location.reload();
            } catch (e) { toast(e.message, true); }
        });
    });
}

document.addEventListener('DOMContentLoaded', wireDashboard);

/**
 * Manages a list of repeatable rows of inputs.
 *
 * @param {HTMLElement} container - DOM element to append rows to.
 * @param {Array<{name:string, placeholder:string, type?:string}>} fields - Field definitions.
 * @param {Array<Object>} initial - Initial values; one object per row, keyed by field name.
 * @param {HTMLElement} addBtn - Button that triggers adding a new empty row.
 * @returns {{ readAll: () => Array<Object>, addRow: (vals?: Object) => void }}
 */
function repeatableRows(container, fields, initial, addBtn) {
    function addRow(vals = {}) {
        const row = document.createElement('div');
        row.className = 'repeat-row';
        fields.forEach(f => {
            const input = document.createElement(f.type === 'textarea' ? 'textarea' : 'input');
            if (f.type && f.type !== 'textarea') input.type = f.type;
            input.placeholder = f.placeholder;
            input.dataset.field = f.name;
            input.value = vals[f.name] || '';
            row.appendChild(input);
        });
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn btn-ghost';
        rm.textContent = '×';
        rm.title = 'Remove row';
        rm.addEventListener('click', () => row.remove());
        row.appendChild(rm);
        container.appendChild(row);
    }
    (initial || []).forEach(addRow);
    if (addBtn) addBtn.addEventListener('click', () => addRow());
    function readAll() {
        return Array.from(container.querySelectorAll('.repeat-row')).map(row => {
            const obj = {};
            row.querySelectorAll('[data-field]').forEach(el => {
                obj[el.dataset.field] = el.value;
            });
            return obj;
        });
    }
    return { readAll, addRow };
}

// Export for form pages
window.VEFS = { uploadToCloudinary, wireImagePicker, postJSON, toast, repeatableRows };

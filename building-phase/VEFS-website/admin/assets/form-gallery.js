(function() {
    const { wireImagePicker, postJSON, toast } = window.VEFS;

    wireImagePicker(
        document.getElementById('image-picker'),
        document.getElementById('image-url'),
        document.getElementById('image-preview'),
        document.getElementById('image-status'),
    );

    document.getElementById('gallery-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const _chosenIsNew = (document.querySelector('input[name="isNew"]:checked') || {}).value || 'auto';
        const isNewPayload = _chosenIsNew === 'true' ? true : _chosenIsNew === 'false' ? false : 'auto';
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'gallery',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                year: parseInt(document.getElementById('year').value, 10) || 0,
                imageUrl: document.getElementById('image-url').value,
                isNew: isNewPayload,
                disabled: document.querySelector('[name=disabled]').checked,
                hiddenFromPublic: document.querySelector('[name=hiddenFromPublic]').checked,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=gallery';
        } catch (e) { toast(e.message, true); }
    });
})();

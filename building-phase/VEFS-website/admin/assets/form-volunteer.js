(function() {
    const { wireImagePicker, postJSON, toast } = window.VEFS;

    wireImagePicker(
        document.getElementById('featured-picker'),
        document.getElementById('featured-url'),
        document.getElementById('featured-preview'),
        document.getElementById('featured-status'),
    );

    function intOrNull(v) {
        const s = String(v).trim();
        if (s === '') return null;
        return parseInt(s, 10);
    }
    function splitLines(s) {
        return String(s).split(/\r?\n/).map(l => l.trim()).filter(l => l);
    }

    document.getElementById('volunteer-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const _chosenIsNew = (document.querySelector('input[name="isNew"]:checked') || {}).value || 'auto';
        const isNewPayload = _chosenIsNew === 'true' ? true : _chosenIsNew === 'false' ? false : 'auto';
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'volunteer',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value,
                status: document.getElementById('status').value,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                commitment: document.getElementById('commitment').value,
                description: {
                    brief: document.getElementById('brief').value,
                    full:  document.getElementById('full').value,
                },
                dates: {
                    start: document.getElementById('dates-start').value,
                    end:   document.getElementById('dates-end').value,
                },
                duration: {
                    value: parseInt(document.getElementById('duration-value').value, 10) || 0,
                    unit:  document.getElementById('duration-unit').value,
                },
                requirements: {
                    age: {
                        min: intOrNull(document.getElementById('age-min').value),
                        max: intOrNull(document.getElementById('age-max').value),
                    },
                    skills:    splitLines(document.getElementById('skills').value),
                    physical:  document.getElementById('physical').value,
                    education: document.getElementById('education').value,
                },
                benefits: {
                    learning:      splitLines(document.getElementById('learning').value),
                    certificate:   document.getElementById('ben-certificate').checked,
                    meals:         document.getElementById('ben-meals').checked,
                    accommodation: document.getElementById('ben-accommodation').checked,
                    stipend: {
                        provided: document.getElementById('stipend-provided').checked,
                        amount:   parseInt(document.getElementById('stipend-amount').value, 10) || 0,
                    },
                },
                relatedEvents: splitLines(document.getElementById('relatedEvents').value),
                location: {
                    type:  document.getElementById('location-type').value,
                    city:  document.getElementById('location-city').value,
                    state: document.getElementById('location-state').value,
                },
                spots: {
                    total:     parseInt(document.getElementById('spots-total').value, 10) || 0,
                    filled:    parseInt(document.getElementById('spots-filled').value, 10) || 0,
                    available: 0,
                },
                contact: {
                    name:  document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    phone: document.getElementById('contact-phone').value,
                },
                media: {
                    featuredImage: document.getElementById('featured-url').value,
                },
                isNew: isNewPayload,
                project_id: (document.getElementById('project_id')?.value || null),
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=volunteer';
        } catch (e) { toast(e.message, true); }
    });
})();

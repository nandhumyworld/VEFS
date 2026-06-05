(function() {
    const { wireImagePicker, postJSON, toast, repeatableRows } = window.VEFS;

    wireImagePicker(
        document.getElementById('featured-picker'),
        document.getElementById('featured-url'),
        document.getElementById('featured-preview'),
        document.getElementById('featured-status'),
    );
    wireImagePicker(
        document.getElementById('hero-picker'),
        document.getElementById('hero-url'),
        document.getElementById('hero-preview'),
        document.getElementById('hero-status'),
    );

    const agenda = repeatableRows(
        document.getElementById('agenda-rows'),
        [
            { name: 'time',  placeholder: 'Time (e.g. 9:00 AM)' },
            { name: 'title', placeholder: 'Title' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
        ],
        window.VEFS_INITIAL.agenda,
        document.getElementById('add-agenda'),
    );

    const speakers = repeatableRows(
        document.getElementById('speakers-rows'),
        [
            { name: 'name',  placeholder: 'Name' },
            { name: 'title', placeholder: 'Title' },
            { name: 'bio',   placeholder: 'Bio',   type: 'textarea' },
        ],
        window.VEFS_INITIAL.speakers,
        document.getElementById('add-speaker'),
    );

    function intOrNull(v) {
        const s = String(v).trim();
        if (s === '') return null;
        return parseInt(s, 10);
    }
    function splitLines(s) {
        return String(s).split(/\r?\n/).map(l => l.trim()).filter(l => l);
    }
    function splitCsv(s) {
        return String(s).split(',').map(l => l.trim()).filter(l => l);
    }

    document.getElementById('event-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const capRaw = document.getElementById('capacity').value.trim();
        const _chosenIsNew = (document.querySelector('input[name="isNew"]:checked') || {}).value || 'auto';
        const isNewPayload = _chosenIsNew === 'true' ? true : _chosenIsNew === 'false' ? false : 'auto';
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'event',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value,
                type: document.getElementById('type').value,
                status: document.getElementById('status').value,
                featured: document.getElementById('featured').checked,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                recurring: {
                    isRecurring: document.getElementById('recurring-isRecurring').checked,
                    frequency:   document.getElementById('recurring-frequency').value,
                    pattern:     document.getElementById('recurring-pattern').value,
                    label:       document.getElementById('recurring-label').value,
                },
                date: {
                    start:    document.getElementById('date-start').value,
                    end:      document.getElementById('date-end').value,
                    timezone: document.getElementById('date-timezone').value,
                },
                duration: {
                    value: parseInt(document.getElementById('duration-value').value, 10) || 0,
                    unit:  document.getElementById('duration-unit').value,
                },
                location: {
                    type:    document.getElementById('location-type').value,
                    venue:   document.getElementById('location-venue').value,
                    address: document.getElementById('location-address').value,
                    city:    document.getElementById('location-city').value,
                    state:   document.getElementById('location-state').value,
                    mapUrl:  document.getElementById('location-mapUrl').value,
                },
                shortDescription: document.getElementById('shortDescription').value,
                fullDescription:  document.getElementById('fullDescription').value,
                agenda:   agenda.readAll(),
                speakers: speakers.readAll(),
                organizer: {
                    name:  document.getElementById('organizer-name').value,
                    email: document.getElementById('organizer-email').value,
                    phone: document.getElementById('organizer-phone').value,
                },
                registration: {
                    required: document.getElementById('registration-required').checked,
                    fee: {
                        amount:   parseInt(document.getElementById('fee-amount').value, 10) || 0,
                        currency: 'INR',
                        type:     document.getElementById('fee-type').value,
                    },
                },
                capacity: capRaw === '' ? null : parseInt(capRaw, 10),
                requirements: {
                    age: {
                        min: intOrNull(document.getElementById('age-min').value),
                        max: intOrNull(document.getElementById('age-max').value),
                    },
                    whatToBring: splitLines(document.getElementById('whatToBring').value),
                },
                links: {
                    whatsapp: document.getElementById('link-whatsapp').value,
                    youtube:  document.getElementById('link-youtube').value,
                    map:      document.getElementById('link-map').value,
                },
                images: {
                    featured: document.getElementById('featured-url').value,
                    hero:     document.getElementById('hero-url').value,
                },
                tags: splitCsv(document.getElementById('tags').value),
                isNew: isNewPayload,
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=event';
        } catch (e) { toast(e.message, true); }
    });
})();

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

    const sessions = repeatableRows(
        document.getElementById('sessions-rows'),
        [
            { name: 'date',        placeholder: 'Date (YYYY-MM-DD)' },
            { name: 'startTime',   placeholder: 'Start time' },
            { name: 'endTime',     placeholder: 'End time' },
            { name: 'title',       placeholder: 'Title' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
        ],
        window.VEFS_INITIAL.sessions,
        document.getElementById('add-session'),
    );

    const curriculum = repeatableRows(
        document.getElementById('curriculum-rows'),
        [
            { name: 'module',     placeholder: 'Module name' },
            { name: 'topicsText', placeholder: 'Topics (one per line)', type: 'textarea' },
        ],
        window.VEFS_INITIAL.curriculum,
        document.getElementById('add-curriculum'),
    );

    const facilitators = repeatableRows(
        document.getElementById('facilitators-rows'),
        [
            { name: 'name',  placeholder: 'Name' },
            { name: 'title', placeholder: 'Title' },
            { name: 'bio',   placeholder: 'Bio', type: 'textarea' },
        ],
        window.VEFS_INITIAL.facilitators,
        document.getElementById('add-facilitator'),
    );

    function splitLines(s) {
        return String(s).split(/\r?\n/).map(l => l.trim()).filter(l => l);
    }

    document.getElementById('training-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            csrf: document.querySelector('[name=csrf]').value,
            type: 'training',
            original_id: document.querySelector('[name=original_id]').value || null,
            data: {
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                status: document.getElementById('status').value,
                featured: document.getElementById('featured').checked,
                order: parseInt(document.getElementById('order').value, 10) || 0,
                schedule: {
                    type: document.getElementById('schedule-type').value,
                    sessions: sessions.readAll(),
                    dailyStructure: {
                        morning:   document.getElementById('dailyStructure-morning').value,
                        afternoon: document.getElementById('dailyStructure-afternoon').value,
                        evening:   document.getElementById('dailyStructure-evening').value,
                        night:     document.getElementById('dailyStructure-night').value,
                    },
                    timezone: document.getElementById('schedule-timezone').value,
                },
                totalDuration: {
                    value: parseInt(document.getElementById('totalDuration-value').value, 10) || 0,
                    unit:  document.getElementById('totalDuration-unit').value,
                },
                location: {
                    type:    document.getElementById('location-type').value,
                    venue:   document.getElementById('location-venue').value,
                    city:    document.getElementById('location-city').value,
                    state:   document.getElementById('location-state').value,
                    country: document.getElementById('location-country').value,
                },
                audience: splitLines(document.getElementById('audience').value),
                targetAudience: document.getElementById('targetAudience').value,
                capacity: {
                    total:      parseInt(document.getElementById('capacity-total').value, 10) || 0,
                    registered: parseInt(document.getElementById('capacity-registered').value, 10) || 0,
                    available:  0,
                },
                description: {
                    brief: document.getElementById('brief').value,
                    full:  document.getElementById('full').value,
                    objectives:   splitLines(document.getElementById('objectives').value),
                    curriculum:   curriculum.readAll().map(r => ({
                        module: r.module,
                        topics: splitLines(r.topicsText),
                    })),
                    outcomes:     splitLines(document.getElementById('outcomes').value),
                    requirements: splitLines(document.getElementById('requirements-list').value),
                },
                facilitators: facilitators.readAll(),
                registration: {
                    required: document.getElementById('registration-required').checked,
                    fee: {
                        amount:   parseInt(document.getElementById('fee-amount').value, 10) || 0,
                        currency: 'INR',
                        type:     document.getElementById('fee-type').value,
                    },
                    notes: document.getElementById('registration-notes').value,
                },
                media: {
                    featuredImage: document.getElementById('featured-url').value,
                    heroImage:     document.getElementById('hero-url').value,
                },
            },
        };
        try {
            await postJSON('/admin/api/save.php', payload);
            location.href = '/admin/dashboard.php?tab=training';
        } catch (e) { toast(e.message, true); }
    });
})();

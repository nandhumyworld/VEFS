# Phase 2: Data Layer

## Status: 🚧 IN PROGRESS

**Start Date:** December 25, 2025
**Duration:** 2 days
**Goal:** Create JSON data files and sample content for dynamic pages

---

## Objectives

1. Create structured JSON data files for:
   - Events (10-15 sample events)
   - Trainings (5-8 sample trainings)
   - Programs (6-8 sample programs)

2. Ensure data adheres to schemas defined in `VEFS-requirements/data-schemas/`

3. Create placeholder/sample images structure

4. Test data loading with existing utilities

---

## Data Files to Create

### 1. events.json
- **Location:** `VEFS-website/data/events.json`
- **Sample Count:** 10-15 events
- **Categories:** Workshops, Awareness Programs, Community Events, Tree Plantation
- **Status Mix:** Upcoming (open), Completed, Full
- **Date Range:** Past 3 months to next 6 months

### 2. trainings.json
- **Location:** `VEFS-website/data/trainings.json`
- **Sample Count:** 5-8 trainings
- **Types:** Organic Farming, Seed Preservation, Composting, Tree Identification
- **Status Mix:** Available, Full, Upcoming
- **Fee Mix:** Free and Paid (₹200-₹1000)

### 3. programs.json
- **Location:** `VEFS-website/data/programs.json`
- **Sample Count:** 6-8 programs
- **Target Audiences:** Students, Farmers, Women, General Public
- **Categories:** Education, Training, Awareness, Conservation

### 4. recent-registrations.json
- **Location:** `VEFS-website/data/recent-registrations.json`
- **Purpose:** Duplicate registration checking
- **Structure:** `{ "event-id": ["email1@example.com", "email2@example.com"] }`

---

## Sample Content Guidelines

### Event Content
- **Realistic titles:** "Organic Farming Workshop for Beginners"
- **Locations:** Chennai, Coimbatore, Madurai, Trichy, Salem
- **Dates:** Mix of past, current month, and future
- **Descriptions:** 2-3 sentences, eco-focused
- **Images:** Placeholder paths (user will replace later)

### Training Content
- **Duration:** Half-day, Full-day, Multi-day
- **Prerequisites:** Some require experience, others for beginners
- **Materials:** What participants should bring
- **Certification:** Some offer certificates

### Program Content
- **Impact metrics:** Number of participants, trees planted, schools reached
- **Features:** Key benefits of each program
- **Icons:** SVG icon names for UI

---

## Image Placeholder Structure

```
VEFS-website/images/
├── events/
│   ├── event-placeholder-1.jpg
│   ├── event-placeholder-2.jpg
│   └── ... (10-15 placeholders)
├── trainings/
│   ├── training-placeholder-1.jpg
│   └── ... (5-8 placeholders)
├── programs/
│   ├── program-icon-education.svg
│   └── ... (6-8 icons)
└── hero/
    ├── hero-slide-1.jpg
    ├── hero-slide-2.jpg
    ├── hero-slide-3.jpg
    └── hero-slide-4.jpg
```

**Note:** Actual images will be provided by user later. For now, document required dimensions and formats.

---

## Success Criteria

- [ ] All JSON files validate (no syntax errors)
- [ ] Data adheres to documented schemas
- [ ] Sample content is realistic and diverse
- [ ] Date ranges are logical (past, present, future)
- [ ] Image paths are consistent
- [ ] Registration checking file structure is correct
- [ ] Documentation complete with usage examples

---

## Timeline

- **Hour 1:** Read schemas, create events.json
- **Hour 2:** Create trainings.json and programs.json
- **Hour 3:** Create image placeholders documentation, test data loading
- **Hour 4:** Validation, Phase 2 summary

---

## Next Steps (Phase 3)

After completing data layer, we'll move to Priority 1 Pages:
1. Home page (index.html)
2. About page
3. Programs page
4. Events page
5. Contact page

# Programs Data Schema

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines the data schema and management approach for the **Programs** section of the VEFS website. Programs are stored in a JSON file following the same pattern as Events and Trainings, ensuring consistency across the platform.

### Scope

Programs represent the core activities and initiatives of VEFS Foundation:
- School awareness programs
- Farmer training initiatives
- Women empowerment programs
- Community outreach activities
- Environmental education sessions

---

## 1. Data Storage Approach

### 1.1 File Location

**File:** `public_html/data/programs.json`

**Characteristics:**
- Single JSON file containing all programs
- Static file, manually edited via FTP or file manager
- Loaded client-side via JavaScript fetch()
- No database or server-side processing required

### 1.2 Update Workflow

```
1. Download programs.json from server (FTP/File Manager)
2. Edit file in text editor (VS Code, Notepad++, etc.)
3. Validate JSON syntax (jsonlint.com)
4. Upload to server
5. Changes take effect immediately
6. Backup original file before making changes
```

### 1.3 Validation

Before uploading:
- Use online JSON validator (https://jsonlint.com)
- Check for syntax errors (commas, brackets, quotes)
- Verify all required fields are present
- Ensure IDs are unique
- Test image paths

---

## 2. Programs JSON Schema

### 2.1 Root Structure

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-12-24T10:30:00Z",
    "totalPrograms": 8
  },
  "programs": [
    { /* Program object */ },
    { /* Program object */ }
  ]
}
```

### 2.2 Program Object Schema

**Complete Example:**

```json
{
  "id": "prog-001",
  "title": "School Awareness Programs",
  "slug": "school-awareness-programs",
  "shortDescription": "Educational sessions for students about indigenous trees, ecology, and environmental conservation.",
  "fullDescription": "Our school awareness programs introduce students to the rich heritage of Tamil literature's indigenous tree species. Through interactive workshops, storytelling, and hands-on activities, we inspire young minds to become environmental stewards and champions of biodiversity conservation.",

  "targetAudience": "students",
  "ageGroup": "8-18 years",
  "category": "education",

  "objectives": [
    "Create awareness about indigenous tree species mentioned in Tamil literature",
    "Inspire environmental consciousness in young minds",
    "Teach practical skills in tree identification and conservation",
    "Foster connection between cultural heritage and ecology"
  ],

  "outcomes": [
    "Students can identify 10+ indigenous tree species",
    "Understanding of ecological importance of native trees",
    "Knowledge of Tamil literary references to trees",
    "Increased environmental awareness and action"
  ],

  "duration": {
    "typical": "2-3 hours",
    "format": "workshop",
    "frequency": "On request",
    "location": "Schools/Educational institutions"
  },

  "activities": [
    {
      "name": "Tree Identification Walk",
      "description": "Guided nature walk identifying indigenous species",
      "duration": "45 minutes"
    },
    {
      "name": "Tamil Literature & Trees",
      "description": "Storytelling session about trees in ancient Tamil texts",
      "duration": "30 minutes"
    },
    {
      "name": "Hands-on Planting",
      "description": "Students plant sapling and learn care techniques",
      "duration": "45 minutes"
    }
  ],

  "materials": {
    "provided": [
      "Educational workbooks",
      "Tree identification guides",
      "Saplings for planting",
      "Certificates of participation"
    ],
    "studentsBring": [
      "Notebook and pen",
      "Water bottle",
      "Enthusiasm to learn!"
    ]
  },

  "images": {
    "thumbnail": "/images/programs/school-awareness-thumb.jpg",
    "hero": "/images/programs/school-awareness-hero.jpg",
    "gallery": [
      "/images/programs/school-awareness-1.jpg",
      "/images/programs/school-awareness-2.jpg",
      "/images/programs/school-awareness-3.jpg"
    ]
  },

  "icon": "graduation-cap",

  "contact": {
    "person": "Educational Outreach Team",
    "email": "education@vefs.org",
    "phone": "+91-XXXXXXXXXX"
  },

  "requirements": {
    "minParticipants": 20,
    "maxParticipants": 60,
    "venue": "School campus with outdoor space",
    "preparation": "2 weeks advance booking required"
  },

  "cost": {
    "type": "free",
    "amount": 0,
    "notes": "Fully sponsored by VEFS Foundation"
  },

  "testimonials": [
    {
      "quote": "The students were captivated by the connection between Tamil literature and nature. This program truly opened their eyes to our environmental heritage.",
      "author": "Principal, ABC School",
      "school": "ABC Matriculation School, Chennai",
      "date": "2024-11"
    }
  ],

  "impact": {
    "schoolsReached": 45,
    "studentsImpacted": 8500,
    "treesPlanted": 1200,
    "since": "2020"
  },

  "featured": true,
  "active": true,
  "order": 1,

  "seo": {
    "metaTitle": "School Awareness Programs - VEFS Foundation",
    "metaDescription": "Interactive educational programs for students about indigenous trees and environmental conservation.",
    "keywords": ["school programs", "environmental education", "indigenous trees", "Tamil heritage"]
  },

  "createdAt": "2023-01-15",
  "updatedAt": "2025-12-24"
}
```

---

## 3. Field Specifications

### 3.1 Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique identifier | `"prog-001"` |
| `title` | String | Program name | `"School Awareness Programs"` |
| `shortDescription` | String | Brief 1-2 sentence summary | `"Educational sessions for students..."` |
| `targetAudience` | String (Enum) | Primary audience | `"students"`, `"farmers"`, `"women"`, `"public"` |
| `category` | String (Enum) | Program type | `"education"`, `"training"`, `"outreach"`, `"conservation"` |
| `active` | Boolean | Program currently offered | `true` or `false` |

### 3.2 Recommended Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | String | URL-friendly identifier for SEO |
| `fullDescription` | String | Detailed program description (2-3 paragraphs) |
| `ageGroup` | String | Target age range |
| `objectives` | Array[String] | Learning objectives (3-5 points) |
| `outcomes` | Array[String] | Expected results/achievements |
| `duration` | Object | Timing details |
| `images` | Object | Image URLs (thumbnail, hero, gallery) |
| `contact` | Object | Contact information |
| `featured` | Boolean | Display prominently on homepage |
| `order` | Number | Display order (lower = higher priority) |

### 3.3 Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `activities` | Array[Object] | Individual activities within program |
| `materials` | Object | Materials provided/required |
| `requirements` | Object | Venue, participant limits, preparation time |
| `cost` | Object | Pricing information |
| `testimonials` | Array[Object] | Participant feedback |
| `impact` | Object | Statistics/metrics |
| `seo` | Object | SEO metadata |
| `icon` | String | Icon name for UI display |
| `createdAt` | String (ISO Date) | Creation date |
| `updatedAt` | String (ISO Date) | Last update date |

---

## 4. Field Details & Validation Rules

### 4.1 ID Field

**Format:** `prog-XXX` where XXX is a sequential number

**Rules:**
- Must be unique across all programs
- Use lowercase letters and hyphens only
- No spaces or special characters
- Once assigned, should not change (URL stability)

**Examples:**
```json
"id": "prog-001"  // Valid
"id": "prog-school-awareness"  // Valid (descriptive)
"id": "PROG-001"  // Invalid (uppercase)
"id": "program 1"  // Invalid (space)
```

### 4.2 Target Audience

**Allowed Values:**
- `"students"` - School/college students
- `"farmers"` - Agricultural community
- `"women"` - Women empowerment programs
- `"public"` - General public
- `"professionals"` - Working professionals
- `"seniors"` - Senior citizens
- `"youth"` - Young adults (18-30)
- `"all"` - Open to everyone

**Usage:** Used for filtering programs on website

### 4.3 Category

**Allowed Values:**
- `"education"` - Educational/awareness programs
- `"training"` - Skill-building training
- `"outreach"` - Community outreach
- `"conservation"` - Environmental conservation
- `"research"` - Research initiatives
- `"advocacy"` - Policy advocacy

**Usage:** Program classification for organization

### 4.4 Duration Object

```json
"duration": {
  "typical": "2-3 hours",
  "format": "workshop",         // workshop, seminar, training, series, ongoing
  "frequency": "On request",     // weekly, monthly, on request, one-time
  "location": "Schools"          // venue type
}
```

**Format Values:**
- `"workshop"` - Single session workshop
- `"seminar"` - Lecture/presentation format
- `"training"` - Multi-session training program
- `"series"` - Ongoing series of sessions
- `"fieldwork"` - Outdoor/field-based
- `"online"` - Virtual delivery

### 4.5 Images Object

```json
"images": {
  "thumbnail": "/images/programs/program-thumb.jpg",   // 400x300px
  "hero": "/images/programs/program-hero.jpg",         // 1200x600px
  "gallery": [
    "/images/programs/program-1.jpg",                  // 800x600px each
    "/images/programs/program-2.jpg"
  ]
}
```

**Image Requirements:**
- **Thumbnail:** 400x300px, used in program cards
- **Hero:** 1200x600px (2:1 aspect ratio), used on program detail page
- **Gallery:** 800x600px (4:3 aspect ratio), optional photos

**File Naming Convention:**
- Lowercase with hyphens
- Descriptive names: `school-awareness-workshop-2024.jpg`
- Store in `/images/programs/` directory

**Optimization:**
- JPEG format for photos
- Compress to <200KB per image
- WebP format for better compression (optional)

### 4.6 Activities Array

```json
"activities": [
  {
    "name": "Tree Identification Walk",
    "description": "Guided nature walk identifying indigenous species",
    "duration": "45 minutes"
  }
]
```

**Purpose:** Break down program into specific activities

**Fields:**
- `name` (String): Activity title
- `description` (String): Brief description
- `duration` (String): Time estimate

### 4.7 Cost Object

```json
"cost": {
  "type": "free",              // free, paid, donation
  "amount": 0,                 // in INR
  "notes": "Fully sponsored by VEFS Foundation"
}
```

**Type Values:**
- `"free"` - No cost to participants
- `"paid"` - Fixed fee required
- `"donation"` - Suggested donation amount
- `"sponsored"` - Can be sponsored by organizations

### 4.8 Impact Object

```json
"impact": {
  "schoolsReached": 45,
  "studentsImpacted": 8500,
  "treesPlanted": 1200,
  "since": "2020"
}
```

**Purpose:** Showcase program success metrics

**Custom Fields:** Add metrics relevant to each program type
- Schools/participants/beneficiaries reached
- Trees planted / area conserved
- Communities impacted
- Training hours delivered

---

## 5. Complete Examples

### 5.1 Example: School Awareness Program (Detailed)

See Section 2.2 for complete example

### 5.2 Example: Farmer Training Program

```json
{
  "id": "prog-002",
  "title": "Sustainable Farming Practices",
  "slug": "sustainable-farming-practices",
  "shortDescription": "Training program for farmers on organic farming, soil health, and sustainable agriculture techniques.",
  "fullDescription": "This comprehensive training equips farmers with knowledge and skills for sustainable agriculture. Participants learn organic farming methods, soil conservation, water management, and indigenous crop varieties suited to Tamil Nadu's climate.",

  "targetAudience": "farmers",
  "ageGroup": "18+ years",
  "category": "training",

  "objectives": [
    "Teach organic farming principles and practices",
    "Demonstrate soil health management techniques",
    "Introduce water-efficient irrigation methods",
    "Promote cultivation of indigenous crop varieties"
  ],

  "outcomes": [
    "Farmers can implement organic farming on their land",
    "Reduced chemical fertilizer dependency",
    "Improved soil quality and crop yield",
    "Knowledge of government schemes for sustainable farming"
  ],

  "duration": {
    "typical": "2 days (8 hours total)",
    "format": "training",
    "frequency": "Quarterly",
    "location": "Training center and demonstration farm"
  },

  "activities": [
    {
      "name": "Organic Farming Principles",
      "description": "Theory session on organic farming methods",
      "duration": "2 hours"
    },
    {
      "name": "Soil Testing Workshop",
      "description": "Hands-on soil testing and analysis",
      "duration": "2 hours"
    },
    {
      "name": "Farm Visit",
      "description": "Visit to successful organic farm",
      "duration": "3 hours"
    },
    {
      "name": "Q&A and Certification",
      "description": "Discussion and certificate distribution",
      "duration": "1 hour"
    }
  ],

  "materials": {
    "provided": [
      "Training manual in Tamil and English",
      "Soil testing kit",
      "Organic fertilizer samples",
      "Certificate of completion",
      "Government scheme information booklet"
    ],
    "studentsBring": [
      "Soil sample from their farm",
      "Notebook and pen",
      "Lunch and water"
    ]
  },

  "images": {
    "thumbnail": "/images/programs/farmer-training-thumb.jpg",
    "hero": "/images/programs/farmer-training-hero.jpg",
    "gallery": [
      "/images/programs/farmer-training-classroom.jpg",
      "/images/programs/farmer-training-field.jpg",
      "/images/programs/farmer-training-soil-test.jpg"
    ]
  },

  "icon": "tractor",

  "contact": {
    "person": "Agricultural Training Team",
    "email": "training@vefs.org",
    "phone": "+91-XXXXXXXXXX"
  },

  "requirements": {
    "minParticipants": 15,
    "maxParticipants": 40,
    "venue": "VEFS Training Center",
    "preparation": "Register 2 weeks in advance"
  },

  "cost": {
    "type": "paid",
    "amount": 500,
    "notes": "Includes training materials, meals, and certificate. Subsidized rate for small farmers."
  },

  "testimonials": [
    {
      "quote": "This training changed how I approach farming. My soil quality has improved and I've reduced chemical use by 70%.",
      "author": "Murugan R.",
      "location": "Coimbatore District",
      "date": "2024-08"
    }
  ],

  "impact": {
    "farmersReached": 450,
    "acresConverted": 320,
    "chemicalReduction": "60%",
    "since": "2019"
  },

  "featured": true,
  "active": true,
  "order": 2,

  "seo": {
    "metaTitle": "Sustainable Farming Practices Training - VEFS",
    "metaDescription": "Comprehensive organic farming training for farmers in Tamil Nadu. Learn sustainable agriculture techniques.",
    "keywords": ["organic farming", "sustainable agriculture", "farmer training", "Tamil Nadu"]
  },

  "createdAt": "2023-02-10",
  "updatedAt": "2025-12-20"
}
```

### 5.3 Example: Women Empowerment Program

```json
{
  "id": "prog-003",
  "title": "Women in Environmental Leadership",
  "slug": "women-environmental-leadership",
  "shortDescription": "Empowering women to become environmental leaders in their communities through training and skill development.",
  "fullDescription": "This program equips women with knowledge, skills, and confidence to lead environmental initiatives in their communities. Participants learn about sustainable livelihoods, organic kitchen gardening, waste management, and community mobilization.",

  "targetAudience": "women",
  "ageGroup": "18-60 years",
  "category": "outreach",

  "objectives": [
    "Build environmental awareness and leadership skills",
    "Teach sustainable livelihood opportunities",
    "Create network of women environmental champions",
    "Promote economic empowerment through green initiatives"
  ],

  "outcomes": [
    "Women leading community environmental projects",
    "Sustainable income through organic farming/products",
    "Reduced household waste through composting",
    "Increased community environmental awareness"
  ],

  "duration": {
    "typical": "6-week program",
    "format": "series",
    "frequency": "Weekly sessions",
    "location": "Community centers"
  },

  "images": {
    "thumbnail": "/images/programs/women-leadership-thumb.jpg",
    "hero": "/images/programs/women-leadership-hero.jpg",
    "gallery": [
      "/images/programs/women-leadership-workshop.jpg",
      "/images/programs/women-leadership-gardening.jpg"
    ]
  },

  "icon": "users",

  "contact": {
    "person": "Women Empowerment Cell",
    "email": "women@vefs.org",
    "phone": "+91-XXXXXXXXXX"
  },

  "cost": {
    "type": "free",
    "amount": 0,
    "notes": "Fully sponsored. Materials and seeds provided free."
  },

  "impact": {
    "womenTrained": 280,
    "selfHelpGroupsFormed": 12,
    "kitchenGardensEstablished": 180,
    "since": "2021"
  },

  "featured": false,
  "active": true,
  "order": 3,

  "createdAt": "2023-04-20",
  "updatedAt": "2025-11-15"
}
```

### 5.4 Example: Public Awareness Campaign

```json
{
  "id": "prog-004",
  "title": "Urban Tree Awareness Campaign",
  "slug": "urban-tree-awareness",
  "shortDescription": "Community awareness drives about importance of urban green cover and tree conservation.",
  "fullDescription": "Through street plays, exhibitions, and interactive sessions, we engage urban communities in understanding the vital role of trees in city ecosystems. The campaign focuses on native species conservation and citizen participation in greening initiatives.",

  "targetAudience": "public",
  "ageGroup": "All ages",
  "category": "outreach",

  "objectives": [
    "Raise awareness about urban biodiversity",
    "Promote adoption of native tree species",
    "Encourage citizen participation in tree planting",
    "Highlight Tamil cultural connection to trees"
  ],

  "duration": {
    "typical": "1 day event",
    "format": "campaign",
    "frequency": "Quarterly in different cities",
    "location": "Public spaces, parks"
  },

  "images": {
    "thumbnail": "/images/programs/urban-awareness-thumb.jpg",
    "hero": "/images/programs/urban-awareness-hero.jpg",
    "gallery": []
  },

  "icon": "megaphone",

  "contact": {
    "person": "Public Outreach Team",
    "email": "outreach@vefs.org",
    "phone": "+91-XXXXXXXXXX"
  },

  "cost": {
    "type": "free",
    "amount": 0,
    "notes": "Free for public participation"
  },

  "impact": {
    "eventsHeld": 18,
    "participantsReached": 12000,
    "saplingsDistributed": 3500,
    "since": "2022"
  },

  "featured": false,
  "active": true,
  "order": 4,

  "createdAt": "2023-06-01",
  "updatedAt": "2025-10-30"
}
```

---

## 6. Website Integration

### 6.1 Loading Programs Data

**JavaScript (client-side):**

```javascript
// File: js/programs.js

class Programs {
  constructor() {
    this.programs = [];
    this.filteredPrograms = [];
    this.currentFilter = 'all';

    this.init();
  }

  async init() {
    await this.loadPrograms();
    this.render();
    this.setupFilters();
  }

  async loadPrograms() {
    try {
      const response = await fetch('/data/programs.json');
      const data = await response.json();

      // Get only active programs, sorted by order
      this.programs = data.programs
        .filter(p => p.active)
        .sort((a, b) => a.order - b.order);

      this.filteredPrograms = this.programs;
    } catch (error) {
      console.error('Failed to load programs:', error);
      this.showError();
    }
  }

  filterByAudience(audience) {
    this.currentFilter = audience;

    if (audience === 'all') {
      this.filteredPrograms = this.programs;
    } else {
      this.filteredPrograms = this.programs.filter(
        p => p.targetAudience === audience
      );
    }

    this.render();
  }

  render() {
    const container = document.getElementById('programs-container');

    if (this.filteredPrograms.length === 0) {
      container.innerHTML = '<p class="no-results">No programs found for this category.</p>';
      return;
    }

    container.innerHTML = this.filteredPrograms.map(program => `
      <div class="card card-program" data-aos="fade-up">
        <div class="card-icon">
          <i class="icon-${program.icon}"></i>
        </div>
        <div class="card-body">
          <span class="card-badge">${this.formatAudience(program.targetAudience)}</span>
          <h3 class="card-title">${program.title}</h3>
          <p class="card-description">${program.shortDescription}</p>

          <ul class="card-highlights">
            ${program.objectives.slice(0, 3).map(obj => `
              <li>${obj}</li>
            `).join('')}
          </ul>

          ${program.impact ? `
            <div class="card-impact">
              <strong>Impact:</strong> ${this.formatImpact(program.impact)}
            </div>
          ` : ''}

          <button class="btn btn-text" onclick="programsInstance.showDetails('${program.id}')">
            Learn More →
          </button>
        </div>
      </div>
    `).join('');
  }

  showDetails(programId) {
    const program = this.programs.find(p => p.id === programId);
    if (!program) return;

    // Populate modal with program details
    const modal = document.getElementById('program-modal');
    const modalContent = modal.querySelector('.modal-body');

    modalContent.innerHTML = `
      ${program.images.hero ? `
        <img src="${program.images.hero}" alt="${program.title}" class="program-hero-img">
      ` : ''}

      <h2>${program.title}</h2>
      <p class="program-meta">
        <span><strong>For:</strong> ${this.formatAudience(program.targetAudience)}</span> |
        <span><strong>Duration:</strong> ${program.duration.typical}</span> |
        <span><strong>Cost:</strong> ${this.formatCost(program.cost)}</span>
      </p>

      <div class="program-section">
        <h3>About This Program</h3>
        <p>${program.fullDescription}</p>
      </div>

      <div class="program-section">
        <h3>Learning Objectives</h3>
        <ul>
          ${program.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      </div>

      <div class="program-section">
        <h3>Expected Outcomes</h3>
        <ul>
          ${program.outcomes.map(out => `<li>${out}</li>`).join('')}
        </ul>
      </div>

      ${program.activities ? `
        <div class="program-section">
          <h3>Program Activities</h3>
          ${program.activities.map(activity => `
            <div class="activity-item">
              <h4>${activity.name} <span class="activity-duration">(${activity.duration})</span></h4>
              <p>${activity.description}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${program.testimonials && program.testimonials.length > 0 ? `
        <div class="program-section">
          <h3>What Participants Say</h3>
          ${program.testimonials.map(test => `
            <blockquote class="testimonial">
              <p>"${test.quote}"</p>
              <footer>— ${test.author}, ${test.school || test.location}</footer>
            </blockquote>
          `).join('')}
        </div>
      ` : ''}

      <div class="program-section">
        <h3>Get Involved</h3>
        <p><strong>Contact:</strong> ${program.contact.person}</p>
        <p><strong>Email:</strong> <a href="mailto:${program.contact.email}">${program.contact.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${program.contact.phone}">${program.contact.phone}</a></p>

        <a href="/contact?program=${program.id}" class="btn btn-primary mt-md">
          Inquire About This Program
        </a>
      </div>
    `;

    // Open modal (using modal system from Component Library)
    window.modalInstance.open('program-modal');
  }

  formatAudience(audience) {
    const labels = {
      'students': 'Students',
      'farmers': 'Farmers',
      'women': 'Women',
      'public': 'Public',
      'professionals': 'Professionals',
      'seniors': 'Seniors',
      'youth': 'Youth',
      'all': 'All Ages'
    };
    return labels[audience] || audience;
  }

  formatCost(cost) {
    if (cost.type === 'free') return 'Free';
    if (cost.type === 'paid') return `₹${cost.amount}`;
    if (cost.type === 'donation') return `Suggested ₹${cost.amount}`;
    return cost.notes || 'Contact for details';
  }

  formatImpact(impact) {
    // Format first impact metric for card display
    const firstKey = Object.keys(impact)[0];
    if (firstKey && firstKey !== 'since') {
      return `${impact[firstKey].toLocaleString()} ${this.humanizeKey(firstKey)}`;
    }
    return '';
  }

  humanizeKey(key) {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .toLowerCase();
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter programs
        const audience = button.getAttribute('data-filter');
        this.filterByAudience(audience);
      });
    });
  }

  showError() {
    const container = document.getElementById('programs-container');
    container.innerHTML = `
      <div class="alert alert-error">
        <p>Unable to load programs. Please try again later.</p>
      </div>
    `;
  }
}

// Initialize
let programsInstance;
document.addEventListener('DOMContentLoaded', () => {
  programsInstance = new Programs();
});
```

### 6.2 Programs Page HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Programs - VEFS Foundation</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <!-- Header/Nav here -->

  <main>
    <!-- Hero Section -->
    <section class="section section-hero">
      <div class="container">
        <h1 class="section-title">Our Programs</h1>
        <p class="section-subtitle">
          Creating environmental awareness and sustainable change through education, training, and community engagement
        </p>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="section section-py-sm">
      <div class="container">
        <div class="filter-tabs">
          <button class="filter-tab active" data-filter="all">All Programs</button>
          <button class="filter-tab" data-filter="students">Students</button>
          <button class="filter-tab" data-filter="farmers">Farmers</button>
          <button class="filter-tab" data-filter="women">Women</button>
          <button class="filter-tab" data-filter="public">Public</button>
        </div>
      </div>
    </section>

    <!-- Programs Grid -->
    <section class="section">
      <div class="container">
        <div class="card-grid" id="programs-container">
          <!-- Programs loaded here via JavaScript -->
          <div class="spinner-container">
            <div class="spinner"></div>
            <p class="spinner-text">Loading programs...</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Program Details Modal -->
  <div class="modal" id="program-modal" role="dialog" aria-modal="true" aria-labelledby="program-modal-title" aria-hidden="true">
    <div class="modal-backdrop" data-modal-close></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="program-modal-title">Program Details</h2>
          <button class="modal-close" data-modal-close aria-label="Close modal">×</button>
        </div>
        <div class="modal-body">
          <!-- Content loaded dynamically -->
        </div>
      </div>
    </div>
  </div>

  <!-- Footer here -->

  <script src="/js/components/modal.js"></script>
  <script src="/js/programs.js"></script>
</body>
</html>
```

### 6.3 Featured Programs on Homepage

```javascript
// Display featured programs on homepage
async function loadFeaturedPrograms() {
  const response = await fetch('/data/programs.json');
  const data = await response.json();

  const featured = data.programs
    .filter(p => p.active && p.featured)
    .slice(0, 3); // Show max 3

  const container = document.getElementById('featured-programs');
  container.innerHTML = featured.map(program => `
    <div class="card card-program-featured">
      <div class="card-image">
        <img src="${program.images.thumbnail}" alt="${program.title}" loading="lazy">
      </div>
      <div class="card-body">
        <h3 class="card-title">${program.title}</h3>
        <p class="card-description">${program.shortDescription}</p>
        <a href="/programs#${program.slug}" class="btn btn-outline btn-sm">Learn More</a>
      </div>
    </div>
  `).join('');
}
```

---

## 7. Maintenance & Best Practices

### 7.1 Adding a New Program

1. **Copy template** from Section 5 examples
2. **Assign unique ID** (next sequential number)
3. **Fill required fields** (id, title, shortDescription, targetAudience, category, active)
4. **Add recommended fields** (objectives, outcomes, duration, images, contact)
5. **Set order number** (determines display sequence)
6. **Upload images** to `/images/programs/` directory
7. **Validate JSON** syntax (jsonlint.com)
8. **Test locally** if possible
9. **Upload to server**
10. **Verify on website**

### 7.2 Updating Existing Program

1. **Locate program** by ID in programs.json
2. **Update fields** as needed
3. **Update `updatedAt` field** with current date
4. **Validate JSON** syntax
5. **Upload to server**
6. **Check website** for changes

### 7.3 Deactivating a Program

**Don't delete programs** - set `active: false` instead

```json
{
  "id": "prog-005",
  "active": false,  // Program won't appear on website
  // ... rest of fields
}
```

**Reason:** Preserves historical data, can be reactivated later

### 7.4 Backup Strategy

**Before making changes:**
1. Download current `programs.json`
2. Save as `programs-backup-YYYY-MM-DD.json`
3. Store in safe location (local computer, cloud storage)
4. Make changes to copy, not original
5. Upload new version
6. Keep backups for at least 3 months

### 7.5 Common Errors & Solutions

**Error: Programs not displaying**
- Check browser console for JavaScript errors
- Verify JSON file path is correct (`/data/programs.json`)
- Validate JSON syntax (no trailing commas, missing brackets)

**Error: Images not loading**
- Verify image paths are correct
- Check file exists on server
- Ensure image files are in `/images/programs/` directory
- Check file names match exactly (case-sensitive)

**Error: Filter not working**
- Verify `targetAudience` field uses allowed values
- Check filter button `data-filter` attributes match

---

## 8. Performance Optimization

### 8.1 Image Optimization

**Before uploading:**
- Resize to required dimensions
- Compress to <200KB per image
- Use JPEG for photos, PNG for graphics
- Consider WebP format for modern browsers

**Tools:**
- TinyPNG (https://tinypng.com)
- ImageOptim (Mac)
- GIMP (free, cross-platform)

### 8.2 JSON File Size

**Keep file lightweight:**
- Remove unnecessary whitespace in production
- Limit gallery images to 3-5 per program
- Keep descriptions concise (2-3 paragraphs)
- Don't store large text blocks in JSON

**Current file size estimate:**
- 8-10 programs: ~50-70 KB
- 20 programs: ~150-200 KB
- Target: Keep under 300 KB

### 8.3 Caching

**Add cache-busting for updates:**

```javascript
// Add version parameter when loading
fetch('/data/programs.json?v=' + new Date().getTime())
```

**Or use service worker caching** for better performance

---

## 9. SEO Considerations

### 9.1 SEO Fields

Each program can have SEO metadata:

```json
"seo": {
  "metaTitle": "School Awareness Programs - VEFS Foundation",
  "metaDescription": "Interactive educational programs for students...",
  "keywords": ["school programs", "environmental education"]
}
```

### 9.2 URL Structure

**Programs page:** `/programs`

**Individual program (if creating dedicated pages):**
- `/programs/school-awareness-programs`
- Use `slug` field for URL

**Benefits:**
- SEO-friendly URLs
- Easy to share
- Human-readable

---

## 10. Future Enhancements

### 10.1 Phase 2 Features

**Suggested additions:**
- Program registration form
- Impact tracking dashboard
- Photo gallery per program
- Downloadable program brochures (PDF)
- Video integration
- Related programs recommendations

### 10.2 Admin Panel

**Future admin panel could include:**
- Visual program editor (no JSON editing)
- Image upload interface
- Preview before publishing
- Impact metrics tracking
- Participant database

---

## 11. Appendices

### Appendix A: Minimal Program Template

```json
{
  "id": "prog-XXX",
  "title": "",
  "slug": "",
  "shortDescription": "",
  "targetAudience": "",
  "category": "",
  "objectives": [],
  "duration": {
    "typical": "",
    "format": "",
    "frequency": "",
    "location": ""
  },
  "images": {
    "thumbnail": "",
    "hero": ""
  },
  "contact": {
    "person": "",
    "email": "",
    "phone": ""
  },
  "cost": {
    "type": "free",
    "amount": 0
  },
  "featured": false,
  "active": true,
  "order": 0,
  "createdAt": "",
  "updatedAt": ""
}
```

### Appendix B: Icon Names Reference

Suggested icon names for `icon` field:

- `"graduation-cap"` - Education programs
- `"tractor"` - Farming programs
- `"users"` - Community programs
- `"leaf"` - Environmental programs
- `"heart"` - Social welfare
- `"megaphone"` - Awareness campaigns
- `"book"` - Training programs
- `"tree"` - Conservation programs

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

**End of Document**

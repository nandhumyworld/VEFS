# Content Replacement Map

**Purpose:** This document shows exactly where each piece of content from `CONTENT_TO_PROVIDE.md` needs to be updated in the website files.

**How to Use:**
1. Fill out `CONTENT_TO_PROVIDE.md` first
2. Use this map to find where to update each piece of content
3. Check off items as you complete them

**Last Updated:** December 26, 2025 (v2.0 - Added Phase 4-5 page mappings)

---

## QUICK REFERENCE TABLE

| Content Type | Files Affected | Priority | Status |
|-------------|----------------|----------|--------|
| Contact Information | contact.html, footer (all pages) | 🔴 High | ⬜ |
| Founder Info | about.html | 🔴 High | ⬜ |
| Trustees Info | about.html | 🟡 Medium | ⬜ |
| Foundation Story | about.html | 🔴 High | ⬜ |
| Mission/Vision | about.html, index.html | 🔴 High | ⬜ |
| Bank Details | donate.html | 🔴 High | ⬜ |
| Donation Impact Tiers | donate.html | 🔴 High | ⬜ |
| UPI QR Code | donate.html | 🔴 High | ⬜ |
| Programs Data | data/programs.json | 🟡 Medium | ⬜ |
| Events Data | data/events.json | 🟡 Medium | ⬜ |
| Trainings Data | data/trainings.json | 🟡 Medium | ⬜ |
| Gallery Images | gallery.js, images/gallery/ | 🟡 Medium | ⬜ |
| Future Plans Goals | future-plans.html | 🟡 Medium | ⬜ |
| Privacy Policy Review | privacy.html | 🟡 Medium | ⬜ |
| Terms of Service Review | terms.html | 🟡 Medium | ⬜ |
| Images | All pages | 🟢 Low | ⬜ |
| Google Maps | contact.html | 🟡 Medium | ⬜ |
| Video URL | index.html | 🟢 Low | ⬜ |

---

## 1. CONTACT INFORMATION

### Office Address

**Update in:** `contact.html`
**Lines:** 75-78

**Current Placeholder:**
```html
[Address Line 1]<br>
[Address Line 2]<br>
[City], [State] - [Pincode]<br>
Tamil Nadu, India
```

**Replace with data from:** `CONTENT_TO_PROVIDE.md` → Section 2 → Office Address

**Example:**
```html
123 Gandhi Road, Anna Nagar<br>
Near Central Park<br>
Coimbatore, Tamil Nadu - 641001<br>
India
```

---

### Phone Number

**Update in:** `contact.html` (line 98), `footer` in all HTML pages (lines 277-278)

**Current Placeholder:**
```html
<a href="tel:+919876543210">+91 98765 43210</a>
```

**Replace with:** Actual phone number from Section 2

---

### Email Addresses

**Update in:** `contact.html` (lines 87-89), `footer` in all pages (line 274)

**Current Placeholder:**
```html
info@vefs.org
programs@vefs.org
partnerships@vefs.org
```

**Replace with:** Actual emails from Section 2

---

### Social Media URLs

**Update in:** `footer` in all HTML pages (lines 246-251), `contact.html` (lines 108-109)

**Current Placeholder:**
```html
https://www.facebook.com/vefsfoundation
https://www.instagram.com/vefsfoundation
```

**Replace with:** Actual social media URLs from Section 2

---

### Google Maps Embed

**Update in:** `contact.html`
**Lines:** 209-220

**Current Placeholder:**
```html
<!-- Google Maps Placeholder -->
<div style="...">
  <svg>...</svg>
  <p>Google Maps<br><small>(Map embed to be added with actual office location)</small></p>
</div>
```

**Replace with:**
```html
<iframe
  src="[PASTE_EMBED_URL_HERE]"
  width="100%"
  height="450"
  frameborder="0"
  allowfullscreen
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

**Get embed code from:** Google Maps → Search location → Share → Embed a map → Copy HTML

---

## 2. ABOUT PAGE CONTENT

### Foundation Story

**Update in:** `about.html`
**Lines:** 69-84 (entire section)

**Current Placeholder:**
```html
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
<p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
```

**Replace with:** Three paragraphs from `CONTENT_TO_PROVIDE.md` → Section 5 → Story Paragraphs

---

### Mission Statement

**Update in:** `about.html` (lines 92-94), `index.html` (lines 275-277)

**Current Placeholder:**
```html
To promote the conservation of indigenous tree species and sustainable farming practices
while empowering local communities through environmental education and livelihood support programs.
```

**Replace with:** Actual mission from Section 6 → Mission Statement

---

### Vision Statement

**Update in:** `about.html` (lines 107-109), `index.html` (lines 287-289)

**Current Placeholder:**
```html
A Tamil Nadu where indigenous trees thrive, biodiversity flourishes, and communities
live in harmony with nature, creating a sustainable legacy for future generations.
```

**Replace with:** Actual vision from Section 6 → Vision Statement

---

### Core Values

**Update in:** `about.html`
**Lines:** 120-190 (6 value cards)

**Current Content:**
- Ecological Restoration
- Indigenous Knowledge
- Education & Awareness
- Community Engagement
- Sustainability
- Inclusivity

**Replace with:** Your actual 4-6 core values from Section 6 → Core Values

**Format for each value:**
```html
<div class="card">
  <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">🌱</div>
  <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">[VALUE NAME]</h3>
  <p style="color: var(--color-gray-700);">[VALUE DESCRIPTION]</p>
</div>
```

---

### Impact Metrics

**Update in:** `about.html`
**Lines:** 205-246 (8 statistics)

**Current Placeholder:**
```html
50,000+ Trees Planted
1,200+ Farmers Trained
15,000+ Students Reached
300+ Programs Conducted
12 Districts Covered
500+ Women Empowered
200+ Hectares Conserved
25+ Partner Organizations
```

**Replace with:** Actual numbers from Section 7 → Impact Metrics

---

### Timeline/Journey

**Update in:** `about.html`
**Lines:** 260-335 (6 milestones)

**Current Placeholder:**
- 2019: Foundation Established
- 2020: First Major Plantation Drive
- 2021: Educational Programs Launch
- 2022: Expansion to Multiple Districts
- 2023: Recognition & Awards
- 2025+: Future Vision

**Replace with:** Actual milestones from Section 8 → Timeline

**Format for each milestone:**
```html
<div style="display: flex; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
  <div style="flex-shrink: 0; width: 120px; text-align: right;">
    <span style="background-color: var(--color-primary); color: white; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-full);">[YEAR]</span>
  </div>
  <div style="position: relative; border-left: 3px solid var(--color-primary-light); padding-left: var(--spacing-lg); padding-bottom: var(--spacing-xl);">
    <div style="position: absolute; left: -8px; top: 0; width: 14px; height: 14px; border-radius: 50%; background-color: var(--color-primary);"></div>
    <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-xs);">[MILESTONE TITLE]</h3>
    <p style="color: var(--color-gray-700);">[MILESTONE DESCRIPTION]</p>
  </div>
</div>
```

---

### Founder Profile

**Update in:** `about.html`
**Lines:** 350-365

**Current Placeholder:**
```html
<img src="/images/team/founder.jpg" alt="[Founder Name]">
<h3>[Founder Name]</h3>
<p class="founder-title">[Title/Position]</p>
<p>[Founder biography - 2-3 paragraphs about their background, expertise, vision for VEFS]</p>
```

**Replace with:** Data from Section 3 → Founder Information

**Image file:** Place in `/VEFS-website/images/team/founder.jpg` (400x400px)

---

### Board of Trustees

**Update in:** `about.html`
**Lines:** 383-425 (3 trustee cards)

**Current Placeholder:**
```html
<div class="card">
  <img src="/images/team/trustee-1.jpg" alt="[Trustee Name]">
  <h3>[Trustee Name]</h3>
  <p class="trustee-title">[Position]</p>
  <p>[Brief bio about their expertise and role]</p>
</div>
```

**Replace with:** Data from Section 4 → Board of Trustees

**Image files:**
- `/VEFS-website/images/team/trustee-1.jpg` (300x300px)
- `/VEFS-website/images/team/trustee-2.jpg` (300x300px)
- `/VEFS-website/images/team/trustee-3.jpg` (300x300px)

---

## 3. HOME PAGE CONTENT

### Hero Carousel Images

**Update in:** `index.html`
**Lines:** 66, 82, 98, 114 (4 slides)

**Current Placeholder:**
```html
<img src="/images/hero/hero-slide-1.jpg" alt="...">
<img src="/images/hero/hero-slide-2.jpg" alt="...">
<img src="/images/hero/hero-slide-3.jpg" alt="...">
<img src="/images/hero/hero-slide-4.jpg" alt="...">
```

**Replace with:** Actual hero images from Section 11 → Hero Images

**Image files required:**
- `/VEFS-website/images/hero/hero-slide-1.jpg` (1920x800px, <200KB)
- `/VEFS-website/images/hero/hero-slide-2.jpg` (1920x800px, <200KB)
- `/VEFS-website/images/hero/hero-slide-3.jpg` (1920x800px, <200KB)
- `/VEFS-website/images/hero/hero-slide-4.jpg` (1920x800px, <200KB)

**Optimization:** Use tools like TinyPNG or ImageOptim to keep file size under 200KB

---

### Video Container

**Update in:** `index.html`
**Lines:** 136-145

**Current Placeholder:**
```html
<!-- Video URL to be added -->
<div class="video-placeholder">
  <p>Founder's Message Video</p>
  <p style="font-size: var(--font-size-sm);">(Video embed to be added)</p>
</div>
```

**Replace with:**
```html
<iframe
  width="100%"
  height="400"
  src="[YOUTUBE_EMBED_URL]"
  title="Founder's Message"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy">
</iframe>
```

**Get video URL from:** Section 10 → Founder Message Video

---

## 4. LOGO & BRANDING

### Primary Logo

**Update in:** All HTML pages
**Lines:** Header (~28), Footer (~244)

**Current Placeholder:**
```html
<img src="/images/logos/vefs-logo.png" alt="VEFS Foundation Logo" width="60" height="60">
```

**Replace with:** Actual logo from Section 11 → Logo & Branding

**Image file:** `/VEFS-website/images/logos/vefs-logo.png` (512x512px, PNG with transparency)

---

### Favicon

**Update in:** All HTML pages
**Line:** ~12

**Current Placeholder:**
```html
<link rel="icon" type="image/x-icon" href="/images/logos/vefs-favicon.ico">
```

**Replace with:** Actual favicon from Section 11

**Image file:** `/VEFS-website/images/logos/vefs-favicon.ico` (16x16, 32x32, 48x48)

---

## 5. DATA FILES (JSON)

### Programs Data

**Update in:** `/VEFS-website/data/programs.json`

**Current Status:** ⚠️ NEEDS COMPLETE DATA

**Replace with:** Data from Section 12 → Programs Data

**JSON Structure:**
```json
{
  "programs": [
    {
      "id": "prog-001",
      "slug": "eco-education-schools",
      "title": "[Program Name]",
      "category": "education",
      "targetAudience": "students",
      "shortDescription": "[1-2 sentences]",
      "fullDescription": "[2-3 paragraphs]",
      "objectives": ["Objective 1", "Objective 2", "Objective 3"],
      "expectedOutcomes": ["Outcome 1", "Outcome 2"],
      "activities": ["Activity 1", "Activity 2"],
      "duration": "3 months",
      "cost": 0,
      "capacity": 30,
      "impact": {
        "treesPlanted": 500,
        "participantsTrained": 200,
        "villagesReached": 5
      },
      "contact": {
        "name": "[Coordinator Name]",
        "email": "programs@vefs.org",
        "phone": "+91 XXXXXXXXXX"
      },
      "images": {
        "featured": "/images/programs/program-1-featured.jpg"
      },
      "active": true,
      "featured": true,
      "order": 1
    }
  ]
}
```

**How many programs?** Fill out one entry for each program in CONTENT_TO_PROVIDE.md

---

### Events Data

**Update in:** `/VEFS-website/data/events.json`

**Current Status:** ⚠️ NEEDS COMPLETE DATA

**Replace with:** Data from Section 13 → Events Data

**JSON Structure:**
```json
{
  "events": [
    {
      "id": "evt-001",
      "title": "[Event Name]",
      "type": "workshop",
      "shortDescription": "[1-2 sentences]",
      "fullDescription": "[2-3 paragraphs]",
      "date": {
        "start": "2025-03-15T09:00:00",
        "end": "2025-03-15T17:00:00"
      },
      "location": {
        "venue": "[Venue Name]",
        "address": "[Full Address]",
        "city": "[City]",
        "state": "Tamil Nadu"
      },
      "fee": 0,
      "capacity": 50,
      "status": "upcoming",
      "organizer": {
        "name": "[Organizer Name]",
        "email": "events@vefs.org",
        "phone": "+91 XXXXXXXXXX"
      },
      "images": {
        "featured": "/images/events/event-1-featured.jpg",
        "hero": "/images/events/event-1-hero.jpg"
      },
      "featured": true
    }
  ]
}
```

---

### Trainings Data

**Update in:** `/VEFS-website/data/trainings.json`

**Current Status:** ⚠️ INCOMPLETE - Needs full data

**Replace with:** Data from Section 14 → Trainings Data

**JSON Structure:**
```json
{
  "trainings": [
    {
      "id": "train-001",
      "title": "[Training Name]",
      "type": "certification",
      "category": "farming",
      "shortDescription": "[1-2 sentences]",
      "fullDescription": "[2-3 paragraphs]",
      "schedule": {
        "startDate": "2025-04-01",
        "endDate": "2025-06-30",
        "duration": "3 months",
        "sessions": "12 sessions",
        "time": "10:00 AM - 4:00 PM"
      },
      "location": {
        "venue": "[Venue Name]",
        "city": "[City]",
        "mode": "In-person"
      },
      "fee": 0,
      "capacity": 30,
      "status": "open",
      "curriculum": [
        "Module 1: [Description]",
        "Module 2: [Description]"
      ],
      "prerequisites": "None",
      "certificate": true,
      "instructor": {
        "name": "[Instructor Name]",
        "bio": "[1-2 sentences]",
        "photo": "/images/instructors/instructor-1.jpg"
      },
      "images": {
        "featured": "/images/trainings/training-1-featured.jpg"
      },
      "featured": true
    }
  ]
}
```

---

## 6. IMAGES ORGANIZATION

### Directory Structure

```
VEFS-website/images/
├── logos/
│   ├── vefs-logo.png (512x512px, PNG)
│   ├── vefs-logo-white.png (512x512px, PNG)
│   └── vefs-favicon.ico (16x16, 32x32, 48x48)
├── hero/
│   ├── hero-slide-1.jpg (1920x800px, <200KB)
│   ├── hero-slide-2.jpg (1920x800px, <200KB)
│   ├── hero-slide-3.jpg (1920x800px, <200KB)
│   └── hero-slide-4.jpg (1920x800px, <200KB)
├── team/
│   ├── founder.jpg (400x400px)
│   ├── trustee-1.jpg (300x300px)
│   ├── trustee-2.jpg (300x300px)
│   └── trustee-3.jpg (300x300px)
├── programs/
│   ├── program-1-featured.jpg (600x400px, <150KB)
│   ├── program-2-featured.jpg
│   └── ... (one per program)
├── events/
│   ├── event-1-featured.jpg (600x400px, <150KB)
│   ├── event-1-hero.jpg (1200x600px, <200KB)
│   └── ... (two per event)
├── trainings/
│   ├── training-1-featured.jpg (600x400px, <150KB)
│   └── ... (one per training)
├── instructors/
│   └── instructor-1.jpg (300x300px)
├── testimonials/ (optional)
│   └── testimonial-1.jpg (200x200px)
└── gallery/ (Phase 4)
    ├── 2019/
    ├── 2020/
    ├── 2021/
    ├── 2022/
    ├── 2023/
    ├── 2024/
    └── 2025/
```

### Image Specifications

| Image Type | Dimensions | Format | Max Size | Purpose |
|-----------|------------|---------|----------|---------|
| Hero Carousel | 1920x800px | JPG | 200KB | Homepage slides |
| Logo | 512x512px | PNG | 100KB | Transparent background |
| Favicon | 16/32/48px | ICO | 50KB | Browser tab icon |
| Team Photos | 300-400px square | JPG | 100KB | Founder, trustees |
| Program Featured | 600x400px | JPG | 150KB | Program cards |
| Event Featured | 600x400px | JPG | 150KB | Event cards |
| Event Hero | 1200x600px | JPG | 200KB | Event modal |
| Gallery | 1200x800px | JPG | 200KB | Photo gallery |

### Image Optimization Tools

**Online:**
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim Online: https://imageoptim.com/online

**Desktop:**
- Photoshop (Save for Web)
- GIMP (Export as JPG, quality 85%)
- XnConvert (batch processing)

---

## 7. DONATION PAGE (Phase 4)

### Bank Account Details

**Update in:** `donate.html` (when created in Phase 4)

**Will need from:** Section 9 → Bank Details

**Display format:**
```html
<div class="bank-details">
  <h3>Bank Transfer Details</h3>
  <table>
    <tr><td>Account Name:</td><td>[Account Name]</td></tr>
    <tr><td>Bank Name:</td><td>[Bank Name]</td></tr>
    <tr><td>Branch:</td><td>[Branch]</td></tr>
    <tr><td>Account Number:</td><td>[Account Number]</td></tr>
    <tr><td>IFSC Code:</td><td>[IFSC Code]</td></tr>
    <tr><td>Account Type:</td><td>[Current/Savings]</td></tr>
  </table>
</div>
```

---

### UPI QR Code

**Update in:** `donate.html`

**Image file:** `/VEFS-website/images/donation/upi-qr-code.png` (500x500px)

**Display:**
```html
<div class="upi-section">
  <h3>Scan to Donate via UPI</h3>
  <img src="/images/donation/upi-qr-code.png" alt="UPI QR Code" width="300" height="300">
  <p>UPI ID: [upi@bankname]</p>
</div>
```

---

## 8. FUTURE UPDATES (Later Phases)

### Trainings Page (Phase 4)
- Will need complete trainings.json (Section 14)
- Training images in /images/trainings/

### Gallery Page (Phase 4)
- Will need gallery images organized by year (Section 15)
- Images in /images/gallery/[year]/

### Future Plans Page (Phase 4)
- Will need strategic goals (Section 16)

### Privacy & Terms Pages (Phase 5)
- Will need privacy policy content (Section 18)
- Will need terms of service content (Section 18)

---

## PHASE 4 & 5 PAGES (NEW)

The following sections cover content replacement for pages built in Phases 4 and 5.

---

## 10. TRAININGS PAGE

### Trainings Data File

**Update in:** `data/trainings.json`

**Current:** File structure is defined but needs real data

**Replace with:** Complete training data from `CONTENT_TO_PROVIDE.md` → Section 14

**JSON Structure:**
```json
{
  "trainings": [
    {
      "id": "train-001",
      "title": "[Training name]",
      "type": "workshop|certification|course|bootcamp",
      "category": "farming|conservation|livelihood|technical",
      "shortDescription": "[1-2 sentences]",
      "description": "[2-3 paragraphs]",
      "schedule": {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "duration": "[e.g., 6 weeks]",
        "sessions": "[e.g., 12 sessions]",
        "time": "[e.g., 10:00 AM - 4:00 PM]"
      },
      "location": {
        "venue": "[Venue name]",
        "city": "[City]",
        "mode": "in-person|online|hybrid"
      },
      "registration": {
        "fee": 0,
        "capacity": 50,
        "status": "open|full|upcoming|completed",
        "deadline": "YYYY-MM-DD"
      },
      "curriculum": [
        "Module 1: [Name and description]",
        "Module 2: [Name and description]"
      ],
      "prerequisites": "[Requirements or 'None']",
      "certificate": {
        "provided": true,
        "type": "[Certificate name]"
      },
      "instructor": {
        "name": "[Instructor name]",
        "bio": "[1-2 sentences]",
        "photo": "instructors/instructor-1.jpg"
      },
      "featuredImage": "trainings/training-1.jpg",
      "targetAudience": "students|farmers|women"
    }
  ]
}
```

**Note:** The trainings page loads this data dynamically and displays it in a timeline view grouped by year and month.

---

## 11. DONATE PAGE

### Bank Account Details

**Update in:** `donate.html`
**Lines:** 387-405 (Bank Transfer section)

**Current Placeholder:**
```html
<strong>Account Name:</strong> [Account Holder Name]<br>
<strong>Bank Name:</strong> [Bank Name]<br>
<strong>Branch:</strong> [Branch Name]<br>
<strong>Account Number:</strong> [Account Number]<br>
<strong>IFSC Code:</strong> [IFSC Code]<br>
<strong>Account Type:</strong> [Current/Savings]
```

**Replace with:** Bank details from `CONTENT_TO_PROVIDE.md` → Section 9 → Bank Account Information

---

### UPI QR Code

**Update in:** `donate.html`
**Lines:** 414-416 (UPI section)

**Current Placeholder:**
```html
<img src="images/donation-qr-placeholder.png" alt="UPI QR Code">
<p><strong>UPI ID:</strong> vefs@upi</p>
```

**Replace with:**
1. Upload QR code image to `/images/donation-upi-qr.png`
2. Update UPI ID from `CONTENT_TO_PROVIDE.md` → Section 9 → UPI Details

---

### Donation Impact Tiers

**Update in:** `donate.html`
**Lines:** 138-220 (Impact Showcase section)

**Current Placeholders:**
- Tier 1 (₹500): "Plant One Tree"
- Tier 2 (₹2,000): "Sponsor a Student"
- Tier 3 (₹5,000): "Community Workshop"
- Tier 4 (₹10,000): "Village Restoration"
- Tier 5 (₹25,000): "Program Sponsor"
- Tier 6: "Choose Your Impact" (custom amount)

**Replace with:** Custom impact tiers from `CONTENT_TO_PROVIDE.md` → Section 9 → Donation Impact Tiers

**Example for Tier 1:**
```html
<div class="impact-card" data-amount="500">
  <div class="impact-icon">🌳</div>
  <h3>Plant One Tree</h3>
  <p class="impact-amount">₹500</p>
  <p class="impact-description">Fund the planting and 1-year care of one indigenous tree sapling</p>
  <p class="impact-result">1 tree planted and nurtured</p>
</div>
```

---

### 80G Tax Certificate Info

**Update in:** `donate.html`
**Lines:** 437-448 (Tax Benefits section)

**Current:**
```html
<strong>80G Certificate Number:</strong> [Certificate Number]
```

**Replace with:** Actual 80G certificate number from `CONTENT_TO_PROVIDE.md` → Section 1 → 80G Certificate Number

---

## 12. GALLERY PAGE

### Gallery Images

**Update in:** `images/gallery/` folder

**Current:** Sample placeholder images in `gallery.js`

**Organize by:** Year and category folders

**Folder Structure:**
```
images/gallery/
├── 2025/
│   ├── programs/
│   ├── events/
│   ├── trainings/
│   └── nature/
├── 2024/
│   ├── programs/
│   ├── events/
│   └── nature/
└── 2023/
    └── ...
```

**Update gallery.js** (lines 6-100):
Replace sample photo data with actual photo metadata from `CONTENT_TO_PROVIDE.md` → Section 15 → Gallery Images

**Photo Data Structure:**
```javascript
{
  id: 1,
  title: "[Photo title]",
  description: "[Photo description]",
  category: "programs|events|trainings|nature",
  year: 2025,
  date: "YYYY-MM-DD",
  location: "[Location]",
  image: "gallery/2025/programs/photo-1.jpg"
}
```

---

## 13. FUTURE PLANS PAGE

### Strategic Goals & Objectives

**Update in:** `future-plans.html`
**Lines:** 67-173 (Strategic Roadmap section)

**Current:** 5 milestones with placeholder objectives (2026-2030+)

**Replace with:** Actual strategic goals from `CONTENT_TO_PROVIDE.md` → Section 16 → Strategic Goals

**For each milestone (example - 2026):**
```html
<!-- Lines 77-98 for 2026 milestone -->
<div class="milestone-year">2026</div>
<div class="milestone-dot"></div>
<div class="milestone-content">
  <h3>Expand to 20 Districts</h3>
  <ul>
    <li>Establish regional offices in 8 new districts</li>
    <li>Train 500+ farmers in sustainable agriculture practices</li>
    <li>Plant 25,000 indigenous trees across expansion districts</li>
  </ul>
</div>
```

**Repeat for:**
- 2027 milestone (lines 103-120)
- 2028 milestone (lines 125-142)
- 2029 milestone (lines 147-164)
- 2030+ milestone (lines 169-186)

---

### Current Impact Metrics

**Update in:** `future-plans.html`
**Lines:** 42-58 (Where We Stand Today section)

**Current Placeholder:**
```html
<div class="stat-number">50,000+</div>
<div class="stat-label">Trees Planted</div>
...
<div class="stat-number">12</div>
<div class="stat-label">Districts Covered</div>
...
<div class="stat-number">15,000+</div>
<div class="stat-label">Lives Impacted</div>
```

**Replace with:** Actual current impact numbers from `CONTENT_TO_PROVIDE.md` → Section 7 → Impact Metrics

---

## 14. PRIVACY POLICY PAGE

### ✅ Page Already Built - Customization Only

**File:** `privacy.html` (480 lines, 11 comprehensive sections)

**Action Required:** Review and customize specific organizational details

**Updates Needed:**

1. **Data Retention Period** (Section 6 - Data Security)
   **Lines:** 120-125
   **Current:** "We retain personal information only as long as necessary..."
   **Add:** Specific retention period from `CONTENT_TO_PROVIDE.md` → Section 18 → Data Retention Period

2. **Third-Party Services** (Section 5 - How We Share Your Information)
   **Lines:** 88-95
   **Current:** Generic mention of "payment processors" and "analytics"
   **Update:** Specific service names (e.g., "Razorpay", "Google Analytics 4")

3. **Cookie Types** (Section 4 - Cookies and Tracking)
   **Lines:** 73-82
   **Review:** Confirm cookie types match actual implementation

4. **Contact Email for Privacy**
   **Lines:** 168-170
   **Current:** info@vefs.org
   **Update:** If you have a dedicated privacy email (e.g., privacy@vefs.org)

5. **Last Updated Date**
   **Line:** 21
   **Current:** December 26, 2025
   **Update:** To actual publication date when going live

**Legal Review:** Have a lawyer review the entire document before publication

---

## 15. TERMS OF SERVICE PAGE

### ✅ Page Already Built - Customization Only

**File:** `terms.html` (510 lines, 13 comprehensive sections)

**Action Required:** Review and customize specific organizational policies

**Updates Needed:**

1. **Cancellation Policy** (Section 4 - Program and Event Registrations)
   **Lines:** 86-90
   **Current:** "24-hour advance notice required for cancellations"
   **Confirm:** This aligns with actual policy from `CONTENT_TO_PROVIDE.md` → Section 18

2. **Refund Policy** (Section 5.4 - Refund Policy)
   **Lines:** 138-142
   **Current:** "Case-by-case basis for processing errors"
   **Confirm:** This matches actual practice

3. **80G Certificate Process** (Section 5.1 - Donation Terms)
   **Lines:** 110-112
   **Add details:** How donors will receive 80G certificates (email, mail, download?)
   **From:** `CONTENT_TO_PROVIDE.md` → Section 18 → 80G Certificate Process

4. **Payment Processor Names** (Section 5.2 - Payment Processing)
   **Lines:** 118-122
   **Current:** Generic "third-party payment processors"
   **Update:** Specific names (e.g., "Razorpay" or "bank transfer only")

5. **Contact Email for Legal**
   **Lines:** 216-218
   **Current:** info@vefs.org
   **Update:** If you have a dedicated legal/terms email

6. **Last Updated Date**
   **Line:** 21
   **Current:** December 26, 2025
   **Update:** To actual publication date when going live

**Legal Review:** Have a lawyer review the entire document, especially:
- Liability disclaimers (Section 8)
- Indemnification clause (Section 9)
- Governing law and jurisdiction (Section 11)

---

## WORKFLOW CHECKLIST

### Step 1: Content Collection ✅
- [ ] Fill out `CONTENT_TO_PROVIDE.md` completely
- [ ] Review all sections for accuracy
- [ ] Get approval from founder/trustees

### Step 2: Image Preparation
- [ ] Collect all required images
- [ ] Resize images to specified dimensions
- [ ] Optimize images (reduce file size)
- [ ] Name files according to convention
- [ ] Organize into folder structure

### Step 3: Content Integration
- [ ] Update contact information (all pages)
- [ ] Update About page content
- [ ] Update Home page images
- [ ] Update logo and favicon
- [ ] Update programs.json
- [ ] Update events.json
- [ ] Update trainings.json
- [ ] Add Google Maps embed
- [ ] Add video URL (if available)

### Step 4: Testing
- [ ] Open each page in browser
- [ ] Verify all images load correctly
- [ ] Test all links (email, phone, social media)
- [ ] Check Google Maps works
- [ ] Test contact form
- [ ] Verify dynamic content loads (programs, events)
- [ ] Test on mobile device

### Step 5: Final Review
- [ ] Proofread all text content
- [ ] Verify contact information accuracy
- [ ] Check image quality
- [ ] Test accessibility (screen reader, keyboard)
- [ ] Run Lighthouse audit
- [ ] Get stakeholder approval

---

## PRIORITY ORDER

**Do First (Critical):**
1. ✅ Contact information (phone, email, address)
2. ✅ Founder information (name, bio, photo)
3. ✅ Foundation story (3 paragraphs)
4. ✅ Mission and vision statements
5. ✅ Logo and favicon
6. ✅ Hero carousel images (4 images)

**Do Second (Important):**
7. ⬜ Programs data (at least 3-5 programs)
8. ⬜ Events data (at least 2-3 upcoming events)
9. ⬜ Trustees information (3 people)
10. ⬜ Impact metrics (statistics)
11. ⬜ Google Maps embed
12. ⬜ Social media links

**Do Third (Nice to Have):**
13. ⬜ Trainings data
14. ⬜ Timeline milestones
15. ⬜ Founder message video
16. ⬜ Bank details (for donation page)
17. ⬜ Gallery images
18. ⬜ Future plans content

---

## QUESTIONS OR ISSUES?

**If you encounter any problems:**
1. Mark the section with ❓ in `CONTENT_TO_PROVIDE.md`
2. Add a comment explaining the issue
3. Continue with other sections
4. Reach out for clarification

**Common Questions:**

**Q: I don't have professional photos yet**
A: Use the best available photos for now. You can replace them later with professional shots.

**Q: I don't have exact numbers for impact metrics**
A: Provide your best estimates. We can update them as you track more data.

**Q: Our programs are still being finalized**
A: Start with the confirmed programs. We can add more later.

**Q: Video is not ready yet**
A: Leave the placeholder for now. The site works fine without it.

---

**Document Version:** 2.0
**Date Created:** December 25, 2025
**Last Updated:** December 26, 2025 (Added Phase 4-5 page mappings: trainings, donate, gallery, future-plans, privacy, terms)
**Next Update:** After content integration and backend deployment

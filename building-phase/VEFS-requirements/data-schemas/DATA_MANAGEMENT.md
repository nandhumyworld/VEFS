# VEFS Data Management & Schemas

**Status:** Complete
**Priority:** High (Technical Foundation)
**Created:** 2025-12-23

## Overview

This document defines the data management approach for VEFS website dynamic content. Events and Trainings are stored in JSON files that can be directly edited and uploaded to Hostinger shared hosting. The website uses vanilla JavaScript and PHP to read and display the data.

**Hosting Environment:** Hostinger shared hosting (PHP + JavaScript)
**No Build Process:** Static HTML/CSS/JS with client-side rendering
**File Access:** FTP/Hostinger File Manager for uploads

---

## Technical Constraints

### What This Hosting Environment Provides

✅ **Available:**
- Static HTML, CSS, JavaScript files (starts from `index.html`)
- PHP support (latest versions available)
- MySQL database (if needed in future)
- FTP/SFTP access
- Hostinger File Manager (web-based)
- Standard Apache web server
- .htaccess configuration
- Cron jobs (scheduled tasks)

❌ **NOT Available:**
- Node.js runtime or npm packages
- Build tools (Webpack, Vite, etc.)
- CI/CD pipelines (GitHub Actions, etc.)
- Auto-deployment from Git
- Server-side frameworks (Next.js, Express, etc.)
- WebSocket servers
- Custom server applications

### What This Means for Data Management

1. **JSON files are static files** served directly by Apache
2. **JavaScript reads JSON** via `fetch()` API in the browser
3. **PHP can process JSON** if server-side logic needed
4. **Updates require manual upload** via FTP or File Manager
5. **No automatic rebuild** - changes take effect immediately after upload
6. **Validation happens client-side** or in PHP, not in a build process

---

## File Structure

### Location
```
project-root/
├── data/
│   ├── events.json          # All events data
│   ├── trainings.json       # All trainings data
│   └── schemas/             # JSON schema definitions
│       ├── event-schema.json
│       └── training-schema.json
```

### File Organization
- **Single file approach:** All events in one file, all trainings in one file
- **Format:** Valid JSON with proper formatting (2-space indentation)
- **Encoding:** UTF-8
- **Line endings:** LF (Unix-style)

---

## Events Schema

### File: `data/events.json`

```json
{
  "events": [
    {
      "id": "evt-001",
      "title": "Workshop on Indigenous Trees",
      "slug": "workshop-indigenous-trees-2025",
      "type": "workshop",
      "status": "upcoming",
      "featured": true,
      "date": {
        "start": "2025-02-15T09:00:00+05:30",
        "end": "2025-02-15T17:00:00+05:30",
        "timezone": "Asia/Kolkata"
      },
      "duration": {
        "value": 8,
        "unit": "hours"
      },
      "location": {
        "type": "in-person",
        "venue": "VEFS Community Center",
        "address": "123 Main Street, Coimbatore, Tamil Nadu 641001",
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "coordinates": {
          "lat": 11.0168,
          "lng": 76.9558
        }
      },
      "audience": ["students", "general-public"],
      "targetAudience": "Students and environmental enthusiasts",
      "capacity": {
        "total": 50,
        "registered": 32,
        "available": 18
      },
      "description": {
        "brief": "Learn about ancient Tamil indigenous trees and their ecological importance.",
        "full": "This comprehensive workshop explores indigenous tree species mentioned in Tamil Sangha literature. Participants will learn identification techniques, ecological significance, and conservation methods. The session includes hands-on activities and field demonstrations.",
        "objectives": [
          "Identify 10+ indigenous tree species",
          "Understand ecological roles of native trees",
          "Learn propagation techniques",
          "Explore cultural significance in Tamil literature"
        ],
        "activities": [
          "Morning session: Tree identification walkthrough",
          "Afternoon: Propagation techniques demonstration",
          "Group discussion on conservation strategies",
          "Q&A with expert botanists"
        ]
      },
      "facilitators": [
        {
          "name": "Dr. Rajesh Kumar",
          "title": "Environmental Scientist",
          "bio": "20+ years experience in native tree conservation",
          "photo": "/images/facilitators/rajesh-kumar.jpg"
        }
      ],
      "registration": {
        "required": true,
        "url": "/events/evt-001/register",
        "deadline": "2025-02-10T23:59:59+05:30",
        "fee": {
          "amount": 0,
          "currency": "INR",
          "type": "free"
        }
      },
      "requirements": {
        "age": {
          "min": 12,
          "max": null
        },
        "prerequisites": "None",
        "whatToBring": ["Notebook", "Pen", "Water bottle", "Hat/cap for field work"],
        "dressCode": "Comfortable outdoor clothing, closed-toe shoes"
      },
      "logistics": {
        "meals": ["Lunch", "Snacks"],
        "parking": true,
        "accessibility": "Wheelchair accessible",
        "transportation": "Bus stop 200m from venue"
      },
      "media": {
        "featuredImage": "/images/events/evt-001-featured.jpg",
        "gallery": [
          "/images/events/evt-001-1.jpg",
          "/images/events/evt-001-2.jpg",
          "/images/events/evt-001-3.jpg"
        ],
        "video": null
      },
      "tags": ["trees", "indigenous", "workshop", "education"],
      "relatedPrograms": ["prog-003"],
      "cancellationPolicy": "Free cancellation up to 2 days before event",
      "metadata": {
        "createdAt": "2024-12-01T10:00:00+05:30",
        "updatedAt": "2024-12-20T15:30:00+05:30",
        "createdBy": "admin",
        "publishedAt": "2024-12-05T09:00:00+05:30"
      }
    }
  ],
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-01-15T10:00:00+05:30",
    "totalEvents": 1
  }
}
```

### Event Field Definitions

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | ✓ | Unique identifier | Format: `evt-XXX` (3+ digits) |
| `title` | string | ✓ | Event title | 5-150 characters |
| `slug` | string | ✓ | URL-friendly identifier | Lowercase, hyphens only |
| `type` | string | ✓ | Event category | Enum: `workshop`, `seminar`, `field-visit`, `trekking`, `competition`, `gathering`, `other` |
| `status` | string | ✓ | Current status | Enum: `upcoming`, `ongoing`, `completed`, `cancelled` |
| `featured` | boolean | ✗ | Show in featured section | Default: `false` |
| `date.start` | string | ✓ | Start date/time | ISO 8601 format with timezone |
| `date.end` | string | ✓ | End date/time | ISO 8601 format with timezone |
| `date.timezone` | string | ✓ | Timezone | IANA timezone identifier |
| `duration.value` | number | ✓ | Duration amount | Positive number |
| `duration.unit` | string | ✓ | Duration unit | Enum: `hours`, `days`, `weeks` |
| `location.type` | string | ✓ | Location type | Enum: `in-person`, `online`, `hybrid` |
| `location.venue` | string | ✓ (if in-person) | Venue name | 3-200 characters |
| `location.address` | string | ✓ (if in-person) | Full address | 10-500 characters |
| `location.city` | string | ✓ | City name | 2-100 characters |
| `location.state` | string | ✓ | State name | 2-100 characters |
| `location.coordinates.lat` | number | ✗ | Latitude | -90 to 90 |
| `location.coordinates.lng` | number | ✗ | Longitude | -180 to 180 |
| `audience` | array | ✓ | Target audiences | Array of: `students`, `farmers`, `women`, `general-public`, `families` |
| `targetAudience` | string | ✓ | Audience description | 10-300 characters |
| `capacity.total` | number | ✗ | Total capacity | Positive integer |
| `capacity.registered` | number | ✗ | Currently registered | Non-negative integer |
| `capacity.available` | number | ✗ | Spots available | Non-negative integer |
| `description.brief` | string | ✓ | Short description | 20-300 characters |
| `description.full` | string | ✓ | Full description | 100-2000 characters |
| `description.objectives` | array | ✓ | Learning objectives | Array of strings, 2-10 items |
| `description.activities` | array | ✓ | Activities list | Array of strings, 2-20 items |
| `facilitators` | array | ✓ | Facilitator details | Array of objects, 1-10 items |
| `facilitators[].name` | string | ✓ | Facilitator name | 2-100 characters |
| `facilitators[].title` | string | ✓ | Professional title | 2-150 characters |
| `facilitators[].bio` | string | ✓ | Short biography | 20-500 characters |
| `facilitators[].photo` | string | ✗ | Photo URL | Valid URL path |
| `registration.required` | boolean | ✓ | Registration needed | true/false |
| `registration.url` | string | ✗ | Registration URL | Valid URL path |
| `registration.deadline` | string | ✗ | Registration deadline | ISO 8601 format |
| `registration.fee.amount` | number | ✓ | Fee amount | Non-negative number |
| `registration.fee.currency` | string | ✓ | Currency code | ISO 4217 code (e.g., `INR`) |
| `registration.fee.type` | string | ✓ | Fee type | Enum: `free`, `paid`, `donation` |
| `requirements.age.min` | number | ✗ | Minimum age | Positive integer |
| `requirements.age.max` | number | ✗ | Maximum age | Positive integer or null |
| `requirements.prerequisites` | string | ✗ | Prerequisites | 0-500 characters |
| `requirements.whatToBring` | array | ✗ | Items to bring | Array of strings |
| `requirements.dressCode` | string | ✗ | Dress code | 0-200 characters |
| `logistics.meals` | array | ✗ | Meals provided | Array of strings |
| `logistics.parking` | boolean | ✗ | Parking available | true/false |
| `logistics.accessibility` | string | ✗ | Accessibility info | 0-300 characters |
| `logistics.transportation` | string | ✗ | Transportation info | 0-300 characters |
| `media.featuredImage` | string | ✓ | Featured image URL | Valid URL path |
| `media.gallery` | array | ✗ | Gallery images | Array of URL paths |
| `media.video` | string | ✗ | Video URL | Valid URL or null |
| `tags` | array | ✓ | Search tags | Array of strings, 2-10 items |
| `relatedPrograms` | array | ✗ | Related program IDs | Array of program IDs |
| `cancellationPolicy` | string | ✗ | Cancellation policy | 0-500 characters |
| `metadata.createdAt` | string | ✓ | Creation timestamp | ISO 8601 format |
| `metadata.updatedAt` | string | ✓ | Last update timestamp | ISO 8601 format |
| `metadata.createdBy` | string | ✓ | Creator username | 2-50 characters |
| `metadata.publishedAt` | string | ✗ | Publish timestamp | ISO 8601 format |

---

## Trainings Schema

### File: `data/trainings.json`

```json
{
  "trainings": [
    {
      "id": "trn-001",
      "title": "Sustainable Farming Techniques",
      "slug": "sustainable-farming-techniques-2025",
      "category": "farming",
      "status": "open",
      "featured": false,
      "schedule": {
        "type": "multi-session",
        "sessions": [
          {
            "sessionNumber": 1,
            "date": "2025-03-01T09:00:00+05:30",
            "duration": 4,
            "topic": "Introduction to Sustainable Farming"
          },
          {
            "sessionNumber": 2,
            "date": "2025-03-08T09:00:00+05:30",
            "duration": 4,
            "topic": "Organic Pest Management"
          },
          {
            "sessionNumber": 3,
            "date": "2025-03-15T09:00:00+05:30",
            "duration": 4,
            "topic": "Soil Health and Composting"
          }
        ],
        "timezone": "Asia/Kolkata"
      },
      "totalDuration": {
        "value": 3,
        "unit": "weeks"
      },
      "location": {
        "type": "hybrid",
        "venue": "VEFS Training Center",
        "address": "456 Farm Road, Pollachi, Tamil Nadu 642001",
        "city": "Pollachi",
        "state": "Tamil Nadu",
        "onlineLink": "https://meet.vefs.org/trn-001",
        "coordinates": {
          "lat": 10.6579,
          "lng": 77.0089
        }
      },
      "audience": ["farmers"],
      "targetAudience": "Farmers seeking sustainable agricultural practices",
      "capacity": {
        "total": 30,
        "registered": 18,
        "available": 12
      },
      "description": {
        "brief": "Comprehensive training on sustainable and organic farming techniques for small-scale farmers.",
        "full": "This three-week training program covers essential sustainable farming practices including organic pest management, soil health improvement, water conservation, and crop rotation strategies. Participants will gain hands-on experience through field demonstrations and practical exercises.",
        "objectives": [
          "Understand principles of sustainable agriculture",
          "Master organic pest control methods",
          "Improve soil health through natural techniques",
          "Implement water conservation strategies",
          "Plan effective crop rotation"
        ],
        "curriculum": [
          {
            "week": 1,
            "topics": ["Sustainable farming principles", "Assessment of current practices", "Introduction to organic methods"]
          },
          {
            "week": 2,
            "topics": ["Natural pest management", "Beneficial insects", "Organic pesticide preparation", "Field demonstration"]
          },
          {
            "week": 3,
            "topics": ["Soil testing", "Composting techniques", "Cover cropping", "Water management"]
          }
        ],
        "outcomes": [
          "Ability to implement sustainable practices on own farm",
          "Reduced dependency on chemical inputs",
          "Improved soil health and crop yields",
          "Cost savings through natural methods"
        ]
      },
      "facilitators": [
        {
          "name": "Mr. Senthil Kumar",
          "title": "Organic Farming Expert",
          "bio": "15 years of experience in sustainable agriculture training",
          "photo": "/images/facilitators/senthil-kumar.jpg"
        },
        {
          "name": "Dr. Priya Devi",
          "title": "Soil Scientist",
          "bio": "Specialist in soil health and organic farming systems",
          "photo": "/images/facilitators/priya-devi.jpg"
        }
      ],
      "registration": {
        "required": true,
        "url": "/trainings/trn-001/register",
        "deadline": "2025-02-20T23:59:59+05:30",
        "fee": {
          "amount": 500,
          "currency": "INR",
          "type": "paid",
          "scholarships": true,
          "earlyBird": {
            "amount": 400,
            "deadline": "2025-02-10T23:59:59+05:30"
          }
        }
      },
      "requirements": {
        "prerequisites": "Basic farming experience preferred but not required",
        "whatToBring": ["Notebook", "Samples from own farm (optional)", "Comfortable outdoor clothing"],
        "language": ["Tamil", "English"],
        "education": "No formal education requirement"
      },
      "certificate": {
        "provided": true,
        "type": "Certificate of Completion",
        "criteria": "Attend all 3 sessions and complete practical assignments"
      },
      "logistics": {
        "meals": ["Lunch", "Tea"],
        "materials": "All training materials provided",
        "parking": true,
        "accommodation": false,
        "accessibility": "Ground floor, wheelchair accessible"
      },
      "media": {
        "featuredImage": "/images/trainings/trn-001-featured.jpg",
        "gallery": [
          "/images/trainings/trn-001-1.jpg",
          "/images/trainings/trn-001-2.jpg"
        ],
        "video": "/videos/trainings/trn-001-intro.mp4"
      },
      "tags": ["sustainable-farming", "organic", "agriculture", "training"],
      "relatedPrograms": ["prog-002"],
      "followUp": {
        "provided": true,
        "description": "Monthly follow-up sessions for 6 months",
        "contact": "support@vefs.org"
      },
      "metadata": {
        "createdAt": "2024-11-15T10:00:00+05:30",
        "updatedAt": "2024-12-22T14:00:00+05:30",
        "createdBy": "admin",
        "publishedAt": "2024-11-20T09:00:00+05:30"
      }
    }
  ],
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-01-15T10:00:00+05:30",
    "totalTrainings": 1
  }
}
```

### Training Field Definitions

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | ✓ | Unique identifier | Format: `trn-XXX` (3+ digits) |
| `title` | string | ✓ | Training title | 5-150 characters |
| `slug` | string | ✓ | URL-friendly identifier | Lowercase, hyphens only |
| `category` | string | ✓ | Training category | Enum: `farming`, `education`, `conservation`, `leadership`, `technical`, `other` |
| `status` | string | ✓ | Current status | Enum: `open`, `full`, `in-progress`, `completed`, `cancelled` |
| `featured` | boolean | ✗ | Featured training | Default: `false` |
| `schedule.type` | string | ✓ | Schedule format | Enum: `single-session`, `multi-session`, `ongoing` |
| `schedule.sessions` | array | ✓ (if multi) | Session details | Array of session objects |
| `schedule.sessions[].sessionNumber` | number | ✓ | Session number | Positive integer |
| `schedule.sessions[].date` | string | ✓ | Session date/time | ISO 8601 format |
| `schedule.sessions[].duration` | number | ✓ | Duration in hours | Positive number |
| `schedule.sessions[].topic` | string | ✓ | Session topic | 5-200 characters |
| `schedule.timezone` | string | ✓ | Timezone | IANA timezone identifier |
| `totalDuration.value` | number | ✓ | Total duration | Positive number |
| `totalDuration.unit` | string | ✓ | Duration unit | Enum: `hours`, `days`, `weeks`, `months` |
| `location.type` | string | ✓ | Location type | Enum: `in-person`, `online`, `hybrid` |
| `location.venue` | string | ✓ (if in-person) | Venue name | 3-200 characters |
| `location.address` | string | ✓ (if in-person) | Full address | 10-500 characters |
| `location.city` | string | ✓ | City name | 2-100 characters |
| `location.state` | string | ✓ | State name | 2-100 characters |
| `location.onlineLink` | string | ✗ (if online/hybrid) | Online meeting link | Valid URL |
| `location.coordinates.lat` | number | ✗ | Latitude | -90 to 90 |
| `location.coordinates.lng` | number | ✗ | Longitude | -180 to 180 |
| `audience` | array | ✓ | Target audiences | Array of: `students`, `farmers`, `women`, `general-public` |
| `targetAudience` | string | ✓ | Audience description | 10-300 characters |
| `capacity.total` | number | ✗ | Total capacity | Positive integer |
| `capacity.registered` | number | ✗ | Currently registered | Non-negative integer |
| `capacity.available` | number | ✗ | Spots available | Non-negative integer |
| `description.brief` | string | ✓ | Short description | 20-300 characters |
| `description.full` | string | ✓ | Full description | 100-2000 characters |
| `description.objectives` | array | ✓ | Learning objectives | Array of strings, 3-15 items |
| `description.curriculum` | array | ✓ | Curriculum breakdown | Array of week/topic objects |
| `description.outcomes` | array | ✓ | Expected outcomes | Array of strings, 2-10 items |
| `facilitators` | array | ✓ | Facilitator details | Array of objects, 1-10 items |
| `facilitators[].name` | string | ✓ | Facilitator name | 2-100 characters |
| `facilitators[].title` | string | ✓ | Professional title | 2-150 characters |
| `facilitators[].bio` | string | ✓ | Short biography | 20-500 characters |
| `facilitators[].photo` | string | ✗ | Photo URL | Valid URL path |
| `registration.required` | boolean | ✓ | Registration needed | true/false |
| `registration.url` | string | ✗ | Registration URL | Valid URL path |
| `registration.deadline` | string | ✗ | Registration deadline | ISO 8601 format |
| `registration.fee.amount` | number | ✓ | Fee amount | Non-negative number |
| `registration.fee.currency` | string | ✓ | Currency code | ISO 4217 code |
| `registration.fee.type` | string | ✓ | Fee type | Enum: `free`, `paid`, `donation` |
| `registration.fee.scholarships` | boolean | ✗ | Scholarships available | true/false |
| `registration.fee.earlyBird.amount` | number | ✗ | Early bird price | Positive number |
| `registration.fee.earlyBird.deadline` | string | ✗ | Early bird deadline | ISO 8601 format |
| `requirements.prerequisites` | string | ✗ | Prerequisites | 0-500 characters |
| `requirements.whatToBring` | array | ✗ | Items to bring | Array of strings |
| `requirements.language` | array | ✗ | Languages offered | Array of strings |
| `requirements.education` | string | ✗ | Education requirement | 0-200 characters |
| `certificate.provided` | boolean | ✓ | Certificate offered | true/false |
| `certificate.type` | string | ✗ | Certificate type | 5-100 characters |
| `certificate.criteria` | string | ✗ | Completion criteria | 10-300 characters |
| `logistics.meals` | array | ✗ | Meals provided | Array of strings |
| `logistics.materials` | string | ✗ | Materials info | 0-300 characters |
| `logistics.parking` | boolean | ✗ | Parking available | true/false |
| `logistics.accommodation` | boolean | ✗ | Accommodation provided | true/false |
| `logistics.accessibility` | string | ✗ | Accessibility info | 0-300 characters |
| `media.featuredImage` | string | ✓ | Featured image URL | Valid URL path |
| `media.gallery` | array | ✗ | Gallery images | Array of URL paths |
| `media.video` | string | ✗ | Video URL | Valid URL or null |
| `tags` | array | ✓ | Search tags | Array of strings, 2-10 items |
| `relatedPrograms` | array | ✗ | Related program IDs | Array of program IDs |
| `followUp.provided` | boolean | ✗ | Follow-up offered | true/false |
| `followUp.description` | string | ✗ | Follow-up details | 10-300 characters |
| `followUp.contact` | string | ✗ | Follow-up contact | Valid email |
| `metadata.createdAt` | string | ✓ | Creation timestamp | ISO 8601 format |
| `metadata.updatedAt` | string | ✓ | Last update timestamp | ISO 8601 format |
| `metadata.createdBy` | string | ✓ | Creator username | 2-50 characters |
| `metadata.publishedAt` | string | ✗ | Publish timestamp | ISO 8601 format |

---

## Validation Rules

### JSON Schema Files

**Location:** `data/schemas/event-schema.json` and `data/schemas/training-schema.json`

These files contain formal JSON Schema definitions for validation. Any JSON editing tool or CI/CD pipeline can validate against these schemas before deployment.

### Validation Triggers

1. **Pre-commit validation** (Git hook)
2. **Pre-build validation** (Build process)
3. **Editor validation** (IDE/text editor with JSON Schema support)

### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing required field | Field marked ✓ is absent | Add the required field |
| Invalid date format | Date not ISO 8601 | Use format: `YYYY-MM-DDTHH:MM:SS+05:30` |
| Invalid enum value | Value not in allowed list | Use one of the specified enum values |
| Invalid ID format | ID doesn't match pattern | Use `evt-XXX` or `trn-XXX` format |
| Duplicate ID | ID already exists | Use unique ID for each item |
| Invalid URL path | Path format incorrect | Use valid path starting with `/` |
| Capacity mismatch | registered + available ≠ total | Ensure numbers add up correctly |
| Past deadline | Deadline before start date | Deadline must be before event/training starts |
| Invalid coordinates | Lat/lng out of range | Use valid GPS coordinates |

---

## Editing Workflow

### Step 1: Download JSON Files from Hostinger

**Option A: Using Hostinger File Manager**
1. Log into Hostinger control panel
2. Navigate to File Manager
3. Go to `public_html/data/` directory
4. Download `events.json` or `trainings.json`

**Option B: Using FTP Client (FileZilla, WinSCP)**
1. Connect to Hostinger via FTP
2. Navigate to `public_html/data/` directory
3. Download JSON files to local computer

### Step 2: Edit JSON Files Locally

Open `events.json` or `trainings.json` in your text editor:

```bash
# Using VSCode
code events.json

# Using Notepad++
notepad++ events.json

# Using any text editor
notepad events.json
```

### Step 3: Add/Edit Entry

#### Adding a New Event

1. Copy an existing event object
2. Update all fields with new information
3. Generate new unique ID (e.g., `evt-045`)
4. Update `metadata.totalEvents` count
5. Update `metadata.lastUpdated` timestamp
6. **Save file**

#### Editing an Existing Event

1. Find event by ID
2. Modify necessary fields
3. Update `metadata.updatedAt` timestamp
4. Update root-level `metadata.lastUpdated`
5. **Save file**

#### Deleting an Event

1. Remove entire event object from array
2. Update `metadata.totalEvents` count
3. Update `metadata.lastUpdated` timestamp
4. **Save file**

### Step 4: Validate JSON (Optional but Recommended)

**Online Validators:**
- Use https://jsonlint.com/ to check syntax
- Paste JSON content and click "Validate JSON"
- Fix any syntax errors shown

**Local Validation (if Node.js installed):**
```bash
# Check JSON syntax
npx jsonlint events.json
```

### Step 5: Upload to Hostinger

**Option A: Using Hostinger File Manager**
1. Log into Hostinger control panel
2. Navigate to File Manager
3. Go to `public_html/data/` directory
4. Upload the edited JSON file (overwrite existing)
5. Confirm upload complete

**Option B: Using FTP Client**
1. Connect to Hostinger via FTP
2. Navigate to `public_html/data/` directory
3. Upload edited JSON file (overwrite existing)
4. Verify file uploaded successfully

### Step 6: Test on Website

1. Open website in browser
2. Navigate to Events or Trainings page
3. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. Verify new/updated data appears correctly
5. If not appearing, check browser console for errors

---

## Website Integration (Hostinger Static Hosting)

### File Structure on Server

```
public_html/
├── index.html
├── events.html
├── trainings.html
├── css/
│   └── style.css
├── js/
│   ├── events.js
│   └── trainings.js
├── data/
│   ├── events.json
│   └── trainings.json
└── php/
    └── get-data.php (optional)
```

### Frontend Integration Options

**Option 1: Direct JavaScript Fetch (Recommended)**

This is the simplest approach for Hostinger static hosting.

**In `events.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Events | VEFS</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="events-container">
        <p>Loading events...</p>
    </div>

    <script src="js/events.js"></script>
</body>
</html>
```

**In `js/events.js`:**
```javascript
// Fetch events.json and display
async function loadEvents() {
    try {
        const response = await fetch('/data/events.json');
        if (!response.ok) throw new Error('Failed to load events');

        const data = await response.json();
        const events = data.events;

        // Filter to show only upcoming events
        const upcomingEvents = events.filter(event =>
            event.status === 'upcoming' || event.status === 'ongoing'
        );

        // Render events
        renderEvents(upcomingEvents);
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-container').innerHTML =
            '<p>Sorry, unable to load events at this time.</p>';
    }
}

function renderEvents(events) {
    const container = document.getElementById('events-container');

    if (events.length === 0) {
        container.innerHTML = '<p>No upcoming events at this time.</p>';
        return;
    }

    let html = '<div class="events-grid">';

    events.forEach(event => {
        html += `
            <div class="event-card" data-id="${event.id}">
                <img src="${event.media.featuredImage}" alt="${event.title}">
                <div class="event-info">
                    <span class="event-type">${event.type}</span>
                    <span class="event-date">${formatDate(event.date.start)}</span>
                    <h3>${event.title}</h3>
                    <p>${event.description.brief}</p>
                    <p class="event-location">${event.location.city}, ${event.location.state}</p>
                    <button onclick="showEventDetail('${event.id}')">Learn More</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function showEventDetail(eventId) {
    // Open modal or navigate to detail page
    window.location.href = `event-detail.html?id=${eventId}`;
}

// Load events when page loads
document.addEventListener('DOMContentLoaded', loadEvents);
```

**Option 2: PHP to Serve JSON (If PHP processing needed)**

Useful if you want to add server-side filtering or validation.

**Create `php/get-data.php`:**
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get request parameters
$type = isset($_GET['type']) ? $_GET['type'] : 'events';
$status = isset($_GET['status']) ? $_GET['status'] : 'all';

// Read JSON file
$jsonFile = '../data/' . $type . '.json';

if (!file_exists($jsonFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

$jsonContent = file_get_contents($jsonFile);
$data = json_decode($jsonContent, true);

// Validate JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON format']);
    exit;
}

// Filter by status if requested
if ($status !== 'all' && isset($data[$type])) {
    $data[$type] = array_filter($data[$type], function($item) use ($status) {
        return isset($item['status']) && $item['status'] === $status;
    });
    // Re-index array
    $data[$type] = array_values($data[$type]);
}

// Return filtered data
echo json_encode($data);
?>
```

**Use PHP endpoint in JavaScript:**
```javascript
async function loadEvents(status = 'upcoming') {
    try {
        const response = await fetch(`/php/get-data.php?type=events&status=${status}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        renderEvents(data.events);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### Caching Considerations

**Browser Caching:**
- JSON files will be cached by browser
- Users may not see updates immediately
- Solution: Add cache-busting query parameter

**Cache-busting example:**
```javascript
// Add timestamp to force fresh data
const timestamp = new Date().getTime();
fetch(`/data/events.json?v=${timestamp}`)
```

**Or use proper cache headers in PHP:**
```php
<?php
// In get-data.php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
// ... rest of code
?>
```

---

## Status Management

### Event Status Lifecycle

```
upcoming → ongoing → completed
              ↓
          cancelled
```

- **upcoming:** Event date is in the future
- **ongoing:** Event is currently happening
- **completed:** Event has finished
- **cancelled:** Event was cancelled

### Training Status Lifecycle

```
open → in-progress → completed
  ↓
full
  ↓
cancelled
```

- **open:** Registration open, spots available
- **full:** Registration open, but capacity reached
- **in-progress:** Training sessions have begun
- **completed:** All sessions finished
- **cancelled:** Training was cancelled

### Automated Status Updates

Consider implementing automated status updates based on dates:

```javascript
// Pseudo-code for status automation
function updateEventStatus(event) {
  const now = new Date()
  const start = new Date(event.date.start)
  const end = new Date(event.date.end)

  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'ongoing'
  if (now > end) return 'completed'
}
```

---

## Best Practices

### Naming Conventions

**IDs:**
- Events: `evt-001`, `evt-002`, `evt-003`, ...
- Trainings: `trn-001`, `trn-002`, `trn-003`, ...
- Sequential numbering
- Zero-padded (3 digits minimum)

**Slugs:**
- Lowercase
- Hyphens for spaces
- Include year for clarity
- Example: `workshop-indigenous-trees-2025`

**File Paths:**
- Use forward slashes `/`
- Start with `/` for absolute paths
- Organize by type: `/images/events/`, `/images/trainings/`

### Date/Time Guidelines

**Always use ISO 8601 format:**
```
2025-03-15T09:00:00+05:30
```

- Include timezone offset
- Use 24-hour format
- Include seconds

**Timezone:**
- Always specify `Asia/Kolkata` for Tamil Nadu events
- Adjust for different regions if needed

### Image Management

**Image Guidelines:**
- **Featured Images:** 1200x675px (16:9 aspect ratio)
- **Gallery Images:** 800x600px (4:3 aspect ratio)
- **Facilitator Photos:** 400x400px (square)
- **Format:** WebP (primary), JPG (fallback)
- **Compression:** Optimized for web (<300KB)

**Naming Convention:**
```
/images/events/evt-001-featured.jpg
/images/events/evt-001-1.jpg
/images/trainings/trn-001-featured.jpg
/images/facilitators/john-doe.jpg
```

### Capacity Management

**Update capacity in real-time:**
```json
"capacity": {
  "total": 50,
  "registered": 32,
  "available": 18  // total - registered
}
```

**Always ensure:** `registered + available = total`

---

## Error Handling

### Build Failures

If validation fails:
1. Check error message for specific issue
2. Locate problematic field in JSON
3. Fix according to schema requirements
4. Re-run validation locally before committing

### Common Fixes

**Date format error:**
```json
// ❌ Wrong
"date": "2025-03-15"

// ✓ Correct
"date": "2025-03-15T09:00:00+05:30"
```

**Missing required field:**
```json
// ❌ Wrong (missing 'title')
{
  "id": "evt-001",
  "type": "workshop"
}

// ✓ Correct
{
  "id": "evt-001",
  "title": "Workshop Title",
  "type": "workshop"
}
```

**Invalid enum value:**
```json
// ❌ Wrong
"type": "seminar-workshop"

// ✓ Correct
"type": "workshop"
```

---

## Backup & Version Control

### Manual Backup Strategy (Hostinger)

Since files are managed via FTP/File Manager, implement a manual backup system:

**Recommended Backup Approach:**

1. **Before Editing:** Always download and save a backup copy
   ```
   events.json → events-backup-2025-01-15.json
   trainings.json → trainings-backup-2025-01-15.json
   ```

2. **Local Version Control:** Keep dated copies on your computer
   ```
   backups/
   ├── 2025-01-15/
   │   ├── events.json
   │   └── trainings.json
   ├── 2025-01-10/
   │   ├── events.json
   │   └── trainings.json
   ```

3. **Cloud Backup:** Store copies in Google Drive/Dropbox
   - Create a folder: "VEFS Website Data Backups"
   - Upload dated copies after major changes

4. **Hostinger File Manager Backup:**
   - Hostinger File Manager has a "compress" feature
   - Compress `data/` folder periodically
   - Download the ZIP as backup

### Optional: Git for Local Version Control

While not required for hosting, you can use Git locally for better tracking:

```bash
# Initialize local Git repository
git init
git add data/events.json data/trainings.json
git commit -m "Initial data files"

# After editing
git add data/events.json
git commit -m "Added March 2025 workshop event"
```

Benefits:
- Track all changes with commit history
- Easy rollback to previous versions
- No need to keep multiple dated files

### Rollback Procedure

**If using local backups:**
1. Locate the backup file you want to restore
2. Copy it and rename to `events.json` or `trainings.json`
3. Upload to Hostinger (overwrite current file)

**If using Git locally:**
```bash
# View history
git log data/events.json

# Revert to specific commit
git checkout <commit-hash> data/events.json

# Upload restored file to Hostinger
```

---

## Hostinger-Specific Considerations

### File Permissions

Ensure JSON files have proper read permissions on Hostinger:
- Files: 644 (read for everyone, write for owner)
- Folders: 755 (execute/read for everyone, write for owner)

Set via FTP client or File Manager if JSON files aren't loading.

### PHP Version

Hostinger supports multiple PHP versions:
- Recommended: PHP 8.0 or higher
- Set in Hostinger control panel under "PHP Configuration"

### .htaccess Configuration (Optional)

Create `.htaccess` in `data/` folder to set proper headers:

```apache
<Files "*.json">
    Header set Content-Type "application/json"
    Header set Access-Control-Allow-Origin "*"
    Header set Cache-Control "max-age=3600"
</Files>
```

### JSON File Size Limits

Hostinger has reasonable file size limits:
- Keep JSON files under 2MB for fast loading
- If files grow large, consider splitting by year or category

### Performance Tips

1. **Minimize JSON size:** Remove unnecessary whitespace in production
2. **Use compression:** Enable GZIP in Hostinger
3. **CDN:** Consider Cloudflare (free) for faster global access
4. **Lazy loading:** Load event details on-demand, not all at once

---

## Future Enhancements

### Potential Improvements for Hostinger Setup

1. **Simple Admin Panel (PHP-based):**
   - Web form to add/edit events without downloading JSON
   - Basic PHP script that reads/writes JSON files
   - Password-protected admin page
   - Example: `admin.php` with login

2. **PHP Validation Script:**
   - Server-side validation before saving
   - Check required fields
   - Validate date formats
   - Prevent duplicate IDs

3. **Image Upload Handler (PHP):**
   - Upload images via admin panel
   - Automatic resizing/optimization
   - Save to correct folder structure

4. **Automated Status Updates (PHP Cron):**
   - Hostinger supports cron jobs
   - Daily script to update event status based on dates
   - Automatically move "upcoming" → "completed"

5. **CSV Import/Export (PHP):**
   - Bulk upload events via CSV
   - Export current events to CSV for editing in Excel
   - Convert back to JSON

6. **Search Indexing (JavaScript):**
   - Generate search index from JSON
   - Fast client-side search
   - Filter by multiple criteria

7. **Email Notifications (PHP):**
   - Send email when new event added
   - Registration confirmation emails
   - Use PHP `mail()` function

8. **Analytics Integration:**
   - Track which events are viewed most
   - Google Analytics events
   - Simple PHP logging

### Low-Cost Admin Panel Example

**Basic `admin/add-event.php`:**
```php
<?php
// Simple password protection
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $newEvent = [
        'id' => $_POST['id'],
        'title' => $_POST['title'],
        'type' => $_POST['type'],
        'status' => $_POST['status'],
        // ... other fields
    ];

    // Read existing events
    $jsonFile = '../data/events.json';
    $data = json_decode(file_get_contents($jsonFile), true);

    // Add new event
    $data['events'][] = $newEvent;
    $data['metadata']['totalEvents']++;
    $data['metadata']['lastUpdated'] = date('c');

    // Save back to file
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));

    echo "Event added successfully!";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Add Event - VEFS Admin</title>
</head>
<body>
    <h1>Add New Event</h1>
    <form method="POST">
        <label>Event ID: <input name="id" required></label><br>
        <label>Title: <input name="title" required></label><br>
        <label>Type:
            <select name="type" required>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="field-visit">Field Visit</option>
            </select>
        </label><br>
        <!-- Add more fields -->
        <button type="submit">Add Event</button>
    </form>
</body>
</html>
```

This simple PHP admin panel can be built incrementally as needed.

---

## Documentation Maintenance

### When to Update This Document

- When adding new fields to schemas
- When changing validation rules
- When modifying build process
- When adding new enum values
- When changing file structure

### Schema Version Control

Update `metadata.version` in JSON files when making breaking changes:
- `1.0` → `1.1`: Minor changes (new optional fields)
- `1.1` → `2.0`: Major changes (breaking schema changes)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
**Maintained By:** Technical Documentation Team

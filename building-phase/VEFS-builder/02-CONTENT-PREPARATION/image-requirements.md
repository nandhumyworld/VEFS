# Image Requirements & Asset Management

**Project:** VEFS Website - Phase 2 Data Layer
**Document Version:** 1.0
**Created:** December 25, 2025
**Purpose:** Comprehensive guide for image assets required for VEFS website

---

## Overview

This document specifies all image requirements for the VEFS website including dimensions, formats, file sizes, naming conventions, and folder organization. All images referenced in JSON data files (events.json, trainings.json, programs.json) should follow these specifications.

**Important Note:** The JSON files currently contain placeholder image paths. Actual images will be provided by the user and uploaded to the specified locations.

---

## 1. Directory Structure

```
VEFS-website/images/
├── hero/                      # Homepage hero carousel images
│   ├── hero-slide-1.jpg
│   ├── hero-slide-2.jpg
│   ├── hero-slide-3.jpg
│   └── hero-slide-4.jpg
│
├── events/                    # Event images
│   ├── event-001-featured.jpg
│   ├── event-001-gallery-1.jpg
│   ├── event-002-featured.jpg
│   └── ... (12 events × ~3 images each)
│
├── trainings/                 # Training program images
│   ├── training-001-featured.jpg
│   ├── training-001-gallery-1.jpg
│   ├── training-002-featured.jpg
│   └── ... (7 trainings × ~2-3 images each)
│
├── programs/                  # Program images
│   ├── school-awareness-thumb.jpg
│   ├── school-awareness-hero.jpg
│   ├── school-awareness-gallery-1.jpg
│   ├── farmer-training-thumb.jpg
│   ├── farmer-training-hero.jpg
│   └── ... (8 programs × ~3-5 images each)
│
├── gallery/                   # Gallery page images (organized by event/date)
│   ├── 2024/
│   │   ├── 01-january/
│   │   ├── 02-february/
│   │   └── ...
│   ├── 2025/
│   │   ├── 01-january/
│   │   └── ...
│   └── categories/
│       ├── tree-planting/
│       ├── workshops/
│       ├── field-visits/
│       └── awareness-campaigns/
│
├── about/                     # About page images
│   ├── founder-profile.jpg
│   ├── team-group.jpg
│   ├── timeline-2019.jpg
│   └── ...
│
├── logos/                     # Logos and branding
│   ├── vefs-logo.png          # Main logo (transparent PNG)
│   ├── vefs-logo-white.png    # White version for dark backgrounds
│   ├── vefs-favicon.ico       # Favicon
│   └── vefs-og-image.jpg      # OpenGraph/social media image
│
└── icons/                     # SVG icons
    ├── tree.svg
    ├── graduation-cap.svg
    ├── tractor.svg
    └── ... (various program icons)
```

---

## 2. Image Specifications by Type

### 2.1 Hero Carousel Images

**Purpose:** Homepage hero slider (4 rotating slides)
**Location:** `/images/hero/`

| Specification | Value |
|--------------|-------|
| **Dimensions** | 1920 × 800 px (desktop), responsive scaling for mobile |
| **Aspect Ratio** | 12:5 (2.4:1) |
| **Format** | JPEG (.jpg) |
| **File Size** | < 200 KB each (compressed) |
| **Quantity** | 4 images |
| **Naming Convention** | `hero-slide-1.jpg`, `hero-slide-2.jpg`, `hero-slide-3.jpg`, `hero-slide-4.jpg` |

**Content Suggestions:**
1. `hero-slide-1.jpg` - Tree planting activity with volunteers
2. `hero-slide-2.jpg` - School awareness program with students
3. `hero-slide-3.jpg` - Farmer training session or organic farm
4. `hero-slide-4.jpg` - Indigenous tree species (close-up of banyan/peepal)

**Technical Requirements:**
- Horizontal orientation (landscape)
- Clear focal point in center (safe area for text overlay)
- Avoid busy/cluttered backgrounds
- Vibrant but natural colors
- High resolution (no pixelation)

---

### 2.2 Event Images

**Purpose:** Event listings and detail pages
**Location:** `/images/events/`

#### Featured Image (Card Thumbnail)
| Specification | Value |
|--------------|-------|
| **Dimensions** | 600 × 400 px |
| **Aspect Ratio** | 3:2 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 150 KB |
| **Usage** | Event cards on events listing page |

#### Hero Image (Detail Page)
| Specification | Value |
|--------------|-------|
| **Dimensions** | 1200 × 600 px |
| **Aspect Ratio** | 2:1 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 200 KB |
| **Usage** | Top of event detail modal/page |

#### Gallery Images
| Specification | Value |
|--------------|-------|
| **Dimensions** | 800 × 600 px |
| **Aspect Ratio** | 4:3 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 150 KB each |
| **Quantity** | 2-4 images per event |
| **Usage** | Image gallery in event details |

**Naming Convention:**
```
event-{id}-featured.jpg       (Example: event-001-featured.jpg)
event-{id}-hero.jpg           (Example: event-001-hero.jpg)
event-{id}-gallery-1.jpg      (Example: event-001-gallery-1.jpg)
event-{id}-gallery-2.jpg      (Example: event-001-gallery-2.jpg)
```

**Quantity Required:**
- 12 events in events.json
- Each event needs: 1 featured + 1 hero + 2-3 gallery images
- **Total: ~50-60 event images**

---

### 2.3 Training Images

**Purpose:** Training program listings and detail pages
**Location:** `/images/trainings/`

#### Featured Image
| Specification | Value |
|--------------|-------|
| **Dimensions** | 600 × 400 px |
| **Aspect Ratio** | 3:2 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 150 KB |

#### Hero Image
| Specification | Value |
|--------------|-------|
| **Dimensions** | 1200 × 600 px |
| **Aspect Ratio** | 2:1 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 200 KB |

#### Gallery Images
| Specification | Value |
|--------------|-------|
| **Dimensions** | 800 × 600 px |
| **Aspect Ratio** | 4:3 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 150 KB each |
| **Quantity** | 2-3 images per training |

**Naming Convention:**
```
training-{id}-featured.jpg    (Example: training-001-featured.jpg)
training-{id}-hero.jpg        (Example: training-001-hero.jpg)
training-{id}-gallery-1.jpg   (Example: training-001-gallery-1.jpg)
```

**Quantity Required:**
- 7 trainings in trainings.json
- Each training needs: 1 featured + 1 hero + 2-3 gallery images
- **Total: ~30-35 training images**

---

### 2.4 Program Images

**Purpose:** Program cards and detail pages
**Location:** `/images/programs/`

#### Thumbnail (Card Image)
| Specification | Value |
|--------------|-------|
| **Dimensions** | 400 × 300 px |
| **Aspect Ratio** | 4:3 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 100 KB |
| **Usage** | Program cards on programs page |

#### Hero Image
| Specification | Value |
|--------------|-------|
| **Dimensions** | 1200 × 600 px |
| **Aspect Ratio** | 2:1 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 200 KB |
| **Usage** | Program detail modal header |

#### Gallery Images
| Specification | Value |
|--------------|-------|
| **Dimensions** | 800 × 600 px |
| **Aspect Ratio** | 4:3 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 150 KB each |
| **Quantity** | 2-4 images per program |

**Naming Convention:**
```
{program-slug}-thumb.jpg      (Example: school-awareness-thumb.jpg)
{program-slug}-hero.jpg       (Example: school-awareness-hero.jpg)
{program-slug}-gallery-1.jpg  (Example: school-awareness-nature-walk.jpg)
```

**Quantity Required:**
- 8 programs in programs.json
- Each program needs: 1 thumbnail + 1 hero + 2-4 gallery images
- **Total: ~35-45 program images**

**Content Per Program:**
1. **School Awareness** - Students, tree identification, planting activities
2. **Farmer Training** - Classroom sessions, field demonstrations, soil testing
3. **Women Leadership** - Women in gardens, composting, group activities
4. **Urban Awareness** - Street plays, public events, sapling distribution
5. **Conservation** - Field surveys, nurseries, sacred groves, volunteers
6. **Youth Champions** - Young adults in workshops, field projects, networking
7. **Seniors Green** - Seniors gardening, nature walks, mentoring students
8. **Corporate** - Corporate volunteers, plantation events, workshops

---

### 2.5 Gallery Page Images

**Purpose:** Main gallery page showcasing all activities
**Location:** `/images/gallery/`

| Specification | Value |
|--------------|-------|
| **Dimensions** | 800 × 600 px (standard), 1200 × 800 px (featured) |
| **Aspect Ratio** | 4:3 or 3:2 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 200 KB each |
| **Quantity** | 50-100 images (organized by year/category) |

**Organization:**
- By year and month: `/gallery/2024/01-january/`, `/gallery/2025/02-february/`
- By category: `/gallery/categories/tree-planting/`, `/gallery/categories/workshops/`

**Naming Convention:**
```
YYYY-MM-DD-event-name-number.jpg
Example: 2024-11-15-tree-plantation-1.jpg
```

---

### 2.6 Logo & Branding Assets

**Purpose:** Site-wide branding
**Location:** `/images/logos/`

#### Main Logo
| Specification | Value |
|--------------|-------|
| **Dimensions** | 300 × 100 px (approx, maintain aspect ratio) |
| **Format** | PNG (transparent background) |
| **File Size** | < 50 KB |
| **Filename** | `vefs-logo.png` |

#### White Logo (for dark backgrounds)
| Specification | Value |
|--------------|-------|
| **Dimensions** | 300 × 100 px |
| **Format** | PNG (transparent background) |
| **File Size** | < 50 KB |
| **Filename** | `vefs-logo-white.png` |

#### Favicon
| Specification | Value |
|--------------|-------|
| **Dimensions** | 32 × 32 px, 64 × 64 px (multi-size .ico) |
| **Format** | ICO (.ico) or PNG (.png) |
| **File Size** | < 10 KB |
| **Filename** | `vefs-favicon.ico` |

#### OpenGraph/Social Media Image
| Specification | Value |
|--------------|-------|
| **Dimensions** | 1200 × 630 px |
| **Aspect Ratio** | 1.91:1 |
| **Format** | JPEG (.jpg) |
| **File Size** | < 300 KB |
| **Filename** | `vefs-og-image.jpg` |
| **Usage** | Appears when website is shared on social media |

---

### 2.7 About Page Images

**Purpose:** About page content
**Location:** `/images/about/`

| Image Type | Dimensions | Format | Size | Filename |
|-----------|-----------|--------|------|----------|
| Founder Profile | 400 × 400 px | JPEG | < 150 KB | `founder-profile.jpg` |
| Team Group Photo | 1200 × 600 px | JPEG | < 200 KB | `team-group.jpg` |
| Timeline Images | 600 × 400 px | JPEG | < 150 KB | `timeline-YYYY.jpg` |
| Impact Visuals | 800 × 600 px | JPEG | < 150 KB | `impact-{name}.jpg` |

**Quantity:** 8-12 images

---

### 2.8 Icon Assets (SVG)

**Purpose:** Program icons, UI elements
**Location:** `/images/icons/`

| Specification | Value |
|--------------|-------|
| **Format** | SVG (.svg) - vector format |
| **File Size** | < 10 KB each |
| **Color** | Single color (easily changeable via CSS) |

**Required Icons:**
- `graduation-cap.svg` - Education programs
- `tractor.svg` - Farming programs
- `users.svg` - Community programs
- `leaf.svg` - Environmental programs
- `heart.svg` - Social welfare
- `megaphone.svg` - Awareness campaigns
- `book.svg` - Training programs
- `tree.svg` - Conservation programs
- `briefcase.svg` - Corporate programs

**Quantity:** ~15-20 icons

---

## 3. Image Optimization Guidelines

### 3.1 Compression

**Tools Recommended:**
- **TinyPNG** (https://tinypng.com) - Online compression
- **ImageOptim** (Mac) - Batch optimization
- **GIMP** (cross-platform) - Manual editing and compression

**Compression Targets:**
- Hero images: 150-200 KB (high quality needed)
- Featured/thumbnail images: 100-150 KB
- Gallery images: 100-150 KB
- Icons/logos: 10-50 KB

**Quality Settings:**
- JPEG quality: 75-85% (balances quality and file size)
- Use progressive JPEG for faster perceived loading

### 3.2 Responsive Images

**Implementation:**
Use `srcset` attribute for responsive images:

```html
<img
  src="/images/events/event-001-featured.jpg"
  srcset="/images/events/event-001-featured-400.jpg 400w,
          /images/events/event-001-featured-600.jpg 600w,
          /images/events/event-001-featured-800.jpg 800w"
  sizes="(max-width: 768px) 400px, 600px"
  alt="Organic Farming Workshop"
  loading="lazy"
>
```

**Benefits:**
- Smaller images served to mobile devices
- Faster page load times
- Reduced bandwidth usage

### 3.3 Lazy Loading

**Implementation:**
Add `loading="lazy"` attribute to images below the fold:

```html
<img src="/images/events/event-001-hero.jpg" alt="Event" loading="lazy">
```

**When to Use:**
- All gallery images
- Below-fold event/training/program images
- NOT for hero carousel (above the fold)

---

## 4. File Naming Conventions

### 4.1 General Rules

✅ **DO:**
- Use lowercase letters only
- Use hyphens (-) to separate words
- Be descriptive and meaningful
- Include date (YYYY-MM-DD) for gallery images
- Include ID or slug for data-linked images

❌ **DON'T:**
- Use spaces in filenames
- Use special characters (!, @, #, $, %, etc.)
- Use uppercase letters
- Use generic names (image1.jpg, pic.jpg)

### 4.2 Examples

**Good:**
```
✅ event-001-featured.jpg
✅ school-awareness-hero.jpg
✅ 2024-11-15-tree-plantation-1.jpg
✅ farmer-training-soil-testing.jpg
```

**Bad:**
```
❌ Event 001 Featured.jpg        (spaces, uppercase)
❌ IMG_1234.jpg                   (generic, not descriptive)
❌ school@awareness.jpg           (special character)
❌ training.JPG                   (uppercase extension)
```

---

## 5. Image Checklist Before Upload

Before uploading images to the website, verify:

- [ ] **Correct dimensions** for image type (refer to specifications above)
- [ ] **File size under limit** (< 200 KB for most images)
- [ ] **Proper format** (JPEG for photos, PNG for logos/graphics, SVG for icons)
- [ ] **Descriptive filename** following naming conventions
- [ ] **Optimized/compressed** using tools like TinyPNG
- [ ] **Correct folder location** in `/images/` directory
- [ ] **Alt text prepared** for accessibility (descriptive, concise)
- [ ] **No copyrighted content** (use own photos or licensed stock images)

---

## 6. Image Sources & Copyright

### 6.1 Original Photography

**Preferred:** Use original photos from VEFS activities
- Higher authenticity and connection with audience
- No copyright concerns
- Showcases real work and impact

**Recommendations:**
- Take high-resolution photos during events (1920px+ width)
- Capture diverse activities and participants
- Get photo consent from participants (especially children)
- Store originals in high resolution for future use

### 6.2 Stock Images (if needed)

**Free Stock Photo Sources:**
- **Unsplash** (https://unsplash.com) - Free for commercial use
- **Pexels** (https://pexels.com) - Free for commercial use
- **Pixabay** (https://pixabay.com) - Free with attribution

**Search Terms:**
- "Tree planting volunteers India"
- "Organic farming Tamil Nadu"
- "Environmental education students"
- "Indigenous trees India"
- "Community gardening"

**License Requirement:** Always check and comply with license terms

---

## 7. Performance Impact

### 7.1 Total Image Estimates

| Section | Quantity | Avg Size | Total Size |
|---------|----------|----------|------------|
| Hero Carousel | 4 | 180 KB | 720 KB |
| Events | 50 | 140 KB | 7 MB |
| Trainings | 30 | 140 KB | 4.2 MB |
| Programs | 40 | 130 KB | 5.2 MB |
| Gallery | 80 | 150 KB | 12 MB |
| About/Misc | 15 | 130 KB | 2 MB |
| Logos/Icons | 20 | 20 KB | 400 KB |
| **TOTAL** | **~240** | - | **~31 MB** |

**Note:** Not all images load on single page. Individual pages should keep total image size < 2 MB.

### 7.2 Page-Specific Limits

| Page | Max Images | Target Total Size |
|------|-----------|-------------------|
| Home | 10-15 | < 1.5 MB |
| Events Listing | 12 cards | < 2 MB |
| Event Detail | 5-7 | < 1 MB |
| Programs | 8 cards | < 1.2 MB |
| Gallery | 20-30 (paginated) | < 3 MB per page |

---

## 8. Accessibility Requirements

### 8.1 Alt Text Guidelines

**Purpose:** Describe images for screen reader users

**Best Practices:**
- Be concise (< 125 characters)
- Describe what's in the image, not just repeat title
- Don't start with "Image of..." or "Picture of..."
- Include relevant context

**Examples:**

```html
<!-- Event Image -->
<img src="/images/events/event-001-featured.jpg"
     alt="Participants learning tree identification techniques during workshop">

<!-- Program Image -->
<img src="/images/programs/farmer-training-hero.jpg"
     alt="Farmer examining soil sample during organic farming training session">

<!-- Gallery Image -->
<img src="/images/gallery/2024-11-15-tree-plantation-1.jpg"
     alt="Volunteers planting saplings at community tree plantation drive">
```

### 8.2 Decorative Images

**For purely decorative images:**
```html
<img src="/images/decorative-leaf.svg" alt="" role="presentation">
```

Use empty `alt=""` to indicate image is decorative and should be ignored by screen readers.

---

## 9. Content Management Workflow

### 9.1 Adding New Event Images

1. **Capture photos** during event (high resolution)
2. **Select best 3-5 photos** (featured, hero, gallery)
3. **Edit/crop** to required dimensions using image editor
4. **Compress** using TinyPNG or similar (target < 150 KB each)
5. **Rename** following convention: `event-{id}-featured.jpg`, etc.
6. **Upload** to `/images/events/` folder via FTP
7. **Update** `events.json` with correct image paths
8. **Test** on website to ensure images display correctly
9. **Backup** original high-res photos for archive

### 9.2 Updating Existing Images

1. **Download current image** from server (backup)
2. **Prepare new image** following same specifications
3. **Use same filename** to automatically replace old image
4. **Upload** via FTP to same location
5. **Clear browser cache** and verify update
6. **Store backup** of old image (in case revert needed)

---

## 10. Future Enhancements

### 10.1 WebP Format

**Benefits:**
- 25-35% smaller file size than JPEG
- Better compression without quality loss
- Supported by modern browsers

**Implementation:**
```html
<picture>
  <source srcset="/images/events/event-001.webp" type="image/webp">
  <img src="/images/events/event-001.jpg" alt="Event">
</picture>
```

**Recommendation:** Convert existing JPEGs to WebP for performance boost

### 10.2 Image CDN

**Consideration for future:**
- Use CDN (Cloudflare, Cloudinary) for faster global delivery
- Automatic optimization and format conversion
- Reduced server bandwidth usage

---

## Summary

**Total Images Required:** ~240 images across all sections

**Priority for Initial Launch:**
1. **High Priority:** Hero carousel (4), Featured event/training/program images (27)
2. **Medium Priority:** Event/training/program hero images (27), Gallery images (20-30)
3. **Low Priority:** Additional gallery images, testimonial photos

**Placeholder Strategy:**
Until actual images are provided, JSON files reference paths that should be filled with:
- Stock photos matching the theme
- Placeholder images with correct dimensions
- Descriptive labels ("Event Featured Image", etc.)

**User Action Required:**
Review this document and prepare images according to specifications, or provide guidance on sourcing stock images for initial launch.

---

**Document End**
**Last Updated:** December 25, 2025
**Next Review:** After image assets are provided

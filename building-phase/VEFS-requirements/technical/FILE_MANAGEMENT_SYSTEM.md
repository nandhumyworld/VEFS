# File Management & Content Organization System

**Project:** VEFS (Valluvam Ecological Farming and Social Welfare Foundation)
**Document Version:** 1.0
**Last Updated:** 2025-12-24
**Status:** Complete

---

## Overview

This document defines the file management and content organization system for the VEFS website. Since the site uses **Hostinger static hosting** without a custom admin dashboard, all content is managed manually through:

- JSON files for dynamic content (events, trainings, programs)
- Image folders for media assets
- FTP/File Manager for file uploads
- Text editors for JSON editing

**Philosophy:** Simple, organized, version-controlled file management without complex CMS dependencies.

---

## 1. Directory Structure

### 1.1 Complete File Structure

```
public_html/
├── index.html
├── about.html
├── programs.html
├── trainings.html
├── events.html
├── gallery.html
├── contact.html
├── donate.html
├── future-plans.html
│
├── css/
│   ├── theme.css
│   ├── reset.css
│   ├── layout.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   ├── navigation.css
│   │   ├── modals.css
│   │   └── alerts.css
│   └── main.css
│
├── js/
│   ├── components/
│   │   ├── navigation.js
│   │   ├── modal.js
│   │   ├── form-validation.js
│   │   └── scroll-animations.js
│   ├── events.js
│   ├── trainings.js
│   ├── programs.js
│   ├── gallery.js
│   └── main.js
│
├── data/
│   ├── events.json
│   ├── trainings.json
│   ├── programs.json
│   └── recent-registrations.json
│
├── images/
│   ├── logo/
│   │   ├── vefs-logo.png
│   │   ├── vefs-logo-white.png
│   │   └── vefs-favicon.ico
│   │
│   ├── hero/
│   │   ├── home-hero.jpg
│   │   ├── about-hero.jpg
│   │   ├── programs-hero.jpg
│   │   └── ...
│   │
│   ├── events/
│   │   ├── organic-farming-workshop-2025.jpg
│   │   ├── tree-plantation-drive-jan-2025.jpg
│   │   ├── eco-awareness-seminar-feb-2025.jpg
│   │   └── ...
│   │
│   ├── trainings/
│   │   ├── sustainable-farming-training-q1-2025.jpg
│   │   ├── composting-workshop-march-2025.jpg
│   │   └── ...
│   │
│   ├── programs/
│   │   ├── school-awareness-thumb.jpg
│   │   ├── school-awareness-hero.jpg
│   │   ├── school-awareness-gallery-1.jpg
│   │   ├── school-awareness-gallery-2.jpg
│   │   ├── farmer-training-thumb.jpg
│   │   ├── farmer-training-hero.jpg
│   │   └── ...
│   │
│   ├── gallery/
│   │   ├── 2024/
│   │   │   ├── jan/
│   │   │   │   ├── tree-planting-event-01.jpg
│   │   │   │   ├── tree-planting-event-02.jpg
│   │   │   │   └── ...
│   │   │   ├── feb/
│   │   │   └── ...
│   │   ├── 2025/
│   │   │   ├── jan/
│   │   │   └── ...
│   │   └── categories/
│   │       ├── workshops/
│   │       ├── plantations/
│   │       ├── community-events/
│   │       └── trainings/
│   │
│   ├── team/
│   │   ├── founder-photo.jpg
│   │   ├── trustee-1.jpg
│   │   └── ...
│   │
│   ├── icons/
│   │   ├── tree-icon.svg
│   │   ├── calendar-icon.svg
│   │   └── ...
│   │
│   └── references/
│       ├── qr-code-donation.png
│       ├── payment-upi-qr.png
│       ├── location-map.jpg
│       └── certificates/
│           ├── 80g-certificate.pdf
│           └── ...
│
├── forms/
│   ├── form-handler.php
│   ├── process-event-registration.php
│   ├── process-training-registration.php
│   ├── process-donation.php
│   └── config.php
│
├── email-templates/
│   ├── event-confirmation.html
│   ├── training-confirmation.html
│   ├── donation-receipt.html
│   └── admin-notification.html
│
├── logs/
│   ├── registrations.log
│   ├── errors.log
│   └── .htaccess (deny web access)
│
├── backups/
│   ├── data/
│   │   ├── events-backup-2025-12-20.json
│   │   ├── trainings-backup-2025-12-20.json
│   │   └── programs-backup-2025-12-20.json
│   └── .htaccess (deny web access)
│
└── .htaccess
```

---

## 2. JSON File Management

### 2.1 Editing JSON Files

**Tools Required:**
- **Text Editor:** VS Code, Sublime Text, Notepad++, or even Notepad
- **JSON Validator:** https://jsonlint.com (online tool)
- **FTP Client:** FileZilla, Cyberduck, or Hostinger File Manager

**Workflow:**

1. **Download current file**
   - Via FTP or Hostinger File Manager
   - Navigate to `public_html/data/`
   - Download `events.json`, `trainings.json`, or `programs.json`

2. **Create backup**
   - Save as `events-backup-YYYY-MM-DD.json`
   - Store in `backups/data/` folder locally

3. **Edit in text editor**
   - Open file in VS Code or preferred editor
   - Make changes (add event, update training, etc.)
   - Follow JSON syntax strictly (commas, brackets, quotes)

4. **Validate JSON**
   - Copy entire file content
   - Paste into https://jsonlint.com
   - Click "Validate JSON"
   - Fix any errors shown

5. **Upload to server**
   - Via FTP, upload edited file to `public_html/data/`
   - Overwrite existing file
   - Changes take effect immediately (may need to clear browser cache)

6. **Verify on website**
   - Visit the relevant page (Events, Trainings, Programs)
   - Check that changes appear correctly
   - Test any links or images

### 2.2 Common JSON Editing Mistakes

**Mistake 1: Missing Comma**
```json
{
  "title": "Event Title"
  "date": "2025-01-15"  ❌ Missing comma after "Event Title"
}
```

**Correct:**
```json
{
  "title": "Event Title",
  "date": "2025-01-15"  ✅ Comma added
}
```

**Mistake 2: Trailing Comma**
```json
{
  "title": "Event Title",
  "date": "2025-01-15",  ❌ Comma after last item
}
```

**Correct:**
```json
{
  "title": "Event Title",
  "date": "2025-01-15"  ✅ No comma after last item
}
```

**Mistake 3: Wrong Quotes**
```json
{
  "title": 'Event Title'  ❌ Single quotes not allowed
}
```

**Correct:**
```json
{
  "title": "Event Title"  ✅ Use double quotes
}
```

**Mistake 4: Unescaped Quotes in Text**
```json
{
  "description": "The event "Tree Planting" is tomorrow"  ❌ Unescaped quotes
}
```

**Correct:**
```json
{
  "description": "The event \"Tree Planting\" is tomorrow"  ✅ Escaped with backslash
}
```

OR better:
```json
{
  "description": "The event 'Tree Planting' is tomorrow"  ✅ Use single quotes in text
}
```

### 2.3 JSON File Version Control

**Manual Versioning:**

Every time you edit a JSON file:

1. **Update metadata** in the file:
   ```json
   {
     "metadata": {
       "version": "1.5",  ← Increment version
       "lastUpdated": "2025-12-24T14:30:00Z",  ← Current timestamp
       "totalEvents": 25  ← Update count
     }
   }
   ```

2. **Save backup** with date:
   - `events-backup-2025-12-24.json`
   - Keep last 10 backups, delete older ones

3. **Document changes** (optional changelog):
   ```json
   {
     "changelog": [
       {
         "version": "1.5",
         "date": "2025-12-24",
         "changes": "Added 2 new events, updated registration links"
       }
     ]
   }
   ```

---

## 3. Image Management

### 3.1 Image Folder Organization

**Folder Purpose:**

| Folder | Purpose | Image Types |
|--------|---------|-------------|
| `/images/logo/` | Brand assets | Logo variations, favicon |
| `/images/hero/` | Page headers | Hero images for each page |
| `/images/events/` | Event photos | Event-specific images |
| `/images/trainings/` | Training photos | Training-specific images |
| `/images/programs/` | Program photos | Program thumbnails, heroes, galleries |
| `/images/gallery/` | Photo gallery | Organized by year/month or category |
| `/images/team/` | Team photos | Founder, trustees, staff photos |
| `/images/icons/` | UI icons | SVG icons for website |
| `/images/references/` | Miscellaneous | QR codes, maps, certificates |

### 3.2 Image Naming Conventions

**Rules:**
- Use lowercase letters only
- Use hyphens (not underscores or spaces)
- Be descriptive (not IMG_1234.jpg)
- Include date if relevant
- Avoid special characters

**Good Examples:**
```
organic-farming-workshop-jan-2025.jpg
tree-plantation-drive-chennai-2025-01-15.jpg
school-awareness-program-hero.jpg
founder-profile-photo.jpg
payment-qr-code-upi.png
```

**Bad Examples:**
```
IMG_1234.JPG                    ❌ Not descriptive
Event Photo.jpg                  ❌ Has space
Workshop_2025.jpg                ❌ Use hyphens, not underscores
Organic Farming-Workshop 2025!.jpg  ❌ Mixed, has special char
```

### 3.3 Image Specifications

**File Formats:**
- **Photos:** JPEG (.jpg)
- **Graphics/logos:** PNG (.png) or SVG (.svg)
- **Icons:** SVG (.svg) preferred

**Image Sizes:**

| Use Case | Dimensions | Max File Size |
|----------|------------|---------------|
| Event/Training/Program Thumbnail | 400x300px (4:3) | 100 KB |
| Event/Training/Program Hero | 1200x600px (2:1) | 200 KB |
| Gallery Image | 1200x800px (3:2) | 250 KB |
| Page Hero | 1920x800px | 300 KB |
| Team Photo | 400x400px (1:1) | 80 KB |
| Logo | 200x200px (transparent PNG) | 50 KB |
| Icon (SVG) | N/A | 10 KB |

**Optimization:**
- Use online tools: TinyPNG (https://tinypng.com), ImageOptim
- Compress before upload
- Use responsive images (srcset) when possible

### 3.4 Uploading Images via FTP

**Steps:**

1. **Connect to FTP**
   - Open FileZilla or Hostinger File Manager
   - Navigate to appropriate folder (e.g., `public_html/images/events/`)

2. **Prepare images**
   - Rename files following naming conventions
   - Optimize/compress images
   - Organize locally first

3. **Upload**
   - Drag and drop files into FTP client
   - Wait for upload completion
   - Verify file names and sizes

4. **Test access**
   - Open browser
   - Navigate to `https://yoursite.com/images/events/filename.jpg`
   - Ensure image loads correctly

### 3.5 Referencing Images in JSON

**Always use absolute paths starting with `/`:**

```json
{
  "id": "evt-025",
  "title": "Organic Farming Workshop",
  "images": {
    "thumbnail": "/images/events/organic-farming-workshop-jan-2025.jpg",
    "hero": "/images/events/organic-farming-workshop-hero.jpg",
    "gallery": [
      "/images/events/organic-farming-workshop-gallery-1.jpg",
      "/images/events/organic-farming-workshop-gallery-2.jpg",
      "/images/events/organic-farming-workshop-gallery-3.jpg"
    ]
  }
}
```

**Why absolute paths?**
- Works from any page on the site
- No confusion with relative paths
- Easy to update

**Path Format:**
```
✅ Correct:  "/images/events/photo.jpg"
✅ Correct:  "/images/programs/thumbnail.jpg"
❌ Wrong:    "images/events/photo.jpg"  (missing leading slash)
❌ Wrong:    "../images/events/photo.jpg"  (relative path)
❌ Wrong:    "https://yoursite.com/images/events/photo.jpg"  (full URL not needed)
```

### 3.6 Gallery Folder Organization

**Option 1: By Year/Month (Chronological)**
```
/images/gallery/
├── 2024/
│   ├── jan/
│   ├── feb/
│   ├── mar/
│   └── ...
├── 2025/
│   ├── jan/
│   │   ├── tree-planting-event-01.jpg
│   │   ├── tree-planting-event-02.jpg
│   │   └── school-visit-15-jan-2025.jpg
│   └── ...
```

**Option 2: By Category (Thematic)**
```
/images/gallery/
├── workshops/
│   ├── organic-farming-workshop-jan-2025-01.jpg
│   └── composting-workshop-feb-2025-01.jpg
├── plantations/
│   ├── tree-plantation-chennai-jan-2025-01.jpg
│   └── tree-plantation-coimbatore-feb-2025-01.jpg
├── community-events/
└── trainings/
```

**Recommendation:** Use chronological (by year/month) for easier management. Add category tags in gallery JSON metadata.

---

## 4. Backup & Version Control

### 4.1 Manual Backup Strategy

**What to Backup:**
- All JSON files (`events.json`, `trainings.json`, `programs.json`)
- Critical images (logos, hero images)
- HTML files (if edited)
- CSS/JS files (if customized)

**Backup Frequency:**
- **Before major updates:** Always backup before making changes
- **Weekly:** Download all JSON files
- **Monthly:** Full site backup (all files and images)

**Backup Locations:**
1. **Local computer:** `C:/Backups/VEFS-Website/`
2. **Cloud storage:** Google Drive, Dropbox, OneDrive
3. **Server backups folder:** `public_html/backups/` (protected with .htaccess)

### 4.2 Backup Workflow

**Weekly JSON Backup:**

1. Download all JSON files from `/data/` folder
2. Rename with date: `events-backup-2025-12-24.json`
3. Store in local backup folder
4. Keep last 12 weeks of backups (delete older)

**Monthly Full Backup:**

1. Use FTP to download entire `public_html/` directory
2. Compress into ZIP file: `VEFS-Website-Backup-2025-12.zip`
3. Upload to cloud storage
4. Keep last 6 months of backups

**Hostinger Automatic Backups:**
- Hostinger provides automatic daily/weekly backups
- Access via Hostinger control panel
- Use as last resort if manual backups fail

### 4.3 .htaccess Protection for Sensitive Folders

**Protect `/backups/` and `/logs/` folders:**

Create `.htaccess` file in each folder:

```apache
# Deny all web access to this folder
Order Deny,Allow
Deny from all
```

**Purpose:** Prevent public access to backup files and logs via browser.

---

## 5. Content Management Workflows

### 5.1 Adding a New Event

**Step-by-Step:**

1. **Prepare event details**
   - Event title, date, time, location
   - Description
   - Registration link (if applicable)
   - Cost, capacity

2. **Prepare event image**
   - Take/select photo
   - Resize to 400x300px (thumbnail) and 1200x600px (hero)
   - Optimize/compress
   - Name: `event-title-month-year.jpg`

3. **Upload image**
   - FTP to `/images/events/`
   - Note exact filename

4. **Edit events.json**
   - Download from `/data/events.json`
   - Backup: `events-backup-YYYY-MM-DD.json`
   - Copy event template (see Events Data Schema doc)
   - Fill in details
   - Reference image path: `/images/events/event-title-month-year.jpg`
   - Assign unique ID: `evt-026` (next number)
   - Validate JSON

5. **Upload events.json**
   - FTP upload to `/data/`
   - Overwrite existing file

6. **Verify**
   - Visit events page
   - Check new event appears
   - Test image loads
   - Test registration link

### 5.2 Updating an Existing Training

1. **Download trainings.json**
2. **Backup current file**
3. **Find training by ID** (e.g., `trn-012`)
4. **Make changes** (update date, add info, etc.)
5. **Update `updatedAt` field** with current date
6. **Validate JSON**
7. **Upload to server**
8. **Verify changes**

### 5.3 Removing/Archiving Old Content

**Don't delete - archive instead:**

**Option 1: Set status to "past" or "cancelled"**
```json
{
  "id": "evt-020",
  "status": "past",  // or "cancelled"
  ...
}
```

**Option 2: Move to separate archive file**
- Create `events-archive-2024.json`
- Move old events there
- Keep main file clean with only current/upcoming events

**Benefits:**
- Preserves historical data
- Can reference later
- Can create "Past Events" page if desired

---

## 6. File Permissions

### 6.1 Recommended Permissions

**Via FTP or Hostinger File Manager:**

| File/Folder | Permission | Octal |
|-------------|------------|-------|
| Folders | `rwxr-xr-x` | 755 |
| HTML, CSS, JS, JSON | `rw-r--r--` | 644 |
| PHP files | `rw-r--r--` | 644 |
| Images | `rw-r--r--` | 644 |
| .htaccess | `rw-r--r--` | 644 |
| Writable folders (logs, backups) | `rwxrwxr-x` | 775 |

**Important:**
- **Never use 777** (security risk)
- **PHP files should NOT be executable** (644, not 755)
- **Only folders need execute permission** (755)

### 6.2 Securing Sensitive Files

**Hide from web access using .htaccess:**

**Protect config files:**

`/forms/.htaccess`:
```apache
<Files "config.php">
    Order Deny,Allow
    Deny from all
</Files>
```

**Protect JSON data (if needed):**

If you want to prevent direct access to JSON files:

`/data/.htaccess`:
```apache
<FilesMatch "\.(json)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
```

**Note:** This may break JavaScript fetch() - test carefully.

---

## 7. Troubleshooting

### 7.1 Common Issues

**Issue: JSON changes not appearing on website**

Solutions:
1. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
2. **Check JSON validation** - syntax error prevents loading
3. **Check file was uploaded** to correct location (`/data/`)
4. **Check file permissions** (should be 644)
5. **Check browser console** for JavaScript errors

**Issue: Images not loading**

Solutions:
1. **Check file path** in JSON - must start with `/images/`
2. **Check filename spelling** - case-sensitive on Linux servers
3. **Check file exists** on server via FTP
4. **Check file permissions** (should be 644)
5. **Check image format** - JPEG, PNG, SVG supported
6. **Try direct URL** in browser: `https://yoursite.com/images/events/filename.jpg`

**Issue: JSON syntax error**

Solutions:
1. **Use JSONLint.com** to find exact error
2. **Check for missing/extra commas**
3. **Check for missing brackets** `{}` or `[]`
4. **Check quote marks** - must be double quotes `"`
5. **Restore from backup** if error is hard to find

**Issue: File upload fails via FTP**

Solutions:
1. **Check FTP credentials** - username, password, host
2. **Check server disk space** - contact Hostinger if full
3. **Check file size limits** - compress large images
4. **Try different FTP client** (FileZilla vs. Hostinger File Manager)
5. **Check firewall** - may block FTP connection

### 7.2 Emergency Recovery

**If website breaks after update:**

1. **Don't panic!**
2. **Download latest backup**
3. **Upload backup file via FTP** to restore
4. **Website should return to working state**
5. **Review changes** - what went wrong?
6. **Fix issue** in backup file
7. **Re-upload corrected version**

---

## 8. Best Practices

### 8.1 Content Management

✅ **DO:**
- Backup before every edit
- Validate JSON before uploading
- Use descriptive, consistent naming
- Document changes (changelog)
- Test changes on staging if possible
- Keep backups for at least 6 months
- Use version control (even manual versioning)

❌ **DON'T:**
- Edit live files directly without backup
- Skip JSON validation
- Use spaces or special characters in filenames
- Delete old content permanently
- Upload images without optimization
- Share FTP credentials insecurely

### 8.2 Image Management

✅ **DO:**
- Optimize before upload (<200KB)
- Use consistent naming convention
- Organize in appropriate folders
- Use absolute paths in JSON
- Provide alt text in HTML
- Use WebP format for modern browsers (optional)

❌ **DON'T:**
- Upload massive files (>1MB)
- Use random filenames (IMG_1234.jpg)
- Store all images in one folder
- Use relative paths
- Forget to compress images

### 8.3 Security

✅ **DO:**
- Use strong FTP password
- Change FTP password regularly
- Enable 2FA on Hostinger account
- Use HTTPS (SSL certificate)
- Protect sensitive folders with .htaccess
- Keep software updated (PHP version)

❌ **DON'T:**
- Share FTP credentials
- Use simple passwords
- Leave backup files publicly accessible
- Ignore security warnings
- Upload files with 777 permissions

---

## 9. Tools & Resources

### 9.1 Recommended Tools

**Text Editors:**
- **VS Code** (free, Windows/Mac/Linux) - Best for JSON editing
- **Sublime Text** (paid, Windows/Mac/Linux)
- **Notepad++** (free, Windows)
- **TextMate** (free, Mac)

**FTP Clients:**
- **FileZilla** (free, Windows/Mac/Linux)
- **Cyberduck** (free, Mac/Windows)
- **Hostinger File Manager** (built-in, web-based)

**Image Optimization:**
- **TinyPNG** (https://tinypng.com) - Online compression
- **ImageOptim** (Mac)
- **GIMP** (free, cross-platform)
- **Photopea** (https://photopea.com) - Online Photoshop alternative

**JSON Validation:**
- **JSONLint** (https://jsonlint.com)
- **JSON Formatter** (https://jsonformatter.org)
- **VS Code** (built-in JSON validation)

**Backup Tools:**
- **Google Drive** / **Dropbox** / **OneDrive** (cloud backup)
- **Local folders** (organized by date)

### 9.2 Helpful Links

- **Hostinger Help Center:** https://support.hostinger.com
- **Hostinger File Manager Guide:** [link]
- **JSON Syntax Guide:** https://www.json.org
- **Image Optimization Guide:** https://web.dev/optimize-images/
- **FTP Setup Guide:** https://support.hostinger.com/articles/1583128-how-to-upload-files-via-ftp

---

## 10. Quick Reference

### 10.1 File Locations

| Content | File Location |
|---------|---------------|
| Events | `/data/events.json` |
| Trainings | `/data/trainings.json` |
| Programs | `/data/programs.json` |
| Event images | `/images/events/` |
| Training images | `/images/trainings/` |
| Program images | `/images/programs/` |
| Gallery images | `/images/gallery/` |
| Backups | `/backups/data/` |
| Logs | `/logs/` |

### 10.2 Common Tasks Checklist

**Adding New Event:**
- [ ] Prepare event details
- [ ] Prepare & optimize image
- [ ] Upload image to `/images/events/`
- [ ] Download `events.json`
- [ ] Backup `events.json`
- [ ] Add event to JSON file
- [ ] Validate JSON (jsonlint.com)
- [ ] Upload `events.json`
- [ ] Verify on website

**Weekly Maintenance:**
- [ ] Download all JSON files
- [ ] Create dated backups
- [ ] Check for old events to archive
- [ ] Review and respond to registrations
- [ ] Check website for errors

**Monthly Maintenance:**
- [ ] Full site backup (FTP download)
- [ ] Upload backup to cloud storage
- [ ] Delete old backups (keep last 6 months)
- [ ] Review image folder sizes
- [ ] Optimize/compress new images

---

## 11. Support & Escalation

### 11.1 When to Contact Support

**Hostinger Support (for):**
- Server downtime
- FTP connection issues
- Disk space problems
- Email delivery issues
- SSL certificate problems
- PHP version updates

**Developer Support (for):**
- Website functionality errors
- JavaScript/CSS issues
- Custom feature requests
- Design changes
- Complex troubleshooting

### 11.2 Before Contacting Support

**Gather information:**
- What were you trying to do?
- What steps did you take?
- What error message appeared?
- When did the issue start?
- Does the issue persist after clearing cache?
- Screenshot of error (if applicable)

**Try basic troubleshooting:**
- Clear browser cache
- Try different browser
- Check FTP credentials
- Restore from backup
- Validate JSON syntax

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-24 | Initial documentation | Requirements Team |

---

**End of Document**

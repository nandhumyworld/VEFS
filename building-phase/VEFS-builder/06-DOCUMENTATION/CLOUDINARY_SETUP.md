# Cloudinary Setup for VEFS Admin

The admin area uploads images directly browser→Cloudinary using an unsigned upload preset. No images are stored on Hostinger disk.

## One-time setup (developer)

1. Sign up at https://cloudinary.com (free tier: 25 GB storage, 25 GB bandwidth/month).
2. From the dashboard, note your **Cloud name** (e.g. `dxabc1234`).
3. Settings → Upload → "Add upload preset":
   - **Preset name:** `vefs_unsigned`
   - **Signing mode:** Unsigned
   - **Folder:** `vefs/`
   - **Use filename:** No
   - **Unique filename:** Yes
   - **Allowed formats:** `jpg,jpeg,png,webp`
   - **Max file size:** `5000000` (5 MB)
   - **Max image width:** `2000`
   - **Max image height:** `2000`
   - **Auto-format:** `auto` (under "Media analysis and AI" or "Delivery")
   - **Quality:** `auto`
   - Save.
4. Edit `VEFS-website/admin/config.php`:
   ```php
   'cloudinary' => [
       'cloud_name' => 'dxabc1234',
       'upload_preset' => 'vefs_unsigned',
   ],
   ```

## Rotating the preset (if compromised)

Cloudinary Settings → Upload → Delete `vefs_unsigned`, create `vefs_unsigned_v2` with the same locks, update `config.php`. Old uploads stay accessible by URL; new uploads use the new preset.

## Verifying public URLs

A successful upload returns `secure_url` like:
```
https://res.cloudinary.com/dxabc1234/image/upload/v1700000000/vefs/abc123.jpg
```

The site appends `f_auto,q_auto` at render time:
```
https://res.cloudinary.com/dxabc1234/image/upload/f_auto,q_auto,w_800/v1700000000/vefs/abc123.jpg
```
Cloudinary delivers WebP to supporting browsers, original format otherwise — automatically.

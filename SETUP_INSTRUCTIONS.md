# Profile Picture Feature - Quick Setup

## 🚀 Quick Start Guide

Follow these steps to enable profile picture uploads in your application.

---

## Step 1: Run Database Migration

**Go to Supabase Dashboard → SQL Editor → New Query**

Copy and paste this SQL:

```sql
-- Add profile_pic column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_pic TEXT
DEFAULT 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

-- Add comment
COMMENT ON COLUMN users.profile_pic IS 'Supabase storage URL for user profile picture';
```

Click **Run** ✅

---

## Step 2: Create Storage Bucket

**Go to Supabase Dashboard → Storage → New Bucket**

- **Name**: `autotalent_images`
- **Public bucket**: ✅ **ON** (Enable this!)
- Click **Create Bucket**

---

## Step 3: Apply Storage Policies

**Go to Supabase Dashboard → Storage → Policies (for autotalent_images bucket)**

Click **New Policy** → **For full customization** → Paste each policy below:

### Policy 1: Upload to own folder
```sql
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'autotalent_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: Update own files
```sql
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'autotalent_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 3: Delete own files
```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'autotalent_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 4: Public read access
```sql
CREATE POLICY "Public read access for profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'autotalent_images');
```

---

## ✅ Verification

1. **Login** to your application
2. Go to **Profile Editor** → **Basic Info** tab
3. You should see the profile picture uploader
4. Try uploading a test image
5. Check **Supabase Storage** → `autotalent_images` bucket → Should see your `user_id` folder

---

## 📁 What Was Added

### New Files Created:
```
✅ supabase/migrations/add_profile_pic_column.sql
✅ supabase/storage-policies/autotalent_images_policies.sql
✅ components/profile/profile-picture-upload.tsx
✅ PROFILE_PICTURE_SETUP.md (full documentation)
✅ SETUP_INSTRUCTIONS.md (this file)
```

### Modified Files:
```
✅ lib/types.ts - Added profile_pic to Profile & Resume interfaces
✅ components/profile/profile-basic-info-form.tsx - Integrated upload component
✅ lib/cv-templates/html-templates/CV-11eu400-3.ts - Uses real profile pic
✅ lib/cv-templates/html-templates/CV-21eu400-2.ts - Uses real profile pic
```

---

## 🎯 Features

✅ **Upload profile pictures** (JPG, PNG, GIF, WebP)
✅ **Image preview** before and after upload
✅ **Automatic resizing** and optimization
✅ **Remove option** to revert to default
✅ **Secure storage** with user-specific folders
✅ **Auto-updates resumes** with your photo

---

## 🔒 Security

- Files organized by user ID: `autotalent_images/[user_id]/profile_pic.ext`
- Users can only upload/modify their own files
- Public read access for resume viewing
- Max file size: 5MB
- Allowed formats: Image files only

---

## 📖 Full Documentation

For detailed information, see:
- **[PROFILE_PICTURE_SETUP.md](PROFILE_PICTURE_SETUP.md)** - Complete guide with troubleshooting

---

## 🐛 Common Issues

### "Failed to upload"
- ✅ Check bucket is created and **public**
- ✅ Verify all 4 policies are applied
- ✅ File must be < 5MB and image format

### Image doesn't show
- ✅ Bucket must be **PUBLIC**
- ✅ Check URL format is correct
- ✅ Clear browser cache

### Permission denied
- ✅ Ensure user is logged in
- ✅ Policies must be applied correctly
- ✅ Bucket name must be exactly `autotalent_images`

---

## 🎉 You're Done!

The profile picture feature is now live. Users can:
1. Upload their photo in Profile Editor
2. See it in all their resumes automatically
3. Update or remove it anytime

For help, see [PROFILE_PICTURE_SETUP.md](PROFILE_PICTURE_SETUP.md)

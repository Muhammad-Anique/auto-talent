# Profile Picture Upload Setup Guide

## Overview

This guide explains how to set up and use the profile picture upload feature with Supabase storage. Users can upload their profile pictures which are stored in Supabase and automatically used in their resumes.

## Architecture

```
User uploads image
    ↓
Stored in Supabase Storage (autotalent_images bucket)
    ↓
Organized by user ID (user_id/profile_pic.ext)
    ↓
Public URL saved to users.profile_pic column
    ↓
Used in resume templates and profile display
```

## Setup Instructions

### Step 1: Run Database Migration

Execute the SQL migration to add the `profile_pic` column to the `users` table:

```bash
# Navigate to your project directory
cd /path/to/auto-talent

# Run the migration in Supabase SQL Editor
# Copy contents from: supabase/migrations/add_profile_pic_column.sql
```

**Migration SQL:**
```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_pic TEXT DEFAULT 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';
```

### Step 2: Create Supabase Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **Create Bucket**
4. Configure the bucket:
   - **Name**: `autotalent_images`
   - **Public**: ✅ **Yes** (Enable public access)
   - Click **Create**

### Step 3: Apply Storage Policies

Execute the storage policies to control access:

1. Go to Supabase Dashboard → **Storage** → **Policies**
2. Select the `autotalent_images` bucket
3. Click **New Policy**
4. Choose **Custom Policy**
5. Copy and paste each policy from `supabase/storage-policies/autotalent_images_policies.sql`

**Policies Summary:**
- ✅ Users can upload to their own folder (user_id/)
- ✅ Users can update their own files
- ✅ Users can delete their own files
- ✅ Public can view all images (for profile pictures to be visible)

### Step 4: Upload Default Profile Picture (Optional)

1. Create a default profile picture image (e.g., avatar placeholder)
2. Upload it to Supabase Storage:
   - Bucket: `autotalent_images`
   - Path: `profile_pic.png` (root level)
3. This will be used as the default for users without a profile picture

**Default URL:**
```
https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png
```

### Step 5: Verify Setup

Test the implementation:

1. Log into your application
2. Navigate to **Profile Editor** → **Basic Info** tab
3. You should see the profile picture upload component
4. Try uploading a test image
5. Verify the image appears in:
   - Profile editor
   - Resume templates
   - Supabase Storage (under `autotalent_images/[user_id]/`)

## File Structure

```
auto-talent/
├── supabase/
│   ├── migrations/
│   │   └── add_profile_pic_column.sql          # Database migration
│   └── storage-policies/
│       └── autotalent_images_policies.sql      # Storage access policies
├── components/
│   └── profile/
│       ├── profile-picture-upload.tsx          # Upload component
│       └── profile-basic-info-form.tsx         # Integrated form
└── lib/
    └── types.ts                                 # Updated Profile interface
```

## How It Works

### 1. Upload Flow

1. **User selects image**: File input triggered by clicking camera icon or upload button
2. **Validation**: Image type and size validated (max 5MB)
3. **Preview**: Local preview shown immediately
4. **Storage**:
   - Old files deleted from user's folder
   - New file uploaded to `autotalent_images/[user_id]/profile_pic.[ext]`
5. **Database**: `users.profile_pic` updated with public URL
6. **Callback**: Parent component notified with new URL

### 2. Storage Organization

```
autotalent_images/               # Bucket
├── profile_pic.png              # Default image (root level)
├── user-123-abc/                # User folder
│   └── profile_pic.jpg          # User's profile picture
├── user-456-def/
│   └── profile_pic.png
└── user-789-ghi/
    └── profile_pic.webp
```

### 3. Database Schema

**users table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  -- ... other columns ...
  profile_pic TEXT DEFAULT 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png'
);
```

### 4. Type Definition

**Profile interface:**
```typescript
export interface Profile {
  id: string;
  user_id: string;
  // ... other fields ...
  profile_pic?: string | null;  // Supabase storage URL
}
```

## Usage in Components

### ProfilePictureUpload Component

```tsx
import { ProfilePictureUpload } from '@/components/profile/profile-picture-upload';

<ProfilePictureUpload
  currentImageUrl={profile.profile_pic || undefined}
  userId={profile.user_id}
  onUploadComplete={(url) => {
    // Handle the new URL
    updateProfile('profile_pic', url);
  }}
/>
```

**Props:**
- `currentImageUrl`: Current profile picture URL (optional)
- `userId`: User's ID for folder organization
- `onUploadComplete`: Callback when upload succeeds

### Features

✅ **Image Preview**: Live preview before and after upload
✅ **Loading States**: Shows spinner during upload
✅ **Validation**: File type and size checks
✅ **Error Handling**: User-friendly error messages
✅ **Remove Option**: Can remove and revert to default
✅ **Responsive**: Works on all screen sizes

## Resume Template Integration

The profile picture is automatically available in resume templates through the `profile_pic` field:

```typescript
// In resume template generators
export function generateTemplate(resume: Resume): string {
  // Access profile picture from user's profile or use default
  const profileImage = resume.profile_pic ||
    'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

  return `
    <img src="${profileImage}" alt="Profile Picture" />
  `;
}
```

**Note**: Resume templates need to be updated to pull from `resume.profile_pic` instead of generating placeholders.

## Security Considerations

### Row Level Security (RLS)

Storage policies ensure:
- Users can only upload/update/delete files in their own folder
- No user can modify another user's files
- All images are publicly readable (necessary for resume viewing)

### File Validation

The component validates:
- **File Type**: Only images (image/*)
- **File Size**: Maximum 5MB
- **Extension**: Common image formats (JPG, PNG, GIF, WebP)

### Folder Structure

Each user's files are isolated in their own folder using their user ID:
```
autotalent_images/[auth.uid()]/profile_pic.ext
```

This prevents:
- File name collisions
- Unauthorized access to other users' files
- Accidental overwrites

## Troubleshooting

### Issue: "Failed to upload profile picture"

**Possible Causes:**
1. Storage bucket not created
2. Storage policies not applied
3. File too large (>5MB)
4. Invalid file type

**Solution:**
- Verify bucket exists and is public
- Check storage policies are applied
- Try smaller file
- Use JPG/PNG format

### Issue: Image doesn't appear

**Possible Causes:**
1. Public access not enabled on bucket
2. Incorrect URL format
3. CORS issues

**Solution:**
- Enable public access on `autotalent_images` bucket
- Verify URL matches format: `https://[PROJECT].supabase.co/storage/v1/object/public/autotalent_images/...`
- Check browser console for CORS errors

### Issue: "Permission denied" error

**Possible Causes:**
1. Storage policies not applied
2. User not authenticated
3. Trying to access another user's folder

**Solution:**
- Apply all storage policies from `autotalent_images_policies.sql`
- Ensure user is logged in
- Verify user ID matches folder name

## Best Practices

### Image Guidelines

**Recommended:**
- **Size**: 400x400px or larger (square)
- **Format**: JPG or PNG
- **File Size**: Under 1MB for faster loading
- **Aspect Ratio**: 1:1 (square)

### Performance

- Images are cached by Supabase CDN
- Browser caching is enabled (3600s)
- Use `upsert: true` to replace files efficiently

### UX Tips

- Show loading indicator during upload
- Preview image before upload
- Allow crop/resize in future versions
- Provide clear error messages
- Show file size/type requirements

## API Reference

### Component Props

#### ProfilePictureUpload

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentImageUrl` | `string \| undefined` | No | Current profile picture URL |
| `userId` | `string` | Yes | User's ID for folder organization |
| `onUploadComplete` | `(url: string) => void` | Yes | Callback with new URL on success |

### Supabase Storage Methods

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('autotalent_images')
  .upload('user_id/profile_pic.jpg', file, {
    cacheControl: '3600',
    upsert: true,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('autotalent_images')
  .getPublicUrl('user_id/profile_pic.jpg');

// Delete file
const { error } = await supabase.storage
  .from('autotalent_images')
  .remove(['user_id/profile_pic.jpg']);

// List files in folder
const { data, error } = await supabase.storage
  .from('autotalent_images')
  .list('user_id');
```

## Future Enhancements

Potential improvements:
- ✨ Image cropping before upload
- ✨ Multiple image sizes (thumbnail, full)
- ✨ Drag-and-drop upload
- ✨ Webcam capture
- ✨ Image filters/adjustments
- ✨ Progress bar for large uploads
- ✨ Integration with resume editor for real-time preview

---

**Setup Complete!** 🎉

Users can now upload profile pictures that will automatically be used in their resumes and throughout the application.

For issues or questions, check the troubleshooting section or contact support.

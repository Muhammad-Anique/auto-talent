-- Storage Policies for autotalent_images bucket
-- Created: 2026-01-31
-- Description: Policies for authenticated users to manage their profile pictures

-- Policy 1: Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'autotalent_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow authenticated users to update files in their own folder
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'autotalent_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Allow authenticated users to delete files in their own folder
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'autotalent_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow public read access to all files (for profile pictures)
CREATE POLICY "Public read access for profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'autotalent_images');

-- Note: Make sure the bucket 'autotalent_images' is created and set to public
-- You can do this in Supabase Dashboard:
-- Storage > Create Bucket > Name: autotalent_images > Public: Yes

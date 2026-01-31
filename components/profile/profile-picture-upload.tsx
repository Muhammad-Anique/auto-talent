'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userId: string;
  onUploadComplete: (url: string) => void;
}

export function ProfilePictureUpload({
  currentImageUrl,
  userId,
  onUploadComplete,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        position: 'bottom-right',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        position: 'bottom-right',
      });
      return;
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);

      // Generate file path: userId/profile_pic.{extension}
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile_pic.${fileExt}`;

      // Delete existing file if it exists
      const { data: existingFiles } = await supabase.storage
        .from('autotalent_images')
        .list(userId);

      if (existingFiles && existingFiles.length > 0) {
        // Delete all existing files in user's folder
        const filesToDelete = existingFiles.map((f) => `${userId}/${f.name}`);
        await supabase.storage
          .from('autotalent_images')
          .remove(filesToDelete);
      }

      // Upload new file
      const { data, error } = await supabase.storage
        .from('autotalent_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('autotalent_images').getPublicUrl(fileName);

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_pic: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Call the callback with the new URL
      onUploadComplete(publicUrl);

      toast.success('Profile picture updated successfully', {
        position: 'bottom-right',
        className:
          'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload profile picture. Please try again.', {
        position: 'bottom-right',
      });
      // Revert preview on error
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    try {
      setIsUploading(true);

      // Delete file from storage
      const { data: files } = await supabase.storage
        .from('autotalent_images')
        .list(userId);

      if (files && files.length > 0) {
        const filesToDelete = files.map((f) => `${userId}/${f.name}`);
        await supabase.storage
          .from('autotalent_images')
          .remove(filesToDelete);
      }

      // Update user profile with default image
      const defaultUrl =
        'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

      const { error } = await supabase
        .from('users')
        .update({ profile_pic: defaultUrl })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setPreviewUrl(null);
      onUploadComplete(defaultUrl);

      toast.success('Profile picture removed', {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove profile picture', {
        position: 'bottom-right',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Profile Picture Preview */}
      <div className="relative group">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-zinc-200 group-hover:ring-[#5b6949] transition-all duration-200">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
              <Camera className="w-12 h-12 text-zinc-400" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Camera Icon Overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 bg-[#5b6949] text-white rounded-full shadow-lg hover:bg-[#5b6949]/90 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          size="sm"
          className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-[#5b6949]/30 transition-all duration-200"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>

        {previewUrl &&
          previewUrl !==
            'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png' && (
            <Button
              onClick={handleRemove}
              disabled={isUploading}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Helper Text */}
      <p className="text-xs text-zinc-500 text-center max-w-xs">
        Recommended: Square image, at least 400x400px. Max file size: 5MB.
        Supported formats: JPG, PNG, GIF, WebP.
      </p>
    </div>
  );
}

-- Add site images support to layout_requests table
-- This script adds a site_images column to store site images as JSON

-- Add site_images column to layout_requests table
ALTER TABLE layout_requests 
ADD COLUMN site_images TEXT NULL COMMENT 'JSON array of site images with file paths and metadata';

-- Add reference_images column to layout_requests table (if not exists)
ALTER TABLE layout_requests 
ADD COLUMN reference_images TEXT NULL COMMENT 'JSON array of reference images with file paths and metadata';

-- Add room_images column to layout_requests table (if not exists)  
ALTER TABLE layout_requests 
ADD COLUMN room_images TEXT NULL COMMENT 'JSON object of room-specific images with file paths and metadata';

-- Create site_images uploads directory structure
-- Note: This will be handled by PHP when the upload API is called



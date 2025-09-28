-- SQL to modify layout_requests table for architect visibility
-- This script adds columns to store all the detailed information that architects need to see

-- Add columns for better architect visibility and data organization
ALTER TABLE layout_requests 
ADD COLUMN IF NOT EXISTS site_images TEXT NULL COMMENT 'JSON array of site images with file paths and metadata',
ADD COLUMN IF NOT EXISTS reference_images TEXT NULL COMMENT 'JSON array of reference images with file paths and metadata',
ADD COLUMN IF NOT EXISTS room_images TEXT NULL COMMENT 'JSON object of room-specific images with file paths and metadata',
ADD COLUMN IF NOT EXISTS orientation VARCHAR(255) NULL COMMENT 'Site orientation preferences',
ADD COLUMN IF NOT EXISTS site_considerations TEXT NULL COMMENT 'Additional site considerations and notes',
ADD COLUMN IF NOT EXISTS material_preferences TEXT NULL COMMENT 'Material preferences as comma-separated values',
ADD COLUMN IF NOT EXISTS budget_allocation VARCHAR(255) NULL COMMENT 'Budget allocation preferences',
ADD COLUMN IF NOT EXISTS floor_rooms TEXT NULL COMMENT 'JSON object of floor-wise room planning',
ADD COLUMN IF NOT EXISTS num_floors VARCHAR(10) NULL COMMENT 'Number of floors requested',
ADD COLUMN IF NOT EXISTS preferred_style VARCHAR(100) NULL COMMENT 'Preferred architectural style';

-- Update the status enum to include more states if needed
ALTER TABLE layout_requests 
MODIFY COLUMN status ENUM('pending','approved','rejected','active','accepted','declined','deleted') DEFAULT 'pending';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_layout_requests_architect_view ON layout_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_layout_requests_homeowner_status ON layout_requests(homeowner_id, status);

-- Optional: Add a view for architects to easily see all request details
CREATE OR REPLACE VIEW architect_request_details AS
SELECT 
    lr.id,
    lr.user_id,
    lr.homeowner_id,
    lr.plot_size,
    lr.budget_range,
    lr.location,
    lr.timeline,
    lr.num_floors,
    lr.preferred_style,
    lr.orientation,
    lr.site_considerations,
    lr.material_preferences,
    lr.budget_allocation,
    lr.site_images,
    lr.reference_images,
    lr.room_images,
    lr.floor_rooms,
    lr.requirements,
    lr.status,
    lr.layout_type,
    lr.selected_layout_id,
    lr.layout_file,
    lr.created_at,
    lr.updated_at,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    u.address,
    u.city,
    u.state
FROM layout_requests lr
JOIN users u ON lr.homeowner_id = u.id
WHERE lr.status IN ('pending', 'approved', 'active')
ORDER BY lr.created_at DESC;

-- Grant permissions for architects to access the view (adjust as needed)
-- GRANT SELECT ON architect_request_details TO 'architect_user'@'localhost';



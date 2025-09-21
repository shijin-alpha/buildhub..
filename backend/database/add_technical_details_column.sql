-- Add technical_details column to designs table to store comprehensive architectural design information

ALTER TABLE designs 
ADD COLUMN technical_details JSON NULL 
COMMENT 'Comprehensive technical details including floor plans, site orientation, structural elements, elevations, and construction notes';

-- Update existing designs to have empty technical_details
UPDATE designs 
SET technical_details = '{}' 
WHERE technical_details IS NULL;


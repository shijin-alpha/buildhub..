-- Ensure required tables and columns exist for architect profiles and designs

-- Users table columns (safe if already added)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS address TEXT NULL,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS experience_years INT NULL;

-- Architect reviews (for rating and review count)
CREATE TABLE IF NOT EXISTS architect_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  architect_id INT NOT NULL,
  homeowner_id INT NOT NULL,
  design_id INT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (architect_id),
  INDEX (homeowner_id)
);

-- Assignments from homeowner to architect
CREATE TABLE IF NOT EXISTS layout_request_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  layout_request_id INT NOT NULL,
  homeowner_id INT NOT NULL,
  architect_id INT NOT NULL,
  status ENUM('sent','accepted','rejected','cancelled') DEFAULT 'sent',
  message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (layout_request_id),
  INDEX (architect_id)
);

-- Designs table used by upload_design.php
CREATE TABLE IF NOT EXISTS designs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  layout_request_id INT NULL,
  homeowner_id INT NULL,
  architect_id INT NOT NULL,
  design_title VARCHAR(255) NOT NULL,
  description TEXT,
  design_files TEXT,
  layout_json TEXT NULL,
  status ENUM('proposed','shortlisted','finalized') DEFAULT 'proposed',
  batch_id VARCHAR(64) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (layout_request_id),
  INDEX (architect_id),
  INDEX (status)
);
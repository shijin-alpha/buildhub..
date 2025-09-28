# BuildHub Repository Overview

## Project Purpose
BuildHub appears to be a full-stack platform that connects homeowners with contractors and architects. It combines a PHP backend with a modern JavaScript frontend to support user registration, dashboards, and custom design requests.

## Tech Stack Summary
- **Backend**: PHP (with Composer-managed dependencies and PHPMailer for email handling)
- **Frontend**: React (Vite setup), with CSS modules for dashboards and general UI styling
- **Database**: MySQL (SQL schema located under `frontend/buildhub.sql` and backend migrations)
- **Environment**: Project rooted at `c:\xampp\htdocs\buildhub` for local XAMPP deployment

## Key Directories
- **backend/**: PHP API endpoints, configuration, and utilities
- **frontend/**: Vite-based React application for client UI
- **uploads/**: User-uploaded assets (avatars, licenses, portfolios) used by the application
- **.zencoder/**: Rules and configuration for Zencoder assistant (this file)

## Notable Files
- **frontend/index.html**: Base HTML template for the React app
- **frontend/src/App.jsx**: Root React component that defines routing/layout
- **backend/api/**: REST-style PHP endpoints for authentication, profiles, and form submissions
- **backend/config/database.php**: Database connection details (ensure environment-specific credentials)

## Common Tasks
1. **Install frontend dependencies**: `npm install` from `frontend/` directory
2. **Run frontend dev server**: `npm run dev` (ensure Vite config aligns with backend API endpoints)
3. **Install backend dependencies**: `composer install` within `backend/`
4. **Configure database**: Import `frontend/buildhub.sql` or run SQL scripts in `backend/database/`

## Tips
- **Cross-Origin Access**: Verify CORS settings when running frontend and backend on separate origins
- **Uploads directory**: Ensure proper write permissions for upload directories when deploying
- **Email/SMS integrations**: Review `backend/utils` and `backend/config/email_config.php` for SMTP settings

## Last Updated
- 2025-02-14
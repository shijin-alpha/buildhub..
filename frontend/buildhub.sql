-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2025 at 06:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buildhub`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_logs`
--

INSERT INTO `admin_logs` (`id`, `action`, `user_id`, `details`, `created_at`) VALUES
(1, 'status_change', 19, '{\"old_status\":\"pending\",\"new_status\":\"approved\",\"user_name\":\"Shijin Thomas\",\"user_email\":\"thomasshijin12@gmail.com\",\"user_role\":\"homeowner\"}', '2025-08-15 11:29:50'),
(2, 'status_change', 26, '{\"old_status\":\"pending\",\"new_status\":\"approved\",\"user_name\":\"APARNA K SANTHOSH MCA2024-2026\",\"user_email\":\"aparnaksanthosh2026@mca.ajce.in\",\"user_role\":\"architect\"}', '2025-09-03 15:17:59'),
(3, 'status_change', 27, '{\"old_status\":\"pending\",\"new_status\":\"approved\",\"user_name\":\"Shijin Thomas\",\"user_email\":\"shijinthomas1501@gmail.com\",\"user_role\":\"architect\"}', '2025-09-03 15:18:01'),
(4, 'status_change', 28, '{\"old_status\":\"pending\",\"new_status\":\"approved\",\"user_name\":\"SHIJIN THOMAS MCA2024-2026\",\"user_email\":\"shijinthomas2026@mca.ajce.in\",\"user_role\":\"homeowner\"}', '2025-09-03 15:18:02'),
(5, 'status_change', 29, '{\"old_status\":\"pending\",\"new_status\":\"approved\",\"user_name\":\"Shijin Thomas\",\"user_email\":\"shijinthomas248@gmail.com\",\"user_role\":\"contractor\"}', '2025-09-03 15:18:04'),
(6, 'status_change', 30, '{\"old_status\":\"pending\",\"new_status\":\"approved\",\"user_name\":\"Fathima Shibu\",\"user_email\":\"fathima470077@gmail.com\",\"user_role\":\"homeowner\"}', '2025-09-03 15:18:05'),
(7, 'status_change', 32, '{\"old_status\":\"approved\",\"new_status\":\"suspended\",\"user_name\":\"Amal Samuel\",\"user_email\":\"thomasshijin90@gmail.com\",\"user_role\":\"homeowner\",\"schema_has_status\":true}', '2025-09-19 08:10:36'),
(8, 'status_change', 32, '{\"old_status\":\"suspended\",\"new_status\":\"approved\",\"user_name\":\"Amal Samuel\",\"user_email\":\"thomasshijin90@gmail.com\",\"user_role\":\"homeowner\",\"schema_has_status\":true}', '2025-09-19 08:11:33');

-- --------------------------------------------------------

--
-- Table structure for table `architect_layouts`
--

CREATE TABLE `architect_layouts` (
  `id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `design_type` enum('custom','template') NOT NULL,
  `description` text NOT NULL,
  `layout_file` varchar(255) DEFAULT NULL,
  `template_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `architect_reviews`
--

CREATE TABLE `architect_reviews` (
  `id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `design_id` int(11) DEFAULT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `architect_reviews`
--

INSERT INTO `architect_reviews` (`id`, `architect_id`, `homeowner_id`, `design_id`, `rating`, `comment`, `created_at`) VALUES
(1, 27, 30, 6, 5, 'very good', '2025-09-01 16:18:06'),
(2, 27, 30, 6, 5, 'very good', '2025-09-01 16:21:01'),
(3, 27, 30, 6, 5, 'very good', '2025-09-01 16:23:25'),
(4, 27, 30, 7, 5, 'it was very good and thank you for your service', '2025-09-07 07:19:46'),
(5, 27, 30, 8, 5, 'Thank you for the service', '2025-09-14 11:24:44'),
(6, 27, 30, 8, 5, 'thankyou', '2025-09-14 11:24:53'),
(7, 31, 30, 9, 5, 'thankyou', '2025-09-14 11:46:54'),
(8, 27, 30, 8, 5, 'thankyou', '2025-09-14 14:41:48'),
(9, 27, 19, 14, 5, 'Thankyou for the service', '2025-09-22 01:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `contractor_assignments`
--

CREATE TABLE `contractor_assignments` (
  `id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `status` enum('assigned','accepted','rejected','completed') DEFAULT 'assigned',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contractor_assignments`
--

INSERT INTO `contractor_assignments` (`id`, `layout_request_id`, `contractor_id`, `status`, `assigned_at`, `updated_at`) VALUES
(20, 65, 29, 'assigned', '2025-09-23 16:40:33', '2025-09-23 16:40:33');

-- --------------------------------------------------------

--
-- Table structure for table `contractor_assignment_hides`
--

CREATE TABLE `contractor_assignment_hides` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `hidden_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contractor_assignment_hides`
--

INSERT INTO `contractor_assignment_hides` (`id`, `assignment_id`, `contractor_id`, `hidden_at`) VALUES
(1, 4, 29, '2025-09-21 07:59:30'),
(2, 6, 29, '2025-09-21 07:59:34'),
(3, 5, 29, '2025-09-21 07:59:38'),
(4, 8, 29, '2025-09-21 07:59:41'),
(5, 7, 29, '2025-09-21 07:59:44');

-- --------------------------------------------------------

--
-- Table structure for table `contractor_proposals`
--

CREATE TABLE `contractor_proposals` (
  `id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `materials` text NOT NULL,
  `cost_breakdown` text NOT NULL,
  `total_cost` decimal(12,2) NOT NULL,
  `timeline` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contractor_requests_queue`
--

CREATE TABLE `contractor_requests_queue` (
  `id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `contractor_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `timeline` varchar(100) DEFAULT NULL,
  `share_contact` tinyint(1) DEFAULT 1,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contractor_reviews`
--

CREATE TABLE `contractor_reviews` (
  `id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `layout_request_id` int(11) DEFAULT NULL,
  `rating` tinyint(1) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `designs`
--

CREATE TABLE `designs` (
  `id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `design_title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `design_files` text DEFAULT NULL,
  `status` enum('proposed','shortlisted','finalized') DEFAULT 'proposed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `homeowner_id` int(11) DEFAULT NULL,
  `batch_id` varchar(64) DEFAULT NULL,
  `layout_json` text DEFAULT NULL,
  `technical_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Comprehensive technical details including floor plans, site orientation, structural elements, elevations, and construction notes' CHECK (json_valid(`technical_details`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designs`
--

INSERT INTO `designs` (`id`, `layout_request_id`, `architect_id`, `design_title`, `description`, `design_files`, `status`, `created_at`, `updated_at`, `homeowner_id`, `batch_id`, `layout_json`, `technical_details`) VALUES
(10, 20, 27, 'modern', '', '[{\"original\":\"5.png\",\"stored\":\"68cbdbb6e25c96.18389048_1758190518.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68cbdbb6e25c96.18389048_1758190518.png\"}]', 'finalized', '2025-09-18 10:15:18', '2025-09-21 12:12:00', NULL, NULL, NULL, '{}'),
(13, 46, 27, 'Modern 2BHK Residential Home', 'A modern 2BHK residential home with open living spaces, optimized natural light, and efficient circulation. Suitable for a small family, featuring comfortable bedrooms, a spacious living area, and a functional kitchen.', '[{\"original\":\"4.png\",\"stored\":\"68cff0926267c9.27038359_1758458002.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68cff0926267c9.27038359_1758458002.png\"}]', 'finalized', '2025-09-21 12:33:22', '2025-09-21 15:44:43', NULL, NULL, NULL, '{\"floor_plans\":{\"layout_description\":\"A modern 2BHK residential home with open living spaces, optimized natural light, and efficient circulation. Suitable for a small family, featuring comfortable bedrooms, a spacious living area, and a functional kitchen.\",\"living_room_dimensions\":\"20 × 15 ft\",\"kitchen_dimensions\":\"12 × 10 ft\",\"master_bedroom_dimensions\":\"16 × 12 ft\",\"other_room_dimensions\":\"Bedroom 2: 12 × 12 ft\\n\\nBathrooms: 8 × 6 ft each\\n\\nKitchen: 12 × 10 ft\",\"door_window_positions\":\"Main Door: 6 ft × 3 ft, East side entrance\\n\\nInternal Doors: 3 ft × 7 ft\\n\\nWindows: Living Room – 6 ft × 5 ft North; Bedrooms – 5 ft × 4 ft East & West\",\"circulation_paths\":\"Hallway connecting bedrooms and living/dining area\\n\\nStaircase 4 ft wide from ground floor to first floor\\n\\nClear open path from main entrance to living room\"},\"site_orientation\":{\"plot_boundaries\":\"Plot Size: 40 × 30 ft\\n\\nSetbacks: Front – 5 ft, Rear – 5 ft, Sides – 3 ft\",\"orientation\":\"North facing main entrance\\n\\nSouth-facing backyard for sunlight in morning\",\"access_points\":\"Main entrance gate on East side\\n\\nVehicle driveway along front setback\\n\\nPedestrian pathway from gate to main door\"},\"structural\":{\"load_bearing_walls\":\"External walls: 0.3 m thick\\n\\nInternal walls: 0.2 m thick (kitchen and bathrooms mostly non-load bearing)\",\"column_positions\":\"Four corner columns in living room and master bedroom\\n\\nColumns supporting first-floor slab at stairwell and living room\",\"foundation_outline\":\"Reinforced concrete strip foundation for walls\\n\\nDepth: 4 ft below ground level\",\"roof_outline\":\"Flat RCC slab roof\\n\\nOptional terrace area on first floor\"},\"elevations\":{\"front_elevation\":\"Width: 40 ft\\n\\nHeight: 20 ft (ground + first floor)\\n\\nModern façade with large windows, balcony on first floor\",\"cross_sections\":\"Typical floor section showing 10 ft floor-to-ceiling height\\n\\nStaircase section showing riser: 7 in, tread: 11 in\",\"height_details\":\"Ground Floor Ceiling: 10 ft\\n\\nFirst Floor Ceiling: 10 ft\\n\\nTotal Building Height: 20 ft\"},\"construction\":{\"wall_thickness\":\"External Walls: 0.3 m\\n\\nInternal Walls: 0.2 m\",\"ceiling_heights\":\"All rooms: 10 ft\",\"building_codes\":\"Follows local municipal building codes for residential construction\\n\\nFire safety provisions for staircase and kitchen\\n\\nMinimum setbacks and structural safety compliance\",\"critical_instructions\":\"Ensure proper waterproofing on terrace and bathrooms\\n\\nWindow placement for optimal daylight and ventilation\\n\\nStaircase width to allow safe movement\"}}'),
(14, 58, 27, 'Modern', '', '[{\"original\":\"1.png\",\"stored\":\"68d0218eb7a414.89463368_1758470542.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d0218eb7a414.89463368_1758470542.png\"}]', 'finalized', '2025-09-21 16:02:22', '2025-09-21 16:09:08', NULL, NULL, NULL, '{\"floor_plans\":{\"layout_description\":\"Ground Floor: Foyer, Living Room, Kitchen, Dining, Guest Bedroom, Bathroom 1, Staircase\\n\\nFirst Floor: Master Bedroom with attached Bath, Bedroom 2, Common Bathroom, Family Lounge, Balcony\",\"living_room_dimensions\":\"20 ×15\",\"master_bedroom_dimensions\":\"16×12\",\"kitchen_dimensions\":\"12×10\",\"other_room_dimensions\":\"Master Bedroom: 18 × 14 ft\\n\\nBedroom 2: 14 × 12 ft\\n\\nBathrooms: 8 × 7 ft each\\n\\nFamily Lounge: 12 × 10 ft\",\"door_window_positions\":\"Main Door: 7 ft × 3.5 ft, facing North-East\\n\\nInternal Doors: 3 ft × 7 ft\\n\\nWindows:\\n\\nLiving Room – 7 × 5 ft East & North\\n\\nKitchen – 4 × 3 ft West\\n\\nBedrooms – 5 × 4 ft (direction based on room orientation)\",\"circulation_paths\":\"Central hallway from foyer to staircase\\n\\nStaircase 4.5 ft wide with landing mid-level\\n\\nOpen connection between living, dining, and kitchen\"},\"site_orientation\":{\"plot_boundaries\":\"Plot Size: 45 × 35 ft\\n\\nSetbacks: Front – 6 ft, Rear – 5 ft, Sides – 4 ft\",\"orientation\":\"Entry on North-East side\\n\\nLarge windows on South for winter sunlight\\n\\nBalcony positioned for evening breeze\",\"access_points\":\"Vehicle gate and driveway on North\\n\\nSmall side gate for service entry (West)\\n\\nPedestrian walkway from driveway to main door\"},\"structural\":{\"load_bearing_walls\":\"Outer walls: 0.35 m thick\\n\\nPartition walls: 0.18–0.2 m\",\"column_positions\":\"At four corners of living area\\n\\nColumns near staircase landing & balcony supports\",\"foundation_outline\":\"RCC isolated footing under columns + strip footing for walls\\n\\nDepth: 4.5 ft below natural ground level\\n\\n\",\"roof_outline\":\"Flat RCC roof with slight slope for drainage\\n\\nParapet wall 3 ft high along roof edge\"},\"construction\":{\"wall_thickness\":\"External walls: 0.35 m\\n\\nInternal walls: 0.18–0.2 m\",\"ceiling_heights\":\"All floors: 10 ft clear height\",\"building_codes\":\"Adheres to state residential codes for RCC structures\\n\\nEarthquake-resistant detailing per IS standards\\n\\nAdequate fire escape route through staircase\",\"critical_instructions\":\"Provide sunshades above south-facing windows\\n\\nEnsure proper rainwater drainage on roof terrace\\n\\nUse anti-skid tiles in bathrooms and balcony\"}}'),
(18, 62, 33, 'ygyf', '', '[{\"original\":\"2.png\",\"stored\":\"68d10901ccf4a6.65761448_1758529793.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d10901ccf4a6.65761448_1758529793.png\"}]', 'finalized', '2025-09-22 08:29:53', '2025-09-22 08:30:26', NULL, NULL, NULL, '{\"floor_plans\":{\"living_room_dimensions\":\"51\",\"master_bedroom_dimensions\":\"49\",\"kitchen_dimensions\":\"46\",\"other_room_dimensions\":\"45\",\"door_window_positions\":\"bvh\",\"circulation_paths\":\"jhb\"},\"site_orientation\":{\"orientation\":\",m m, \",\"access_points\":\"ihih\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `design_comments`
--

CREATE TABLE `design_comments` (
  `id` int(11) NOT NULL,
  `design_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `design_comments`
--

INSERT INTO `design_comments` (`id`, `design_id`, `user_id`, `message`, `created_at`) VALUES
(1, 6, 30, 'very good', '2025-09-01 16:23:25'),
(2, 7, 30, 'it was very good and thank you for your service', '2025-09-07 07:19:46'),
(3, 8, 30, 'Thank you for the service', '2025-09-14 11:24:44'),
(4, 8, 30, 'thankyou', '2025-09-14 11:24:53'),
(5, 9, 30, 'thankyou', '2025-09-14 11:46:54'),
(6, 8, 30, 'thankyou', '2025-09-14 14:41:48'),
(7, 14, 19, 'Thankyou for the service', '2025-09-22 01:04:59');

-- --------------------------------------------------------

--
-- Table structure for table `layout_library`
--

CREATE TABLE `layout_library` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `layout_type` varchar(100) NOT NULL,
  `bedrooms` int(11) NOT NULL,
  `bathrooms` int(11) NOT NULL,
  `area` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `design_file_url` varchar(500) DEFAULT NULL,
  `price_range` varchar(100) DEFAULT NULL,
  `technical_details` text DEFAULT NULL,
  `architect_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `floor_plans` text DEFAULT NULL,
  `room_dimensions` text DEFAULT NULL,
  `door_window_positions` text DEFAULT NULL,
  `circulation_paths` text DEFAULT NULL,
  `plot_boundaries` text DEFAULT NULL,
  `orientation_north` text DEFAULT NULL,
  `access_points` text DEFAULT NULL,
  `load_bearing_walls` text DEFAULT NULL,
  `column_positions` text DEFAULT NULL,
  `foundation_outline` text DEFAULT NULL,
  `roof_outline` text DEFAULT NULL,
  `front_elevation` text DEFAULT NULL,
  `cross_sections` text DEFAULT NULL,
  `height_details` text DEFAULT NULL,
  `wall_thickness` text DEFAULT NULL,
  `ceiling_heights` text DEFAULT NULL,
  `building_codes` text DEFAULT NULL,
  `critical_instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_library`
--

INSERT INTO `layout_library` (`id`, `title`, `layout_type`, `bedrooms`, `bathrooms`, `area`, `description`, `image_url`, `design_file_url`, `price_range`, `technical_details`, `architect_id`, `status`, `created_at`, `updated_at`, `floor_plans`, `room_dimensions`, `door_window_positions`, `circulation_paths`, `plot_boundaries`, `orientation_north`, `access_points`, `load_bearing_walls`, `column_positions`, `foundation_outline`, `roof_outline`, `front_elevation`, `cross_sections`, `height_details`, `wall_thickness`, `ceiling_heights`, `building_codes`, `critical_instructions`) VALUES
(10, '3BHK', 'Modern', 3, 3, 2500, '', '/buildhub/backend/uploads/designs/lib_1757227454_e98c35d1.jpeg', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg', '80-90 laks', NULL, 27, 'active', '2025-09-07 06:44:14', '2025-09-17 07:40:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'Modern 3BHK Hosue', 'Modern', 3, 3, 3000, '', '/buildhub/backend/uploads/designs/lib_1758475689_df7bb48f.jpeg', '/buildhub/backend/uploads/designs/libfile_1758471904_696c8d06.png', '85-90', NULL, 27, 'active', '2025-09-21 16:11:24', '2025-09-21 17:28:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `layout_library_technical_details`
--

CREATE TABLE `layout_library_technical_details` (
  `id` int(11) NOT NULL,
  `layout_library_id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `room_layout_dimensions` text DEFAULT NULL,
  `door_window_positions` text DEFAULT NULL,
  `circulation_paths` text DEFAULT NULL,
  `plot_boundaries` text DEFAULT NULL,
  `orientation_north_direction` text DEFAULT NULL,
  `access_points` text DEFAULT NULL,
  `load_bearing_walls` text DEFAULT NULL,
  `column_positions` text DEFAULT NULL,
  `foundation_outline` text DEFAULT NULL,
  `roof_outline` text DEFAULT NULL,
  `front_elevation` text DEFAULT NULL,
  `cross_sections` text DEFAULT NULL,
  `height_details` text DEFAULT NULL,
  `wall_thickness` text DEFAULT NULL,
  `ceiling_heights` text DEFAULT NULL,
  `building_codes_compliance` text DEFAULT NULL,
  `critical_instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_requests`
--

CREATE TABLE `layout_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `plot_size` varchar(100) NOT NULL,
  `budget_range` varchar(100) NOT NULL,
  `requirements` text DEFAULT NULL,
  `preferred_style` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','rejected','active','accepted','declined','deleted') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `location` varchar(255) DEFAULT NULL,
  `timeline` varchar(100) DEFAULT NULL,
  `selected_layout_id` int(11) DEFAULT NULL,
  `layout_type` enum('custom','library') NOT NULL DEFAULT 'custom',
  `layout_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_requests`
--

INSERT INTO `layout_requests` (`id`, `user_id`, `homeowner_id`, `plot_size`, `budget_range`, `requirements`, `preferred_style`, `status`, `created_at`, `updated_at`, `location`, `timeline`, `selected_layout_id`, `layout_type`, `layout_file`) VALUES
(14, 30, 30, '1500', '50+ Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"flat\",\"development_laws\":\"2 floors\",\"family_needs\":\"kids friendly\",\"rooms\":\"3 bhk\",\"aesthetic\":\"modern\",\"notes\":\"nothing\"}', NULL, 'deleted', '2025-08-31 15:53:35', '2025-09-20 15:18:32', 'kottayam', '6-12 months', NULL, 'custom', NULL),
(15, 30, 30, '3434', '10-20 Lakhs', '{\"plot_shape\":\"fbfv\",\"topography\":\"bfbbf\",\"development_laws\":\"fbf\",\"family_needs\":\"bfbf\",\"rooms\":\"bfb\",\"aesthetic\":\"fbfb\",\"notes\":\"bbf\"}', NULL, 'deleted', '2025-09-01 16:24:00', '2025-09-20 15:18:35', 'bff', '6-12 months', NULL, 'custom', NULL),
(17, 30, 30, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-07 07:04:09', '2025-09-20 15:18:40', '', '', NULL, 'library', NULL),
(18, 30, 30, '2500', '5-10 Lakhs', '{\"plot_shape\":\"unstructured\",\"topography\":\"rocky\",\"development_laws\":\"nil\",\"family_needs\":\"\",\"rooms\":\"4bhk\",\"aesthetic\":\"contemporary\",\"notes\":\"courtyard, garden\"}', NULL, 'deleted', '2025-09-08 11:02:15', '2025-09-20 15:18:20', 'kottayam', '1-3 months', NULL, 'custom', NULL),
(19, 30, 30, '2500', '500000', '{\"plot_shape\":\"Reactangular\",\"topography\":\"Flat\",\"development_laws\":\"nil\",\"family_needs\":\"nil\",\"rooms\":\"3\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'pending', '2025-09-14 11:06:28', '2025-09-14 11:06:28', 'Kanjirappally', '12-18 months', NULL, 'custom', NULL),
(20, 30, 30, '2000', '2500000', '{\"plot_shape\":\"rectangle\",\"topography\":\"flat\",\"development_laws\":\"nil\",\"family_needs\":\"nil\",\"rooms\":\"5\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-18 10:14:42', '2025-09-20 16:23:09', 'Munnar', '0-6 months', NULL, 'custom', NULL),
(21, 32, 32, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-18 14:44:52', '2025-09-20 05:23:29', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(22, 32, 32, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-18 14:44:52', '2025-09-20 05:23:25', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(23, 32, 32, '2000', '500000', '{\"plot_shape\":\"square\",\"topography\":\"Flat\",\"development_laws\":\"nil\",\"family_needs\":\"nil\",\"rooms\":\"3\",\"aesthetic\":\"traditional\",\"notes\":\"\"}', NULL, 'pending', '2025-09-18 14:49:56', '2025-09-18 14:49:56', 'Kollam', '12-18 months', 10, 'library', NULL),
(24, 32, 32, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-18 15:02:05', '2025-09-20 05:23:18', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(25, 32, 32, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-18 15:02:05', '2025-09-20 05:23:34', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(26, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:25:44', '2025-09-19 05:43:23', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(27, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:25:44', '2025-09-19 05:43:21', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(28, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:25:52', '2025-09-19 05:43:18', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(29, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:25:52', '2025-09-19 05:43:25', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(30, 28, 28, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:26:38', '2025-09-21 14:53:49', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(31, 28, 28, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:26:38', '2025-09-21 15:43:15', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(32, 19, 19, '2500', '750000', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"nil\",\"family_needs\":\"nil\",\"rooms\":\"3\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 04:29:23', '2025-09-19 05:43:33', 'Kanjirappally', '12-18 months', NULL, 'custom', NULL),
(33, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:17:58', '2025-09-19 05:43:14', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(34, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:17:58', '2025-09-19 05:43:36', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(35, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:23:01', '2025-09-19 05:43:11', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(36, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:23:01', '2025-09-19 05:43:39', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(37, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:23:19', '2025-09-19 05:43:07', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(38, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:23:19', '2025-09-19 05:43:41', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(39, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:27:10', '2025-09-19 05:43:03', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(40, 19, 19, '', '', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-19 05:27:10', '2025-09-19 06:17:14', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(42, 19, 19, '', '', '', NULL, 'deleted', '2025-09-19 06:15:57', '2025-09-20 05:51:34', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(43, 32, 32, '', '', '', NULL, 'deleted', '2025-09-20 05:44:54', '2025-09-20 05:45:22', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(44, 32, 32, '', '', '', NULL, 'deleted', '2025-09-20 05:45:10', '2025-09-20 05:45:18', '', '', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(45, 32, 32, '', '', '', NULL, 'active', '2025-09-20 05:50:34', '2025-09-20 05:50:34', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(46, 19, 19, '3000', '8500000', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"nil\",\"family_needs\":\"nil\",\"rooms\":\"4\",\"aesthetic\":\"Modern\",\"notes\":\"\"}', NULL, 'pending', '2025-09-20 05:52:41', '2025-09-20 05:52:41', 'Kottayam', '12-18 months', NULL, 'custom', NULL),
(47, 30, 30, '', '', '', NULL, 'active', '2025-09-20 15:17:49', '2025-09-20 15:17:49', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(48, 30, 30, '', '', '', NULL, 'active', '2025-09-20 15:19:37', '2025-09-20 15:19:37', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(49, 30, 30, '', '', '', NULL, 'active', '2025-09-20 17:08:42', '2025-09-20 17:08:42', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(50, 30, 30, '', '', '', NULL, 'active', '2025-09-20 17:09:01', '2025-09-20 17:09:01', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(51, 19, 19, '', '', '', NULL, 'deleted', '2025-09-21 07:32:17', '2025-09-21 15:43:57', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(52, 19, 19, '', '', '', NULL, 'deleted', '2025-09-21 07:51:25', '2025-09-21 15:46:49', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(53, 28, 28, '', '', '', NULL, 'deleted', '2025-09-21 14:48:43', '2025-09-21 16:29:49', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(54, 28, 28, '', '', '', NULL, 'deleted', '2025-09-21 14:48:58', '2025-09-21 16:29:50', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(55, 28, 28, '', '', 'A modern 2BHK residential home with open living spaces, optimized natural light, and efficient circulation. Suitable for a small family, featuring comfortable bedrooms, a spacious living area, and a functional kitchen.', NULL, 'deleted', '2025-09-21 14:49:15', '2025-09-21 16:29:51', '', 'contractor-direct', NULL, 'library', '/buildhub/backend/uploads/designs/libfile_1758451094_0a144bc0.png'),
(56, 28, 28, '', '', '', NULL, 'deleted', '2025-09-21 14:53:56', '2025-09-21 16:33:39', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(57, 19, 19, '', '', '', NULL, 'deleted', '2025-09-21 15:44:13', '2025-09-21 15:46:44', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(58, 19, 19, '2500', '800000', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"nothing\",\"family_needs\":\"no specifications\",\"rooms\":\"4\",\"aesthetic\":\"Modern\",\"notes\":\"\"}', NULL, 'pending', '2025-09-21 15:50:20', '2025-09-21 15:50:20', 'Kanjirappally', '12-18 months', NULL, 'custom', NULL),
(59, 19, 19, '2000', '500000', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-21 17:18:44', '2025-09-22 01:07:12', '', '', 13, 'library', NULL),
(60, 19, 19, '', '', '', NULL, 'deleted', '2025-09-22 01:05:17', '2025-09-22 01:07:26', '', 'contractor-direct', 13, 'library', '/buildhub/backend/uploads/designs/libfile_1758471904_696c8d06.png'),
(61, 19, 19, '', '', '', NULL, 'active', '2025-09-22 01:07:36', '2025-09-22 01:07:36', '', 'contractor-direct', 10, 'library', '/buildhub/backend/uploads/designs/libfile_1757227454_11c2e8a3.jpg'),
(62, 28, 28, '3000', '9000000', '{\"plot_shape\":\"hvh\",\"topography\":\"jbjbj\",\"development_laws\":\"bb\",\"family_needs\":\"jbbj\",\"rooms\":\"3\",\"aesthetic\":\"vv\",\"notes\":\"\"}', NULL, 'pending', '2025-09-22 08:25:49', '2025-09-22 08:25:49', 'Kottakkal', '12-18 months', NULL, 'custom', NULL),
(63, 28, 28, '', '', '{\"source\":\"homeowner-forward\",\"contractor_message\":\"\",\"layout_description\":\"\",\"forwarded_design\":{\"id\":18,\"title\":\"ygyf\",\"description\":\"\",\"files\":[{\"original\":\"2.png\",\"stored\":\"68d10901ccf4a6.65761448_1758529793.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d10901ccf4a6.65761448_1758529793.png\"}],\"technical_details\":{\"floor_plans\":{\"living_room_dimensions\":\"51\",\"master_bedroom_dimensions\":\"49\",\"kitchen_dimensions\":\"46\",\"other_room_dimensions\":\"45\",\"door_window_positions\":\"bvh\",\"circulation_paths\":\"jhb\"},\"site_orientation\":{\"orientation\":\",m m, \",\"access_points\":\"ihih\"}},\"created_at\":\"2025-09-22 13:59:53\"}}', NULL, 'active', '2025-09-23 06:12:05', '2025-09-23 06:12:05', '', 'contractor-direct', NULL, '', '/buildhub/backend/uploads/designs/68d10901ccf4a6.65761448_1758529793.png'),
(64, 28, 28, '', '', '{\"source\":\"homeowner-forward\",\"contractor_message\":\"\",\"layout_description\":\"\",\"forwarded_design\":{\"id\":18,\"title\":\"ygyf\",\"description\":\"\",\"files\":[{\"original\":\"2.png\",\"stored\":\"68d10901ccf4a6.65761448_1758529793.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d10901ccf4a6.65761448_1758529793.png\"}],\"technical_details\":{\"floor_plans\":{\"living_room_dimensions\":\"51\",\"master_bedroom_dimensions\":\"49\",\"kitchen_dimensions\":\"46\",\"other_room_dimensions\":\"45\",\"door_window_positions\":\"bvh\",\"circulation_paths\":\"jhb\"},\"site_orientation\":{\"orientation\":\",m m, \",\"access_points\":\"ihih\"}},\"created_at\":\"2025-09-22 13:59:53\"}}', NULL, 'active', '2025-09-23 16:37:29', '2025-09-23 16:37:29', '', 'contractor-direct', NULL, '', '/buildhub/backend/uploads/designs/68d10901ccf4a6.65761448_1758529793.png'),
(65, 19, 19, '', '', '{\"source\":\"homeowner-forward\",\"contractor_message\":\"\",\"layout_description\":\"\",\"forwarded_design\":{\"id\":13,\"title\":\"Modern 2BHK Residential Home\",\"description\":\"A modern 2BHK residential home with open living spaces, optimized natural light, and efficient circulation. Suitable for a small family, featuring comfortable bedrooms, a spacious living area, and a functional kitchen.\",\"files\":[{\"original\":\"4.png\",\"stored\":\"68cff0926267c9.27038359_1758458002.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68cff0926267c9.27038359_1758458002.png\"}],\"technical_details\":{\"floor_plans\":{\"layout_description\":\"A modern 2BHK residential home with open living spaces, optimized natural light, and efficient circulation. Suitable for a small family, featuring comfortable bedrooms, a spacious living area, and a functional kitchen.\",\"living_room_dimensions\":\"20 \\u00d7 15 ft\",\"kitchen_dimensions\":\"12 \\u00d7 10 ft\",\"master_bedroom_dimensions\":\"16 \\u00d7 12 ft\",\"other_room_dimensions\":\"Bedroom 2: 12 \\u00d7 12 ft\\n\\nBathrooms: 8 \\u00d7 6 ft each\\n\\nKitchen: 12 \\u00d7 10 ft\",\"door_window_positions\":\"Main Door: 6 ft \\u00d7 3 ft, East side entrance\\n\\nInternal Doors: 3 ft \\u00d7 7 ft\\n\\nWindows: Living Room \\u2013 6 ft \\u00d7 5 ft North; Bedrooms \\u2013 5 ft \\u00d7 4 ft East & West\",\"circulation_paths\":\"Hallway connecting bedrooms and living\\/dining area\\n\\nStaircase 4 ft wide from ground floor to first floor\\n\\nClear open path from main entrance to living room\"},\"site_orientation\":{\"plot_boundaries\":\"Plot Size: 40 \\u00d7 30 ft\\n\\nSetbacks: Front \\u2013 5 ft, Rear \\u2013 5 ft, Sides \\u2013 3 ft\",\"orientation\":\"North facing main entrance\\n\\nSouth-facing backyard for sunlight in morning\",\"access_points\":\"Main entrance gate on East side\\n\\nVehicle driveway along front setback\\n\\nPedestrian pathway from gate to main door\"},\"structural\":{\"load_bearing_walls\":\"External walls: 0.3 m thick\\n\\nInternal walls: 0.2 m thick (kitchen and bathrooms mostly non-load bearing)\",\"column_positions\":\"Four corner columns in living room and master bedroom\\n\\nColumns supporting first-floor slab at stairwell and living room\",\"foundation_outline\":\"Reinforced concrete strip foundation for walls\\n\\nDepth: 4 ft below ground level\",\"roof_outline\":\"Flat RCC slab roof\\n\\nOptional terrace area on first floor\"},\"elevations\":{\"front_elevation\":\"Width: 40 ft\\n\\nHeight: 20 ft (ground + first floor)\\n\\nModern fa\\u00e7ade with large windows, balcony on first floor\",\"cross_sections\":\"Typical floor section showing 10 ft floor-to-ceiling height\\n\\nStaircase section showing riser: 7 in, tread: 11 in\",\"height_details\":\"Ground Floor Ceiling: 10 ft\\n\\nFirst Floor Ceiling: 10 ft\\n\\nTotal Building Height: 20 ft\"},\"construction\":{\"wall_thickness\":\"External Walls: 0.3 m\\n\\nInternal Walls: 0.2 m\",\"ceiling_heights\":\"All rooms: 10 ft\",\"building_codes\":\"Follows local municipal building codes for residential construction\\n\\nFire safety provisions for staircase and kitchen\\n\\nMinimum setbacks and structural safety compliance\",\"critical_instructions\":\"Ensure proper waterproofing on terrace and bathrooms\\n\\nWindow placement for optimal daylight and ventilation\\n\\nStaircase width to allow safe movement\"}},\"created_at\":\"2025-09-21 18:03:22\"}}', NULL, 'active', '2025-09-23 16:40:33', '2025-09-23 16:40:33', '', 'contractor-direct', NULL, '', '/buildhub/backend/uploads/designs/68cff0926267c9.27038359_1758458002.png');

-- --------------------------------------------------------

--
-- Table structure for table `layout_request_assignments`
--

CREATE TABLE `layout_request_assignments` (
  `id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('sent','accepted','declined') DEFAULT 'sent',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_request_assignments`
--

INSERT INTO `layout_request_assignments` (`id`, `layout_request_id`, `homeowner_id`, `architect_id`, `message`, `status`, `created_at`, `updated_at`) VALUES
(2, 14, 30, 27, '', 'declined', '2025-08-31 16:08:15', '2025-09-14 11:12:50'),
(3, 14, 30, 26, '', 'sent', '2025-08-31 16:08:15', '2025-08-31 16:08:15'),
(5, 18, 30, 27, 'Custom design request from wizard', 'declined', '2025-09-08 11:02:15', '2025-09-11 13:19:15'),
(6, 19, 30, 27, 'Custom design request from wizard', 'declined', '2025-09-14 11:06:28', '2025-09-21 17:04:19'),
(7, 19, 30, 31, 'Custom design request from wizard', 'accepted', '2025-09-14 11:06:28', '2025-09-14 11:46:07'),
(8, 19, 30, 26, 'Custom design request from wizard', 'sent', '2025-09-14 11:06:28', '2025-09-14 11:06:28'),
(9, 20, 30, 27, 'Custom design request from wizard', 'declined', '2025-09-18 10:14:42', '2025-09-18 15:41:19'),
(10, 23, 32, 27, 'Custom design request from wizard', 'declined', '2025-09-18 14:49:56', '2025-09-18 14:59:08'),
(12, 23, 32, 31, 'Custom design request from wizard', 'accepted', '2025-09-18 14:49:56', '2025-09-20 06:09:18'),
(13, 32, 19, 27, 'Custom design request from wizard', 'declined', '2025-09-19 04:29:23', '2025-09-20 05:43:01'),
(14, 32, 19, 31, 'Custom design request from wizard', 'declined', '2025-09-19 04:29:23', '2025-09-20 05:56:58'),
(15, 46, 19, 27, 'Custom design request from wizard', 'accepted', '2025-09-20 05:52:41', '2025-09-20 05:53:11'),
(16, 46, 19, 31, 'Custom design request from wizard', 'declined', '2025-09-20 05:52:41', '2025-09-20 06:09:20'),
(17, 58, 19, 27, 'Custom design request from wizard', 'accepted', '2025-09-21 15:50:20', '2025-09-21 15:51:30'),
(18, 59, 19, 27, 'Custom design request from wizard', 'declined', '2025-09-21 17:18:44', '2025-09-21 17:18:57'),
(20, 62, 28, 27, 'Custom design request from wizard', 'sent', '2025-09-22 08:25:49', '2025-09-22 08:25:49'),
(21, 62, 28, 31, 'Custom design request from wizard', 'sent', '2025-09-22 08:25:49', '2025-09-22 08:25:49'),
(22, 62, 28, 33, 'Custom design request from wizard', 'accepted', '2025-09-22 08:25:49', '2025-09-22 08:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `layout_technical_details`
--

CREATE TABLE `layout_technical_details` (
  `id` int(11) NOT NULL,
  `design_id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `room_layout_dimensions` text DEFAULT NULL,
  `door_window_positions` text DEFAULT NULL,
  `circulation_paths` text DEFAULT NULL,
  `plot_boundaries` text DEFAULT NULL,
  `orientation_north_direction` text DEFAULT NULL,
  `access_points` text DEFAULT NULL,
  `load_bearing_walls` text DEFAULT NULL,
  `column_positions` text DEFAULT NULL,
  `foundation_outline` text DEFAULT NULL,
  `roof_outline` text DEFAULT NULL,
  `front_elevation` text DEFAULT NULL,
  `cross_sections` text DEFAULT NULL,
  `height_details` text DEFAULT NULL,
  `wall_thickness` text DEFAULT NULL,
  `ceiling_heights` text DEFAULT NULL,
  `building_codes_compliance` text DEFAULT NULL,
  `critical_instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_templates`
--

CREATE TABLE `layout_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `style` varchar(100) DEFAULT NULL,
  `rooms` int(11) DEFAULT NULL,
  `preview_image` varchar(255) DEFAULT NULL,
  `template_file` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_templates`
--

INSERT INTO `layout_templates` (`id`, `name`, `description`, `style`, `rooms`, `preview_image`, `template_file`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Modern Villa Template', 'Contemporary villa design with open spaces and large windows', 'Modern', 4, NULL, NULL, 'active', '2025-08-15 07:18:01', '2025-08-15 07:18:01'),
(2, 'Traditional House Template', 'Classic house design with traditional architectural elements', 'Traditional', 3, NULL, NULL, 'active', '2025-08-15 07:18:01', '2025-08-15 07:18:01'),
(3, 'Compact Home Template', 'Space-efficient design perfect for small plots', 'Compact', 2, NULL, NULL, 'active', '2025-08-15 07:18:01', '2025-08-15 07:18:01'),
(4, 'Luxury Mansion Template', 'Grand mansion design with premium features', 'Luxury', 6, NULL, NULL, 'active', '2025-08-15 07:18:01', '2025-08-15 07:18:01'),
(5, 'Eco-Friendly Home Template', 'Sustainable design with green building features', 'Eco-Friendly', 3, NULL, NULL, 'active', '2025-08-15 07:18:01', '2025-08-15 07:18:01');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `name`, `category`, `unit`, `price`, `description`, `created_at`, `updated_at`) VALUES
(14, 'kajaria steels', 'steel', '2000 tons', 2000.00, '', '2025-09-15 08:53:31', '2025-09-15 08:53:31');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `email`, `token_hash`, `expires_at`, `used`, `created_at`) VALUES
(1, 30, 'fathima470077@gmail.com', 'ad3484cae65594d475d3645407e4a456be1d15a04489eaf526da38f89f0ef785', '2025-08-31 08:45:10', 1, '2025-08-31 05:45:10'),
(2, 30, 'fathima470077@gmail.com', '048ca2716ede4bf0cd6d31f31283f0767c6938ba3b3d20cdadf35dbd1aa3dbf2', '2025-08-31 08:46:12', 1, '2025-08-31 05:46:12'),
(3, 30, 'fathima470077@gmail.com', '731a165630d5a22e912102647e0167b7badbe04fa24ffd67ed2c3315b2fbc112', '2025-08-31 08:51:13', 1, '2025-08-31 05:51:13'),
(4, 30, 'fathima470077@gmail.com', 'ea570e6c6f9c68473d8b8af7f29be0184dc08a1d50a4ae1febcca6d307d4a9a4', '2025-08-31 08:54:16', 1, '2025-08-31 05:54:16'),
(5, 30, 'fathima470077@gmail.com', '995292a1d0bc99ad09b2fc1102de8023de4350a4092714f4b1a94a70198a21b6', '2025-08-31 08:57:30', 1, '2025-08-31 05:57:30'),
(6, 32, 'thomasshijin90@gmail.com', '2b08026e2b7bc8f04f747f4204aa26a86d0a4e9924c7b00cf753fe8dff62cee2', '2025-09-17 16:20:48', 1, '2025-09-17 13:20:48'),
(7, 32, 'thomasshijin90@gmail.com', '2cbb28c93b5e622d7b543a1b2a30d997cba1e778002281365f3a58c9d92eaf26', '2025-09-17 16:27:09', 1, '2025-09-17 13:27:09'),
(8, 32, 'thomasshijin90@gmail.com', '2fd2221e079fb2fd11fe5244817dc36596c62e77da18e75935d41e1ec97b2876', '2025-09-17 16:31:53', 1, '2025-09-17 13:31:53');

-- --------------------------------------------------------

--
-- Table structure for table `proposals`
--

CREATE TABLE `proposals` (
  `id` int(11) NOT NULL,
  `layout_request_id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `amount` decimal(12,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_issues`
--

CREATE TABLE `support_issues` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` varchar(32) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `category` varchar(64) DEFAULT 'general',
  `message` text NOT NULL,
  `status` varchar(32) DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_issues`
--

INSERT INTO `support_issues` (`id`, `user_id`, `role`, `subject`, `category`, `message`, `status`, `created_at`) VALUES
(1, 30, 'homeowner', 'Bug', 'bug', 'The site have a bug', 'open', '2025-09-15 08:44:13'),
(2, 30, 'homeowner', 'bug', 'bug', 'this site have bugs', 'open', '2025-09-15 08:49:55'),
(3, 30, 'homeowner', 'bug', 'billing', 'bug', 'open', '2025-09-15 08:54:17'),
(4, 30, 'homeowner', 'bug', 'bug', 'this have bug', 'open', '2025-09-15 09:05:55'),
(5, 30, 'homeowner', 'bug', 'bug', 'fs', 'open', '2025-09-15 09:17:26'),
(6, 30, 'homeowner', 'bug', 'bug', 'hbvhvh', 'open', '2025-09-15 09:22:01');

-- --------------------------------------------------------

--
-- Table structure for table `support_replies`
--

CREATE TABLE `support_replies` (
  `id` int(11) NOT NULL,
  `issue_id` int(11) NOT NULL,
  `sender` varchar(16) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('homeowner','contractor','architect') DEFAULT NULL,
  `status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
  `is_verified` tinyint(1) DEFAULT 0,
  `license` varchar(255) DEFAULT NULL,
  `portfolio` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `profile_image`, `bio`, `email`, `password`, `role`, `status`, `is_verified`, `license`, `portfolio`, `created_at`, `updated_at`, `deleted_at`, `specialization`, `experience_years`, `license_number`, `company_name`, `website`, `phone`, `address`, `location`, `city`, `state`, `zip_code`) VALUES
(19, 'Shijin', 'Thomas', NULL, NULL, 'thomasshijin12@gmail.com', '$2y$10$3gq5TYKFrxe79x7Bd6zfYeop4C3lPHlT0RBbDCRK8Wd/olTpWnsNK', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-15 08:37:34', '2025-08-15 11:29:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 'APARNA K SANTHOSH', 'MCA2024-2026', NULL, NULL, 'aparnaksanthosh2026@mca.ajce.in', '$2y$10$3h5YpKY7duoyJ5YHWNRtpOP0a5hyLXfCiy1mzGG.Dgsaz10KZMehu', 'architect', 'approved', 1, NULL, 'uploads/portfolios/68a421323b2f3_license_20.jpeg', '2025-08-19 07:01:06', '2025-09-14 09:35:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 'Shijin', 'Thomas', NULL, NULL, 'shijinthomas1501@gmail.com', '$2y$10$i/i/4o20DEqfRIsuEsLw..7OEL.5HhWbOQFSLcKBfz.XN0a47uGbu', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68a89de45ea03_license_20.jpeg', '2025-08-22 16:42:12', '2025-09-07 05:29:40', NULL, 'Residential', 3, NULL, NULL, NULL, '7558895667', NULL, NULL, 'Kottayam', NULL, NULL),
(28, 'SHIJIN THOMAS', 'MCA2024-2026', NULL, NULL, 'shijinthomas2026@mca.ajce.in', '$2y$10$J243fQ/Wi88Bk9UbtlSKvOJStinlPcePeWgV8C0gApCZnxbG5qRfe', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-22 17:48:50', '2025-09-03 15:18:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'Shijin', 'Thomas', NULL, NULL, 'shijinthomas248@gmail.com', '$2y$10$m6o/je.6qIdMD6/k17enr.0QD0PAYSYSIyhTHF5b9Hs57hpqMsvR6', 'contractor', 'approved', 1, 'uploads/licenses/68b1a6aa444ec_license_20.jpeg', NULL, '2025-08-29 13:10:02', '2025-09-03 15:18:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'Fathima', 'Shibu', NULL, NULL, 'fathima470077@gmail.com', '$2y$10$ZFxAkA99J0LlBoYyr0TPne2PTEc5qFDDwFOCYoaZnH3m6a/ztMRSG', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-31 05:37:04', '2025-09-11 09:29:51', NULL, NULL, NULL, NULL, NULL, NULL, '7558895667', NULL, 'Amal Jyothi College of Engineering, Koovappalli - Vizhikkathodu Road, Koovapally, Kanjirappally, Kottayam, Kerala, 686518, India', NULL, NULL, NULL),
(31, 'shijin', 'thomas', NULL, NULL, 'thomasshijin3@gmail.com', '$2y$10$5V6TmtS.aQnGhVt078Ugnuzq5PZu3afLzcEejgNFYv8bKtuQwe5Xi', 'architect', 'approved', 1, NULL, 'uploads/portfolios/68c686c50945d_license.jpeg', '2025-09-14 09:11:33', '2025-09-14 09:31:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 'Amal', 'Samuel', NULL, NULL, 'thomasshijin90@gmail.com', '$2y$10$QeLhw1WzOr9RRyFr5UJd1eYge9qLg1A6s2z98YKKVGsIb8Dk7iVjG', 'homeowner', 'approved', 1, NULL, NULL, '2025-09-17 13:20:34', '2025-09-19 08:11:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 'Linsha', 'Nadir', NULL, NULL, 'linshan2026@mca.ajce.in', '$2y$10$xnBF0c6kzGtZ15OLQELJg.pxAxkruyq9O.pITuNr0XaVr8blQSBrG', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68d10766bb3e1_1.png', '2025-09-22 08:23:02', '2025-09-22 08:23:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `users_status_verify_consistency` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
        -- If status is being set to 'approved', ensure is_verified is 1
        IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
            SET NEW.is_verified = 1;
        END IF;
        
        -- If status is being set to 'pending', 'rejected', or 'suspended', ensure is_verified is 0
        IF NEW.status IN ('pending', 'rejected', 'suspended') AND OLD.status = 'approved' THEN
            SET NEW.is_verified = 0;
        END IF;
    END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `users_verify_status_consistency` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
        -- If is_verified is being set to 1, ensure status is 'approved'
        IF NEW.is_verified = 1 AND (OLD.is_verified != 1 OR OLD.status != 'approved') THEN
            SET NEW.status = 'approved';
        END IF;
        
        -- If is_verified is being set to 0, ensure status is 'pending' (unless explicitly set to rejected/suspended)
        IF NEW.is_verified = 0 AND OLD.is_verified != 0 AND NEW.status NOT IN ('rejected', 'suspended') THEN
            SET NEW.status = 'pending';
        END IF;
    END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `architect_layouts`
--
ALTER TABLE `architect_layouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_architect_layouts_architect` (`architect_id`),
  ADD KEY `idx_architect_layouts_request` (`layout_request_id`),
  ADD KEY `idx_architect_layouts_status` (`status`);

--
-- Indexes for table `architect_reviews`
--
ALTER TABLE `architect_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contractor_assignments`
--
ALTER TABLE `contractor_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contractor_assignments_request` (`layout_request_id`),
  ADD KEY `idx_contractor_assignments_contractor` (`contractor_id`),
  ADD KEY `idx_contractor_assignments_status` (`status`);

--
-- Indexes for table `contractor_assignment_hides`
--
ALTER TABLE `contractor_assignment_hides`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_assignment_contractor` (`assignment_id`,`contractor_id`),
  ADD KEY `idx_contractor` (`contractor_id`);

--
-- Indexes for table `contractor_proposals`
--
ALTER TABLE `contractor_proposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contractor_proposals_contractor` (`contractor_id`),
  ADD KEY `idx_contractor_proposals_request` (`layout_request_id`),
  ADD KEY `idx_contractor_proposals_status` (`status`);

--
-- Indexes for table `contractor_requests_queue`
--
ALTER TABLE `contractor_requests_queue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layout_request_id` (`layout_request_id`),
  ADD KEY `homeowner_id` (`homeowner_id`),
  ADD KEY `contractor_id` (`contractor_id`);

--
-- Indexes for table `contractor_reviews`
--
ALTER TABLE `contractor_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contractor_reviews_contractor` (`contractor_id`),
  ADD KEY `idx_contractor_reviews_homeowner` (`homeowner_id`),
  ADD KEY `idx_contractor_reviews_request` (`layout_request_id`),
  ADD KEY `idx_contractor_reviews_rating` (`rating`);

--
-- Indexes for table `designs`
--
ALTER TABLE `designs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layout_request_id` (`layout_request_id`),
  ADD KEY `architect_id` (`architect_id`);

--
-- Indexes for table `design_comments`
--
ALTER TABLE `design_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `layout_library`
--
ALTER TABLE `layout_library`
  ADD PRIMARY KEY (`id`),
  ADD KEY `architect_id` (`architect_id`);

--
-- Indexes for table `layout_library_technical_details`
--
ALTER TABLE `layout_library_technical_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layout_library_id` (`layout_library_id`),
  ADD KEY `architect_id` (`architect_id`);

--
-- Indexes for table `layout_requests`
--
ALTER TABLE `layout_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_layout_requests_homeowner` (`homeowner_id`),
  ADD KEY `idx_layout_requests_status` (`status`),
  ADD KEY `idx_lr_user_id` (`user_id`),
  ADD KEY `idx_lr_homeowner_id` (`homeowner_id`),
  ADD KEY `idx_lr_selected_layout_id` (`selected_layout_id`),
  ADD KEY `idx_lr_status` (`status`),
  ADD KEY `idx_lr_created_at` (`created_at`);

--
-- Indexes for table `layout_request_assignments`
--
ALTER TABLE `layout_request_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_lr_arch` (`layout_request_id`,`architect_id`),
  ADD KEY `homeowner_id` (`homeowner_id`),
  ADD KEY `architect_id` (`architect_id`);

--
-- Indexes for table `layout_technical_details`
--
ALTER TABLE `layout_technical_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `design_id` (`design_id`),
  ADD KEY `architect_id` (`architect_id`);

--
-- Indexes for table `layout_templates`
--
ALTER TABLE `layout_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `expires_at` (`expires_at`);

--
-- Indexes for table `proposals`
--
ALTER TABLE `proposals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_issues`
--
ALTER TABLE `support_issues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_replies`
--
ALTER TABLE `support_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `issue_id` (`issue_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `architect_layouts`
--
ALTER TABLE `architect_layouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `architect_reviews`
--
ALTER TABLE `architect_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contractor_assignments`
--
ALTER TABLE `contractor_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `contractor_assignment_hides`
--
ALTER TABLE `contractor_assignment_hides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contractor_proposals`
--
ALTER TABLE `contractor_proposals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contractor_requests_queue`
--
ALTER TABLE `contractor_requests_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contractor_reviews`
--
ALTER TABLE `contractor_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `designs`
--
ALTER TABLE `designs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `design_comments`
--
ALTER TABLE `design_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `layout_library`
--
ALTER TABLE `layout_library`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `layout_library_technical_details`
--
ALTER TABLE `layout_library_technical_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `layout_requests`
--
ALTER TABLE `layout_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `layout_request_assignments`
--
ALTER TABLE `layout_request_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `layout_technical_details`
--
ALTER TABLE `layout_technical_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `layout_templates`
--
ALTER TABLE `layout_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `proposals`
--
ALTER TABLE `proposals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_issues`
--
ALTER TABLE `support_issues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `support_replies`
--
ALTER TABLE `support_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `architect_layouts`
--
ALTER TABLE `architect_layouts`
  ADD CONSTRAINT `architect_layouts_ibfk_1` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `architect_layouts_ibfk_2` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contractor_assignments`
--
ALTER TABLE `contractor_assignments`
  ADD CONSTRAINT `contractor_assignments_ibfk_1` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contractor_assignments_ibfk_2` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contractor_proposals`
--
ALTER TABLE `contractor_proposals`
  ADD CONSTRAINT `contractor_proposals_ibfk_1` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contractor_proposals_ibfk_2` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contractor_requests_queue`
--
ALTER TABLE `contractor_requests_queue`
  ADD CONSTRAINT `contractor_requests_queue_ibfk_1` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contractor_requests_queue_ibfk_2` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contractor_requests_queue_ibfk_3` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contractor_reviews`
--
ALTER TABLE `contractor_reviews`
  ADD CONSTRAINT `contractor_reviews_ibfk_1` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contractor_reviews_ibfk_2` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contractor_reviews_ibfk_3` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `designs`
--
ALTER TABLE `designs`
  ADD CONSTRAINT `designs_ibfk_1` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`),
  ADD CONSTRAINT `designs_ibfk_2` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `layout_library`
--
ALTER TABLE `layout_library`
  ADD CONSTRAINT `layout_library_ibfk_1` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `layout_library_technical_details`
--
ALTER TABLE `layout_library_technical_details`
  ADD CONSTRAINT `layout_library_technical_details_ibfk_1` FOREIGN KEY (`layout_library_id`) REFERENCES `layout_library` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_library_technical_details_ibfk_2` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `layout_requests`
--
ALTER TABLE `layout_requests`
  ADD CONSTRAINT `fk_lr_homeowner` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lr_selected_layout` FOREIGN KEY (`selected_layout_id`) REFERENCES `layout_library` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_lr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_requests_ibfk_1` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `layout_request_assignments`
--
ALTER TABLE `layout_request_assignments`
  ADD CONSTRAINT `layout_request_assignments_ibfk_1` FOREIGN KEY (`layout_request_id`) REFERENCES `layout_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_request_assignments_ibfk_2` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_request_assignments_ibfk_3` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `layout_technical_details`
--
ALTER TABLE `layout_technical_details`
  ADD CONSTRAINT `layout_technical_details_ibfk_1` FOREIGN KEY (`design_id`) REFERENCES `designs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_technical_details_ibfk_2` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

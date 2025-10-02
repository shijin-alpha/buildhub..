-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 02, 2025 at 01:28 PM
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
(8, 'status_change', 32, '{\"old_status\":\"suspended\",\"new_status\":\"approved\",\"user_name\":\"Amal Samuel\",\"user_email\":\"thomasshijin90@gmail.com\",\"user_role\":\"homeowner\",\"schema_has_status\":true}', '2025-09-19 08:11:33'),
(9, 'status_change', 34, '{\"old_status\":\"approved\",\"new_status\":\"suspended\",\"user_name\":\"Savio Joseph\",\"user_email\":\"saviojoseph2026@mca.ajce.in\",\"user_role\":\"architect\",\"schema_has_status\":true}', '2025-09-25 04:36:43'),
(10, 'status_change', 34, '{\"old_status\":\"suspended\",\"new_status\":\"approved\",\"user_name\":\"Savio Joseph\",\"user_email\":\"saviojoseph2026@mca.ajce.in\",\"user_role\":\"architect\",\"schema_has_status\":true}', '2025-09-25 04:36:45');

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
-- Stand-in structure for view `architect_request_details`
-- (See below for the actual view)
--
CREATE TABLE `architect_request_details` (
`id` int(11)
,`user_id` int(11)
,`homeowner_id` int(11)
,`plot_size` varchar(100)
,`budget_range` varchar(100)
,`location` varchar(255)
,`timeline` varchar(100)
,`num_floors` varchar(10)
,`preferred_style` varchar(100)
,`orientation` varchar(255)
,`site_considerations` text
,`material_preferences` text
,`budget_allocation` varchar(255)
,`site_images` text
,`reference_images` text
,`room_images` text
,`floor_rooms` text
,`requirements` text
,`status` enum('pending','approved','rejected','active','accepted','declined','deleted')
,`layout_type` enum('custom','library')
,`selected_layout_id` int(11)
,`layout_file` varchar(255)
,`created_at` timestamp
,`updated_at` timestamp
,`first_name` varchar(100)
,`last_name` varchar(100)
,`email` varchar(255)
,`phone` varchar(20)
,`address` text
,`city` varchar(100)
,`state` varchar(50)
);

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
(9, 27, 19, 14, 5, 'Thankyou for the service', '2025-09-22 01:05:00'),
(10, 27, 28, 19, 5, 'Thankyou for your service', '2025-09-25 15:26:15');

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
(18, 62, 33, 'ygyf', '', '[{\"original\":\"2.png\",\"stored\":\"68d10901ccf4a6.65761448_1758529793.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d10901ccf4a6.65761448_1758529793.png\"}]', 'finalized', '2025-09-22 08:29:53', '2025-09-22 08:30:26', NULL, NULL, NULL, '{\"floor_plans\":{\"living_room_dimensions\":\"51\",\"master_bedroom_dimensions\":\"49\",\"kitchen_dimensions\":\"46\",\"other_room_dimensions\":\"45\",\"door_window_positions\":\"bvh\",\"circulation_paths\":\"jhb\"},\"site_orientation\":{\"orientation\":\",m m, \",\"access_points\":\"ihih\"}}'),
(19, 66, 27, 'Modern 2 bhk', '', '[{\"original\":\"1.png\",\"stored\":\"68d55d6848d6c3.43317542_1758813544.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d55d6848d6c3.43317542_1758813544.png\"}]', 'finalized', '2025-09-25 15:19:04', '2025-09-25 15:25:56', NULL, NULL, NULL, '{\"floor_plans\":{\"living_room_dimensions\":\"20 * 50\",\"kitchen_dimensions\":\"12 * 50\",\"master_bedroom_dimensions\":\"16 * 12\",\"other_room_dimensions\":\"bathroom\",\"door_window_positions\":\"north\",\"circulation_paths\":\"hallway\"},\"site_orientation\":{\"plot_boundaries\":\"kkk\",\"orientation\":\"north\",\"access_points\":\"main entrance\"},\"structural\":{\"load_bearing_walls\":\"wall\",\"column_positions\":\"20*50\",\"foundation_outline\":\"jh\",\"roof_outline\":\"10 m\"},\"elevations\":{\"front_elevation\":\"dvds\",\"cross_sections\":\"dsdvs\",\"height_details\":\"10 m\"},\"construction\":{\"wall_thickness\":\"5\",\"ceiling_heights\":\"12\",\"building_codes\":\"bddf\",\"critical_instructions\":\"fbfdd\"}}'),
(20, 68, 27, 'modern', '', '[{\"original\":\"1.png\",\"stored\":\"68d62315880b59.21849364_1758864149.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68d62315880b59.21849364_1758864149.png\"}]', 'finalized', '2025-09-26 05:22:29', '2025-09-28 09:07:46', NULL, NULL, NULL, '{\"floor_plans\":{\"living_room_dimensions\":\"20\"}}');

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
(7, 14, 19, 'Thankyou for the service', '2025-09-22 01:04:59'),
(8, 19, 28, 'Thankyou for your service', '2025-09-25 15:26:15');

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
  `layout_file` varchar(255) DEFAULT NULL,
  `site_images` text DEFAULT NULL COMMENT 'JSON array of site images with file paths and metadata',
  `reference_images` text DEFAULT NULL COMMENT 'JSON array of reference images with file paths and metadata',
  `room_images` text DEFAULT NULL COMMENT 'JSON object of room-specific images with file paths and metadata',
  `orientation` varchar(255) DEFAULT NULL COMMENT 'Site orientation preferences',
  `site_considerations` text DEFAULT NULL COMMENT 'Additional site considerations and notes',
  `material_preferences` text DEFAULT NULL COMMENT 'Material preferences as comma-separated values',
  `budget_allocation` varchar(255) DEFAULT NULL COMMENT 'Budget allocation preferences',
  `floor_rooms` text DEFAULT NULL COMMENT 'JSON object of floor-wise room planning',
  `num_floors` varchar(10) DEFAULT NULL COMMENT 'Number of floors requested'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_requests`
--

INSERT INTO `layout_requests` (`id`, `user_id`, `homeowner_id`, `plot_size`, `budget_range`, `requirements`, `preferred_style`, `status`, `created_at`, `updated_at`, `location`, `timeline`, `selected_layout_id`, `layout_type`, `layout_file`, `site_images`, `reference_images`, `room_images`, `orientation`, `site_considerations`, `material_preferences`, `budget_allocation`, `floor_rooms`, `num_floors`) VALUES
(20, 30, 30, '2000', '2500000', '{\"plot_shape\":\"rectangle\",\"topography\":\"flat\",\"development_laws\":\"nil\",\"family_needs\":\"nil\",\"rooms\":\"5\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-18 10:14:42', '2025-09-20 16:23:09', 'Munnar', '0-6 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 28, 28, '3000', '9000000', '{\"plot_shape\":\"hvh\",\"topography\":\"jbjbj\",\"development_laws\":\"bb\",\"family_needs\":\"jbbj\",\"rooms\":\"3\",\"aesthetic\":\"vv\",\"notes\":\"\"}', NULL, 'pending', '2025-09-22 08:25:49', '2025-09-22 08:25:49', 'Kottakkal', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 28, 28, '2100', '5500000', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"nil\",\"family_needs\":\"nothing special\",\"rooms\":\"3\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-25 15:14:06', '2025-10-02 10:31:44', 'Kollam', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 19, 19, '2000', '5000000', '{\"plot_shape\":\"rectangle\",\"topography\":\"flat\",\"development_laws\":\"nil\",\"family_needs\":\"\",\"rooms\":\"3\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-26 05:16:10', '2025-09-28 09:09:54', 'Koothattukulam', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 19, 19, '2000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly, Storage space, Energy efficient\",\"rooms\":\"\",\"aesthetic\":\"Modern\",\"notes\":\"\",\"site_images\":[{\"id\":\"68d8e31620aaf\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/19_a8d5aba2e09ecc76.webp\"}],\"reference_images\":[],\"room_images\":{\"master_bedroom\":[{\"id\":1759044388131.9763,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/2620b368-37b0-410c-8d05-6286572948ff\"}]}}', NULL, 'pending', '2025-09-28 07:28:28', '2025-09-28 07:28:28', 'Kottayam', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 28, 28, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly, Work-from-home\",\"rooms\":\"\",\"aesthetic\":\"Contemporary\",\"notes\":\"\",\"site_images\":[{\"id\":\"68d8e4cc74f90\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_c01cae37088323e3.webp\"}],\"reference_images\":[],\"room_images\":{\"master_bedroom\":[{\"id\":1759044820967.2327,\"file\":[],\"name\":\"2.jpeg\",\"size\":11870,\"url\":\"blob:http:\\/\\/localhost:3000\\/256b3c69-6c50-44f0-a7e7-2ef1d7fcde96\"}]}}', NULL, 'deleted', '2025-09-28 07:34:27', '2025-09-28 07:54:49', 'Mumbai', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 28, 28, '2500', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"Standard setbacks\",\"family_needs\":\"Elder-friendly, Work-from-home\",\"rooms\":\"3 BHK\",\"aesthetic\":\"Modern\",\"notes\":\"Test requirements\",\"orientation\":\"North-facing\",\"site_considerations\":\"Good sunlight, privacy needed\",\"material_preferences\":\"Eco-friendly, Low maintenance\",\"budget_allocation\":\"40% structure, 30% finishes, 30% services\",\"num_floors\":\"2\",\"preferred_style\":\"Contemporary\",\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Contemporary', 'deleted', '2025-09-28 07:52:50', '2025-09-28 07:54:50', 'Test City', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', 'North-facing', 'Good sunlight, privacy needed', 'Eco-friendly, Low maintenance', '40% structure, 30% finishes, 30% services', '{\"floor1\":{\"bedrooms\":2,\"bathrooms\":1}}', '2'),
(77, 28, 28, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly\",\"rooms\":\"\",\"aesthetic\":\"Contemporary\",\"notes\":\"\",\"orientation\":\"North-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Marble, Granite, Natural Stone\",\"budget_allocation\":\"Quality over quantity\",\"num_floors\":\"1\",\"preferred_style\":\"Contemporary\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"dining_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":1,\\\"prayer_room\\\":1,\\\"guest_room\\\":1,\\\"store_room\\\":1,\\\"garage\\\":1,\\\"utility_area\\\":1}}\",\"site_images\":[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}],\"reference_images\":[],\"room_images\":{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}}', 'Contemporary', 'deleted', '2025-09-28 08:26:03', '2025-10-02 10:31:47', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}]', '[]', '{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}', 'North-facing', '', 'Marble, Granite, Natural Stone', 'Quality over quantity', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1,\"dining_room\":1,\"kitchen\":1,\"study_room\":1,\"prayer_room\":1,\"guest_room\":1,\"store_room\":1,\"garage\":1,\"utility_area\":1}}', '1'),
(78, 28, 28, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly\",\"rooms\":\"\",\"aesthetic\":\"Contemporary\",\"notes\":\"\",\"orientation\":\"North-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Marble, Granite, Natural Stone\",\"budget_allocation\":\"Quality over quantity\",\"num_floors\":\"1\",\"preferred_style\":\"Contemporary\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"dining_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":1,\\\"prayer_room\\\":1,\\\"guest_room\\\":1,\\\"store_room\\\":1,\\\"garage\\\":1,\\\"utility_area\\\":1}}\",\"site_images\":[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}],\"reference_images\":[],\"room_images\":{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}}', 'Contemporary', 'deleted', '2025-09-28 08:29:31', '2025-10-02 10:31:47', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}]', '[]', '{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}', 'North-facing', '', 'Marble, Granite, Natural Stone', 'Quality over quantity', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1,\"dining_room\":1,\"kitchen\":1,\"study_room\":1,\"prayer_room\":1,\"guest_room\":1,\"store_room\":1,\"garage\":1,\"utility_area\":1}}', '1'),
(79, 28, 28, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly\",\"rooms\":\"\",\"aesthetic\":\"Contemporary\",\"notes\":\"\",\"orientation\":\"North-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Marble, Granite, Natural Stone\",\"budget_allocation\":\"Quality over quantity\",\"num_floors\":\"1\",\"preferred_style\":\"Contemporary\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"dining_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":1,\\\"prayer_room\\\":1,\\\"guest_room\\\":1,\\\"store_room\\\":1,\\\"garage\\\":1,\\\"utility_area\\\":1}}\",\"site_images\":[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}],\"reference_images\":[],\"room_images\":{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}}', 'Contemporary', 'deleted', '2025-09-28 08:29:57', '2025-10-02 10:31:48', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}]', '[]', '{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}', 'North-facing', '', 'Marble, Granite, Natural Stone', 'Quality over quantity', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1,\"dining_room\":1,\"kitchen\":1,\"study_room\":1,\"prayer_room\":1,\"guest_room\":1,\"store_room\":1,\"garage\":1,\"utility_area\":1}}', '1'),
(80, 28, 28, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly\",\"rooms\":\"\",\"aesthetic\":\"Contemporary\",\"notes\":\"\",\"orientation\":\"North-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Marble, Granite, Natural Stone\",\"budget_allocation\":\"Quality over quantity\",\"num_floors\":\"1\",\"preferred_style\":\"Contemporary\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"dining_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":1,\\\"prayer_room\\\":1,\\\"guest_room\\\":1,\\\"store_room\\\":1,\\\"garage\\\":1,\\\"utility_area\\\":1}}\",\"site_images\":[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}],\"reference_images\":[],\"room_images\":{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}}', 'Contemporary', 'deleted', '2025-09-28 08:32:19', '2025-10-02 10:31:48', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[{\"id\":\"68d8f0e7a993d\",\"file\":null,\"name\":\"1.webp\",\"size\":220842,\"url\":\"\\/buildhub\\/uploads\\/site_images\\/28_b77eb818078bf425.webp\"}]', '[]', '{\"master_bedroom\":[{\"id\":1759047922385.3518,\"file\":[],\"name\":\"1.webp\",\"size\":220842,\"url\":\"blob:http:\\/\\/localhost:3000\\/33f054a3-1ff7-4ddb-969d-cebe30ec1071\"}]}', 'North-facing', '', 'Marble, Granite, Natural Stone', 'Quality over quantity', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1,\"dining_room\":1,\"kitchen\":1,\"study_room\":1,\"prayer_room\":1,\"guest_room\":1,\"store_room\":1,\"garage\":1,\"utility_area\":1}}', '1'),
(81, 35, 35, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Elder-friendly, Wheelchair accessible, Home office, Security features\",\"rooms\":\"\",\"aesthetic\":\"Luxury\",\"notes\":\"\",\"orientation\":\"South-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Concrete, Brick\",\"budget_allocation\":\"Balanced approach\",\"num_floors\":\"2\",\"preferred_style\":\"Luxury\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"dining_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":1,\\\"prayer_room\\\":1,\\\"guest_room\\\":1,\\\"store_room\\\":1,\\\"garage\\\":1,\\\"utility_area\\\":1},\\\"floor2\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"dining_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":1,\\\"prayer_room\\\":1,\\\"guest_room\\\":1,\\\"store_room\\\":1}}\",\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Luxury', 'approved', '2025-09-28 09:13:21', '2025-09-28 09:27:47', 'Chennai', '12-18 months', NULL, 'custom', NULL, '[]', '[]', '[]', 'South-facing', '', 'Concrete, Brick', 'Balanced approach', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1,\"dining_room\":1,\"kitchen\":1,\"study_room\":1,\"prayer_room\":1,\"guest_room\":1,\"store_room\":1,\"garage\":1,\"utility_area\":1},\"floor2\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1,\"dining_room\":1,\"kitchen\":1,\"study_room\":1,\"prayer_room\":1,\"guest_room\":1,\"store_room\":1}}', '2'),
(82, 35, 35, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"\",\"topography\":\"\",\"development_laws\":\"\",\"family_needs\":\"Security features, Low maintenance\",\"rooms\":\"\",\"aesthetic\":\"\",\"notes\":\"\",\"orientation\":\"\",\"site_considerations\":\"\",\"material_preferences\":\"\",\"budget_allocation\":\"\",\"num_floors\":\"\",\"preferred_style\":\"\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1}}\",\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', '', 'approved', '2025-09-28 09:37:05', '2025-09-28 09:37:31', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', '', '', '', '', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1}}', '');

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
(9, 20, 30, 27, 'Custom design request from wizard', 'declined', '2025-09-18 10:14:42', '2025-09-18 15:41:19'),
(20, 62, 28, 27, 'Custom design request from wizard', 'declined', '2025-09-22 08:25:49', '2025-09-24 16:17:06'),
(21, 62, 28, 31, 'Custom design request from wizard', 'declined', '2025-09-22 08:25:49', '2025-09-28 07:45:51'),
(22, 62, 28, 33, 'Custom design request from wizard', 'accepted', '2025-09-22 08:25:49', '2025-09-22 08:29:03'),
(23, 66, 28, 27, 'Custom design request from wizard', 'declined', '2025-09-25 15:14:06', '2025-09-28 08:39:01'),
(24, 66, 28, 31, 'Custom design request from wizard', 'declined', '2025-09-25 15:14:06', '2025-09-28 07:39:36'),
(25, 66, 28, 34, 'Custom design request from wizard', 'sent', '2025-09-25 15:14:06', '2025-09-25 15:14:06'),
(26, 68, 19, 27, 'Custom design request from wizard', 'declined', '2025-09-26 05:16:10', '2025-09-28 08:38:59'),
(27, 69, 19, 27, 'Custom design request from wizard', 'declined', '2025-09-28 07:28:28', '2025-09-28 08:38:57'),
(28, 69, 19, 31, 'Custom design request from wizard', 'declined', '2025-09-28 07:28:28', '2025-09-28 07:35:10'),
(29, 70, 28, 31, 'Custom design request from wizard', 'declined', '2025-09-28 07:34:27', '2025-09-28 09:16:18'),
(30, 80, 28, 27, 'Custom design request from wizard', 'declined', '2025-09-28 08:32:19', '2025-09-28 08:52:11'),
(31, 81, 35, 31, 'Custom design request from wizard', 'declined', '2025-09-28 09:13:21', '2025-09-28 09:28:51'),
(32, 82, 35, 31, 'Custom design request from wizard', 'accepted', '2025-09-28 09:37:05', '2025-09-28 09:37:31');

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
(19, 'Shijin', 'Thomas', NULL, NULL, 'thomasshijin12@gmail.com', '$2y$10$3gq5TYKFrxe79x7Bd6zfYeop4C3lPHlT0RBbDCRK8Wd/olTpWnsNK', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-15 08:37:34', '2025-09-25 04:15:11', NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, 'അമൽ ജ്യോതി കോളേജ് ഓഫ് എഞ്ചിനീയറിങ്, കൂവപ്പള്ളി - വിഴിക്കത്തോട് റോഡ്, കൂവപ്പള്ളി, Kanjirappally, കോട്ടയം ജില്ല, Kerala, 686518, India', NULL, NULL, NULL),
(26, 'APARNA K SANTHOSH', 'MCA2024-2026', NULL, NULL, 'aparnaksanthosh2026@mca.ajce.in', '$2y$10$3h5YpKY7duoyJ5YHWNRtpOP0a5hyLXfCiy1mzGG.Dgsaz10KZMehu', 'architect', 'approved', 1, NULL, 'uploads/portfolios/68a421323b2f3_license_20.jpeg', '2025-08-19 07:01:06', '2025-09-14 09:35:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 'Shijin', 'Thomas', NULL, NULL, 'shijinthomas1501@gmail.com', '$2y$10$i/i/4o20DEqfRIsuEsLw..7OEL.5HhWbOQFSLcKBfz.XN0a47uGbu', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68a89de45ea03_license_20.jpeg', '2025-08-22 16:42:12', '2025-09-07 05:29:40', NULL, 'Residential', 3, NULL, NULL, NULL, '7558895667', NULL, NULL, 'Kottayam', NULL, NULL),
(28, 'SHIJIN THOMAS', 'MCA2024-2026', NULL, NULL, 'shijinthomas2026@mca.ajce.in', '$2y$10$J243fQ/Wi88Bk9UbtlSKvOJStinlPcePeWgV8C0gApCZnxbG5qRfe', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-22 17:48:50', '2025-09-03 15:18:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'Shijin', 'Thomas', NULL, NULL, 'shijinthomas248@gmail.com', '$2y$10$m6o/je.6qIdMD6/k17enr.0QD0PAYSYSIyhTHF5b9Hs57hpqMsvR6', 'contractor', 'approved', 1, 'uploads/licenses/68b1a6aa444ec_license_20.jpeg', NULL, '2025-08-29 13:10:02', '2025-09-03 15:18:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'Fathima', 'Shibu', NULL, NULL, 'fathima470077@gmail.com', '$2y$10$ZFxAkA99J0LlBoYyr0TPne2PTEc5qFDDwFOCYoaZnH3m6a/ztMRSG', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-31 05:37:04', '2025-09-11 09:29:51', NULL, NULL, NULL, NULL, NULL, NULL, '7558895667', NULL, 'Amal Jyothi College of Engineering, Koovappalli - Vizhikkathodu Road, Koovapally, Kanjirappally, Kottayam, Kerala, 686518, India', NULL, NULL, NULL),
(31, 'shijin', 'thomas', NULL, NULL, 'thomasshijin3@gmail.com', '$2y$10$5V6TmtS.aQnGhVt078Ugnuzq5PZu3afLzcEejgNFYv8bKtuQwe5Xi', 'architect', 'approved', 1, NULL, 'uploads/portfolios/68c686c50945d_license.jpeg', '2025-09-14 09:11:33', '2025-09-24 15:43:55', NULL, 'Commercial', 3, NULL, NULL, NULL, '7558958947', NULL, NULL, 'Ernakulam', NULL, NULL),
(32, 'Amal', 'Samuel', NULL, NULL, 'thomasshijin90@gmail.com', '$2y$10$QeLhw1WzOr9RRyFr5UJd1eYge9qLg1A6s2z98YKKVGsIb8Dk7iVjG', 'homeowner', 'approved', 1, NULL, NULL, '2025-09-17 13:20:34', '2025-09-19 08:11:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 'Linsha', 'Nadir', NULL, NULL, 'linshan2026@mca.ajce.in', '$2y$10$xnBF0c6kzGtZ15OLQELJg.pxAxkruyq9O.pITuNr0XaVr8blQSBrG', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68d10766bb3e1_1.png', '2025-09-22 08:23:02', '2025-09-24 15:44:52', NULL, 'Interior Design', 0, NULL, NULL, NULL, '7558958478', NULL, NULL, 'Malappuram', NULL, NULL),
(34, 'Savio', 'Joseph', NULL, NULL, 'saviojoseph2026@mca.ajce.in', '$2y$10$5cBxbUh2PhhTK0013cmvneDeSJJmNPsyYCl6kDbCxn2b6RqNT0bzC', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68d4c250e8f94_2222.png', '2025-09-25 04:17:21', '2025-09-25 04:41:39', NULL, 'Urban Planner', 0, NULL, NULL, NULL, '9656819474', NULL, NULL, 'Kottayam', NULL, NULL),
(35, 'SHIJIN', 'THOMAS', NULL, NULL, 'thomasshijin6@gmail.com', '$2y$10$S2jih5XV.2Bb3gfpdji76.xS89SXuglKVpkIpPG9UsrYvU809/ddq', 'homeowner', 'pending', 1, NULL, NULL, '2025-09-28 09:11:23', '2025-09-28 09:11:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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

-- --------------------------------------------------------

--
-- Structure for view `architect_request_details`
--
DROP TABLE IF EXISTS `architect_request_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `architect_request_details`  AS SELECT `lr`.`id` AS `id`, `lr`.`user_id` AS `user_id`, `lr`.`homeowner_id` AS `homeowner_id`, `lr`.`plot_size` AS `plot_size`, `lr`.`budget_range` AS `budget_range`, `lr`.`location` AS `location`, `lr`.`timeline` AS `timeline`, `lr`.`num_floors` AS `num_floors`, `lr`.`preferred_style` AS `preferred_style`, `lr`.`orientation` AS `orientation`, `lr`.`site_considerations` AS `site_considerations`, `lr`.`material_preferences` AS `material_preferences`, `lr`.`budget_allocation` AS `budget_allocation`, `lr`.`site_images` AS `site_images`, `lr`.`reference_images` AS `reference_images`, `lr`.`room_images` AS `room_images`, `lr`.`floor_rooms` AS `floor_rooms`, `lr`.`requirements` AS `requirements`, `lr`.`status` AS `status`, `lr`.`layout_type` AS `layout_type`, `lr`.`selected_layout_id` AS `selected_layout_id`, `lr`.`layout_file` AS `layout_file`, `lr`.`created_at` AS `created_at`, `lr`.`updated_at` AS `updated_at`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `u`.`email` AS `email`, `u`.`phone` AS `phone`, `u`.`address` AS `address`, `u`.`city` AS `city`, `u`.`state` AS `state` FROM (`layout_requests` `lr` join `users` `u` on(`lr`.`homeowner_id` = `u`.`id`)) WHERE `lr`.`status` in ('pending','approved','active') ORDER BY `lr`.`created_at` DESC ;

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
  ADD KEY `idx_lr_created_at` (`created_at`),
  ADD KEY `idx_layout_requests_architect_view` (`status`,`created_at`),
  ADD KEY `idx_layout_requests_homeowner_status` (`homeowner_id`,`status`);

--
-- Indexes for table `layout_request_assignments`
--
ALTER TABLE `layout_request_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_lr_arch` (`layout_request_id`,`architect_id`),
  ADD KEY `homeowner_id` (`homeowner_id`),
  ADD KEY `architect_id` (`architect_id`),
  ADD KEY `idx_lra_request` (`layout_request_id`),
  ADD KEY `idx_lra_architect` (`architect_id`),
  ADD KEY `idx_lra_homeowner` (`homeowner_id`),
  ADD KEY `idx_lra_status` (`status`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `architect_layouts`
--
ALTER TABLE `architect_layouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `architect_reviews`
--
ALTER TABLE `architect_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contractor_assignments`
--
ALTER TABLE `contractor_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `design_comments`
--
ALTER TABLE `design_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `layout_request_assignments`
--
ALTER TABLE `layout_request_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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

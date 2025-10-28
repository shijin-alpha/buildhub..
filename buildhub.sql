-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2025 at 07:55 PM
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
(10, 27, 28, 19, 5, 'Thankyou for your service', '2025-09-25 15:26:15'),
(11, 1, 1, 1, 5, 'Excellent work! The architect was very professional and delivered exactly what we wanted. Highly recommended!', '2025-10-21 07:34:25'),
(12, 1, 1, 2, 4, 'Good design and timely delivery. Would work with them again.', '2025-10-21 07:34:25'),
(13, 2, 1, 3, 5, 'Outstanding commercial design. The architect understood our business needs perfectly.', '2025-10-21 07:34:25'),
(14, 2, 1, 4, 4, 'Professional service and creative solutions for our office space.', '2025-10-21 07:34:25'),
(15, 3, 1, 5, 5, 'Beautiful traditional design that respects our cultural heritage.', '2025-10-21 07:34:25'),
(16, 3, 1, 6, 3, 'Good work but communication could be better.', '2025-10-21 07:34:25'),
(17, 4, 1, 7, 5, 'Amazing eco-friendly design! The architect was very knowledgeable about sustainable architecture.', '2025-10-21 07:34:25'),
(18, 4, 1, 8, 4, 'Great modern design with green features. Very satisfied with the result.', '2025-10-21 07:34:25'),
(19, 5, 1, 9, 5, 'Exceptional industrial design. The architect handled our complex requirements perfectly.', '2025-10-21 07:34:25'),
(20, 5, 1, 10, 4, 'Good commercial design. Professional and reliable service.', '2025-10-21 07:34:25'),
(21, 1, 1, 1, 5, 'Excellent work! The architect was very professional and delivered exactly what we wanted. Highly recommended!', '2025-10-21 07:40:52'),
(22, 1, 1, 2, 4, 'Good design and timely delivery. Would work with them again.', '2025-10-21 07:40:52'),
(23, 2, 1, 3, 5, 'Outstanding commercial design. The architect understood our business needs perfectly.', '2025-10-21 07:40:52'),
(24, 2, 1, 4, 4, 'Professional service and creative solutions for our office space.', '2025-10-21 07:40:52'),
(25, 3, 1, 5, 5, 'Beautiful traditional design that respects our cultural heritage.', '2025-10-21 07:40:52'),
(26, 3, 1, 6, 3, 'Good work but communication could be better.', '2025-10-21 07:40:52'),
(27, 4, 1, 7, 5, 'Amazing eco-friendly design! The architect was very knowledgeable about sustainable architecture.', '2025-10-21 07:40:52'),
(28, 4, 1, 8, 4, 'Great modern design with green features. Very satisfied with the result.', '2025-10-21 07:40:52'),
(29, 5, 1, 9, 5, 'Exceptional industrial design. The architect handled our complex requirements perfectly.', '2025-10-21 07:40:52'),
(30, 5, 1, 10, 4, 'Good commercial design. Professional and reliable service.', '2025-10-21 07:40:52'),
(31, 27, 28, 22, 4, 'good', '2025-10-21 10:33:14'),
(32, 27, 28, 28, 4, 'very good', '2025-10-27 16:54:58');

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
-- Table structure for table `contractor_estimate_payments`
--

CREATE TABLE `contractor_estimate_payments` (
  `id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `estimate_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contractor_estimate_payments`
--

INSERT INTO `contractor_estimate_payments` (`id`, `homeowner_id`, `estimate_id`, `amount`, `currency`, `payment_status`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `created_at`, `updated_at`) VALUES
(1, 28, 24, 100.00, 'INR', 'completed', 'order_RU4ZVnWZqBzOKD', 'pay_RU4Zghdf0713db', 'f7b3e7b5c457ebfb152ea45394996f80686a3a484e5d14bb0363d89ae683015d', '2025-10-16 08:07:21', '2025-10-16 08:07:44'),
(2, 28, 23, 100.00, 'INR', 'pending', 'order_RUPLuNInB8T5t7', NULL, NULL, '2025-10-17 04:27:03', '2025-10-17 04:27:03'),
(3, 28, 23, 100.00, 'INR', 'pending', 'order_RUPLz2tVm72vVw', NULL, NULL, '2025-10-17 04:27:08', '2025-10-17 04:27:08'),
(4, 28, 23, 100.00, 'INR', 'pending', 'order_RUPM026os9UPez', NULL, NULL, '2025-10-17 04:27:09', '2025-10-17 04:27:09'),
(5, 28, 23, 100.00, 'INR', 'pending', 'order_RUPM938N3JrLkg', NULL, NULL, '2025-10-17 04:27:17', '2025-10-17 04:27:17'),
(6, 28, 23, 100.00, 'INR', 'completed', 'order_RUPMAqBPPW7d3g', 'pay_RUPMLP1qU84Keo', 'aba39dcaab8f1e203fea5f9a6d1cbfaa2a63bb739c639bd27c4b3f756c73c469', '2025-10-17 04:27:18', '2025-10-17 04:27:41'),
(7, 28, 29, 100.00, 'INR', 'completed', 'order_RYCR5ty0D6TYJs', 'pay_RYCRjYXFJlUXRe', '5bc87cca642a3a65d6d996a4ca52e6f43cb0d215244105ece379df912a7d4b28', '2025-10-26 18:24:58', '2025-10-26 18:26:05'),
(8, 28, 30, 100.00, 'INR', 'pending', 'order_RYaNCxyhF8lvrO', NULL, NULL, '2025-10-27 17:49:56', '2025-10-27 17:49:56'),
(9, 28, 30, 100.00, 'INR', 'pending', 'order_RYaNHDW4oTEa2q', NULL, NULL, '2025-10-27 17:50:00', '2025-10-27 17:50:00'),
(10, 28, 30, 100.00, 'INR', 'completed', 'order_RYaTSUWP8yYRHj', 'pay_RYaTZ1i74QBvxb', '7191670139d57499a61d171f096e0ac5722aca346900f2827137ff52f43adbcf', '2025-10-27 17:55:51', '2025-10-27 17:56:10');

-- --------------------------------------------------------

--
-- Table structure for table `contractor_inbox`
--

CREATE TABLE `contractor_inbox` (
  `id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `estimate_id` int(11) DEFAULT NULL,
  `type` enum('layout_request','construction_start','estimate_response','general') DEFAULT 'layout_request',
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('unread','read','acknowledged') DEFAULT 'unread',
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `homeowner_name` varchar(255) DEFAULT NULL,
  `homeowner_email` varchar(255) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contractor_inbox`
--

INSERT INTO `contractor_inbox` (`id`, `contractor_id`, `homeowner_id`, `estimate_id`, `type`, `title`, `message`, `status`, `acknowledged_at`, `due_date`, `created_at`, `updated_at`, `homeowner_name`, `homeowner_email`, `payload`) VALUES
(2, 29, 28, 23, '', 'Estimate Approved: Estimate #23', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', 'unread', NULL, NULL, '2025-10-21 05:12:37', '2025-10-21 05:12:37', NULL, NULL, '{\"estimate_details\":{\"id\":23,\"materials\":null,\"cost_breakdown\":null,\"total_cost\":null,\"timeline\":\"6 months\",\"notes\":null,\"structured\":{\"project_name\":\"Commercial Complex\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}},\"homeowner_details\":{\"id\":28,\"first_name\":\"SHIJIN THOMAS\",\"last_name\":\"MCA2024-2026\",\"email\":\"shijinthomas2026@mca.ajce.in\",\"phone\":null,\"address\":null,\"city\":null,\"state\":null,\"zip_code\":null},\"layout_details\":null,\"project_title\":\"Estimate #23\",\"original_message\":null}'),
(3, 29, 28, 24, '', 'Estimate Approved: Estimate #24', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', 'unread', NULL, NULL, '2025-10-21 06:50:38', '2025-10-21 06:50:38', NULL, NULL, '{\"estimate_details\":{\"id\":24,\"materials\":null,\"cost_breakdown\":null,\"total_cost\":null,\"timeline\":\"6 months\",\"notes\":null,\"structured\":{\"project_name\":\"Residential Villa\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"Masonry - \\u20b9\\/m\\u00b3\",\"qty\":\"5\",\"rate\":\"90\",\"amount\":\"450\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"WC, basin, shower set\",\"qty\":\"6\",\"rate\":\"9000\",\"amount\":\"54000\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"Material transport local\",\"qty\":\"50\",\"rate\":\"50\",\"amount\":\"2500\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"450\",\"utilities\":\"54000\",\"misc\":\"2500\",\"grand\":\"75950\"},\"brands\":\"\"}},\"homeowner_details\":{\"id\":28,\"first_name\":\"SHIJIN THOMAS\",\"last_name\":\"MCA2024-2026\",\"email\":\"shijinthomas2026@mca.ajce.in\",\"phone\":null,\"address\":null,\"city\":null,\"state\":null,\"zip_code\":null},\"layout_details\":null,\"project_title\":\"Estimate #24\",\"original_message\":null}'),
(4, 29, 28, 29, '', 'Estimate Approved: Estimate #29', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', 'unread', NULL, NULL, '2025-10-26 18:26:12', '2025-10-26 18:26:12', NULL, NULL, '{\"estimate_details\":{\"id\":29,\"materials\":null,\"cost_breakdown\":null,\"total_cost\":null,\"timeline\":\"6 months\",\"notes\":null,\"structured\":{\"project_name\":\"Residential Villa\",\"project_address\":\"\",\"plot_size\":\"2800\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}},\"homeowner_details\":{\"id\":28,\"first_name\":\"SHIJIN THOMAS\",\"last_name\":\"MCA2024-2026\",\"email\":\"shijinthomas2026@mca.ajce.in\",\"phone\":null,\"address\":null,\"city\":null,\"state\":null,\"zip_code\":null},\"layout_details\":null,\"project_title\":\"Estimate #29\",\"original_message\":null}'),
(5, 29, 28, 30, '', 'Estimate Approved: Estimate #30', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', 'unread', NULL, NULL, '2025-10-27 17:56:37', '2025-10-27 17:56:37', NULL, NULL, '{\"estimate_details\":{\"id\":30,\"materials\":null,\"cost_breakdown\":null,\"total_cost\":null,\"timeline\":\"10 months\",\"notes\":null,\"structured\":{\"project_name\":\"Residential Villa\",\"project_address\":\"jnbn\",\"plot_size\":\"2800\",\"built_up_area\":\"2800\",\"floors\":\"1\",\"estimation_date\":\"\",\"client_name\":\"shijin\",\"client_contact\":\"shijinthomas2026mca.ajc.in\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"River sand - 5 m\\u00b3\",\"qty\":\"6\",\"rate\":\"2500\",\"amount\":\"15000\"},\"bricks\":{\"name\":\"Clay bricks - 5000 nos\",\"qty\":\"5000\",\"rate\":\"10\",\"amount\":\"50000\"},\"steel\":{\"name\":\"TMT 8\\/10\\/12mm - 1500 kg\",\"qty\":\"1200\",\"rate\":\"68\",\"amount\":\"81600\"},\"aggregate\":{\"name\":\"20mm aggregate - 8 m\\u00b3\",\"qty\":\"34\",\"rate\":\"1230\",\"amount\":\"41820\"},\"tiles\":{\"name\":\"Vitrified tiles - 120 m\\u00b2\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"Interior emulsion - 80 L\",\"qty\":\"80\",\"rate\":\"250\",\"amount\":\"20000\"},\"doors\":{\"name\":\"Teakwood doors - 10 nos\",\"qty\":\"10\",\"rate\":\"7000\",\"amount\":\"70000\"},\"windows\":{\"name\":\"uPVC windows - 12 nos\",\"qty\":\"12\",\"rate\":\"6000\",\"amount\":\"72000\"},\"others\":{\"name\":\"glass\",\"qty\":\"10\",\"rate\":\"1000\",\"amount\":\"10000\"}},\"labor\":{\"mason\":{\"name\":\"Masonry - \\u20b9\\/m\\u00b3\",\"qty\":\"5\",\"rate\":\"90\",\"amount\":\"450\"},\"plaster\":{\"name\":\"Internal plaster - \\u20b9\\/m\\u00b2\",\"qty\":\"2\",\"rate\":\"90\",\"amount\":\"180\"},\"painting\":{\"name\":\"2-coat interior - \\u20b9\\/m\\u00b2\",\"qty\":\"3\",\"rate\":\"90\",\"amount\":\"270\"},\"electrical\":{\"name\":\"Per point - \\u20b9\\/pt\",\"qty\":\"5\",\"rate\":\"5\",\"amount\":\"25\"},\"plumbing\":{\"name\":\"Per fitting - \\u20b9\\/fit\",\"qty\":\"5\",\"rate\":\"5\",\"amount\":\"25\"},\"flooring\":{\"name\":\"Flooring install - \\u20b9\\/m\\u00b2\",\"qty\":\"5\",\"rate\":\"5\",\"amount\":\"25\"},\"roofing\":{\"name\":\"Roof sheet install - \\u20b9\\/m\\u00b2\",\"qty\":\"12\",\"rate\":\"500\",\"amount\":\"6000\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"WC, basin, shower set\",\"qty\":\"6\",\"rate\":\"9000\",\"amount\":\"54000\"},\"kitchen\":{\"name\":\"Modular kitchen - 12ft\",\"qty\":\"6\",\"rate\":\"100000\",\"amount\":\"600000\"},\"electrical_fixtures\":{\"name\":\"LED panels, fans, switches\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"Overhead tank 1000L + pump\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"Split AC - 1.5T x 2\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"Gas line + kitchen water line\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"Material transport local\",\"qty\":\"50\",\"rate\":\"50\",\"amount\":\"2500\"},\"contingency\":{\"name\":\"5% buffer\",\"qty\":\"5\",\"rate\":\"50\",\"amount\":\"250\"},\"fees\":{\"name\":\"Permit & registration\",\"amount\":\"10000\"},\"cleaning\":{\"name\":\"Debris removal\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"PPE & scaffolding\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"379420\",\"labor\":\"6975\",\"utilities\":\"654000\",\"misc\":\"12750\",\"grand\":\"1053145\"},\"brands\":\"\"}},\"homeowner_details\":{\"id\":28,\"first_name\":\"SHIJIN THOMAS\",\"last_name\":\"MCA2024-2026\",\"email\":\"shijinthomas2026@mca.ajce.in\",\"phone\":null,\"address\":null,\"city\":null,\"state\":null,\"zip_code\":null},\"layout_details\":null,\"project_title\":\"Estimate #30\",\"original_message\":null}');

-- --------------------------------------------------------

--
-- Table structure for table `contractor_layout_sends`
--

CREATE TABLE `contractor_layout_sends` (
  `id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `homeowner_id` int(11) DEFAULT NULL,
  `layout_id` int(11) DEFAULT NULL,
  `design_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `acknowledged_at` datetime DEFAULT NULL,
  `due_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contractor_layout_sends`
--

INSERT INTO `contractor_layout_sends` (`id`, `contractor_id`, `homeowner_id`, `layout_id`, `design_id`, `message`, `payload`, `created_at`, `acknowledged_at`, `due_date`) VALUES
(3, 37, 28, NULL, NULL, NULL, '{\"layout_id\":null,\"design_id\":null,\"message\":null,\"forwarded_design\":{\"id\":21,\"title\":\"nbn\",\"description\":\"\",\"files\":[{\"original\":\"4.png\",\"stored\":\"68e51548c6d1c5.76863274_1759843656.png\",\"ext\":\"png\",\"path\":\"/buildhub/backend/uploads/designs/68e51548c6d1c5.76863274_1759843656.png\"}],\"technical_details\":{\"floor_plans\":{\"living_room_dimensions\":\"24 × 18 ft\",\"master_bedroom_dimensions\":\"18 × 14 ft\"},\"structural\":{\"foundation_outline\":\"Isolated footings; basement optional\",\"roof_outline\":\"Flat + partial sloped accents; terrace deck\"},\"construction\":{\"wall_thickness\":\"External 250–300 mm with high insulation; internal 115–150 mm\",\"ceiling_heights\":\"Ground 3.4 m; Upper 3.2 m\",\"building_codes\":\"High energy performance; local villa standards\",\"critical_instructions\":\"Provision for home automation and solar PV\"},\"meta\":{\"building_type\":\"residential\"},\"elevations\":{\"front_elevation\":\"Monolithic volumes; concealed gutters; frameless corners\",\"height_details\":\"Clear height 3.0 m; floor-to-floor 3.2 m\"}},\"created_at\":\"2025-10-07 18:57:36\"},\"layout_image_url\":null}', '2025-10-07 16:03:31', '2025-10-07 21:33:55', '2025-10-16'),
(7, 37, 28, NULL, NULL, NULL, '{\"layout_id\":null,\"design_id\":null,\"message\":null,\"forwarded_design\":{\"id\":22,\"title\":\"hgvv\",\"description\":\"\",\"files\":[{\"original\":\"2.png\",\"stored\":\"68ef98b6b90964.28887100_1760532662.png\",\"ext\":\"png\",\"path\":\"/buildhub/backend/uploads/designs/68ef98b6b90964.28887100_1760532662.png\"}],\"technical_details\":{\"floor_plans\":{\"living_room_dimensions\":\"20 × 15 ft\",\"master_bedroom_dimensions\":\"16 × 12 ft\",\"layout_description\":\" jhg\",\"kitchen_dimensions\":\"12 × 10 ft\"},\"structural\":{\"load_bearing_walls\":\"Reinforced concrete walls at cores; 200 mm slabs\",\"column_positions\":\"8 m grid; edge columns 300×600 mm\",\"foundation_outline\":\"Isolated footings; M30 concrete\",\"roof_outline\":\"Flat RCC slab with insulation\"},\"construction\":{\"wall_thickness\":\"External 230 mm RCC + insulation + plaster; Internal 115 mm block\",\"ceiling_heights\":\"Living 3.1 m; Bedrooms 3.0 m; Kitchen 2.9 m\",\"building_codes\":\"IBC 2021 / IS 456 as applicable\",\"critical_instructions\":\"Use Fe500 rebars; cover as per exposure class XC2\"},\"meta\":{\"building_type\":\"residential\"},\"elevations\":{\"front_elevation\":\"Monolithic volumes; concealed gutters; frameless corners\",\"height_details\":\"Clear height 3.0 m; floor-to-floor 3.2 m\"}},\"created_at\":\"2025-10-15 18:21:02\"},\"layout_image_url\":null,\"floor_details\":null}', '2025-10-21 10:32:49', NULL, NULL),
(11, 29, 28, NULL, NULL, NULL, '{\"layout_id\":null,\"design_id\":null,\"message\":null,\"forwarded_design\":{\"id\":28,\"title\":\"modern\",\"description\":\"\",\"files\":[{\"original\":\"2.png\",\"stored\":\"68ff9bb0f26623.63611107_1761582000.png\",\"ext\":\"png\",\"path\":\"/buildhub/backend/uploads/designs/68ff9bb0f26623.63611107_1761582000.png\"}],\"technical_details\":{\"floor_plan_layout\":\"Simple rectangular layout with clear circulation\",\"room_dimensions\":{\"living_room\":\"20×15 ft\",\"master_bedroom\":\"14×12 ft\",\"kitchen\":\"12×10 ft\",\"other_rooms\":\"Bedroom 2: 12×10 ft\\nBathroom: 8×6 ft\"},\"door_window_positions\":\"North-facing main entrance with east-west rooms for optimal sunlight\",\"circulation_paths\":\"Central hallway with easy access to all rooms\",\"structural_elements\":\"RCC framed structure with concrete columns, beams, and slabs\",\"elevations_sections\":\"Standard elevation with cement plaster and paint\",\"construction_notes\":\"Standard residential construction with M20 concrete\",\"foundation_type\":\"RCC strip footing foundation\",\"structural_materials\":\"M20 grade concrete, Fe415 steel reinforcement\",\"load_bearing_elements\":\"RCC columns and beams with standard spacing\",\"facade_treatment\":\"Standard cement plaster finish with paint\",\"section_details\":\"Standard wall thickness with cavity insulation\",\"building_height\":\"Ground + 1 floor (approx. 10.5m)\",\"material_specifications\":\"M20 grade concrete, Fe415 steel, standard finishes\",\"construction_methods\":\"Modern construction with precast elements\",\"special_requirements\":\"Earthquake-resistant design with proper reinforcement\",\"electrical_system\":\"Standard residential electrical layout with MCB distribution board\",\"plumbing_system\":\"CPVC pipes for water supply, PVC for drainage\",\"hvac_system\":\"Natural ventilation with ceiling fans\",\"fire_safety\":\"Standard fire safety with fire extinguishers and exit signs\",\"accessibility_features\":\"Ramps and accessible parking\",\"energy_efficiency\":\"Standard insulation with energy-efficient windows\",\"estimated_cost\":\"560000\",\"cost_breakdown\":\"Foundation: 15%, Structure: 30%, Finishing: 35%, Services: 20%\",\"material_costs\":\"Cement: ₹250/bag, Steel: ₹55/kg, Bricks: ₹8/unit\",\"labor_costs\":\"Masonry: ₹600/day, Carpenter: ₹700/day, Electrician: ₹550/day\",\"view_price\":\"8500\"},\"created_at\":\"2025-10-27 21:50:01\"},\"layout_image_url\":null,\"floor_details\":null}', '2025-10-27 17:24:17', '2025-10-27 23:04:50', '2025-11-28');

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
  `rating` tinyint(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contractor_send_estimates`
--

CREATE TABLE `contractor_send_estimates` (
  `id` int(11) NOT NULL,
  `send_id` int(11) NOT NULL,
  `contractor_id` int(11) NOT NULL,
  `materials` text DEFAULT NULL,
  `cost_breakdown` text DEFAULT NULL,
  `total_cost` decimal(15,2) DEFAULT NULL,
  `timeline` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` varchar(32) DEFAULT 'submitted',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `structured` longtext DEFAULT NULL,
  `homeowner_feedback` text DEFAULT NULL,
  `homeowner_action_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contractor_send_estimates`
--

INSERT INTO `contractor_send_estimates` (`id`, `send_id`, `contractor_id`, `materials`, `cost_breakdown`, `total_cost`, `timeline`, `notes`, `status`, `created_at`, `structured`, `homeowner_feedback`, `homeowner_action_at`) VALUES
(23, 2, 29, NULL, NULL, NULL, '6 months', NULL, 'approved_with_message', '2025-10-20 08:38:43', '{\"project_name\":\"Commercial Complex\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', '2025-10-21 10:42:37'),
(24, 2, 29, NULL, NULL, NULL, '6 months', NULL, 'approved_with_message', '2025-10-15 17:23:16', '{\"project_name\":\"Residential Villa\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"Masonry - \\u20b9\\/m\\u00b3\",\"qty\":\"5\",\"rate\":\"90\",\"amount\":\"450\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"WC, basin, shower set\",\"qty\":\"6\",\"rate\":\"9000\",\"amount\":\"54000\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"Material transport local\",\"qty\":\"50\",\"rate\":\"50\",\"amount\":\"2500\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"450\",\"utilities\":\"54000\",\"misc\":\"2500\",\"grand\":\"75950\"},\"brands\":\"\"}', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', '2025-10-21 12:20:38'),
(25, 6, 29, 'Cement, Steel, Bricks, Tiles, Paint, Electrical fixtures', 'Materials: ₹35L, Labor: ₹20L, Utilities: ₹3L, Misc: ₹2L', 6000000.00, '8-10 months', 'High-quality construction with modern amenities', 'accepted', '2025-10-20 10:00:07', '{\"project_name\":\"Modern Family Home\",\"totals\":{\"materials\":3500000,\"labor\":2000000,\"utilities\":300000,\"misc\":200000,\"grand\":6000000}}', NULL, NULL),
(26, 9, 29, NULL, NULL, NULL, '6 months', NULL, 'submitted', '2025-10-26 18:22:46', '{\"project_name\":\"gf\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}', NULL, NULL),
(27, 9, 29, NULL, NULL, NULL, '6 months', NULL, 'submitted', '2025-10-26 18:22:56', '{\"project_name\":\"gf\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}', NULL, NULL),
(28, 9, 29, NULL, NULL, NULL, '6 months', NULL, 'submitted', '2025-10-26 18:23:02', '{\"project_name\":\"gf\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}', NULL, NULL),
(29, 9, 29, NULL, NULL, NULL, '6 months', NULL, 'approved_with_message', '2025-10-26 18:24:17', '{\"project_name\":\"Residential Villa\",\"project_address\":\"\",\"plot_size\":\"2800\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"19000\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"19000\"},\"brands\":\"\"}', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', '2025-10-26 23:56:12'),
(30, 11, 29, NULL, NULL, NULL, '10 months', NULL, 'approved_with_message', '2025-10-27 17:47:28', '{\"project_name\":\"Residential Villa\",\"project_address\":\"jnbn\",\"plot_size\":\"2800\",\"built_up_area\":\"2800\",\"floors\":\"1\",\"estimation_date\":\"\",\"client_name\":\"shijin\",\"client_contact\":\"shijinthomas2026mca.ajc.in\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"380\",\"amount\":\"19000\"},\"sand\":{\"name\":\"River sand - 5 m\\u00b3\",\"qty\":\"6\",\"rate\":\"2500\",\"amount\":\"15000\"},\"bricks\":{\"name\":\"Clay bricks - 5000 nos\",\"qty\":\"5000\",\"rate\":\"10\",\"amount\":\"50000\"},\"steel\":{\"name\":\"TMT 8\\/10\\/12mm - 1500 kg\",\"qty\":\"1200\",\"rate\":\"68\",\"amount\":\"81600\"},\"aggregate\":{\"name\":\"20mm aggregate - 8 m\\u00b3\",\"qty\":\"34\",\"rate\":\"1230\",\"amount\":\"41820\"},\"tiles\":{\"name\":\"Vitrified tiles - 120 m\\u00b2\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"Interior emulsion - 80 L\",\"qty\":\"80\",\"rate\":\"250\",\"amount\":\"20000\"},\"doors\":{\"name\":\"Teakwood doors - 10 nos\",\"qty\":\"10\",\"rate\":\"7000\",\"amount\":\"70000\"},\"windows\":{\"name\":\"uPVC windows - 12 nos\",\"qty\":\"12\",\"rate\":\"6000\",\"amount\":\"72000\"},\"others\":{\"name\":\"glass\",\"qty\":\"10\",\"rate\":\"1000\",\"amount\":\"10000\"}},\"labor\":{\"mason\":{\"name\":\"Masonry - \\u20b9\\/m\\u00b3\",\"qty\":\"5\",\"rate\":\"90\",\"amount\":\"450\"},\"plaster\":{\"name\":\"Internal plaster - \\u20b9\\/m\\u00b2\",\"qty\":\"2\",\"rate\":\"90\",\"amount\":\"180\"},\"painting\":{\"name\":\"2-coat interior - \\u20b9\\/m\\u00b2\",\"qty\":\"3\",\"rate\":\"90\",\"amount\":\"270\"},\"electrical\":{\"name\":\"Per point - \\u20b9\\/pt\",\"qty\":\"5\",\"rate\":\"5\",\"amount\":\"25\"},\"plumbing\":{\"name\":\"Per fitting - \\u20b9\\/fit\",\"qty\":\"5\",\"rate\":\"5\",\"amount\":\"25\"},\"flooring\":{\"name\":\"Flooring install - \\u20b9\\/m\\u00b2\",\"qty\":\"5\",\"rate\":\"5\",\"amount\":\"25\"},\"roofing\":{\"name\":\"Roof sheet install - \\u20b9\\/m\\u00b2\",\"qty\":\"12\",\"rate\":\"500\",\"amount\":\"6000\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"WC, basin, shower set\",\"qty\":\"6\",\"rate\":\"9000\",\"amount\":\"54000\"},\"kitchen\":{\"name\":\"Modular kitchen - 12ft\",\"qty\":\"6\",\"rate\":\"100000\",\"amount\":\"600000\"},\"electrical_fixtures\":{\"name\":\"LED panels, fans, switches\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"Overhead tank 1000L + pump\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"Split AC - 1.5T x 2\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"Gas line + kitchen water line\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"Material transport local\",\"qty\":\"50\",\"rate\":\"50\",\"amount\":\"2500\"},\"contingency\":{\"name\":\"5% buffer\",\"qty\":\"5\",\"rate\":\"50\",\"amount\":\"250\"},\"fees\":{\"name\":\"Permit & registration\",\"amount\":\"10000\"},\"cleaning\":{\"name\":\"Debris removal\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"PPE & scaffolding\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"379420\",\"labor\":\"6975\",\"utilities\":\"654000\",\"misc\":\"12750\",\"grand\":\"1053145\"},\"brands\":\"\"}', 'I am satisfied with this estimate and ready to start the construction project. Please let me know the next steps and when we can begin work.', '2025-10-27 23:26:37'),
(31, 11, 29, NULL, NULL, NULL, '10 months', NULL, 'submitted', '2025-10-27 18:53:58', '{\"project_name\":\"Residential Villa\",\"project_address\":\"\",\"plot_size\":\"\",\"built_up_area\":\"\",\"floors\":\"\",\"estimation_date\":\"\",\"client_name\":\"\",\"client_contact\":\"\",\"materials\":{\"cement\":{\"name\":\"OPC 43 grade - 50 bags\",\"qty\":\"50\",\"rate\":\"\",\"amount\":\"\"},\"sand\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"bricks\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"steel\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"aggregate\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"tiles\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"paint\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"doors\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"windows\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"labor\":{\"mason\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plaster\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"painting\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"plumbing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"flooring\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"roofing\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"}},\"utilities\":{\"sanitary\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"kitchen\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"electrical_fixtures\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"water_tank\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"hvac\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"gas_water\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"misc\":{\"transport\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"contingency\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"fees\":{\"name\":\"\",\"amount\":\"\"},\"cleaning\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"safety\":{\"name\":\"\",\"qty\":\"\",\"rate\":\"\",\"amount\":\"\"},\"others1\":{\"name\":\"\",\"amount\":\"\"},\"others2\":{\"name\":\"\",\"amount\":\"\"},\"others3\":{\"name\":\"\",\"amount\":\"\"}},\"totals\":{\"materials\":\"\",\"labor\":\"\",\"utilities\":\"\",\"misc\":\"\",\"grand\":\"\"},\"brands\":\"\"}', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contractor_send_estimate_files`
--

CREATE TABLE `contractor_send_estimate_files` (
  `id` int(11) NOT NULL,
  `estimate_id` int(11) NOT NULL,
  `path` varchar(512) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `ext` varchar(16) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
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
  `technical_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Comprehensive technical details including floor plans, site orientation, structural elements, elevations, and construction notes',
  `view_price` decimal(10,2) DEFAULT 0.00 COMMENT 'Price for homeowners to view this layout'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designs`
--

INSERT INTO `designs` (`id`, `layout_request_id`, `architect_id`, `design_title`, `description`, `design_files`, `status`, `created_at`, `updated_at`, `homeowner_id`, `batch_id`, `layout_json`, `technical_details`, `view_price`) VALUES
(22, 86, 27, 'hgvv', '', '[{\"original\":\"2.png\",\"stored\":\"68ef98b6b90964.28887100_1760532662.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68ef98b6b90964.28887100_1760532662.png\"}]', 'shortlisted', '2025-10-15 12:51:02', '2025-10-27 16:54:49', 28, NULL, NULL, '{\"floor_plans\":{\"living_room_dimensions\":\"20 × 15 ft\",\"master_bedroom_dimensions\":\"16 × 12 ft\",\"layout_description\":\" jhg\",\"kitchen_dimensions\":\"12 × 10 ft\"},\"structural\":{\"load_bearing_walls\":\"Reinforced concrete walls at cores; 200 mm slabs\",\"column_positions\":\"8 m grid; edge columns 300×600 mm\",\"foundation_outline\":\"Isolated footings; M30 concrete\",\"roof_outline\":\"Flat RCC slab with insulation\"},\"construction\":{\"wall_thickness\":\"External 230 mm RCC + insulation + plaster; Internal 115 mm block\",\"ceiling_heights\":\"Living 3.1 m; Bedrooms 3.0 m; Kitchen 2.9 m\",\"building_codes\":\"IBC 2021 / IS 456 as applicable\",\"critical_instructions\":\"Use Fe500 rebars; cover as per exposure class XC2\"},\"meta\":{\"building_type\":\"residential\"},\"elevations\":{\"front_elevation\":\"Monolithic volumes; concealed gutters; frameless corners\",\"height_details\":\"Clear height 3.0 m; floor-to-floor 3.2 m\"}}', 0.00),
(25, 86, 27, 'fg', '', '[{\"original\":\"4.png\",\"stored\":\"68f5d54b1f0da6.48700673_1760941387.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68f5d54b1f0da6.48700673_1760941387.png\"}]', 'proposed', '2025-10-20 06:23:07', '2025-10-25 10:36:27', 28, NULL, NULL, '{\"floor_plans\":{\"living_room_dimensions\":\"20 × 15 ft\",\"master_bedroom_dimensions\":\"16 × 12 ft\",\"layout_description\":\" jhg\",\"kitchen_dimensions\":\"12 × 10 ft\",\"other_room_dimensions\":\"\"},\"structural\":{\"load_bearing_walls\":\"Reinforced concrete walls at cores; 200 mm slabs\",\"column_positions\":\"8 m grid; edge columns 300×600 mm\",\"foundation_outline\":\"Isolated footings; M30 concrete\",\"roof_outline\":\"Flat RCC slab with insulation\"},\"construction\":{\"wall_thickness\":\"External 230 mm RCC + insulation + plaster; Internal 115 mm block\",\"ceiling_heights\":\"Living 3.1 m; Bedrooms 3.0 m; Kitchen 2.9 m\",\"building_codes\":\"IBC 2021 / IS 456 as applicable\",\"critical_instructions\":\"Use Fe500 rebars; cover as per exposure class XC2\"},\"meta\":{\"building_type\":\"residential\"},\"elevations\":{\"front_elevation\":\"Monolithic volumes; concealed gutters; frameless corners\",\"height_details\":\"Clear height 3.0 m; floor-to-floor 3.2 m\"}}', 8200.00),
(26, 88, 27, 'adbhdb', '', '[{\"original\":\"shijin_project_report_that_i_editing[1][1].pdf\",\"stored\":\"68fca6b7604026.31740844_1761388215.pdf\",\"ext\":\"pdf\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68fca6b7604026.31740844_1761388215.pdf\"}]', 'finalized', '2025-10-25 10:30:15', '2025-10-25 10:51:01', 28, NULL, NULL, '{\"floor_plan_layout\":\"\",\"room_dimensions\":{\"living_room\":\"\",\"master_bedroom\":\"\",\"kitchen\":\"\",\"other_rooms\":\"\"},\"door_window_positions\":\"\",\"circulation_paths\":\"\",\"structural_elements\":\"RCC framed structure with concrete columns, beams, and slabs. Standard residential construction with M20 grade concrete.\",\"elevations_sections\":\"\",\"construction_notes\":\"\",\"foundation_type\":\"RCC Foundation with strip footing\",\"structural_materials\":\"M20 grade concrete, Fe415 steel reinforcement\",\"load_bearing_elements\":\"\",\"facade_treatment\":\"\",\"section_details\":\"\",\"building_height\":\"\",\"material_specifications\":\"\",\"construction_methods\":\"\",\"special_requirements\":\"\",\"electrical_system\":\"Standard residential electrical layout with MCB distribution board\",\"plumbing_system\":\"CPVC pipes for water supply, PVC for drainage\",\"hvac_system\":\"Natural ventilation with ceiling fans\",\"fire_safety\":\"\",\"accessibility_features\":\"\",\"energy_efficiency\":\"\",\"estimated_cost\":\"₹15,00,000 - ₹20,00,000\",\"cost_breakdown\":\"\",\"material_costs\":\"\",\"labor_costs\":\"\"}', 0.00),
(28, 86, 27, 'modern', '', '[{\"original\":\"2.png\",\"stored\":\"68ff9bb0f26623.63611107_1761582000.png\",\"ext\":\"png\",\"path\":\"\\/buildhub\\/backend\\/uploads\\/designs\\/68ff9bb0f26623.63611107_1761582000.png\"}]', 'finalized', '2025-10-27 16:20:01', '2025-10-27 16:54:49', NULL, NULL, NULL, '{\"floor_plan_layout\":\"Simple rectangular layout with clear circulation\",\"room_dimensions\":{\"living_room\":\"20×15 ft\",\"master_bedroom\":\"14×12 ft\",\"kitchen\":\"12×10 ft\",\"other_rooms\":\"Bedroom 2: 12×10 ft\\nBathroom: 8×6 ft\"},\"door_window_positions\":\"North-facing main entrance with east-west rooms for optimal sunlight\",\"circulation_paths\":\"Central hallway with easy access to all rooms\",\"structural_elements\":\"RCC framed structure with concrete columns, beams, and slabs\",\"elevations_sections\":\"Standard elevation with cement plaster and paint\",\"construction_notes\":\"Standard residential construction with M20 concrete\",\"foundation_type\":\"RCC strip footing foundation\",\"structural_materials\":\"M20 grade concrete, Fe415 steel reinforcement\",\"load_bearing_elements\":\"RCC columns and beams with standard spacing\",\"facade_treatment\":\"Standard cement plaster finish with paint\",\"section_details\":\"Standard wall thickness with cavity insulation\",\"building_height\":\"Ground + 1 floor (approx. 10.5m)\",\"material_specifications\":\"M20 grade concrete, Fe415 steel, standard finishes\",\"construction_methods\":\"Modern construction with precast elements\",\"special_requirements\":\"Earthquake-resistant design with proper reinforcement\",\"electrical_system\":\"Standard residential electrical layout with MCB distribution board\",\"plumbing_system\":\"CPVC pipes for water supply, PVC for drainage\",\"hvac_system\":\"Natural ventilation with ceiling fans\",\"fire_safety\":\"Standard fire safety with fire extinguishers and exit signs\",\"accessibility_features\":\"Ramps and accessible parking\",\"energy_efficiency\":\"Standard insulation with energy-efficient windows\",\"estimated_cost\":\"560000\",\"cost_breakdown\":\"Foundation: 15%, Structure: 30%, Finishing: 35%, Services: 20%\",\"material_costs\":\"Cement: ₹250/bag, Steel: ₹55/kg, Bricks: ₹8/unit\",\"labor_costs\":\"Masonry: ₹600/day, Carpenter: ₹700/day, Electrician: ₹550/day\",\"view_price\":\"8500\"}', 8500.00);

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
(8, 19, 28, 'Thankyou for your service', '2025-09-25 15:26:15'),
(9, 22, 28, 'good', '2025-10-21 10:33:14'),
(10, 28, 28, 'very good', '2025-10-27 16:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `homeowner_notifications`
--

CREATE TABLE `homeowner_notifications` (
  `id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `contractor_id` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'acknowledgment',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `homeowner_notifications`
--

INSERT INTO `homeowner_notifications` (`id`, `homeowner_id`, `contractor_id`, `type`, `title`, `message`, `status`, `created_at`) VALUES
(1, 28, 29, 'acknowledgment', 'Contractor Acknowledged Your Layout', 'Shijin Thomas acknowledged your layout at 2025-10-26 19:19:55.\nDue date: December 25, 2025', 'unread', '2025-10-26 18:19:55'),
(2, 28, 29, 'acknowledgment', 'Contractor Acknowledged Your Layout', 'Shijin Thomas acknowledged your layout at 2025-10-27 18:34:48.\nDue date: November 28, 2025', 'unread', '2025-10-27 17:34:48'),
(3, 28, 29, 'acknowledgment', 'Contractor Acknowledged Your Layout', 'Shijin Thomas acknowledged your layout at 2025-10-27 18:34:50.\nDue date: November 28, 2025', 'unread', '2025-10-27 17:34:50');

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
  `view_price` decimal(10,2) DEFAULT 0.00,
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

INSERT INTO `layout_library` (`id`, `title`, `layout_type`, `bedrooms`, `bathrooms`, `area`, `description`, `image_url`, `design_file_url`, `price_range`, `view_price`, `technical_details`, `architect_id`, `status`, `created_at`, `updated_at`, `floor_plans`, `room_dimensions`, `door_window_positions`, `circulation_paths`, `plot_boundaries`, `orientation_north`, `access_points`, `load_bearing_walls`, `column_positions`, `foundation_outline`, `roof_outline`, `front_elevation`, `cross_sections`, `height_details`, `wall_thickness`, `ceiling_heights`, `building_codes`, `critical_instructions`) VALUES
(10, '3BHK', 'Modern', 3, 3, 2500, '', '/buildhub/backend/uploads/designs/lib_1759842787_f51c001b.jpeg', '/buildhub/backend/uploads/designs/libfile_1759842787_e8794d84.png', '80-90 laks', 0.00, NULL, 27, 'active', '2025-09-07 06:44:14', '2025-10-07 13:13:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'Modern 3BHK Hosue', 'Modern', 3, 3, 3000, '', '/buildhub/backend/uploads/designs/lib_1759842744_d4b24a9c.webp', '/buildhub/backend/uploads/designs/libfile_1759842744_a818e016.png', '85-90', 0.00, NULL, 27, 'active', '2025-09-21 16:11:24', '2025-10-26 18:15:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
-- Table structure for table `layout_payments`
--

CREATE TABLE `layout_payments` (
  `id` int(11) NOT NULL,
  `homeowner_id` int(11) NOT NULL,
  `architect_id` int(11) NOT NULL,
  `design_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
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
  `num_floors` varchar(10) DEFAULT NULL COMMENT 'Number of floors requested',
  `building_size` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layout_requests`
--

INSERT INTO `layout_requests` (`id`, `user_id`, `homeowner_id`, `plot_size`, `budget_range`, `requirements`, `preferred_style`, `status`, `created_at`, `updated_at`, `location`, `timeline`, `selected_layout_id`, `layout_type`, `layout_file`, `site_images`, `reference_images`, `room_images`, `orientation`, `site_considerations`, `material_preferences`, `budget_allocation`, `floor_rooms`, `num_floors`, `building_size`) VALUES
(62, 28, 28, '3000', '9000000', '{\"plot_shape\":\"hvh\",\"topography\":\"jbjbj\",\"development_laws\":\"bb\",\"family_needs\":\"jbbj\",\"rooms\":\"3\",\"aesthetic\":\"vv\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-22 08:25:49', '2025-10-02 16:43:05', 'Kottakkal', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 28, 28, '2100', '5500000', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"nil\",\"family_needs\":\"nothing special\",\"rooms\":\"3\",\"aesthetic\":\"modern\",\"notes\":\"\"}', NULL, 'deleted', '2025-09-25 15:14:06', '2025-10-02 16:43:09', 'Kollam', '12-18 months', NULL, 'custom', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(86, 28, 28, '3000', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Slightly Sloped\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"\",\"aesthetic\":\"Traditional\",\"notes\":\"\",\"orientation\":\"South-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Marble, Vitrified Tiles\",\"budget_allocation\":\"Balanced approach\",\"num_floors\":\"2\",\"preferred_style\":\"Traditional\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1},\\\"floor2\\\":{\\\"master_bedroom\\\":1,\\\"bedrooms\\\":1,\\\"attached_bathrooms\\\":1,\\\"common_bathrooms\\\":1}}\",\"site_images\":[{\"id\":\"68deacff07dac\",\"file\":null,\"name\":\"11.webp\",\"size\":42242,\"url\":\"\\/buildhub\\/backend\\/uploads\\/site_images\\/28_68deacff07b1f.webp\"}],\"reference_images\":[],\"room_images\":{\"floor1\":{\"master_bedroom\":[{\"id\":\"68deacbd684ca\",\"name\":\"master bed.jpg\",\"size\":42453,\"url\":\"\\/buildhub\\/backend\\/uploads\\/room_images\\/28_68deacbd67dce.jpg\",\"floor\":1}]}}}', 'Traditional', 'approved', '2025-10-02 16:49:17', '2025-10-02 16:50:46', 'Kottayam', '12-18 months', NULL, 'custom', NULL, '[{\"id\":\"68deacff07dac\",\"file\":null,\"name\":\"11.webp\",\"size\":42242,\"url\":\"\\/buildhub\\/backend\\/uploads\\/site_images\\/28_68deacff07b1f.webp\"}]', '[]', '{\"floor1\":{\"master_bedroom\":[{\"id\":\"68deacbd684ca\",\"name\":\"master bed.jpg\",\"size\":42453,\"url\":\"\\/buildhub\\/backend\\/uploads\\/room_images\\/28_68deacbd67dce.jpg\",\"floor\":1}]}}', 'South-facing', '', 'Marble, Vitrified Tiles', 'Balanced approach', '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1,\"living_room\":1},\"floor2\":{\"master_bedroom\":1,\"bedrooms\":1,\"attached_bathrooms\":1,\"common_bathrooms\":1}}', '2', NULL),
(87, 28, 28, '2500', '30-50 Lakhs', '{\"plot_shape\":\"Irregular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"Garden\\/Outdoor space, Kids play area, Security features, Storage space, Elder-friendly\",\"rooms\":\"\",\"aesthetic\":\"Contemporary\",\"notes\":\"\",\"orientation\":\"North-facing\",\"site_considerations\":\"\",\"material_preferences\":\"Granite, Wood, Natural Stone, Glass, Vitrified Tiles, Concrete, Eco-friendly, Smart Materials\",\"budget_allocation\":\"Eco-friendly focus\",\"num_floors\":\"2\",\"preferred_style\":\"Contemporary\",\"floor_rooms\":\"{\\\"floor1\\\":{\\\"master_bedroom\\\":1,\\\"attached_bathrooms\\\":1,\\\"bedrooms\\\":2,\\\"common_bathrooms\\\":1,\\\"living_room\\\":1,\\\"kitchen\\\":1,\\\"study_room\\\":0,\\\"store_room\\\":1,\\\"garage\\\":1,\\\"utility_area\\\":1}}\",\"site_images\":[{\"id\":\"68f1c1cb5b641\",\"file\":null,\"name\":\"fgdf.jpg\",\"size\":80861,\"url\":\"\\/buildhub\\/backend\\/uploads\\/site_images\\/28_68f1c1cb5a625.jpg\"}],\"reference_images\":[],\"room_images\":[]}', 'Contemporary', 'deleted', '2025-10-17 04:25:09', '2025-10-24 09:26:41', 'Kanpur', '12-18 months', NULL, 'custom', NULL, '[{\"id\":\"68f1c1cb5b641\",\"file\":null,\"name\":\"fgdf.jpg\",\"size\":80861,\"url\":\"\\/buildhub\\/backend\\/uploads\\/site_images\\/28_68f1c1cb5a625.jpg\"}]', '[]', '[]', 'North-facing', '', 'Granite, Wood, Natural Stone, Glass, Vitrified Tiles, Concrete, Eco-friendly, Smart Materials', 'Eco-friendly focus', '{\"floor1\":{\"master_bedroom\":1,\"attached_bathrooms\":1,\"bedrooms\":2,\"common_bathrooms\":1,\"living_room\":1,\"kitchen\":1,\"study_room\":0,\"store_room\":1,\"garage\":1,\"utility_area\":1}}', '2', NULL),
(88, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"bedrooms,master_bedroom,bathrooms,kitchen,living_room,dining_room\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'approved', '2025-10-24 08:37:11', '2025-10-25 10:29:27', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2500'),
(89, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Square\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'deleted', '2025-10-24 08:38:36', '2025-10-24 09:26:37', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2498'),
(90, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Square\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms,kitchen\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'deleted', '2025-10-24 08:46:11', '2025-10-24 09:32:09', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2495'),
(91, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms,kitchen,living_room,dining_room,study_room\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'deleted', '2025-10-24 09:00:21', '2025-10-24 09:26:35', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2498'),
(92, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms,kitchen,living_room,dining_room\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'deleted', '2025-10-24 09:06:17', '2025-10-24 09:26:33', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2489'),
(93, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'deleted', '2025-10-24 09:09:12', '2025-10-24 09:32:18', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2497'),
(94, 28, 28, '7', '50-75 Lakhs', '{\"plot_shape\":\"Square\",\"topography\":\"Flat\",\"development_laws\":\"\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms\",\"aesthetic\":\"Minimalist\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Minimalist\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Minimalist', 'approved', '2025-10-24 09:26:08', '2025-10-24 09:29:56', '', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2491'),
(95, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"Standard\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms,prayer_room,study_room\",\"aesthetic\":\"Scandinavian\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"1\",\"preferred_style\":\"Scandinavian\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Scandinavian', 'deleted', '2025-10-26 18:18:58', '2025-10-27 14:34:51', 'Delhi', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '1', '2500'),
(96, 28, 28, '10', '75 Lakhs - 1 Crore', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"Standard\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms,attached_bathroom,kitchen,living_room,dining_room,study_room,prayer_room\",\"aesthetic\":\"Modern Contemporary\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Modern Contemporary\",\"floor_rooms\":null,\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Modern Contemporary', 'deleted', '2025-10-27 14:45:42', '2025-10-27 15:40:02', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '2', '2500'),
(97, 28, 28, '10', '50-75 Lakhs', '{\"plot_shape\":\"Rectangular\",\"topography\":\"Flat\",\"development_laws\":\"Standard\",\"family_needs\":\"\",\"rooms\":\"master_bedroom,bedrooms,bathrooms,attached_bathroom,kitchen,living_room\",\"aesthetic\":\"Modern Contemporary\",\"notes\":\"\",\"orientation\":null,\"site_considerations\":null,\"material_preferences\":null,\"budget_allocation\":null,\"num_floors\":\"2\",\"preferred_style\":\"Modern Contemporary\",\"floor_rooms\":{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"bathrooms\":1,\"attached_bathroom\":1,\"kitchen\":1,\"living_room\":1},\"floor2\":{\"master_bedroom\":1,\"bedrooms\":1,\"bathrooms\":1,\"attached_bathroom\":1,\"kitchen\":1,\"living_room\":1}},\"site_images\":[],\"reference_images\":[],\"room_images\":[]}', 'Modern Contemporary', 'approved', '2025-10-27 15:39:57', '2025-10-27 15:40:31', 'Mumbai', '6-12 months', NULL, 'custom', NULL, '[]', '[]', '[]', NULL, NULL, NULL, NULL, '{\"floor1\":{\"master_bedroom\":1,\"bedrooms\":1,\"bathrooms\":1,\"attached_bathroom\":1,\"kitchen\":1,\"living_room\":1},\"floor2\":{\"master_bedroom\":1,\"bedrooms\":1,\"bathrooms\":1,\"attached_bathroom\":1,\"kitchen\":1,\"living_room\":1}}', '2', '2500');

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
(40, 86, 28, 27, 'Custom design request from wizard', 'accepted', '2025-10-02 16:49:17', '2025-10-02 16:50:46'),
(41, 86, 28, 31, 'Custom design request from wizard', 'accepted', '2025-10-02 16:49:17', '2025-10-20 15:30:46'),
(44, 88, 28, 31, NULL, 'declined', '2025-10-24 08:37:11', '2025-10-24 09:41:37'),
(50, 94, 28, 27, NULL, 'declined', '2025-10-24 09:26:08', '2025-10-24 09:30:07'),
(51, 94, 28, 34, '', 'accepted', '2025-10-24 09:33:39', '2025-10-24 09:34:10'),
(52, 94, 28, 31, '', 'accepted', '2025-10-24 09:41:14', '2025-10-24 09:41:43'),
(53, 88, 28, 27, '', 'declined', '2025-10-25 10:28:51', '2025-10-27 15:38:04'),
(57, 97, 28, 27, NULL, 'declined', '2025-10-27 15:39:57', '2025-10-27 15:48:02');

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
(28, 'SHIJIN THOMAS', 'MCA2024-2026', NULL, NULL, 'shijinthomas2026@mca.ajce.in', '$2y$10$J243fQ/Wi88Bk9UbtlSKvOJStinlPcePeWgV8C0gApCZnxbG5qRfe', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-22 17:48:50', '2025-10-19 10:35:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'Shijin', 'Thomas', NULL, NULL, 'shijinthomas248@gmail.com', '$2y$10$m6o/je.6qIdMD6/k17enr.0QD0PAYSYSIyhTHF5b9Hs57hpqMsvR6', 'contractor', 'approved', 1, 'uploads/licenses/68b1a6aa444ec_license_20.jpeg', NULL, '2025-08-29 13:10:02', '2025-09-03 15:18:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'Fathima', 'Shibu', NULL, NULL, 'fathima470077@gmail.com', '$2y$10$ZFxAkA99J0LlBoYyr0TPne2PTEc5qFDDwFOCYoaZnH3m6a/ztMRSG', 'homeowner', 'approved', 1, NULL, NULL, '2025-08-31 05:37:04', '2025-09-11 09:29:51', NULL, NULL, NULL, NULL, NULL, NULL, '7558895667', NULL, 'Amal Jyothi College of Engineering, Koovappalli - Vizhikkathodu Road, Koovapally, Kanjirappally, Kottayam, Kerala, 686518, India', NULL, NULL, NULL),
(31, 'shijin', 'thomas', NULL, NULL, 'thomasshijin3@gmail.com', '$2y$10$5V6TmtS.aQnGhVt078Ugnuzq5PZu3afLzcEejgNFYv8bKtuQwe5Xi', 'architect', 'approved', 1, NULL, 'uploads/portfolios/68c686c50945d_license.jpeg', '2025-09-14 09:11:33', '2025-09-24 15:43:55', NULL, 'Commercial', 3, NULL, NULL, NULL, '7558958947', NULL, NULL, 'Ernakulam', NULL, NULL),
(32, 'Amal', 'Samuel', NULL, NULL, 'thomasshijin90@gmail.com', '$2y$10$QeLhw1WzOr9RRyFr5UJd1eYge9qLg1A6s2z98YKKVGsIb8Dk7iVjG', 'homeowner', 'approved', 1, NULL, NULL, '2025-09-17 13:20:34', '2025-09-19 08:11:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 'Linsha', 'Nadir', NULL, NULL, 'linshan2026@mca.ajce.in', '$2y$10$xnBF0c6kzGtZ15OLQELJg.pxAxkruyq9O.pITuNr0XaVr8blQSBrG', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68d10766bb3e1_1.png', '2025-09-22 08:23:02', '2025-09-24 15:44:52', NULL, 'Interior Design', 0, NULL, NULL, NULL, '7558958478', NULL, NULL, 'Malappuram', NULL, NULL),
(34, 'Savio', 'Joseph', NULL, NULL, 'saviojoseph2026@mca.ajce.in', '$2y$10$5cBxbUh2PhhTK0013cmvneDeSJJmNPsyYCl6kDbCxn2b6RqNT0bzC', 'architect', 'approved', 1, NULL, '/uploads/portfolios/68d4c250e8f94_2222.png', '2025-09-25 04:17:21', '2025-09-25 04:41:39', NULL, 'Urban Planner', 0, NULL, NULL, NULL, '9656819474', NULL, NULL, 'Kottayam', NULL, NULL),
(35, 'SHIJIN', 'THOMAS', NULL, NULL, 'thomasshijin6@gmail.com', '$2y$10$S2jih5XV.2Bb3gfpdji76.xS89SXuglKVpkIpPG9UsrYvU809/ddq', 'homeowner', 'pending', 1, NULL, NULL, '2025-09-28 09:11:23', '2025-09-28 09:11:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 'Thomas', 'Joseph', NULL, NULL, 'thomasshijin281@gmail.com', '$2y$10$89COFm04m7rM9oTBLXdDee8nzohwua1AmFvutXrZXYqi68Dls2adu', 'homeowner', 'pending', 1, NULL, NULL, '2025-10-06 16:00:36', '2025-10-06 16:00:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 'Shijin', 'Thomas', NULL, NULL, 'shijinthomas81@gmail.com', '$2y$10$.tyScF6DTz3gYhm.CcHC3uKG2GHNEz5F1kuegebG/mNJ/KhU9avKy', 'contractor', 'approved', 1, '/uploads/licenses/68e3e7ffec8f6_68b5c450e97c92.78819543_1756742736.pdf', NULL, '2025-10-06 16:02:08', '2025-10-06 16:02:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
-- Indexes for table `contractor_estimate_payments`
--
ALTER TABLE `contractor_estimate_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `homeowner_id` (`homeowner_id`),
  ADD KEY `estimate_id` (`estimate_id`),
  ADD KEY `payment_status` (`payment_status`);

--
-- Indexes for table `contractor_inbox`
--
ALTER TABLE `contractor_inbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contractor_id` (`contractor_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `contractor_layout_sends`
--
ALTER TABLE `contractor_layout_sends`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `contractor_send_estimates`
--
ALTER TABLE `contractor_send_estimates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `send_id` (`send_id`);

--
-- Indexes for table `contractor_send_estimate_files`
--
ALTER TABLE `contractor_send_estimate_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estimate_id` (`estimate_id`);

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
-- Indexes for table `homeowner_notifications`
--
ALTER TABLE `homeowner_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `homeowner_id` (`homeowner_id`),
  ADD KEY `status` (`status`),
  ADD KEY `type` (`type`);

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
-- Indexes for table `layout_payments`
--
ALTER TABLE `layout_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `architect_id` (`architect_id`),
  ADD KEY `idx_layout_payments_homeowner` (`homeowner_id`),
  ADD KEY `idx_layout_payments_design` (`design_id`),
  ADD KEY `idx_layout_payments_status` (`payment_status`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
-- AUTO_INCREMENT for table `contractor_estimate_payments`
--
ALTER TABLE `contractor_estimate_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contractor_inbox`
--
ALTER TABLE `contractor_inbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contractor_layout_sends`
--
ALTER TABLE `contractor_layout_sends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
-- AUTO_INCREMENT for table `contractor_send_estimates`
--
ALTER TABLE `contractor_send_estimates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `contractor_send_estimate_files`
--
ALTER TABLE `contractor_send_estimate_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `designs`
--
ALTER TABLE `designs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `design_comments`
--
ALTER TABLE `design_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `homeowner_notifications`
--
ALTER TABLE `homeowner_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT for table `layout_payments`
--
ALTER TABLE `layout_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `layout_requests`
--
ALTER TABLE `layout_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `layout_request_assignments`
--
ALTER TABLE `layout_request_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

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
-- Constraints for table `layout_payments`
--
ALTER TABLE `layout_payments`
  ADD CONSTRAINT `layout_payments_ibfk_1` FOREIGN KEY (`homeowner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_payments_ibfk_2` FOREIGN KEY (`architect_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `layout_payments_ibfk_3` FOREIGN KEY (`design_id`) REFERENCES `designs` (`id`) ON DELETE CASCADE;

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

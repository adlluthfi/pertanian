-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pertanian
CREATE DATABASE IF NOT EXISTS `pertanian` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pertanian`;

-- Dumping structure for table pertanian.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.cart: ~0 rows (approximately)

-- Dumping structure for table pertanian.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `admin_id` int DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.messages: ~0 rows (approximately)

-- Dumping structure for table pertanian.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `shipping_address` text COLLATE utf8mb4_general_ci NOT NULL,
  `shipping_phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `shipping_notes` text COLLATE utf8mb4_general_ci,
  `status` enum('pending','paid','shipped','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.orders: ~1 rows (approximately)
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `shipping_name`, `shipping_address`, `shipping_phone`, `shipping_notes`, `status`, `created_at`) VALUES
	(28, 4, 800000.00, 'luthfi', 'disini', '09878787', NULL, 'paid', '2025-05-27 10:54:44');

-- Dumping structure for table pertanian.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.order_items: ~0 rows (approximately)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
	(15, 28, 17, 1, 800000.00);

-- Dumping structure for table pertanian.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.payments: ~0 rows (approximately)

-- Dumping structure for table pertanian.payment_details
CREATE TABLE IF NOT EXISTS `payment_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `card_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `card_holder` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expiry_date` varchar(7) COLLATE utf8mb4_general_ci NOT NULL,
  `payment_status` enum('pending','completed','failed') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.payment_details: ~1 rows (approximately)
INSERT INTO `payment_details` (`id`, `order_id`, `card_number`, `card_holder`, `expiry_date`, `payment_status`, `created_at`) VALUES
	(11, 28, '9878789789789787', 'LUTHFI', '11/22', 'completed', '2025-05-27 10:54:57');

-- Dumping structure for table pertanian.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) NOT NULL,
  `category` enum('alat','pupuk','bibit') COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.products: ~13 rows (approximately)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `image`, `stock`, `created_at`) VALUES
	(7, 'pupuk kompos', 'pupuk kompos biasa ajah', 30000.00, 'pupuk', '683584205c727.jpeg', 50, '2025-05-27 09:21:36'),
	(8, 'pupuk atom', 'pupuk renyah yang bisa untuk menyuburkan tanah meskipun telah terkontaminasi little boy', 40000.00, 'pupuk', '6835846f697b4.jpeg', 90, '2025-05-27 09:22:55'),
	(9, 'pupuk sachet', 'pupuk harga ekonomis dan juga pas untuk pot manapun', 2000.00, 'pupuk', '683584f929eb5.jpeg', 55, '2025-05-27 09:25:13'),
	(10, 'pupuk botol', 'pupuk yang bisa menyegarkan tanaman dan juga bisa untuk menjaga daya tahan tanaman', 15000.00, 'pupuk', '68358546cbdd3.jpeg', 77, '2025-05-27 09:26:30'),
	(11, 'bibit kacang', 'bibit yang di besarkan oleh sendiri', 3000.00, 'bibit', '6835865840da4.jpeg', 70, '2025-05-27 09:31:04'),
	(12, 'bibit merah', 'bibit random yang di cat warna merah agar menambah estetika', 5000.00, 'bibit', '6835868f07778.jpeg', 90, '2025-05-27 09:31:59'),
	(13, 'bibit per cm', 'bibit random yang kami jual per cm', 7000.00, 'bibit', '683586b7db9d0.jpeg', 53, '2025-05-27 09:32:39'),
	(14, 'penanam bibit', 'alat ini dikhususkan untuk menanam padi dengan cara yang efisien sehingga dapat untuk memangkas sumber daya manusia yang tidak diperlukan dalam pertanian sawah', 499997.00, 'alat', '68358f1d5c7c7.jpeg', 60, '2025-05-27 10:08:29'),
	(15, 'bibit sintetis', 'bibit yang bisa ditanam tapi tidak akan tumbuh karena bibit ini dibuat dari plastik', 8000.00, 'bibit', '6835958f3085c.jpeg', 300, '2025-05-27 10:35:59'),
	(16, 'bibit unggul', 'bibit yang sangat tangguh dan dapat tumbuh di segala kondisi', 7000.00, 'bibit', '683595e354204.jpeg', 69, '2025-05-27 10:37:23'),
	(17, 'pembajak ladang', 'alat khusus untuk membajak ladanag dan berkualitas internasional di sertifikasi langsung oleh world bank', 800000.00, 'alat', '6835964c69a48.jpeg', 38, '2025-05-27 10:39:08'),
	(18, 'pembajak sawah', 'alat yang sangat handal dalam menangani tanah agar terbajak dengan sempurna', 400000.00, 'alat', '683596b611946.jpeg', 80, '2025-05-27 10:40:54'),
	(19, 'perkakas kebun', 'perkakas lengkap untuk segala kebutuhan berkebun dan sangat praktis sehingga tidak merepotkan saat dipakai disertai dengan genggaman yang sangat efisien sehingga pengguna tidak merasakan sakit ketika memakainya', 40000.00, 'alat', '683597282de1d.jpeg', 700, '2025-05-27 10:42:48');

-- Dumping structure for table pertanian.trainings
CREATE TABLE IF NOT EXISTS `trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `date` date NOT NULL,
  `time` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quota` int NOT NULL,
  `registered` int DEFAULT '0',
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.trainings: ~3 rows (approximately)
INSERT INTO `trainings` (`id`, `title`, `description`, `date`, `time`, `location`, `quota`, `registered`, `image`, `status`, `created_at`) VALUES
	(2, 'Workshop Hidroponik', 'Pelatihan sistem hidroponik untuk budidaya sayuran. Peserta akan belajar setup sistem, nutrisi, dan maintenance.', '2025-06-20', '08:00 - 14:00', 'Green House Center Jl. Taman No. 45', 25, 1, 'assets/images/trainings/hidroponik.jpg', 'active', '2025-05-21 04:23:34'),
	(3, 'Pelatihan Budidaya Jamur Tiram', 'Pembelajaran komprehensif tentang budidaya jamur tiram dari pembuatan baglog hingga panen dan pengolahan hasil.', '2025-06-25', '10:00 - 16:00', 'Pusat Pelatihan Pertanian Jl. Kebun No. 67', 20, 0, 'assets/images/trainings/jamur.jpg', 'active', '2025-05-21 04:23:34');

-- Dumping structure for table pertanian.training_registrations
CREATE TABLE IF NOT EXISTS `training_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `training_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_registration` (`training_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `training_registrations_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`),
  CONSTRAINT `training_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.training_registrations: ~0 rows (approximately)
INSERT INTO `training_registrations` (`id`, `training_id`, `user_id`, `status`, `created_at`) VALUES
	(1, 2, 4, 'pending', '2025-05-21 04:24:12');

-- Dumping structure for table pertanian.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pertanian.users: ~4 rows (approximately)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `token`) VALUES
	(2, 'aku', 'aku@gmail.com', '$2y$10$YA9Sd0DjHLlLpd0apr6e/OyJU8qyvCcScgqkIbPbdIhMqIKS39DDG', 'ae449ff235517dd48b5999410587d3c3a4af921c60a5da19f3fb1e8931794c96'),
	(3, 'saya', 'saya@gmail.com', '$2y$10$f/ZsP5ONrYrtLYeSsaiaAe5PcPZh2ovWwg5KlCRUbQM9dqx23mfWm', NULL),
	(4, 'luthfi', 'luthfi@gmail.com', '$2y$10$eBJ2Os6u8ePVtG02EiGCSuP81nxjXi.dpB0.cc0R5iuVtdjJQN35G', '7131d36778173b66912f53c1700efd3e1cf8d14509c8fb9f3eb66b843bfdc989'),
	(5, 'jihan', 'jihan@gmail.com', '$2y$10$XIZb9HuCScZQBy7ZbCL7DeaT5pnS5DszCkzG3f3xE6.y0ChIjN0n2', '76271311b1b11a8601777d475fccb9887ad06366523185f56b6f81fba7c49218');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

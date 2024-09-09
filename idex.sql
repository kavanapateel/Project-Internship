-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2024 at 07:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `idex`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(4, 'admin', '$2b$10$2z5ESN7oIFYd2eJSWI5BSObzdF4YFcKhKK0dfMk1RBGji93BlryjG'),
(5, 'admin1', '$2b$10$82MuBtKsrDGFlSTC6dKeBOd8cmmLZ7oAcI0brYllpUlSzht9rd5JO');

-- --------------------------------------------------------

--
-- Table structure for table `linesm`
--

CREATE TABLE `linesm` (
  `id` int(11) NOT NULL,
  `line` varchar(30) NOT NULL,
  `line_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `linesm`
--

INSERT INTO `linesm` (`id`, `line`, `line_description`) VALUES
(11, 'line1', '10 products'),
(12, 'line3', '12 products'),
(13, 'line2', '8 products'),
(14, 'line4', '4 products');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `description`) VALUES
(21, 'Zone 2', 'testing');

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

CREATE TABLE `parts` (
  `id` int(11) NOT NULL,
  `part_number` varchar(30) NOT NULL,
  `operation` varchar(40) NOT NULL,
  `cycle_time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parts`
--

INSERT INTO `parts` (`id`, `part_number`, `operation`, `cycle_time`) VALUES
(5, '1823', 'Assembly', 120),
(6, '1765', 'Testing', 241);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productID` int(11) NOT NULL,
  `productName` varchar(30) DEFAULT NULL,
  `zone1_ideal` double DEFAULT NULL,
  `zone2_ideal` double DEFAULT NULL,
  `zone3_ideal` double DEFAULT NULL,
  `zone4_ideal` double DEFAULT NULL,
  `zone5_ideal` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productID`, `productName`, `zone1_ideal`, `zone2_ideal`, `zone3_ideal`, `zone4_ideal`, `zone5_ideal`) VALUES
(101, 'Trolley', 1000, 2000, 3000, 4000, 5000),
(4093, 'product3', 100000, 200000, 211000, 312000, 222000),
(6210, 'product2', 102000, 21000, 12000, 18000, 22000),
(8906, 'Box', 10000, 5000, 6000, 2000, 7000),
(9803, 'product1', 10000, 20000, 10000, 14000, 6000);

-- --------------------------------------------------------

--
-- Table structure for table `product_checkpoints`
--

CREATE TABLE `product_checkpoints` (
  `id` int(11) NOT NULL,
  `productID` int(11) DEFAULT NULL,
  `line` varchar(10) NOT NULL,
  `zone1_ET` datetime DEFAULT NULL,
  `zone2_ET` datetime DEFAULT NULL,
  `zone3_ET` datetime DEFAULT NULL,
  `zone4_ET` datetime DEFAULT NULL,
  `zone5_ET` datetime DEFAULT NULL,
  `zone5_QT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_checkpoints`
--

INSERT INTO `product_checkpoints` (`id`, `productID`, `line`, `zone1_ET`, `zone2_ET`, `zone3_ET`, `zone4_ET`, `zone5_ET`, `zone5_QT`) VALUES
(20, 8906, 'line2', '2024-08-22 20:46:34', '2024-08-22 20:47:09', '2024-08-22 20:47:25', '2024-08-22 20:47:32', '2024-08-22 20:47:40', '2024-08-22 20:47:44'),
(21, 8906, 'line2', '2024-08-25 21:59:34', '2024-08-25 22:00:51', NULL, NULL, NULL, NULL),
(22, 9803, 'line1', '2024-08-25 22:02:23', '2024-08-25 22:03:08', '2024-08-25 22:04:35', '2024-08-25 22:05:58', '2024-08-25 22:06:24', '2024-08-25 22:06:35'),
(23, 9803, 'line1', '2024-08-25 22:06:55', '2024-08-25 22:07:03', '2024-08-25 22:07:40', NULL, NULL, NULL),
(24, 8906, 'line2', '2024-08-25 22:22:58', '2024-08-25 22:23:33', '2024-08-25 22:23:58', '2024-08-25 22:24:44', '2024-08-25 22:25:32', '2024-08-25 22:25:45'),
(25, 8906, 'line2', '2024-08-25 22:26:02', '2024-08-25 22:26:49', '2024-08-25 22:27:18', '2024-08-25 22:28:06', NULL, NULL),
(26, 8906, 'line2', '2024-08-25 22:28:36', '2024-08-25 22:29:02', '2024-08-25 22:29:45', NULL, NULL, NULL),
(27, 6210, 'line3', '2024-08-25 22:32:12', '2024-08-25 22:32:51', '2024-08-25 22:33:04', '2024-08-25 22:33:15', '2024-08-25 22:33:23', '2024-08-25 22:34:02'),
(28, 4093, 'line4', '2024-08-25 22:34:28', '2024-08-25 22:35:13', '2024-08-25 22:35:22', '2024-08-25 22:35:28', '2024-08-25 22:35:48', '2024-08-25 22:36:00'),
(29, 6210, 'line3', '2024-08-25 23:07:54', '2024-08-25 23:08:10', NULL, NULL, NULL, NULL),
(30, 8906, 'line2', '2024-08-25 23:25:16', '2024-08-25 23:25:57', '2024-08-25 23:26:08', '2024-08-25 23:26:35', NULL, NULL),
(31, 9803, 'line1', '2024-08-25 23:35:01', '2024-08-25 23:36:39', '2024-08-25 23:36:59', '2024-08-25 23:37:21', '2024-08-25 23:37:47', NULL),
(32, 4093, 'line4', '2024-08-25 23:38:12', '2024-08-25 23:39:47', '2024-08-25 23:39:58', '2024-08-25 23:40:15', NULL, NULL),
(33, 9803, 'line1', '2024-08-25 23:46:47', '2024-08-26 19:47:38', '2024-08-26 19:35:22', '2024-08-26 19:35:05', '2024-08-26 19:35:07', '2024-08-26 19:35:09'),
(34, 9803, 'line1', '2024-08-26 19:49:44', '2024-08-26 19:49:54', '2024-08-26 19:50:51', NULL, NULL, NULL),
(35, 9803, 'line1', '2024-08-26 19:51:24', '2024-08-26 19:51:58', NULL, NULL, NULL, NULL),
(36, 9803, 'line1', '2024-08-26 19:54:38', '2024-08-26 19:54:55', '2024-08-26 19:55:28', '2024-08-26 19:56:04', '2024-08-26 19:56:59', '2024-08-26 19:57:39'),
(37, 9803, 'line1', '2024-08-26 19:57:59', '2024-08-26 20:00:01', '2024-08-26 20:00:18', '2024-08-26 20:00:58', '2024-08-26 20:01:32', '2024-08-26 20:02:38'),
(38, 9803, 'line1', '2024-08-27 11:18:24', '2024-08-27 11:19:35', '2024-08-27 11:21:15', '2024-08-27 11:21:51', '2024-08-27 11:24:28', '2024-08-27 11:24:52'),
(39, 9803, 'line1', '2024-08-27 11:25:19', '2024-08-27 11:25:51', '2024-08-27 11:26:21', '2024-08-27 11:27:24', NULL, NULL),
(40, 9803, 'line1', '2024-08-27 11:27:49', '2024-08-27 11:29:15', '2024-08-27 11:29:45', '2024-08-27 11:30:07', '2024-08-27 11:30:47', NULL),
(41, 9803, 'line1', '2024-08-27 11:32:29', '2024-08-27 11:33:42', '2024-08-27 11:34:00', '2024-08-27 11:34:52', NULL, NULL),
(42, 9803, 'line1', '2024-08-27 11:35:23', '2024-08-27 11:36:13', '2024-08-27 11:36:59', NULL, NULL, NULL),
(43, 9803, 'line1', '2024-08-27 11:37:28', '2024-08-27 11:37:59', '2024-08-27 11:38:44', '2024-08-27 11:39:13', '2024-08-27 11:40:08', '2024-08-27 11:40:54'),
(44, 9803, 'line1', '2024-08-27 11:41:06', '2024-08-27 11:42:17', '2024-08-27 11:42:52', '2024-08-27 11:43:13', '2024-08-27 11:43:25', NULL),
(45, 9803, 'line1', '2024-08-27 11:44:14', '2024-08-27 11:44:52', NULL, NULL, NULL, NULL),
(46, 9803, 'line1', '2024-08-28 11:22:31', NULL, NULL, NULL, NULL, NULL),
(47, 8906, 'line2', '2024-08-28 11:37:40', NULL, NULL, NULL, NULL, NULL),
(48, 8906, 'line2', '2024-08-28 11:38:08', '2024-08-28 11:38:54', '2024-08-28 11:39:41', '2024-08-28 11:39:59', '2024-08-28 11:40:14', NULL),
(49, 6210, 'line3', '2024-08-28 11:40:49', '2024-08-28 11:41:51', '2024-08-28 11:42:07', '2024-08-28 11:42:44', '2024-08-28 11:43:28', NULL),
(50, 6210, 'line3', '2024-08-28 11:43:50', '2024-08-28 11:44:47', '2024-08-28 11:45:11', '2024-08-28 11:45:52', NULL, NULL),
(51, 6210, 'line3', '2024-08-28 11:46:22', '2024-08-28 11:47:27', '2024-08-28 11:47:58', NULL, NULL, NULL),
(52, 6210, 'line3', '2024-08-28 11:48:23', NULL, NULL, NULL, NULL, NULL),
(53, 6210, 'line3', '2024-08-28 11:48:46', '2024-08-28 11:48:55', NULL, NULL, NULL, NULL),
(54, 6210, 'line3', '2024-08-28 11:49:10', NULL, NULL, NULL, NULL, NULL),
(55, 6210, 'line3', '2024-08-28 11:49:45', NULL, NULL, NULL, NULL, NULL),
(56, 4093, 'line4', '2024-08-28 11:50:23', NULL, NULL, NULL, NULL, NULL),
(57, 4093, 'line4', '2024-08-28 11:50:46', '2024-08-28 11:52:08', '2024-08-28 11:52:39', '2024-08-28 11:52:49', '2024-08-28 11:52:57', NULL),
(58, 4093, 'line4', '2024-08-28 11:53:10', '2024-08-28 11:54:02', '2024-08-28 11:54:15', '2024-08-28 11:54:26', NULL, NULL),
(59, 4093, 'line4', '2024-08-28 11:54:40', '2024-08-28 11:55:04', NULL, NULL, NULL, NULL),
(60, 4093, 'line4', '2024-08-28 11:55:23', '2024-08-28 11:56:25', '2024-08-28 11:57:19', NULL, NULL, NULL),
(61, 4093, 'line4', '2024-08-28 11:57:33', '2024-08-28 11:58:00', NULL, NULL, NULL, NULL),
(62, 4093, 'line4', '2024-08-28 11:58:15', '2024-08-28 11:59:07', '2024-08-28 11:59:53', '2024-08-28 12:00:08', NULL, NULL),
(63, 4093, 'line4', '2024-08-28 12:00:26', '2024-08-28 12:01:24', NULL, NULL, NULL, NULL),
(64, 4093, 'line4', '2024-08-28 12:01:53', NULL, NULL, NULL, NULL, NULL),
(65, 8906, 'line2', '2024-08-28 12:02:32', NULL, NULL, NULL, NULL, NULL),
(66, 8906, 'line2', '2024-08-28 12:03:27', '2024-08-28 12:03:43', NULL, NULL, NULL, NULL),
(67, 6210, 'line3', '2024-08-28 12:04:14', '2024-08-28 12:04:37', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `readers`
--

CREATE TABLE `readers` (
  `id` int(11) NOT NULL,
  `location` varchar(30) NOT NULL,
  `readerName` varchar(30) NOT NULL,
  `readerIp` varchar(20) NOT NULL,
  `readerTag` varchar(30) NOT NULL,
  `terminalReader` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `readers`
--

INSERT INTO `readers` (`id`, `location`, `readerName`, `readerIp`, `readerTag`, `terminalReader`) VALUES
(4, 'assembly', 'Wifi', '198:98:01:0', '7895', 0);

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `slNo` varchar(10) NOT NULL,
  `workPartNumber` text NOT NULL,
  `partNumber` text NOT NULL,
  `line` varchar(10) NOT NULL,
  `quantity` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `records`
--

INSERT INTO `records` (`id`, `slNo`, `workPartNumber`, `partNumber`, `line`, `quantity`, `startDate`, `endDate`) VALUES
(16, '31', '8906', '3212', 'line2', 12, '2024-06-07', '2024-06-11'),
(17, '23', '9803', '1023', 'line1', 20, '2024-08-25', '2024-09-02'),
(18, '902', '6210', '1920', 'line3', 17, '2024-08-20', '2024-09-16'),
(20, '11', '4093', '1922', 'line4', 18, '2024-08-24', '2024-09-07'),
(23, '13', '2230', '2112', 'line1', 10, '2024-08-24', '2024-08-24');

-- --------------------------------------------------------

--
-- Table structure for table `rfidlist`
--

CREATE TABLE `rfidlist` (
  `ID` int(11) NOT NULL,
  `Zone` int(11) NOT NULL,
  `RFIDName` text NOT NULL,
  `RFIDNumber` text NOT NULL,
  `Line` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfidlist`
--

INSERT INTO `rfidlist` (`ID`, `Zone`, `RFIDName`, `RFIDNumber`, `Line`) VALUES
(18, 4, 'box', '6210', '3'),
(16, 1, 'boxes', '8906', '2'),
(17, 2, 'trolley', '9803', '1');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `tagType` varchar(30) NOT NULL,
  `tagDescription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `tagType`, `tagDescription`) VALUES
(3, 'Product Tag', 'products entry'),
(4, 'Reader Tag', 'count tag'),
(5, 'Trolley Tag', 'Trolley');

-- --------------------------------------------------------

--
-- Table structure for table `trolleys`
--

CREATE TABLE `trolleys` (
  `id` int(11) NOT NULL,
  `trolleyNumber` varchar(20) NOT NULL,
  `trolleyName` varchar(30) NOT NULL,
  `trolleyDescription` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trolleys`
--

INSERT INTO `trolleys` (`id`, `trolleyNumber`, `trolleyName`, `trolleyDescription`) VALUES
(8, '23', 'Testing', '5 trolley entry');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `linesm`
--
ALTER TABLE `linesm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `product_checkpoints`
--
ALTER TABLE `product_checkpoints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `readers`
--
ALTER TABLE `readers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfidlist`
--
ALTER TABLE `rfidlist`
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trolleys`
--
ALTER TABLE `trolleys`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `linesm`
--
ALTER TABLE `linesm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_checkpoints`
--
ALTER TABLE `product_checkpoints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `readers`
--
ALTER TABLE `readers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `trolleys`
--
ALTER TABLE `trolleys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_checkpoints`
--
ALTER TABLE `product_checkpoints`
  ADD CONSTRAINT `product_checkpoints_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`);

--
-- Constraints for table `rfidlist`
--
ALTER TABLE `rfidlist`
  ADD CONSTRAINT `rfidlist_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `records` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

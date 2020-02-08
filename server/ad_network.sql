-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 04, 2020 at 05:58 PM
-- Server version: 5.7.29-0ubuntu0.18.04.1
-- PHP Version: 5.6.40-15+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ad_network`
--

-- --------------------------------------------------------

--
-- Table structure for table `application_ads_mapping`
--

CREATE TABLE `application_ads_mapping` (
  `id` int(11) NOT NULL,
  `app_id` int(11) DEFAULT NULL,
  `data` json DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `application_hit_count`
--

CREATE TABLE `application_hit_count` (
  `id` bigint(100) NOT NULL,
  `app_id` int(11) DEFAULT NULL,
  `request_id` int(11) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `application_master`
--

CREATE TABLE `application_master` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(555) DEFAULT NULL,
  `package` varchar(555) DEFAULT NULL,
  `fcm` varchar(555) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `type` tinyint(1) DEFAULT '1' COMMENT '1 = Android, 2 = IOS, 3 = Both',
  `is_live` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = Yes, 0 = No',
  `owner` enum('advertiser','publisher') DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL COMMENT 'user_master.id',
  `link` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `data` json DEFAULT NULL,
  `web_view` tinyint(1) DEFAULT '0' COMMENT ' 0 = false, 1 = true',
  `privacy` text,
  `other` json DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `custom_ads_mapping`
--

CREATE TABLE `custom_ads_mapping` (
  `id` bigint(25) NOT NULL,
  `publisher_app_id` int(11) DEFAULT NULL,
  `publisher_app_package` varchar(255) DEFAULT NULL,
  `advertiser_app_id` int(11) DEFAULT NULL,
  `advertiser_app_package` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `device_master`
--

CREATE TABLE `device_master` (
  `id` bigint(255) NOT NULL,
  `app_id` int(11) DEFAULT NULL,
  `device_id` varchar(2000) DEFAULT NULL,
  `fcm` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shedule_master`
--

CREATE TABLE `shedule_master` (
  `id` bigint(100) NOT NULL,
  `time` timestamp NULL DEFAULT NULL,
  `time_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = once, 2 = daily, 3 = weekly(sunday), 4 = monthly',
  `run_state` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = false, 1 = true',
  `true_count` int(100) NOT NULL DEFAULT '0',
  `false_count` int(100) NOT NULL DEFAULT '0',
  `user_id` bigint(20) DEFAULT NULL COMMENT 'users_master.id',
  `data` json DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `staff_master`
--

CREATE TABLE `staff_master` (
  `id` int(20) NOT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '1 = Active, 0 = Inactive',
  `create_by` bigint(20) DEFAULT NULL,
  `modify_by` bigint(20) DEFAULT NULL,
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  `first_name` varchar(200) DEFAULT NULL,
  `last_name` varchar(200) DEFAULT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = Male, 1 = Female',
  `address` varchar(500) DEFAULT NULL,
  `mobile_no` varchar(15) DEFAULT NULL,
  `email_id` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users_master`
--

CREATE TABLE `users_master` (
  `id` bigint(20) NOT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '1 = Active, 0 = Inactive',
  `user_type` tinyint(1) DEFAULT NULL COMMENT '1 = Advertise, 2 = Publisher',
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `mobile_no` varchar(15) DEFAULT NULL,
  `create_by` bigint(20) DEFAULT NULL,
  `modify_by` bigint(20) DEFAULT NULL,
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_master`
--

INSERT INTO `users_master` (`id`, `status`, `user_type`, `first_name`, `last_name`, `email_id`, `mobile_no`, `create_by`, `modify_by`, `create_date`, `modify_date`) VALUES
(1, 1, 2, 'Siddharth', 'Makadiya', 'publisher@mailinator.com', '9898989898', 1, NULL, '2020-02-04 17:55:29', NULL),
(2, 1, 1, 'Siddharth', 'Makadiya', 'advertiser@gmail.com', '9898989898', 1, NULL, '2020-02-04 17:56:29', NULL),
(3, 1, 2, 'Dixit', 'savaliya', 'dixit20051998@gmail.com', '7016231822', 1, NULL, '2020-02-04 17:58:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `id` bigint(20) NOT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '1 = Active, 0 = Inactive',
  `user_group` enum('admin','admin_staff','publisher','advertiser') DEFAULT NULL COMMENT 'user can be either Admin, Publiser or Advertiser',
  `user_group_id` int(20) DEFAULT NULL COMMENT 'user_group_id is staff_master id if user_type = admin_staff, users_master.id if type provider or advertiser',
  `user_role_id` int(10) DEFAULT NULL COMMENT 'user_role.id',
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `avatar` varchar(250) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `mobile_no` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `secret_key` varchar(500) DEFAULT NULL COMMENT 'secret_key used to identify user entity',
  `access_token` varchar(255) DEFAULT NULL COMMENT 'access_token_hash',
  `refresh_token` varchar(255) DEFAULT NULL COMMENT 'refresh_token_hash',
  `expire_time` timestamp NULL DEFAULT NULL COMMENT '	token expire time',
  `create_by` bigint(20) DEFAULT NULL,
  `modify_by` bigint(20) DEFAULT NULL,
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `modify_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`id`, `status`, `user_group`, `user_group_id`, `user_role_id`, `first_name`, `last_name`, `username`, `avatar`, `email_id`, `mobile_no`, `password`, `secret_key`, `access_token`, `refresh_token`, `expire_time`, `create_by`, `modify_by`, `create_date`, `modify_date`) VALUES
(1, 1, 'admin', NULL, 1, 'Hardik', 'Ahir', 'hardikahir', NULL, 'hardik797@gmail.com', NULL, '$2a$05$KE8MrA.KnHqctw3pBJax7uqEv2bg29oBGbY8ySSSJv8UoegB6jGx6', NULL, NULL, NULL, NULL, NULL, 1, '2019-09-07 07:25:45', '2019-12-16 14:49:57'),
(2, 1, 'admin', NULL, 1, 'Dixit', 'Savaliya', 'adNetwork', 'User/flOunv.jpg', 'dixit20051998@gmail.com', '9726275280', '$2a$05$ZiXgauVzjzaLTJ/p7DwDY.683jvqLTgOls3EJeDjq4Kyi3YFGpP1.', 'Ml9hZG1pbl9udWxsXzE=', 'ojjybP891v52ncFk(ZJ33e2yrFBoMfM7', 'wIWyBkiXCWm8Xt0h{Pk7hb83HOmimuws', '2020-02-04 13:12:22', 1, 2, '2019-09-07 07:25:45', '2020-02-04 16:42:22'),
(17, 1, 'publisher', 1, 3, 'Siddharth', 'Makadiya', '', NULL, 'publisher@mailinator.com', '9898989898', '$2a$05$8kAkOIGhUZe54XkHPeWVe.C2edVEh0V9jBRbaIDwVeNCLecg7AOs2', 'MTdfcHVibGlzaGVyXzFfMw==', '9f1AScTMoPirWPpH)zzXlbZqEv2cJkbn', 'hPBR5xcexW5yxn0T}UsnkvxFXMK2mA2N', '2020-02-04 14:25:35', 1, NULL, '2020-02-04 17:55:29', '2020-02-04 17:55:35'),
(18, 1, 'advertiser', 2, 2, 'Siddharth', 'Makadiya', '', NULL, 'advertiser@gmail.com', '9898989898', '$2a$05$fxZutkivoLtGUCXiYwK03e9tVC9EdA9Y0VOuCNsRiODuFlfv29yjS', 'MThfYWR2ZXJ0aXNlcl8yXzI=', 'XMr1cWyW2IXQK0BS*5scMqldfFKZ4JiB', 'jsK2fXDk8wUNNRwO)P68Pd0RkVaGP1O6', '2020-02-04 14:26:42', 1, NULL, '2020-02-04 17:56:29', '2020-02-04 17:56:42'),
(19, 1, 'publisher', 3, 3, 'Dixit', 'savaliya', '', NULL, 'dixit20051998@gmail.com', '7016231822', '$2a$05$7xgrvGE6PQE8BBUzuRdpGOh64dIOeRswoaFH9bV9ZKSKPPySkke12', 'MTlfcHVibGlzaGVyXzNfMw==', 'RINykT7Vs9l3EVvV*KPFwKzF0bLnc09i', 'nsMLVCLGToUEdFlZ{AcrvZZxu1jBP5N3', '2020-02-04 14:28:40', 1, NULL, '2020-02-04 17:58:35', '2020-02-04 17:58:40');

-- --------------------------------------------------------

--
-- Table structure for table `user_right`
--

CREATE TABLE `user_right` (
  `id` int(11) NOT NULL COMMENT 'auto incremental id',
  `name` varchar(100) NOT NULL DEFAULT '',
  `display_name` varchar(1000) DEFAULT NULL,
  `group_name` varchar(200) DEFAULT NULL,
  `group_display_name` varchar(200) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL COMMENT '0 = chemist_panel, 1 = doctor_panel, 2 = admin_panel',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = Web App Right, 1 = Mobile App Right',
  `modify_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_right`
--

INSERT INTO `user_right` (`id`, `name`, `display_name`, `group_name`, `group_display_name`, `type`, `status`, `modify_date`) VALUES
(3, 'user_role', 'User Role', 'User Role', 'User Role Management', 2, 0, '2019-09-07 07:25:45'),
(4, 'user_right', 'User Right', 'User Right', 'User Right Management', 2, 0, '2019-09-07 07:25:45'),
(5, 'role_to_right', 'User Role To Right', 'User Role To Right', 'User Role To Right Management', 2, 0, '2019-09-07 07:25:45'),
(6, 'settings', 'Settings', 'Settings', 'Settings Management', 2, 0, '2019-09-07 07:25:45'),
(7, 'right_management', 'Right Management', 'Right Management', 'Right Management', 2, 0, '2019-09-07 07:25:45'),
(11, 'profile', 'Profile', 'User', 'User Profile Management', 2, 0, '2019-09-07 07:25:45'),
(166, 'application', 'application', 'Application', 'Application', 2, 0, '2020-02-04 11:44:24'),
(167, 'dashboard', 'Dashboard', 'Dashboard', 'Dashboard', 2, 0, '2020-02-04 11:44:25'),
(168, 'advertiser', 'Advertiser', 'Advertiser', 'Advertiser', 2, 0, '2020-02-04 11:44:26'),
(169, 'publisher', 'Publisher', 'Publisher', 'Publisher', 2, 0, '2020-02-04 11:44:28'),
(170, 'advertisement', 'Advertisement', 'Advertisement', 'advertisement', 2, 0, '2020-02-04 11:44:29'),
(171, 'notification', 'Notification', 'Notification', 'Notification', 2, 0, '2020-02-04 11:44:30'),
(177, 'custom-ads', 'Custom Ads', 'custom-ads', 'custom-ads', 2, 0, '2020-02-04 11:44:31'),
(178, 'monetization', 'Monetization', 'monetization', 'monetization', 2, 0, '2020-02-04 11:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` int(10) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `modifiable` tinyint(1) DEFAULT '1' COMMENT ' 1= true, 0 = false',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 => Active, 0 => Inactive',
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'inserted timestamp',
  `modify_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'updated timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `name`, `modifiable`, `status`, `create_date`, `modify_date`) VALUES
(1, 'Admin', 0, 1, '2019-09-07 07:25:45', '2019-08-19 12:55:14'),
(2, 'Advertiser', 0, 1, '2019-09-07 07:25:45', '2019-12-20 04:17:30'),
(3, 'Publisher', 0, 1, '2019-12-10 10:18:40', '2019-12-20 04:17:41');

-- --------------------------------------------------------

--
-- Table structure for table `user_role_to_right`
--

CREATE TABLE `user_role_to_right` (
  `id` bigint(20) NOT NULL,
  `user_role_id` int(10) DEFAULT NULL COMMENT 'FK => user.id',
  `user_right` int(11) DEFAULT NULL COMMENT 'FK => user_right.name',
  `read` tinyint(1) DEFAULT '0',
  `write` tinyint(1) DEFAULT '0',
  `delete` tinyint(1) DEFAULT '0',
  `import` tinyint(1) DEFAULT '0',
  `export` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_role_to_right`
--

INSERT INTO `user_role_to_right` (`id`, `user_role_id`, `user_right`, `read`, `write`, `delete`, `import`, `export`) VALUES
(26207, 1, 168, 1, 1, 1, 1, 1),
(26208, 1, 166, 1, 1, 1, 1, 1),
(26209, 1, 167, 1, 1, 1, 1, 1),
(26210, 1, 169, 1, 1, 1, 1, 1),
(26211, 1, 6, 1, 1, 1, 1, 1),
(26212, 1, 11, 1, 1, 1, 1, 1),
(26213, 1, 4, 1, 1, 1, 1, 1),
(26214, 1, 3, 1, 1, 1, 1, 1),
(26215, 1, 5, 1, 1, 1, 1, 1),
(26216, 3, 170, 1, 1, 1, 1, 1),
(26217, 3, 166, 1, 1, 1, 1, 1),
(26218, 3, 177, 1, 1, 1, 1, 1),
(26219, 3, 167, 1, 1, 1, 1, 1),
(26220, 3, 178, 1, 1, 1, 1, 1),
(26221, 3, 171, 1, 1, 1, 1, 1),
(26222, 3, 11, 1, 1, 1, 1, 1),
(26223, 2, 166, 1, 1, 1, 1, 1),
(26224, 2, 167, 1, 1, 1, 1, 1),
(26225, 2, 11, 1, 1, 1, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_ads_mapping`
--
ALTER TABLE `application_ads_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_id` (`app_id`);

--
-- Indexes for table `application_hit_count`
--
ALTER TABLE `application_hit_count`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_id` (`app_id`),
  ADD KEY `create` (`request_id`);

--
-- Indexes for table `application_master`
--
ALTER TABLE `application_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `custom_ads_mapping`
--
ALTER TABLE `custom_ads_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `publisher_app_id` (`publisher_app_id`),
  ADD KEY `advertise_app_id` (`advertiser_app_id`);

--
-- Indexes for table `device_master`
--
ALTER TABLE `device_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_id` (`app_id`);

--
-- Indexes for table `shedule_master`
--
ALTER TABLE `shedule_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `staff_master`
--
ALTER TABLE `staff_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `modify_by` (`modify_by`),
  ADD KEY `create_by` (`create_by`);

--
-- Indexes for table `users_master`
--
ALTER TABLE `users_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_id` (`user_role_id`),
  ADD KEY `user_group_id` (`user_group_id`),
  ADD KEY `user_group` (`user_group`);

--
-- Indexes for table `user_right`
--
ALTER TABLE `user_right`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name_2` (`name`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_role_to_right`
--
ALTER TABLE `user_role_to_right`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_group_id` (`user_role_id`),
  ADD KEY `right` (`user_right`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application_ads_mapping`
--
ALTER TABLE `application_ads_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `application_hit_count`
--
ALTER TABLE `application_hit_count`
  MODIFY `id` bigint(100) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `application_master`
--
ALTER TABLE `application_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `custom_ads_mapping`
--
ALTER TABLE `custom_ads_mapping`
  MODIFY `id` bigint(25) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `device_master`
--
ALTER TABLE `device_master`
  MODIFY `id` bigint(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `shedule_master`
--
ALTER TABLE `shedule_master`
  MODIFY `id` bigint(100) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `staff_master`
--
ALTER TABLE `staff_master`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users_master`
--
ALTER TABLE `users_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user_master`
--
ALTER TABLE `user_master`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `user_right`
--
ALTER TABLE `user_right`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto incremental id', AUTO_INCREMENT=185;
--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user_role_to_right`
--
ALTER TABLE `user_role_to_right`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26226;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_ads_mapping`
--
ALTER TABLE `application_ads_mapping`
  ADD CONSTRAINT `application_ads_mapping_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `application_master` (`id`);

--
-- Constraints for table `application_hit_count`
--
ALTER TABLE `application_hit_count`
  ADD CONSTRAINT `application_hit_count_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `application_master` (`id`),
  ADD CONSTRAINT `application_hit_count_ibfk_2` FOREIGN KEY (`request_id`) REFERENCES `application_master` (`id`);

--
-- Constraints for table `application_master`
--
ALTER TABLE `application_master`
  ADD CONSTRAINT `application_master_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_master` (`id`);

--
-- Constraints for table `custom_ads_mapping`
--
ALTER TABLE `custom_ads_mapping`
  ADD CONSTRAINT `custom_ads_mapping_ibfk_1` FOREIGN KEY (`publisher_app_id`) REFERENCES `application_master` (`id`),
  ADD CONSTRAINT `custom_ads_mapping_ibfk_2` FOREIGN KEY (`advertiser_app_id`) REFERENCES `application_master` (`id`);

--
-- Constraints for table `device_master`
--
ALTER TABLE `device_master`
  ADD CONSTRAINT `device_master_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `application_master` (`id`);

--
-- Constraints for table `shedule_master`
--
ALTER TABLE `shedule_master`
  ADD CONSTRAINT `shedule_master_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_master` (`id`);

--
-- Constraints for table `user_master`
--
ALTER TABLE `user_master`
  ADD CONSTRAINT `FK_User_Role` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

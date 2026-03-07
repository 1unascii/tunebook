-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 02:31 AM
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
-- Database: `tunebook`
--

-- --------------------------------------------------------

--
-- Table structure for table `composers`
--

CREATE TABLE `composers` (
  `composer_id` int(25) NOT NULL,
  `composer_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `composers`
--

INSERT INTO `composers` (`composer_id`, `composer_name`) VALUES
(1, 'Michael Coleman'),
(2, 'Paddy Fahey');

-- --------------------------------------------------------

--
-- Table structure for table `tunes`
--

CREATE TABLE `tunes` (
  `tune_id` int(25) NOT NULL,
  `tune_title` varchar(100) NOT NULL,
  `tune_type_id` int(20) NOT NULL,
  `author_id` int(25) NOT NULL,
  `composer_id` int(25) DEFAULT NULL,
  `metre` varchar(5) NOT NULL,
  `default_note_length` varchar(5) NOT NULL,
  `key` varchar(15) NOT NULL,
  `tune_body` longtext NOT NULL,
  `audio` varchar(500) NOT NULL,
  `video` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tunes`
--

INSERT INTO `tunes` (`tune_id`, `tune_title`, `tune_type_id`, `author_id`, `composer_id`, `metre`, `default_note_length`, `key`, `tune_body`, `audio`, `video`) VALUES
(7, 'Green Fields of America', 1, 33, NULL, '4/4', '1/8', 'G', 'c2ec B2dB | AGAB AGEF| ~G3E DEGB | AGAB AGEG |\nc2ec B2dB | AGAB AGEF | ~G3E DEGA|BGAF G3z :||\nGABc d2ef | gage dBGB | c2ec B2dB | AGAB AGE2 |\n~g3d efge | dcBG AGEF | ~G3E DEGA | BGAF G3z :||\n', 'None', 'None'),
(8, 'Barr Na Cuille', 1, 33, NULL, '4/4', '1/8', 'D', 'G|:FAAF GBdg|fAdf dBAG|FA (3ABA GBdg|fdef d3 G|\nFA (3AAA Bddg|fAdf efdA|FA (3AAA GBdg|fdef d3 g|\n|:faaf gbbg|faag gfed|faaf gbag|fdef d3 g\nfaaf gbbg|faag gfed|fdfa (3bbb bg|fdef dBAG|]', 'None', 'None'),
(10, 'Ruined Old Cottage in the Glen', 1, 33, NULL, '4/4', '1/8', 'E dorian', '|:B2 AF D2 FA|B~A3 (3Bcd ef|dBAF DEFA|BdAF FEEA:|\n|B2 ed BdAd|(3Bcd ef gfed|B2 ed BdAd|(3Bcd AF FEEA|\n|ABed BdAd|(3Bcd ef g2 ga|bg (3agf gfed|BdAF FEEA|', 'None', 'None');

-- --------------------------------------------------------

--
-- Table structure for table `tune_types`
--

CREATE TABLE `tune_types` (
  `tune_type_id` int(3) NOT NULL,
  `tune_type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tune_types`
--

INSERT INTO `tune_types` (`tune_type_id`, `tune_type`) VALUES
(1, 'Reels'),
(2, 'Jig'),
(3, 'Hornpipe'),
(4, 'Air');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(25) NOT NULL,
  `first_name` varchar(75) NOT NULL,
  `last_name` varchar(75) NOT NULL,
  `email` varchar(75) NOT NULL,
  `user_name` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `user_name`, `password`) VALUES
(33, 'Earl', 'Cameron', 'josepheaorle@gmail.com', 'lunascii', '¨V°Í0I í÷GRDþí.r¾'),
(92, 'Joseph', 'Weiner', 'josephearlweiner@gmail.com', '1unascii', '¡hàOT\Zhˆ£íCÍï');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `composers`
--
ALTER TABLE `composers`
  ADD PRIMARY KEY (`composer_id`);

--
-- Indexes for table `tunes`
--
ALTER TABLE `tunes`
  ADD PRIMARY KEY (`tune_id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `composer_id` (`composer_id`),
  ADD KEY `tune_type_id` (`tune_type_id`);

--
-- Indexes for table `tune_types`
--
ALTER TABLE `tune_types`
  ADD PRIMARY KEY (`tune_type_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `composers`
--
ALTER TABLE `composers`
  MODIFY `composer_id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tunes`
--
ALTER TABLE `tunes`
  MODIFY `tune_id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tune_types`
--
ALTER TABLE `tune_types`
  MODIFY `tune_type_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tunes`
--
ALTER TABLE `tunes`
  ADD CONSTRAINT `tunes_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `tunes_ibfk_2` FOREIGN KEY (`tune_type_id`) REFERENCES `tune_types` (`tune_type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

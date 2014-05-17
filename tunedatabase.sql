-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 28, 2013 at 01:07 PM
-- Server version: 5.5.34
-- PHP Version: 5.3.10-1ubuntu3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mytunebook`
--

-- --------------------------------------------------------

--
-- Table structure for table `composers`
--

CREATE TABLE IF NOT EXISTS `composers` (
  `composer_id` int(25) NOT NULL AUTO_INCREMENT,
  `composer_name` varchar(100) NOT NULL,
  PRIMARY KEY (`composer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

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

CREATE TABLE IF NOT EXISTS `tunes` (
  `tune_id` int(25) NOT NULL AUTO_INCREMENT,
  `tune_title` varchar(100) NOT NULL,
  `tune_type` varchar(20) NOT NULL,
  `author_id` int(25) NOT NULL,
  `composer_id` int(25) NOT NULL,
  `metre` varchar(5) NOT NULL,
  `default_note_length` varchar(5) NOT NULL,
  `key` varchar(15) NOT NULL,
  `tune_body` longtext NOT NULL,
  `audio` varchar(500) NOT NULL,
  `video` varchar(500) NOT NULL,
  PRIMARY KEY (`tune_id`),
  KEY `author_id` (`author_id`),
  KEY `composer_id` (`composer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `tunes`
--

INSERT INTO `tunes` (`tune_id`, `tune_title`, `tune_type`, `author_id`, `composer_id`, `metre`, `default_note_length`, `key`, `tune_body`, `audio`, `video`) VALUES
(7, 'Green Fields of America', 'Reel', 33, 0, '4/4', '1/8', 'G', 'c2ec B2dB | AGAB AGEF| ~G3E DEGB | AGAB AGEG |\nc2ec B2dB | AGAB AGEF | ~G3E DEGA|BGAF G3z :||\nGABc d2ef | gage dBGB | c2ec B2dB | AGAB AGE2 |\n~g3d efge | dcBG AGEF | ~G3E DEGA | BGAF G3z :||\n', 'None', 'None'),
(8, 'Barr Na Cuille', 'None', 33, 0, '4/4', '1/8', 'D', 'G|:FAAF GBdg|fAdf dBAG|FA (3ABA GBdg|fdef d3 G|\nFA (3AAA Bddg|fAdf efdA|FA (3AAA GBdg|fdef d3 g|\n|:faaf gbbg|faag gfed|faaf gbag|fdef d3 g\nfaaf gbbg|faag gfed|fdfa (3bbb bg|fdef dBAG|]', 'None', 'None'),
(9, 'Ruined Old Cottage in the', 'Reel', 33, 0, '4/4', '1/8', 'E dorian', '|:B2 AF D2 FA|B~A3 (3Bcd ef|dBAF DEFA|BdAF FEEA:|\n|B2 ed BdAd|(3Bcd ef gfed|B2 ed BdAd|(3Bcd AF FEEA|\n|ABed BdAd|(3Bcd ef g2 ga|bg (3agf gfed|BdAF FEEA|', 'None', 'None'),
(10, 'Ruined Old Cottage in the Glen', 'Reel', 33, 0, '4/4', '1/8', 'E dorian', '|:B2 AF D2 FA|B~A3 (3Bcd ef|dBAF DEFA|BdAF FEEA:|\n|B2 ed BdAd|(3Bcd ef gfed|B2 ed BdAd|(3Bcd AF FEEA|\n|ABed BdAd|(3Bcd ef g2 ga|bg (3agf gfed|BdAF FEEA|', 'None', 'None');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(25) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(75) NOT NULL,
  `last_name` varchar(75) NOT NULL,
  `email` varchar(75) NOT NULL,
  `user_name` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=91 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `user_name`, `password`) VALUES
(33, 'Earl', 'Cameron', 'josepheaorle@gmail.com', 'lunascii', '¨V°Í0I í÷GRDþí.r¾');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tunes`
--
ALTER TABLE `tunes`
  ADD CONSTRAINT `tunes_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

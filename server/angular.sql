-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 10, 2017 at 05:47 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `angular`
--

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE IF NOT EXISTS `note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=66 ;

--
-- Dumping data for table `note`
--

INSERT INTO `note` (`id`, `note`, `created`) VALUES
(36, 'sdfsdf', '2016-03-02 11:00:29'),
(37, 'sdfs', '2016-03-02 11:00:31'),
(38, 'sdfsdf', '2016-03-02 11:00:32'),
(39, 'sdfsdf', '2016-03-02 11:00:33'),
(40, 'sdfsdf', '2016-03-02 11:00:35'),
(41, 'sdfsf', '2016-03-02 11:00:36'),
(42, 'sdfsd', '2016-03-02 11:00:37'),
(43, 'sdfsfsd', '2016-03-02 11:00:38'),
(44, 'sdfsdf', '2016-03-02 11:00:39'),
(45, 'sdfsdffdfsd', '2016-03-02 11:00:41'),
(49, 'r5rytytfyrtyrtyryr', '2016-03-02 11:40:06'),
(50, '<marquee>sdfsd', '2016-03-02 11:40:15'),
(51, '<b>dsd</b>', '2016-03-02 11:40:56'),
(52, 'sdfsdfsdfssdsdfsd', '2016-03-02 11:42:06'),
(53, 'sdfsdfsdfsdfsd', '2016-03-02 11:42:07'),
(58, 'sdfsdfsfsdsdfds', '2016-03-02 13:38:06'),
(59, 'dasdaad', '2016-03-08 12:49:20'),
(60, 'sdfsdf', '2016-03-08 12:49:23'),
(63, 'sdfsd', '2016-03-08 13:40:54'),
(64, 'sdfds', '2016-03-08 13:40:55'),
(65, 'motlals', '2016-03-08 13:40:58');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `sku` varchar(10) DEFAULT NULL,
  `description` text,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=30 ;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `image`, `sku`, `description`, `price`) VALUES
(20, 'dfgfd', '1483449308.jpg', 'dfgfg', 'dfg', 25),
(22, 'lorem 1', '1483422192.jpg', 'sdad', 'lorem spam is simple dummy test', 100),
(23, 'Apple', '1483449290.jpg', 'sdad', 'this is apple fruirt', 12),
(26, 'Banana', '1483514186.jpg', 'B0001', 'The banana is an edible fruit, botanically a berry, produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, bananas used for cooking may be called plantains, in contrast to dessert bananas', 58),
(27, 'sdfsdfgfggdgdf', '1483969875.jpg', 'dfsfd', 'sdfsd', 23),
(28, 'dgdfg', '1483969889.jpg', 'fgd', 'dfgdf', 534),
(29, 'fghgf', '1483969998.jpg', 'fgf', 'fghfgh', 354);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `username`, `password`) VALUES
(1, 'Motilal', 'Soni', 'motilalsoni@gmail.com', 'motilal', '123456'),
(2, 'Kailash', 'malac', 'kal@gmail.com', 'admin', 'admin');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

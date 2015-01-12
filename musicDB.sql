-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 09, 2014 at 04:56 PM
-- Server version: 5.6.16
-- PHP Version: 5.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `musicDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `Albums`
--

CREATE TABLE IF NOT EXISTS `Albums` (
  `aid` char(22) NOT NULL,
  `image_url` char(100) NOT NULL,
  `popularity` int(11) NOT NULL,
  `title` char(40) NOT NULL,
  `release_date` date NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Albums`
--


-- --------------------------------------------------------

--
-- Table structure for table `Artists`
--

CREATE TABLE IF NOT EXISTS `Artists` (
  `id` char(22) NOT NULL,
  `image_url` char(100) NOT NULL,
  `popularity` int(11) NOT NULL,
  `name` char(40) NOT NULL,
  `viewed` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Artists`
--

-- --------------------------------------------------------

--
-- Table structure for table `Influences`
--

CREATE TABLE IF NOT EXISTS `Influences` (
  `pid` char(22) NOT NULL DEFAULT '',
  `cid` char(22) NOT NULL DEFAULT '',
  PRIMARY KEY (`pid`,`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Influences`
--

-- --------------------------------------------------------

--
-- Table structure for table `Releases`
--

CREATE TABLE IF NOT EXISTS `Releases` (
  `id` char(22) NOT NULL DEFAULT '',
  `tid` char(22) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`tid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Tracks`
--

CREATE TABLE IF NOT EXISTS `Tracks` (
  `tid` char(22) NOT NULL,
  `popularity` int(11) NOT NULL,
  `name` char(40) NOT NULL,
  `aid` char(40) NOT NULL,
  PRIMARY KEY (`tid`),
  KEY `aid` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Releases`
--
ALTER TABLE `Releases`
  ADD CONSTRAINT `releases_ibfk_1` FOREIGN KEY (`id`) REFERENCES `Artists` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `releases_ibfk_2` FOREIGN KEY (`tid`) REFERENCES `Tracks` (`tid`) ON UPDATE CASCADE;

--
-- Constraints for table `Tracks`
--
ALTER TABLE `Tracks`
  ADD CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `Albums` (`aid`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

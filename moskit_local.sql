-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2014 at 10:29 AM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `moskit_local`
--

-- --------------------------------------------------------

--
-- Table structure for table `attribute_type`
--

CREATE TABLE IF NOT EXISTS `attribute_type` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `machine_name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `base_attribute_type_code` int(11) DEFAULT NULL,
  `verification_command` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE IF NOT EXISTS `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` text NOT NULL,
  `identification_number` int(11) DEFAULT NULL,
  `is_external` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE IF NOT EXISTS `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_number` varchar(45) DEFAULT NULL,
  `document_type_id` int(11) NOT NULL,
  `current_node_level_id` int(11) NOT NULL,
  `document_author_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`document_author_id`),
  KEY `fk_Document_Document_Type_idx` (`document_type_id`),
  KEY `fk_Document_Node_Level1_idx` (`current_node_level_id`),
  KEY `fk_document_persons1_idx` (`document_author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `document_attribute`
--

CREATE TABLE IF NOT EXISTS `document_attribute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `composite_attribute_id` int(11) DEFAULT NULL,
  `attribute_type_id` int(11) NOT NULL,
  `array_index` int(11) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`id`,`attribute_type_id`,`author_id`,`document_id`),
  KEY `fk_Document_Attribute_Document1_idx` (`document_id`),
  KEY `fk_Document_Attribute_ Attribute_Type1_idx` (`attribute_type_id`),
  KEY `fk_document_attribute_persons1_idx` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `document_ attribute_type`
--

CREATE TABLE IF NOT EXISTS `document_ attribute_type` (
  `document_type_id` int(11) NOT NULL,
  `attribute_type_id` int(11) NOT NULL,
  `min` int(11) DEFAULT NULL,
  `max` int(11) DEFAULT NULL,
  PRIMARY KEY (`document_type_id`,`attribute_type_id`),
  KEY `fk_Document_Type_has_ Attribute_Type_ Attribute_Type1_idx` (`attribute_type_id`),
  KEY `fk_Document_Type_has_ Attribute_Type_Document_Type1_idx` (`document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `document_has_linked_document`
--

CREATE TABLE IF NOT EXISTS `document_has_linked_document` (
  `document_id` int(11) NOT NULL,
  `linked_document_id` int(11) NOT NULL,
  PRIMARY KEY (`document_id`,`linked_document_id`),
  KEY `fk_Document_has_Linked_Document_Linked_Document1_idx` (`linked_document_id`),
  KEY `fk_Document_has_Linked_Document_Document1_idx` (`document_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `document_type`
--

CREATE TABLE IF NOT EXISTS `document_type` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `short_name` varchar(45) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  `default_header` varchar(45) DEFAULT NULL,
  `is_service` tinyint(1) DEFAULT NULL,
  `secrecy_type` int(11) DEFAULT NULL,
  `urgency_type` int(11) DEFAULT NULL,
  `presentation` mediumtext,
  `direction_type_code` int(11) DEFAULT NULL,
  `description` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `linked_document`
--

CREATE TABLE IF NOT EXISTS `linked_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_order` int(11) DEFAULT NULL,
  `linked_document_type_code` int(11) DEFAULT NULL,
  `linked_document_number` int(11) DEFAULT NULL,
  `linked_document_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `node_level`
--

CREATE TABLE IF NOT EXISTS `node_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route` int(11) DEFAULT NULL,
  `node_level_type_id` int(11) NOT NULL,
  `level_order` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Node_Level_Node_Level_Type1_idx` (`node_level_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `node_level_type`
--

CREATE TABLE IF NOT EXISTS `node_level_type` (
  `id` int(11) NOT NULL,
  `code` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `default_node_level_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `node_level_type_rule`
--

CREATE TABLE IF NOT EXISTS `node_level_type_rule` (
  `id` int(11) NOT NULL,
  `node_level_type_id` int(11) NOT NULL,
  `existing_level_type` int(11) DEFAULT NULL,
  `is_exist` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Node_Level_Type_Rule_Node_Level_Type1_idx` (`node_level_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE IF NOT EXISTS `person` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(64) NOT NULL,
  `patronymic_name` varchar(64) DEFAULT NULL,
  `family_name` varchar(64) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(64) DEFAULT NULL,
  `sex_id` int(11) DEFAULT NULL,
  `inn` int(11) DEFAULT NULL,
  `citizenship` varchar(64) DEFAULT NULL,
  `deputy` int(11) DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`client_id`),
  KEY `sex` (`sex_id`),
  KEY `fk_person_client1_idx` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `person_post`
--

CREATE TABLE IF NOT EXISTS `person_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `unit_post_id` int(11) NOT NULL,
  `document` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `person` (`person_id`),
  KEY `unit_post` (`unit_post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE IF NOT EXISTS `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(12) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `rank`
--

CREATE TABLE IF NOT EXISTS `rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(15) DEFAULT NULL,
  `description` text,
  `is_officer` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sex`
--

CREATE TABLE IF NOT EXISTS `sex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE IF NOT EXISTS `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `short_name` varchar(10) DEFAULT NULL,
  `own_numeration` tinyint(1) DEFAULT NULL,
  `is_legal` tinyint(1) DEFAULT NULL,
  `commander` int(11) DEFAULT NULL,
  `deputy` int(11) DEFAULT NULL,
  `on_duty` int(11) DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`client_id`),
  KEY `fk_unit_client1_idx` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `unit_post`
--

CREATE TABLE IF NOT EXISTS `unit_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `stop_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unit` (`unit_id`),
  KEY `post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_Document_Document_Type` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Document_Node_Level1` FOREIGN KEY (`current_node_level_id`) REFERENCES `node_level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_document_persons1` FOREIGN KEY (`document_author_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `document_attribute`
--
ALTER TABLE `document_attribute`
  ADD CONSTRAINT `fk_Document_Attribute_ Attribute_Type1` FOREIGN KEY (`attribute_type_id`) REFERENCES `attribute_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Document_Attribute_Document1` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_document_attribute_persons1` FOREIGN KEY (`author_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `document_ attribute_type`
--
ALTER TABLE `document_ attribute_type`
  ADD CONSTRAINT `fk_Document_Type_has_ Attribute_Type_ Attribute_Type1` FOREIGN KEY (`attribute_type_id`) REFERENCES `attribute_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Document_Type_has_ Attribute_Type_Document_Type1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `document_has_linked_document`
--
ALTER TABLE `document_has_linked_document`
  ADD CONSTRAINT `fk_Document_has_Linked_Document_Document1` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Document_has_Linked_Document_Linked_Document1` FOREIGN KEY (`linked_document_id`) REFERENCES `linked_document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `node_level`
--
ALTER TABLE `node_level`
  ADD CONSTRAINT `fk_Node_Level_Node_Level_Type1` FOREIGN KEY (`node_level_type_id`) REFERENCES `node_level_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `node_level_type_rule`
--
ALTER TABLE `node_level_type_rule`
  ADD CONSTRAINT `fk_Node_Level_Type_Rule_Node_Level_Type1` FOREIGN KEY (`node_level_type_id`) REFERENCES `node_level_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `person_sex` FOREIGN KEY (`sex_id`) REFERENCES `sex` (`id`);

--
-- Constraints for table `person_post`
--
ALTER TABLE `person_post`
  ADD CONSTRAINT `person_post_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `person_post_ibfk_2` FOREIGN KEY (`unit_post_id`) REFERENCES `unit_post` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `fk_unit_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `unit_post`
--
ALTER TABLE `unit_post`
  ADD CONSTRAINT `unit_posts_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `unit_posts_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

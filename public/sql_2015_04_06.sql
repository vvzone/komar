-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2015 at 05:43 PM
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
-- Table structure for table `address`
--

CREATE TABLE IF NOT EXISTS `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime DEFAULT NULL,
  `address` mediumtext,
  `post_code` varchar(45) DEFAULT NULL,
  `is_main` int(1) DEFAULT NULL,
  `address_type_id` int(11) NOT NULL,
  `region_id` int(11) NOT NULL,
  `area` varchar(45) DEFAULT NULL,
  `location_type_id` int(11) NOT NULL,
  `location` varchar(45) DEFAULT NULL,
  `street_type_id` int(11) NOT NULL,
  `street` varchar(45) DEFAULT NULL,
  `house` int(11) DEFAULT NULL,
  `house_suffix` varchar(3) DEFAULT NULL,
  `building` int(11) DEFAULT NULL,
  `flat` int(11) DEFAULT NULL,
  `post_box` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`address_type_id`,`region_id`,`location_type_id`,`street_type_id`),
  KEY `fk_address_address_type1_idx` (`address_type_id`),
  KEY `fk_address_region1_idx` (`region_id`),
  KEY `fk_address_location_type1_idx` (`location_type_id`),
  KEY `fk_address_street_type1_idx` (`street_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `start_date`, `address`, `post_code`, `is_main`, `address_type_id`, `region_id`, `area`, `location_type_id`, `location`, `street_type_id`, `street`, `house`, `house_suffix`, `building`, `flat`, `post_box`) VALUES
(2, '1945-01-01 00:00:00', 'Наро-Фоминск, Кубинское шоссе, улица Пешехонова, в/ч 19612', '143301', 1, 4, 1, 'Кубинское шоссе', 1, 'Наро-Фоминск', 3, 'Пешехонова', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `address_type`
--

CREATE TABLE IF NOT EXISTS `address_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `priotity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `address_type`
--

INSERT INTO `address_type` (`id`, `name`, `priotity`) VALUES
(1, 'Регистрации', 1),
(2, 'Проживания', 2),
(3, 'Почтовый', 3),
(4, 'Юридический', 4),
(5, 'Доставки счетов', NULL),
(6, 'Прописки', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `attribute_type`
--

CREATE TABLE IF NOT EXISTS `attribute_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `machine_name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `base_attribute_type_code` int(11) DEFAULT NULL,
  `verification_command` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `attribute_type`
--

INSERT INTO `attribute_type` (`id`, `name`, `machine_name`, `description`, `base_attribute_type_code`, `verification_command`) VALUES
(1, 'Заголовок', 'header', 'Заголовок документа', NULL, NULL),
(2, 'Основной текст', 'main_text', 'Основной текст документа', NULL, NULL),
(3, 'Координата', 'coordinate', NULL, NULL, NULL),
(4, 'Цвет', 'color', NULL, NULL, NULL),
(5, 'Маршрут', 'route', NULL, NULL, NULL),
(6, 'Азимут', 'azimuth', NULL, NULL, NULL),
(7, 'Аннотация', 'annotation', NULL, NULL, NULL),
(8, 'Номер страницы', 'page_num', NULL, NULL, NULL),
(9, 'Шапка заявления', 'declaration_header', NULL, NULL, NULL),
(10, 'Шапка должностной записки', 'duty_note_header', NULL, NULL, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `full_name`, `identification_number`, `is_external`) VALUES
(7, 'Комбаров Сергей Николаевич', 425434, NULL),
(8, '4-я гвардейская танковая Кантемировская ордена Ленина Краснознамённая дивизия имени Ю.В. Андропова', 19612, NULL),
(12, 'Довлатов Антон Петрович', NULL, NULL),
(21, 'Петрович Иван Сергей', NULL, NULL),
(22, 'Фомина Ольга Ивановна', NULL, NULL),
(23, 'Отдел материально-технического обеспечения', NULL, NULL),
(24, 'Финансово-экономический отдел', NULL, NULL),
(25, 'Петрович Ивано Григорий', NULL, NULL),
(26, 'Генерал-майор', NULL, NULL),
(27, 'Демьяненко Иван Алексеевич', NULL, NULL),
(28, 'Тест', 21312, 1);

-- --------------------------------------------------------

--
-- Table structure for table `client_has_address`
--

CREATE TABLE IF NOT EXISTS `client_has_address` (
  `client_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  PRIMARY KEY (`client_id`,`address_id`),
  KEY `fk_client_has_address_address1_idx` (`address_id`),
  KEY `fk_client_has_address_client1_idx` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `client_has_address`
--

INSERT INTO `client_has_address` (`client_id`, `address_id`) VALUES
(8, 2);

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(8) NOT NULL,
  `name` varchar(16) NOT NULL,
  `full_name` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `code`, `name`, `full_name`) VALUES
(1, '1', 'Армения', 'Армения'),
(2, '7', 'Азейрбаджан', 'Российская Федерация'),
(4, '7', 'Россия', 'Российская Федерация'),
(6, 'Бразилия', 'Бразилия', NULL),
(7, '11', 'Украина', NULL),
(11, '343', 'Уганда', NULL),
(12, '342', 'Зимбабве', NULL),
(13, 'е4545345', 'Труляля', NULL),
(14, 'тест', 'Тест', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `current_document_type`
--

CREATE TABLE IF NOT EXISTS `current_document_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_type_id` int(11) NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `document_type_id` (`document_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `current_document_type`
--

INSERT INTO `current_document_type` (`id`, `document_type_id`, `name`, `short_name`, `code`, `default_header`, `is_service`, `secrecy_type`, `urgency_type`, `presentation`, `direction_type_code`, `description`) VALUES
(1, 1, 'Приказ на списание материальных ценностей', 'Приказ на списание', 11, 'Приказ на списание', NULL, 1, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE IF NOT EXISTS `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `document_author_id` int(11) NOT NULL,
  `document_type_id` int(11) NOT NULL DEFAULT '0',
  `current_document_type_id` int(11) DEFAULT NULL,
  `current_node_level_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`document_author_id`,`document_type_id`,`current_node_level_id`),
  KEY `fk_document_persons1_idx` (`document_author_id`),
  KEY `fk_document_node_level1_idx` (`current_node_level_id`),
  KEY `current_document_type_id` (`current_document_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `name`, `date`, `document_author_id`, `document_type_id`, `current_document_type_id`, `current_node_level_id`) VALUES
(2, 'Списание устаревшей техники', '2014-12-18', 5, 1, 1, 2),
(3, 'Черновик приказа на списание', '2015-02-18', 5, 1, NULL, 1),
(5, 'Черновик на награждение', '2015-02-18', 5, 1, NULL, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `document_attribute`
--

INSERT INTO `document_attribute` (`id`, `composite_attribute_id`, `attribute_type_id`, `array_index`, `author_id`, `document_id`, `data`) VALUES
(1, NULL, 1, NULL, 5, 2, 'Приказ на списание материальных ценностей от 11.12.14'),
(2, NULL, 2, NULL, 5, 2, 'Приказываю списать следующие материальные ценности: \r\n1. Принтер MF-401 инв. номер 124215\r\n2. Системный блок инв. номер 343324');

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

--
-- Dumping data for table `document_type`
--

INSERT INTO `document_type` (`id`, `name`, `short_name`, `code`, `default_header`, `is_service`, `secrecy_type`, `urgency_type`, `presentation`, `direction_type_code`, `description`) VALUES
(1, 'Приказ на списание материальных ценностей', 'Приказ на списание', 11, 'Приказ на списание', NULL, 1, 1, NULL, NULL, NULL),
(2, 'Служебная записка', 'сл. записка', 12, 'Служебная записка', 0, 1, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document_type_attribute_type`
--

CREATE TABLE IF NOT EXISTS `document_type_attribute_type` (
  `document_type_id` int(11) NOT NULL,
  `attribute_type_id` int(11) NOT NULL,
  `min` int(11) DEFAULT NULL,
  `max` int(11) DEFAULT NULL,
  PRIMARY KEY (`document_type_id`,`attribute_type_id`),
  KEY `fk_Document_Type_has_ Attribute_Type_ Attribute_Type1_idx` (`attribute_type_id`),
  KEY `fk_Document_Type_has_ Attribute_Type_Document_Type1_idx` (`document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `document_type_attribute_type`
--

INSERT INTO `document_type_attribute_type` (`document_type_id`, `attribute_type_id`, `min`, `max`) VALUES
(1, 1, 1, 1),
(1, 2, 1, 1),
(2, 1, 1, 1),
(2, 2, 1, 1),
(2, 10, 1, 1);

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
-- Table structure for table `location_type`
--

CREATE TABLE IF NOT EXISTS `location_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `short_name` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `location_type`
--

INSERT INTO `location_type` (`id`, `name`, `short_name`) VALUES
(1, 'город', 'г.'),
(2, 'поселок городского типа', 'пгт'),
(3, 'рабочий поселок', 'р.п.'),
(4, 'кишлак', 'к.'),
(5, 'село', 'с');

-- --------------------------------------------------------

--
-- Table structure for table `menu_client`
--

CREATE TABLE IF NOT EXISTS `menu_client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `entity` varchar(128) DEFAULT NULL,
  `is_not_screen` tinyint(1) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `menu_client`
--

INSERT INTO `menu_client` (`id`, `name`, `entity`, `is_not_screen`, `type`, `parent_id`, `icon`) VALUES
(1, 'Создать документ', 'create_new_document', NULL, 1, NULL, 'glyphicon glyphicon-file'),
(2, 'Входящие', 'inbox', NULL, 2, NULL, 'fa fa-inbox'),
(3, 'Черновики', 'draft', NULL, 2, NULL, 'fa fa-paper-plane'),
(4, 'Исходящие', 'sent', NULL, 2, NULL, 'fa fa-paper-plane'),
(5, 'Уведомления', 'notification', NULL, 2, NULL, 'fa fa-bell fa-lg'),
(6, 'Документы на карте', 'documents_on_map', 1, 3, NULL, 'fa fa-map-marker fa-lg'),
(7, 'Тестовый чайлд', 'test_child', NULL, 1, 6, NULL),
(9, 'test', NULL, 0, NULL, NULL, NULL),
(10, 'test', NULL, 0, NULL, NULL, NULL),
(15, 'Документы на карте', 'documents_on_map', 1, NULL, NULL, 'fa fa-map-marker fa-lg'),
(16, 'Документы на карте', 'documents_on_map', 1, NULL, NULL, 'fa fa-map-marker fa-lg'),
(17, 'Документы на карте', 'documents_on_map', 1, NULL, NULL, 'fa fa-map-marker fa-lg'),
(18, 'Тестовый чайлд', 'test_child', NULL, 1, NULL, NULL),
(19, 'Тестовый чайлд', 'test_child', NULL, 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu_client_tree`
--

CREATE TABLE IF NOT EXISTS `menu_client_tree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `entity` varchar(64) NOT NULL,
  `is_not_screen` tinyint(1) NOT NULL,
  `type` int(2) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `icon` varchar(128) NOT NULL,
  `lft` int(11) NOT NULL,
  `lvl` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `root` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `menu_client_type`
--

CREATE TABLE IF NOT EXISTS `menu_client_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `menu_client_type`
--

INSERT INTO `menu_client_type` (`id`, `name`) VALUES
(1, 'link'),
(2, 'msg_box'),
(3, 'layers'),
(4, 'widget'),
(5, 'new');

-- --------------------------------------------------------

--
-- Table structure for table `node`
--

CREATE TABLE IF NOT EXISTS `node` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `node_level_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `task` longtext,
  `node_state_id` int(11) DEFAULT NULL,
  `period_type_id` int(11) DEFAULT NULL,
  `time_stamp` datetime DEFAULT NULL,
  `period_length` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_node_node_level1_idx` (`node_level_id`),
  KEY `fk_node_client1_idx` (`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `node`
--

INSERT INTO `node` (`id`, `node_level_id`, `client_id`, `sort_order`, `task`, `node_state_id`, `period_type_id`, `time_stamp`, `period_length`) VALUES
(1, 2, 24, 1, 'Направить на согласование в бухгалтерию.', 1, 1, '2014-12-18 00:00:00', 1),
(2, 2, 22, NULL, 'На согласование Фоминой Ольге Ивановне', 1, 1, '2014-12-18 00:00:00', 1),
(3, 3, 7, 1, 'Визирование у командира дивизии', NULL, 1, '2014-12-15 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `node_level`
--

CREATE TABLE IF NOT EXISTS `node_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_order` int(12) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `node_level_type_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`node_level_type_id`,`route_id`),
  KEY `fk_node_level_node_level_type1_idx` (`node_level_type_id`),
  KEY `fk_node_level_route1_idx` (`route_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `node_level`
--

INSERT INTO `node_level` (`id`, `level_order`, `name`, `node_level_type_id`, `route_id`) VALUES
(1, 1, 'Черновик', 1, 1),
(2, 2, 'Согласование с бухглатерией', 2, 1),
(3, 3, 'Визирование', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `node_level_type`
--

CREATE TABLE IF NOT EXISTS `node_level_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(12) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `default_node_level_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `node_level_type`
--

INSERT INTO `node_level_type` (`id`, `code`, `name`, `default_node_level_name`) VALUES
(1, 'draft', 'Черновик', 'Черновик'),
(2, 'approval', 'Согласование', 'Согласование'),
(3, 'sight', 'Визирование', 'Визирование');

-- --------------------------------------------------------

--
-- Table structure for table `node_level_type_rule`
--

CREATE TABLE IF NOT EXISTS `node_level_type_rule` (
  `id` int(11) NOT NULL,
  `existing_level_type` int(11) DEFAULT NULL,
  `is_exist` tinyint(1) DEFAULT NULL,
  `node_level_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`node_level_type_id`),
  KEY `fk_node_level_type_rule_node_level_type1_idx` (`node_level_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `period_type`
--

CREATE TABLE IF NOT EXISTS `period_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `code` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `period_type`
--

INSERT INTO `period_type` (`id`, `name`, `code`) VALUES
(1, 'День', NULL),
(2, 'Неделя', NULL);

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
  `inn` int(11) DEFAULT NULL,
  `citizenship` varchar(64) DEFAULT NULL,
  `deputy` int(11) DEFAULT NULL,
  `sex_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_person_sex1_idx` (`sex_id`),
  KEY `fk_person_client1_idx` (`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `first_name`, `patronymic_name`, `family_name`, `birth_date`, `birth_place`, `inn`, `citizenship`, `deputy`, `sex_id`, `client_id`) VALUES
(5, 'Сергей', 'Николаевич', 'Комбаров', '1972-09-01', 'г. Челябинск', NULL, 'Россия', NULL, 3, 7),
(8, 'Антон', 'Петрович', 'Довлатов', NULL, 'г. Ленинград', NULL, 'Россия', NULL, 3, 12),
(9, 'Иван', 'Сергей', 'Петрович', NULL, 'г. Бобруйск', NULL, 'Белоруссия', NULL, NULL, 21),
(10, 'Ольга', 'Ивановна', 'Фомина', NULL, 'г. Рязань', NULL, 'Россия', NULL, 3, 22),
(11, 'Иван', 'Петрович', 'Григорьев', '1986-12-17', 'г. Брянск', NULL, 'Россия', NULL, NULL, 25),
(12, 'Иван', 'Алексеевич', 'Демьяненко', '1989-11-01', NULL, NULL, NULL, NULL, NULL, 27),
(13, 'Олег', 'Викторович', 'Карацупа', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 'пвапавп', 'вапвап', 'вапвапавп', '1984-11-23', 'вапап', 34545345, NULL, NULL, NULL, NULL),
(15, 'фестнейм', 'патронимик', 'фэмилинейм', '1945-03-11', NULL, NULL, NULL, NULL, 3, 28);

-- --------------------------------------------------------

--
-- Table structure for table `person_has_unit_post`
--

CREATE TABLE IF NOT EXISTS `person_has_unit_post` (
  `person_id` int(11) NOT NULL,
  `unit_post_id` int(11) NOT NULL,
  PRIMARY KEY (`person_id`,`unit_post_id`),
  KEY `fk_person_has_unit_post_unit_post1_idx` (`unit_post_id`),
  KEY `fk_person_has_unit_post_person1_idx` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `person_has_unit_post`
--

INSERT INTO `person_has_unit_post` (`person_id`, `unit_post_id`) VALUES
(5, 1),
(8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE IF NOT EXISTS `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(12) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `name`, `short_name`, `description`) VALUES
(5, 'Командир дивизии', 'Комдив', ''),
(6, 'Заместитель командира по тыловому обеспечению', 'Зампотылу', ''),
(7, 'Заместитель по технике безопасности', 'Зам по ТБ', NULL),
(8, 'Начальник противовоздушной обороны полка', 'нач ПВО', ''),
(9, 'Начальник артиллерии полка', 'нач артил', NULL),
(10, 'Первый заместитель командира полка', 'зам.ком.п', NULL),
(11, 'Начальник инженерной службы полка', 'нач ИС', NULL),
(12, 'Начальник финансовой службы полка', 'НФС', NULL),
(13, 'Начальник химической службы полка', 'НХС', NULL),
(14, 'Начальник физической подготовки и спорта полка', 'НФПиС', NULL),
(15, 'Начальник службы ракетно-артиллерийского вооружения полка', 'НРАВ', NULL),
(16, 'Начальник связи полка', 'НС', NULL),
(17, 'Начальник полкового медицинского пункта', 'НМП', NULL),
(23, 'Генерал-майор', 'Гн.м-р.', 'Без описания'),
(24, 'Генерал-майор', 'Гн.м-р.', 'Без описания'),
(25, 'Генерал-майор', 'Гн.м-р.', 'Без описания'),
(30, 'Майор', 'Тру', NULL),
(41, 'Майор', 'Труляля', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `post_rank`
--

CREATE TABLE IF NOT EXISTS `post_rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `rank_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`,`rank_id`),
  KEY `rank_id` (`rank_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- Dumping data for table `post_rank`
--

INSERT INTO `post_rank` (`id`, `post_id`, `rank_id`) VALUES
(22, 5, 1),
(23, 5, 2),
(24, 5, 5),
(17, 5, 12),
(18, 5, 13),
(2, 5, 14),
(1, 5, 15),
(19, 6, 1),
(20, 6, 2),
(21, 6, 5),
(7, 8, 11),
(8, 8, 12),
(9, 8, 13),
(10, 8, 14);

-- --------------------------------------------------------

--
-- Table structure for table `rank`
--

CREATE TABLE IF NOT EXISTS `rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(15) DEFAULT NULL,
  `description` text,
  `is_officer` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=33 ;

--
-- Dumping data for table `rank`
--

INSERT INTO `rank` (`id`, `name`, `short_name`, `description`, `is_officer`) VALUES
(1, 'Рядовой', 'ряд.', 'Без описания', 0),
(2, 'Ефрейтор', 'евр.', 'Без описания', 0),
(5, 'Младший сержант', 'мл. сержант', 'Без описания', 0),
(7, 'Сержант', 'серж.', 'Без описания', 0),
(8, 'Старший сержант', 'ст. сержант', 'Без описания', 0),
(9, 'Прапорщик', NULL, 'Без описания', 0),
(10, 'Младший лейтенант', 'мл. лейтенант', 'Без описания', 1),
(11, 'Лейтенант', 'л-т', 'Без описания', 1),
(12, 'Капитан', 'кап.', 'Без описания', 1),
(13, 'Майор', 'м-р', 'Старшее офицерское звание.', 0),
(14, 'Подполковник', 'п-ппк', 'Без описания', 1),
(15, 'Полковник', 'п-к', '', 1),
(16, 'Генерал-майор', 'Ген. м-р', 'Без описания', 1),
(17, 'Генерал-лейтенант', 'Ген-л-т', 'Без описания', 1),
(18, 'Майор', 'Труляля', NULL, NULL),
(20, 'Дикий прапор', 'д.пр-р', 'Без описания', 0),
(21, 'Дикий прапор', 'д пр-р', 'Без описания', 0),
(22, 'Пуф-паф', '34324', 'Без описания', 0),
(23, '234235', '32532523', 'Без описания', 0),
(24, '43534534', '4353453434', 'Без описания', 0),
(25, 'ZIGA', '435435', 'Без описания', 0),
(26, '4534534', 'rterter', 'Без описания', 0),
(27, 'TEST', '45345', 'Без описания', 0),
(28, '4545', '524523', 'Без описания', 0),
(29, 'ТРУЛЯЛЯ', '56356', 'Без описания', 0),
(30, 'ПУМ ', 'уеацуекуц', 'Без описания', 0),
(31, 'Тест', 'тест2', 'Без описания', 0),
(32, 'Тест3', 'тест3', 'Без описания', 0);

-- --------------------------------------------------------

--
-- Table structure for table `region`
--

CREATE TABLE IF NOT EXISTS `region` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `code` int(3) NOT NULL,
  `region_type_id` int(11) NOT NULL,
  `description` mediumtext,
  PRIMARY KEY (`id`,`region_type_id`),
  KEY `fk_Region_region_type_idx` (`region_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `region`
--

INSERT INTO `region` (`id`, `name`, `code`, `region_type_id`, `description`) VALUES
(1, 'Москва', 99, 3, NULL),
(2, 'Брянск', 99, 4, NULL),
(4, 'Смоленс', 32, 5, NULL),
(5, 'Калуга', 40, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `region_type`
--

CREATE TABLE IF NOT EXISTS `region_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `region_type`
--

INSERT INTO `region_type` (`id`, `name`, `short_name`) VALUES
(1, 'Тест', 'респ.'),
(2, 'Край', 'край'),
(3, 'Область', 'обл.'),
(4, 'Город', 'г.'),
(5, 'Республика', 'респ.'),
(6, 'площадь', 'пл.'),
(7, 'Село', 'с.');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE IF NOT EXISTS `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `document_type_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`document_type_id`),
  KEY `fk_route_document_type1_idx` (`document_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`id`, `name`, `description`, `document_type_id`) VALUES
(1, 'Типовой на списание', 'Типовой маршрут на списание', 1),
(2, 'Типовая служебная записка', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `route_has_document`
--

CREATE TABLE IF NOT EXISTS `route_has_document` (
  `route_id` int(11) NOT NULL,
  `route_document_type_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `document_document_author_id` int(11) NOT NULL,
  `document_document_type_id` int(11) NOT NULL,
  `document_current_node_level_id` int(11) NOT NULL,
  PRIMARY KEY (`route_id`,`route_document_type_id`,`document_id`,`document_document_author_id`,`document_document_type_id`,`document_current_node_level_id`),
  KEY `fk_route_has_document_document1_idx` (`document_id`,`document_document_author_id`,`document_document_type_id`,`document_current_node_level_id`),
  KEY `fk_route_has_document_route1_idx` (`route_id`,`route_document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `secrecy_type`
--

CREATE TABLE IF NOT EXISTS `secrecy_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(12) DEFAULT NULL,
  `single_numeration` int(1) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `secrecy_type`
--

INSERT INTO `secrecy_type` (`id`, `name`, `short_name`, `single_numeration`, `level`) VALUES
(1, 'Для служебного пользования', 'ДСП', NULL, 1),
(2, 'Секретно', 'С', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sex`
--

CREATE TABLE IF NOT EXISTS `sex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `sex`
--

INSERT INTO `sex` (`id`, `name`, `short_name`) VALUES
(3, 'Мужской', 'муж.'),
(4, 'Женский', 'жен.'),
(5, 'Средний', 'ср');

-- --------------------------------------------------------

--
-- Table structure for table `street_type`
--

CREATE TABLE IF NOT EXISTS `street_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `street_type`
--

INSERT INTO `street_type` (`id`, `name`, `short_name`) VALUES
(1, 'Аллея', 'алл.'),
(2, 'Бульвар', 'буль'),
(3, 'Улица', 'ул.'),
(4, 'Переулок', 'пер.'),
(5, 'Площадь', 'пл.'),
(7, 'Тест', 'тест');

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
  `client_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_unit_client1_idx` (`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=34 ;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`id`, `parent`, `name`, `short_name`, `own_numeration`, `is_legal`, `commander`, `deputy`, `on_duty`, `client_id`) VALUES
(28, NULL, '4 гв. танковая дивизия им. Андропова', 'В\\Ч 19612', 1, 1, 5, NULL, NULL, 8),
(29, NULL, 'Отдел материально-технического обеспечения', 'МТО', 1, NULL, NULL, NULL, NULL, 23),
(30, NULL, 'Финансовый отдел', 'Фин. отдел', 1, NULL, NULL, NULL, NULL, 24),
(31, NULL, 'Генерал-майор', 'Гн.м-р.', NULL, NULL, NULL, NULL, NULL, 26),
(32, NULL, 'Булошная', 'бул.', 1, 1, NULL, NULL, NULL, NULL),
(33, NULL, 'отдел АРМ', 'оАРМ', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `unit_post`
--

CREATE TABLE IF NOT EXISTS `unit_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`unit_id`,`post_id`),
  KEY `fk_unit_post_unit1_idx` (`unit_id`),
  KEY `fk_unit_post_post1_idx` (`post_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `unit_post`
--

INSERT INTO `unit_post` (`id`, `unit_id`, `post_id`, `start_date`, `end_date`) VALUES
(1, 28, 5, NULL, NULL),
(2, 28, 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `urgency_type`
--

CREATE TABLE IF NOT EXISTS `urgency_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(12) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `urgency_type`
--

INSERT INTO `urgency_type` (`id`, `name`, `short_name`, `level`) VALUES
(1, 'Не срочно', 'НС', 1),
(2, 'Срочно', 'Ср.', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `token` text,
  `person_id` int(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `token`, `person_id`, `is_admin`) VALUES
(1, 'admin', 'test', 'f271b2ed94ec0ff79d5a6db57ace63b4f5be28c79e38acd72ca9b5ce30386587b3fa75eea8647a8b0f837753837c95d8eb4e66a23b36fc2abc5f1633d6011c2b', 8, 1),
(2, 'test', '12345', '123456789', 5, 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `fk_address_address_type1` FOREIGN KEY (`address_type_id`) REFERENCES `address_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_address_location_type1` FOREIGN KEY (`location_type_id`) REFERENCES `location_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_address_region1` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_address_street_type1` FOREIGN KEY (`street_type_id`) REFERENCES `street_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `client_has_address`
--
ALTER TABLE `client_has_address`
  ADD CONSTRAINT `fk_client_has_address_address1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_client_has_address_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `current_document_type`
--
ALTER TABLE `current_document_type`
  ADD CONSTRAINT `current_document_type_ibfk_1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_2` FOREIGN KEY (`current_document_type_id`) REFERENCES `current_document_type` (`id`),
  ADD CONSTRAINT `fk_document_node_level1` FOREIGN KEY (`current_node_level_id`) REFERENCES `node_level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_document_persons1` FOREIGN KEY (`document_author_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `document_attribute`
--
ALTER TABLE `document_attribute`
  ADD CONSTRAINT `document_attribute_ibfk_1` FOREIGN KEY (`attribute_type_id`) REFERENCES `attribute_type` (`id`),
  ADD CONSTRAINT `fk_Document_Attribute_Document1` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_document_attribute_persons1` FOREIGN KEY (`author_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `document_has_linked_document`
--
ALTER TABLE `document_has_linked_document`
  ADD CONSTRAINT `fk_Document_has_Linked_Document_Document1` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Document_has_Linked_Document_Linked_Document1` FOREIGN KEY (`linked_document_id`) REFERENCES `linked_document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `document_type_attribute_type`
--
ALTER TABLE `document_type_attribute_type`
  ADD CONSTRAINT `document_type_attribute_type_ibfk_1` FOREIGN KEY (`attribute_type_id`) REFERENCES `attribute_type` (`id`),
  ADD CONSTRAINT `document_type_attribute_type_ibfk_2` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`);

--
-- Constraints for table `menu_client`
--
ALTER TABLE `menu_client`
  ADD CONSTRAINT `menu_client_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menu_client` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `menu_client_ibfk_2` FOREIGN KEY (`type`) REFERENCES `menu_client_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `node`
--
ALTER TABLE `node`
  ADD CONSTRAINT `fk_node_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_node_node_level1` FOREIGN KEY (`node_level_id`) REFERENCES `node_level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `node_level`
--
ALTER TABLE `node_level`
  ADD CONSTRAINT `fk_node_level_route1` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `node_level_ibfk_1` FOREIGN KEY (`node_level_type_id`) REFERENCES `node_level_type` (`id`);

--
-- Constraints for table `node_level_type_rule`
--
ALTER TABLE `node_level_type_rule`
  ADD CONSTRAINT `node_level_type_rule_ibfk_1` FOREIGN KEY (`node_level_type_id`) REFERENCES `node_level_type` (`id`);

--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_person_sex1` FOREIGN KEY (`sex_id`) REFERENCES `sex` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `person_has_unit_post`
--
ALTER TABLE `person_has_unit_post`
  ADD CONSTRAINT `fk_person_has_unit_post_person1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_person_has_unit_post_unit_post1` FOREIGN KEY (`unit_post_id`) REFERENCES `unit_post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `post_rank`
--
ALTER TABLE `post_rank`
  ADD CONSTRAINT `post_rank_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_rank_ibfk_2` FOREIGN KEY (`rank_id`) REFERENCES `rank` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `region`
--
ALTER TABLE `region`
  ADD CONSTRAINT `fk_Region_region_type` FOREIGN KEY (`region_type_id`) REFERENCES `region_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `route_has_document`
--
ALTER TABLE `route_has_document`
  ADD CONSTRAINT `fk_route_has_document_document1` FOREIGN KEY (`document_id`, `document_document_author_id`, `document_document_type_id`, `document_current_node_level_id`) REFERENCES `document` (`id`, `document_author_id`, `document_type_id`, `current_node_level_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_route_has_document_route1` FOREIGN KEY (`route_id`, `route_document_type_id`) REFERENCES `route` (`id`, `document_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `fk_unit_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `unit_post`
--
ALTER TABLE `unit_post`
  ADD CONSTRAINT `fk_unit_post_post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_unit_post_unit1` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

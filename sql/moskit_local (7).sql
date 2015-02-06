-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2015 at 02:18 PM
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

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
(25, 'Петрович Ивано Григорий', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE IF NOT EXISTS `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `document_number` varchar(45) DEFAULT NULL,
  `document_author_id` int(11) NOT NULL,
  `document_type_id` int(11) NOT NULL,
  `current_node_level_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`document_author_id`,`document_type_id`,`current_node_level_id`),
  KEY `fk_document_persons1_idx` (`document_author_id`),
  KEY `fk_document_document_type1_idx` (`document_type_id`),
  KEY `fk_document_node_level1_idx` (`current_node_level_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `name`, `date`, `document_number`, `document_author_id`, `document_type_id`, `current_node_level_id`) VALUES
(2, 'Списание устаревшей техники', '2014-12-18', '2666', 5, 1, 1);

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
-- Table structure for table `menu_client`
--

CREATE TABLE IF NOT EXISTS `menu_client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `entity` varchar(128) DEFAULT NULL,
  `is_not_screen` tinyint(1) DEFAULT NULL,
  `type` enum('link','msg_box','layers','widget') DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `menu_client`
--

INSERT INTO `menu_client` (`id`, `name`, `entity`, `is_not_screen`, `type`, `parent_id`) VALUES
(1, 'Входящие', 'inbox', NULL, 'msg_box', NULL),
(2, 'Черновики', 'draft', NULL, 'msg_box', NULL);

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
  `level_order` int(11) DEFAULT NULL,
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
  `code` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `default_node_level_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `node_level_type`
--

INSERT INTO `node_level_type` (`id`, `code`, `name`, `default_node_level_name`) VALUES
(1, 1, 'Черновик', 'Черновик'),
(2, 2, 'Согласование', 'Согласование'),
(3, 3, 'Визирование', 'Визирование');

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
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_person_sex1_idx` (`sex_id`),
  KEY `fk_person_client1_idx` (`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `first_name`, `patronymic_name`, `family_name`, `birth_date`, `birth_place`, `inn`, `citizenship`, `deputy`, `sex_id`, `client_id`) VALUES
(5, 'Сергей', 'Николаевич', 'Комбаров', '1979-12-01', 'г. Челябинск', NULL, 'Россия', NULL, 3, 7),
(8, 'Антон', 'Петрович', 'Довлатов', NULL, 'г. Ленинград', NULL, 'Россия', NULL, 3, 12),
(9, 'Иван', 'Сергей', 'Петрович', NULL, 'г. Бобруйск', NULL, 'Белоруссия', NULL, NULL, 21),
(10, 'Ольга', 'Ивановна', 'Фомина', NULL, 'г. Рязань', NULL, 'Россия', NULL, 3, 22),
(11, 'Ивано', 'Григорий', 'Петрович', '1986-12-17', 'г. Красноярск', NULL, 'Россия', NULL, NULL, 25);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `name`, `short_name`, `description`) VALUES
(5, 'Командир дивизии', 'Комдив', ''),
(6, 'Заместитель командира по тыловому обеспечению', 'Зампотылу', ''),
(7, 'Заместитель по технике безопасности', 'Зам по ТБ', NULL),
(8, 'Начальник противовоздушной обороны полка', 'нач ПВО', NULL),
(9, 'Начальник артиллерии полка', 'нач артил', NULL),
(10, 'Первый заместитель командира полка', 'зам.ком.п', NULL),
(11, 'Начальник инженерной службы полка', 'нач ИС', NULL),
(12, 'Начальник финансовой службы полка', 'НФС', NULL),
(13, 'Начальник химической службы полка', 'НХС', NULL),
(14, 'Начальник физической подготовки и спорта полка', 'НФПиС', NULL),
(15, 'Начальник службы ракетно-артиллерийского вооружения полка', 'НРАВ', NULL),
(16, 'Начальник связи полка', 'НС', NULL),
(17, 'Начальник полкового медицинского пункта', 'НМП', NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

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
(15, 'Полковник', 'п-к', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE IF NOT EXISTS `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `document_type_id` int(11) NOT NULL,
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
-- Table structure for table `sex`
--

CREATE TABLE IF NOT EXISTS `sex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `sex`
--

INSERT INTO `sex` (`id`, `name`, `short_name`) VALUES
(3, 'Мужской', 'муж.'),
(4, 'Женский', 'жен.');

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
  PRIMARY KEY (`id`),
  KEY `fk_unit_client1_idx` (`client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`id`, `parent`, `name`, `short_name`, `own_numeration`, `is_legal`, `commander`, `deputy`, `on_duty`, `client_id`) VALUES
(28, NULL, '4 гв. танковая дивизия им. Андропова', 'В\\Ч 19612', 1, 0, 5, NULL, NULL, 8),
(29, NULL, 'Отдел материально-технического обеспечения', 'МТО', 1, NULL, NULL, NULL, NULL, 23),
(30, NULL, 'Финансовый отдел', 'Фин. отдел', 1, NULL, NULL, NULL, NULL, 24);

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
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `fk_document_document_type1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
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

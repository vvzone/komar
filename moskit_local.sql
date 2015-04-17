-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Апр 17 2015 г., 11:04
-- Версия сервера: 5.6.17
-- Версия PHP: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `moskit_local`
--

-- --------------------------------------------------------

--
-- Структура таблицы `address`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `address_type`
--

CREATE TABLE IF NOT EXISTS `address_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `priotity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `address_type`
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
-- Структура таблицы `attribute_type`
--

CREATE TABLE IF NOT EXISTS `attribute_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `machine_name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `base_attribute_type_code` int(11) DEFAULT NULL,
  `verification_command` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `base_attribute_type_code` (`base_attribute_type_code`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Дамп данных таблицы `attribute_type`
--

INSERT INTO `attribute_type` (`id`, `name`, `machine_name`, `description`, `base_attribute_type_code`, `verification_command`) VALUES
(1, 'Заголовок', 'header', 'Заголовок документа', 3, NULL),
(2, 'Основной текст', 'main_text', 'Основной текст документа', 3, NULL),
(3, 'Координата', 'coordinate', NULL, 9, NULL),
(4, 'Цвет', 'color', NULL, 3, NULL),
(5, 'Маршрут', 'route', NULL, 9, NULL),
(6, 'Азимут', 'azimuth', NULL, 1, NULL),
(7, 'Аннотация', 'annotation', NULL, 3, NULL),
(8, 'Номер страницы', 'page_num', NULL, 1, NULL),
(9, 'Шапка заявления', 'declaration_header', NULL, 3, NULL),
(10, 'Шапка должностной записки', 'duty_note_header', NULL, 3, NULL),
(15, 'x', 'x', 'Абсцисса', 1, NULL),
(16, 'y', 'y', 'Ордината', 1, NULL),
(17, 'Название', 'name', 'Название чего-либо', 3, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `attribute_type_collection`
--

CREATE TABLE IF NOT EXISTS `attribute_type_collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_attribute_id` int(11) DEFAULT NULL,
  `attribute_id` int(11) NOT NULL,
  `min` int(11) NOT NULL,
  `max` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_attribute_id` (`parent_attribute_id`),
  KEY `attribute_id` (`attribute_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `attribute_type_collection`
--

INSERT INTO `attribute_type_collection` (`id`, `parent_attribute_id`, `attribute_id`, `min`, `max`) VALUES
(1, 3, 15, 1, 1),
(2, 3, 16, 1, 1),
(3, 5, 3, 1, 9999),
(4, 5, 17, 1, 1),
(5, NULL, 1, 1, 1),
(6, NULL, 2, 1, 1),
(7, NULL, 5, 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `base_attribute_type_code`
--

CREATE TABLE IF NOT EXISTS `base_attribute_type_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(11) NOT NULL,
  `code_name` varchar(16) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Дамп данных таблицы `base_attribute_type_code`
--

INSERT INTO `base_attribute_type_code` (`id`, `code`, `code_name`, `description`) VALUES
(1, 1, 'integer', 'Целое.'),
(2, 2, 'real', 'Вещественное.'),
(3, 3, 'text', 'Текст.'),
(4, 4, 'boolean', 'Булевский.'),
(5, 5, 'date', 'Дата.'),
(6, 6, 'time', 'Время.'),
(7, 7, 'datetime', 'Дата/время.'),
(8, 8, 'list', 'Список.'),
(9, 9, 'complex', 'Составной');

-- --------------------------------------------------------

--
-- Структура таблицы `cdt_has_dac`
--

CREATE TABLE IF NOT EXISTS `cdt_has_dac` (
  `cdt_id` int(11) NOT NULL,
  `dac_id` int(11) NOT NULL,
  PRIMARY KEY (`cdt_id`,`dac_id`),
  KEY `cdt_has_atc_ibfk_2` (`dac_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `client`
--

CREATE TABLE IF NOT EXISTS `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` text NOT NULL,
  `identification_number` int(11) DEFAULT NULL,
  `is_external` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Дамп данных таблицы `client`
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
-- Структура таблицы `client_has_address`
--

CREATE TABLE IF NOT EXISTS `client_has_address` (
  `client_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  PRIMARY KEY (`client_id`,`address_id`),
  KEY `fk_client_has_address_address1_idx` (`address_id`),
  KEY `fk_client_has_address_client1_idx` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(8) NOT NULL,
  `name` varchar(16) NOT NULL,
  `full_name` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Дамп данных таблицы `country`
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
-- Структура таблицы `current_document_type`
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `current_document_type`
--

INSERT INTO `current_document_type` (`id`, `document_type_id`, `name`, `short_name`, `code`, `default_header`, `is_service`, `secrecy_type`, `urgency_type`, `presentation`, `direction_type_code`, `description`) VALUES
(4, 1, 'test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `current_document_type_has_route`
--

CREATE TABLE IF NOT EXISTS `current_document_type_has_route` (
  `current_document_type_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  PRIMARY KEY (`current_document_type_id`,`route_id`),
  KEY `fk_current_document_type_has_route_route1_idx` (`route_id`),
  KEY `fk_current_document_type_has_route_current_document_type1_idx` (`current_document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `document`
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
  KEY `current_document_type_id` (`current_document_type_id`),
  KEY `document_type_id` (`document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `document_attribute`
--

CREATE TABLE IF NOT EXISTS `document_attribute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_attribute_collection_id` int(11) DEFAULT NULL,
  `array_index` int(11) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`id`),
  KEY `fk_document_attribute_persons1_idx` (`author_id`),
  KEY `document_attribute_collection_id` (`document_attribute_collection_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Дамп данных таблицы `document_attribute`
--

INSERT INTO `document_attribute` (`id`, `document_attribute_collection_id`, `array_index`, `author_id`, `data`) VALUES
(5, 7, NULL, 5, 'Приказ на списание материальных ценностей от 11.12.14'),
(6, 8, NULL, 5, 'Приказываю списать следующие материальные ценности: \r\n1. Принтер MF-401 инв. номер 124215\r\n2. Системный блок инв. номер 343324'),
(7, 9, NULL, 5, NULL),
(8, 10, 1, 5, NULL),
(9, 10, 2, 5, NULL),
(15, NULL, NULL, 5, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `document_attribute_collection`
--

CREATE TABLE IF NOT EXISTS `document_attribute_collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_document_attribute_id` int(11) DEFAULT NULL,
  `attribute_type_collection_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_document_attribute_id` (`parent_document_attribute_id`),
  KEY `attribute_type_collection_id` (`attribute_type_collection_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Дамп данных таблицы `document_attribute_collection`
--

INSERT INTO `document_attribute_collection` (`id`, `parent_document_attribute_id`, `attribute_type_collection_id`) VALUES
(7, NULL, 5),
(8, NULL, 6),
(9, NULL, 7),
(10, 7, 3),
(11, 8, 1),
(12, 8, 2),
(13, 9, 1),
(14, 9, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `document_has_linked_document`
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
-- Структура таблицы `document_type`
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
-- Дамп данных таблицы `document_type`
--

INSERT INTO `document_type` (`id`, `name`, `short_name`, `code`, `default_header`, `is_service`, `secrecy_type`, `urgency_type`, `presentation`, `direction_type_code`, `description`) VALUES
(1, 'Приказ на списание материальных ценностей', 'Приказ на списание', 11, 'Приказ на списание', NULL, 1, 1, NULL, NULL, NULL),
(2, 'Служебная записка', 'сл. записка', 12, 'Служебная записка', 0, 1, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `document_type_attribute_type`
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

-- --------------------------------------------------------

--
-- Структура таблицы `document_type_has_attribute_type_collection`
--

CREATE TABLE IF NOT EXISTS `document_type_has_attribute_type_collection` (
  `document_type_id` int(11) NOT NULL,
  `attribute_type_collection_id` int(11) NOT NULL,
  PRIMARY KEY (`document_type_id`,`attribute_type_collection_id`),
  KEY `attribute_type_collection_id` (`attribute_type_collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `document_type_has_attribute_type_collection`
--

INSERT INTO `document_type_has_attribute_type_collection` (`document_type_id`, `attribute_type_collection_id`) VALUES
(1, 5),
(1, 6);

-- --------------------------------------------------------

--
-- Структура таблицы `document_type_has_route`
--

CREATE TABLE IF NOT EXISTS `document_type_has_route` (
  `document_type_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  PRIMARY KEY (`document_type_id`,`route_id`),
  KEY `fk_document_type_has_route_route1_idx` (`route_id`),
  KEY `fk_document_type_has_route_document_type1_idx` (`document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `document_type_has_route`
--

INSERT INTO `document_type_has_route` (`document_type_id`, `route_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `linked_document`
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
-- Структура таблицы `location_type`
--

CREATE TABLE IF NOT EXISTS `location_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `short_name` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `menu_client`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `menu_client_tree`
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
-- Структура таблицы `menu_client_type`
--

CREATE TABLE IF NOT EXISTS `menu_client_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `node`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `node_level`
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
-- Дамп данных таблицы `node_level`
--

INSERT INTO `node_level` (`id`, `level_order`, `name`, `node_level_type_id`, `route_id`) VALUES
(1, 1, 'Черновик', 1, 1),
(2, 2, 'Согласование с бухглатерией', 2, 1),
(3, 3, 'Визирование', 3, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `node_level_type`
--

CREATE TABLE IF NOT EXISTS `node_level_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(12) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `default_node_level_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `node_level_type`
--

INSERT INTO `node_level_type` (`id`, `code`, `name`, `default_node_level_name`) VALUES
(1, 'draft', 'Черновик', 'Черновик'),
(2, 'approval', 'Согласование', 'Согласование'),
(3, 'sight', 'Визирование', 'Визирование');

-- --------------------------------------------------------

--
-- Структура таблицы `node_level_type_rule`
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
-- Структура таблицы `period_type`
--

CREATE TABLE IF NOT EXISTS `period_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `code` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `person`
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
-- Дамп данных таблицы `person`
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
-- Структура таблицы `person_has_unit_post`
--

CREATE TABLE IF NOT EXISTS `person_has_unit_post` (
  `person_id` int(11) NOT NULL,
  `unit_post_id` int(11) NOT NULL,
  PRIMARY KEY (`person_id`,`unit_post_id`),
  KEY `fk_person_has_unit_post_unit_post1_idx` (`unit_post_id`),
  KEY `fk_person_has_unit_post_person1_idx` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `post`
--

CREATE TABLE IF NOT EXISTS `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(12) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `post_rank`
--

CREATE TABLE IF NOT EXISTS `post_rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `rank_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`,`rank_id`),
  KEY `rank_id` (`rank_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `rank`
--

CREATE TABLE IF NOT EXISTS `rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `short_name` varchar(15) DEFAULT NULL,
  `description` text,
  `is_officer` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `rank`
--

INSERT INTO `rank` (`id`, `name`, `short_name`, `description`, `is_officer`) VALUES
(1, 'TEST', 'tiny_test', 'Без описания', 0),
(2, 'TEST2222', 'tiny_test', 'Без описания', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `region`
--

CREATE TABLE IF NOT EXISTS `region` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `code` int(3) NOT NULL,
  `region_type_id` int(11) NOT NULL,
  `description` mediumtext,
  PRIMARY KEY (`id`,`region_type_id`),
  KEY `fk_Region_region_type_idx` (`region_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `region_type`
--

CREATE TABLE IF NOT EXISTS `region_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `route`
--

CREATE TABLE IF NOT EXISTS `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `is_main` tinyint(1) DEFAULT NULL,
  `prototype_route_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_route_route1_idx` (`prototype_route_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `route`
--

INSERT INTO `route` (`id`, `name`, `description`, `is_main`, `prototype_route_id`) VALUES
(1, 'Типовой на списание', 'Типовой маршрут на списание', NULL, NULL),
(2, 'Типовая служебная записка', 'Типовой маршрут для служебной записки', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `secrecy_type`
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
-- Дамп данных таблицы `secrecy_type`
--

INSERT INTO `secrecy_type` (`id`, `name`, `short_name`, `single_numeration`, `level`) VALUES
(1, 'Для служебного пользования', 'ДСП', NULL, 1),
(2, 'Секретно', 'С', 1, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `sex`
--

CREATE TABLE IF NOT EXISTS `sex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `sex`
--

INSERT INTO `sex` (`id`, `name`, `short_name`) VALUES
(3, 'Мужской', 'муж.'),
(4, 'Женский', 'жен.'),
(5, 'Средний', 'ср');

-- --------------------------------------------------------

--
-- Структура таблицы `street_type`
--

CREATE TABLE IF NOT EXISTS `street_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `unit`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `unit_post`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `urgency_type`
--

CREATE TABLE IF NOT EXISTS `urgency_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `short_name` varchar(12) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `urgency_type`
--

INSERT INTO `urgency_type` (`id`, `name`, `short_name`, `level`) VALUES
(1, 'Не срочно', 'НС', 1),
(2, 'Срочно', 'Ср.', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `user`
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
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `token`, `person_id`, `is_admin`) VALUES
(1, 'admin', 'test', 'f271b2ed94ec0ff79d5a6db57ace63b4f5be28c79e38acd72ca9b5ce30386587b3fa75eea8647a8b0f837753837c95d8eb4e66a23b36fc2abc5f1633d6011c2b', 8, 1),
(2, 'test', '12345', '123456789', 5, 0);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `fk_address_address_type1` FOREIGN KEY (`address_type_id`) REFERENCES `address_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_address_location_type1` FOREIGN KEY (`location_type_id`) REFERENCES `location_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_address_region1` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_address_street_type1` FOREIGN KEY (`street_type_id`) REFERENCES `street_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `attribute_type`
--
ALTER TABLE `attribute_type`
  ADD CONSTRAINT `attribute_type_ibfk_1` FOREIGN KEY (`base_attribute_type_code`) REFERENCES `base_attribute_type_code` (`id`);

--
-- Ограничения внешнего ключа таблицы `attribute_type_collection`
--
ALTER TABLE `attribute_type_collection`
  ADD CONSTRAINT `attribute_type_collection_ibfk_1` FOREIGN KEY (`parent_attribute_id`) REFERENCES `attribute_type` (`id`),
  ADD CONSTRAINT `attribute_type_collection_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attribute_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `cdt_has_dac`
--
ALTER TABLE `cdt_has_dac`
  ADD CONSTRAINT `cdt_has_dac_ibfk_1` FOREIGN KEY (`cdt_id`) REFERENCES `current_document_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `cdt_has_dac_ibfk_2` FOREIGN KEY (`dac_id`) REFERENCES `document_attribute_collection` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `client_has_address`
--
ALTER TABLE `client_has_address`
  ADD CONSTRAINT `fk_client_has_address_address1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_client_has_address_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `current_document_type`
--
ALTER TABLE `current_document_type`
  ADD CONSTRAINT `current_document_type_ibfk_1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `current_document_type_has_route`
--
ALTER TABLE `current_document_type_has_route`
  ADD CONSTRAINT `fk_current_document_type_has_route_current_document_type1` FOREIGN KEY (`current_document_type_id`) REFERENCES `current_document_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_current_document_type_has_route_route1` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_2` FOREIGN KEY (`current_document_type_id`) REFERENCES `current_document_type` (`id`),
  ADD CONSTRAINT `document_ibfk_3` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`),
  ADD CONSTRAINT `fk_document_node_level1` FOREIGN KEY (`current_node_level_id`) REFERENCES `node_level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_document_persons1` FOREIGN KEY (`document_author_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `document_attribute`
--
ALTER TABLE `document_attribute`
  ADD CONSTRAINT `document_attribute_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `person` (`id`),
  ADD CONSTRAINT `document_attribute_ibfk_3` FOREIGN KEY (`document_attribute_collection_id`) REFERENCES `document_attribute_collection` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `document_attribute_collection`
--
ALTER TABLE `document_attribute_collection`
  ADD CONSTRAINT `document_attribute_collection_ibfk_2` FOREIGN KEY (`parent_document_attribute_id`) REFERENCES `document_attribute` (`id`),
  ADD CONSTRAINT `document_attribute_collection_ibfk_3` FOREIGN KEY (`attribute_type_collection_id`) REFERENCES `attribute_type_collection` (`id`);

--
-- Ограничения внешнего ключа таблицы `document_has_linked_document`
--
ALTER TABLE `document_has_linked_document`
  ADD CONSTRAINT `fk_Document_has_Linked_Document_Document1` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Document_has_Linked_Document_Linked_Document1` FOREIGN KEY (`linked_document_id`) REFERENCES `linked_document` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `document_type_attribute_type`
--
ALTER TABLE `document_type_attribute_type`
  ADD CONSTRAINT `document_type_attribute_type_ibfk_1` FOREIGN KEY (`attribute_type_id`) REFERENCES `attribute_type` (`id`),
  ADD CONSTRAINT `document_type_attribute_type_ibfk_2` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `document_type_has_attribute_type_collection`
--
ALTER TABLE `document_type_has_attribute_type_collection`
  ADD CONSTRAINT `document_type_has_attribute_type_collection_ibfk_1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`),
  ADD CONSTRAINT `document_type_has_attribute_type_collection_ibfk_2` FOREIGN KEY (`attribute_type_collection_id`) REFERENCES `attribute_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `document_type_has_route`
--
ALTER TABLE `document_type_has_route`
  ADD CONSTRAINT `fk_document_type_has_route_document_type1` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_document_type_has_route_route1` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `menu_client`
--
ALTER TABLE `menu_client`
  ADD CONSTRAINT `menu_client_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menu_client` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `menu_client_ibfk_2` FOREIGN KEY (`type`) REFERENCES `menu_client_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `node`
--
ALTER TABLE `node`
  ADD CONSTRAINT `fk_node_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_node_node_level1` FOREIGN KEY (`node_level_id`) REFERENCES `node_level` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `node_level`
--
ALTER TABLE `node_level`
  ADD CONSTRAINT `fk_node_level_route1` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `node_level_ibfk_1` FOREIGN KEY (`node_level_type_id`) REFERENCES `node_level_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `node_level_type_rule`
--
ALTER TABLE `node_level_type_rule`
  ADD CONSTRAINT `node_level_type_rule_ibfk_1` FOREIGN KEY (`node_level_type_id`) REFERENCES `node_level_type` (`id`);

--
-- Ограничения внешнего ключа таблицы `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_person_sex1` FOREIGN KEY (`sex_id`) REFERENCES `sex` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `person_has_unit_post`
--
ALTER TABLE `person_has_unit_post`
  ADD CONSTRAINT `fk_person_has_unit_post_person1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_person_has_unit_post_unit_post1` FOREIGN KEY (`unit_post_id`) REFERENCES `unit_post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `post_rank`
--
ALTER TABLE `post_rank`
  ADD CONSTRAINT `post_rank_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_rank_ibfk_2` FOREIGN KEY (`rank_id`) REFERENCES `rank` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `region`
--
ALTER TABLE `region`
  ADD CONSTRAINT `fk_Region_region_type` FOREIGN KEY (`region_type_id`) REFERENCES `region_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `fk_route_route1` FOREIGN KEY (`prototype_route_id`) REFERENCES `route` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `fk_unit_client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `unit_post`
--
ALTER TABLE `unit_post`
  ADD CONSTRAINT `fk_unit_post_post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_unit_post_unit1` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

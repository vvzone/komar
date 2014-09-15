<?php
/**
 * Created by PhpStorm.
 * User: Victor
 * Date: 15.09.14
 * Time: 17:16
 */

$sys = array(
    array('id' => 10501, 'category' => 'base', 'name' => 'countries', 'screen' => 'countries', 'rus_name' => 'Страны'),
    array('id' => 10502, 'category' => 'base', 'name' => 'address_types', 'screen' => 'address_types', 'rus_name' => 'Типы адреса'),
    array('id' => 10503, 'category' => 'base', 'name' => 'region_types', 'screen' => 'region_types', 'rus_name' => 'Типы региона'),
    array('id' => 10504, 'category' => 'base', 'name' => 'regions', 'screen' => 'regions', 'rus_name' => 'Регионы'),
    array('id' => 10505, 'category' => 'base', 'name' => 'location_types', 'screen' => 'location_types', 'rus_name' => 'Типы нас. пункта'),
    array('id' => 10506, 'category' => 'base', 'name' => 'street_types', 'screen' => 'street_types', 'rus_name' => 'Типы улиц'),
    array('id' => 10507, 'category' => 'base', 'name' => 'sex_types', 'screen' => 'sex_types', 'rus_name' => 'Типы пола служащего'),
);

$sys_docs = array(
    array('id' => 106010, 'category' => 'base', 'name' => 'period_types', 'screen' => 'period_types', 'rus_name' => 'Типы периодов'),
    array('id' => 106020, 'category' => 'base', 'name' => 'enumeration_types', 'screen' => 'enumeration_types', 'rus_name' => 'Типы нумерации'),
    array('id' => 106021, 'category' => 'base', 'name' => 'doc_type_groups', 'screen' => 'doc_type_groups', 'rus_name' => 'Группы типов документов'),
    array('id' => 106022, 'category' => 'base', 'name' => 'doc_secrecy_types', 'screen' => 'doc_secrecy_types', 'rus_name' => 'Типы секретности документа'),
    array('id' => 106023, 'category' => 'base', 'name' => 'doc_urgency_types', 'screen' => 'doc_urgency_types', 'rus_name' => 'Типы срочности документа'),
    array('id' => 106030, 'category' => 'base', 'name' => 'doc_types', 'screen' => 'doc_types', 'rus_name' => 'Типы документов'),
    array('id' => 106040, 'category' => 'base', 'name' => 'node_types', 'screen' => 'node_types', 'rus_name' => 'Типы узлов маршрута'),
    array('id' => 106050, 'category' => 'base', 'name' => 'doc_attributes_types', 'screen' => 'doc_attributes_types', 'rus_name' => 'Типы аттрибутов'),
    array('id' => 106060, 'category' => 'base', 'name' => 'enumeration', 'screen' => 'enumeration', 'rus_name' => 'Нумерация'),
);

/*BASE 1 LVL */
$array_base = array(
    array('id' => 101, 'category' => 'base', 'name' => 'ranks', 'screen' => 'ranks', 'rus_name' => 'Звания'),
    array('id' => 102, 'category' => 'base', 'name' => 'positions', 'screen' => 'positions', 'rus_name' => 'Должности'),
    array('id' => 103, 'category' => 'base', 'name' => 'position_rank', 'screen' => 'positions', 'rus_name' => 'Соответствие звания должности',
        'isNonIndependent' => true ),
    array('id' => 104, 'category' => 'base', 'name' => 'pass_doc_types', 'screen' => 'pass_doc_types', 'rus_name' => 'Типы удостоверяющих личность документов'),
    array('id' => 105, 'category' => 'base', 'name' => 'sys', 'screen' => 'sys', 'rus_name' => 'Основные настройки', 'isNotScreen' => true,
        'childNodes' => $sys),
    array('id' => 106, 'category' => 'base', 'name' => 'sys_docs', 'screen' => 'sys_docs', 'rus_name' => 'Настройки документов', 'isNotScreen' => true,
        'childNodes' => $sys_docs
    ),
    array('id' => 107, 'category' => 'base', 'name' => 'commander_types', 'screen' => 'commander_types', 'rus_name' => 'Тип руководства подразделения'),

);

$array_staff = array(
    array('id' => 201, 'category' => 'staff', 'name' => 'person', 'screen' => 'person', 'rus_name' => 'Картотека Личных дел'),
    array('id' => 202, 'category' => 'staff', 'name' => 'person_position_history', 'screen' => 'person', 'rus_name' => 'История назначений',
        'isNonIndependent' => true ),
    array('id' => 203, 'category' => 'staff', 'name' => 'person_rank_history', 'screen' => 'person', 'rus_name' => 'История присвоения званий',
        'isNonIndependent' => true ),
    array('id' => 204, 'category' => 'staff', 'name' => 'person_address', 'screen' => 'person', 'rus_name' => 'Адрес лица',
        'isNonIndependent' => true ),
    array('id' => 205, 'category' => 'staff', 'name' => 'role', 'screen' => 'person', 'rus_name' => 'Роль служащего',
        'isNonIndependent' => true ),
);

$array_doc = array(
    array('id' => 301, 'category' => 'doc', 'name' => 'doc', 'screen' => 'doc', 'rus_name' => 'Документы'),
    array('id' => 302, 'category' => 'doc', 'name' => 'doc_attribute', 'screen' => 'doc', 'rus_name' => 'Аттрибуты документа',
        'isNonIndependent' => true ),
    array('id' => 303, 'category' => 'doc', 'name' => 'pass_docs', 'screen' => 'pass_docs', 'rus_name' => 'Документы удостоверяющие личность'),
    array('id' => 304, 'category' => 'doc', 'name' => 'route', 'screen' => 'route', 'rus_name' => 'Маршрут'),
    array('id' => 305, 'category' => 'doc', 'name' => 'route_node', 'screen' => 'route', 'rus_name' => 'Пункт маршрута',
        'isNonIndependent' => true ),
    array('id' => 306, 'category' => 'doc', 'name' => 'route_node_attribute', 'screen' => 'route_node', 'rus_name' => 'Изменяемые в узле атрибуты',
        'isNonIndependent' => true )
);

$array_unit = array(
    array('id' => 401, 'category' => 'unit', 'name' => 'unit', 'screen' => 'unit', 'rus_name' => 'Организация/Юр.Лицо/Подразделение'),
    array('id' => 402, 'category' => 'unit', 'name' => 'unit_commander', 'screen' => 'unit', 'rus_name' => 'Руководство',
        'isNonIndependent' => true ),
    array('id' => 403, 'category' => 'unit', 'name' => 'unit_positions', 'screen' => 'unit', 'rus_name' => 'Штатное расписание',
        'isNonIndependent' => true ),
    array('id' => 404, 'category' => 'unit', 'name' => 'unit_doc_types', 'screen' => 'unit', 'rus_name' => 'Типы документов подразделения',
        'isNonIndependent' => true ),
    array('id' => 405, 'category' => 'unit', 'name' => 'unit_routes', 'screen' => 'unit', 'rus_name' => 'Маршруты в подразделении',
        'isNonIndependent' => true ),
    array('id' => 406, 'category' => 'unit', 'name' => 'unit_enumeration', 'screen' => 'unit', 'rus_name' => 'Нумерация в подразделении',
        'isNonIndependent' => true ),
);


$data_array = array(
    array('id' => 1, 'name' => 'base', 'screen' => 'base', 'rus_name' => 'Базовые определения', 'isNotScreen' => true,
        'childNodes' => $array_base),
    array('id' => 2, 'name' => 'staff', 'screen' => 'staff', 'rus_name' => 'Персонал', 'isNotScreen' => true,
        'childNodes' => $array_staff),
    array('id' => 3, 'name' => 'doc', 'screen' => 'doc', 'rus_name' => 'Документы', 'isNotScreen' => true,
        'childNodes' => $array_doc),
    array('id' => 4, 'name' => 'unit', 'screen' => 'unit', 'rus_name' => 'Подразделение', 'isNotScreen' => true,
        'childNodes' => $array_unit),
);
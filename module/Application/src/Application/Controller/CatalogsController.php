<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class CatalogsController extends AbstractActionController
{
    public function menusAction(){

        /*
         * isNonIndependent - output only in the parent screen
         * isNotScreen - no screen output
         * */

        $data_array = array(
            array('id' => 1, 'name' => 'base', 'screen' => 'base', 'rus_name' => 'Базовые определения', 'isNotScreen' => true),
            array('id' => 2, 'name' => 'staff', 'screen' => 'staff', 'rus_name' => 'Персонал', 'isNotScreen' => true),
            array('id' => 3, 'name' => 'doc', 'screen' => 'doc', 'rus_name' => 'Документы', 'isNotScreen' => true),
            array('id' => 4, 'name' => 'unit', 'screen' => 'unit', 'rus_name' => 'Подразделение', 'isNotScreen' => true),
            array('id' => 101, 'parent_id' => 1, 'category' => 'base', 'name' => 'ranks', 'screen' => 'ranks', 'rus_name' => 'Звания'),
            array('id' => 102, 'parent_id' => 1, 'category' => 'base', 'name' => 'positions', 'screen' => 'positions', 'rus_name' => 'Должности'),
            array('id' => 103, 'parent_id' => 1, 'category' => 'base', 'name' => 'position_rank', 'screen' => 'positions', 'rus_name' => 'Соответствие звания должности',
                'isNonIndependent' => true ),
            array('id' => 104, 'parent_id' => 1, 'category' => 'base', 'name' => 'pass_doc_types', 'screen' => 'pass_doc_types', 'rus_name' => 'Типы удостоверяющих личность документов'),
            array('id' => 105, 'parent_id' => 1, 'category' => 'base', 'name' => 'sys', 'screen' => 'sys', 'rus_name' => 'Основные настройки', 'isNotScreen' => true),
            array('id' => 106, 'parent_id' => 1, 'category' => 'base', 'name' => 'sys_docs', 'screen' => 'sys_docs', 'rus_name' => 'Настройки документов', 'isNotScreen' => true
            ),
            array('id' => 107, 'parent_id' => 1, 'category' => 'base', 'name' => 'commander_types', 'screen' => 'commander_types', 'rus_name' => 'Тип руководства подразделения'),
            array('id' => 201, 'parent_id' => 2, 'category' => 'staff', 'name' => 'person', 'screen' => 'person', 'rus_name' => 'Картотека Личных дел'),
            array('id' => 202, 'parent_id' => 2, 'category' => 'staff', 'name' => 'person_position_history', 'screen' => 'person', 'rus_name' => 'История назначений',
                'isNonIndependent' => true ),
            array('id' => 203, 'parent_id' => 2, 'category' => 'staff', 'name' => 'person_rank_history', 'screen' => 'person', 'rus_name' => 'История присвоения званий',
                'isNonIndependent' => true ),
            array('id' => 204, 'parent_id' => 2, 'category' => 'staff', 'name' => 'person_address', 'screen' => 'person', 'rus_name' => 'Адрес лица',
                'isNonIndependent' => true ),
            array('id' => 205, 'parent_id' => 2, 'category' => 'staff', 'name' => 'role', 'screen' => 'person', 'rus_name' => 'Роль служащего',
                'isNonIndependent' => true ),
            array('id' => 301, 'parent_id' => 3, 'category' => 'doc', 'name' => 'doc', 'screen' => 'doc', 'rus_name' => 'Документы'),
            array('id' => 302, 'parent_id' => 3, 'category' => 'doc', 'name' => 'doc_attribute', 'screen' => 'doc', 'rus_name' => 'Аттрибуты документа',
                'isNonIndependent' => true ),
            array('id' => 303, 'parent_id' => 3, 'category' => 'doc', 'name' => 'pass_docs', 'screen' => 'pass_docs', 'rus_name' => 'Документы удостоверяющие личность'),
            array('id' => 304, 'parent_id' => 3, 'category' => 'doc', 'name' => 'route', 'screen' => 'route', 'rus_name' => 'Маршрут'),
            array('id' => 305, 'parent_id' => 3, 'category' => 'doc', 'name' => 'route_node', 'screen' => 'route', 'rus_name' => 'Пункт маршрута',
                'isNonIndependent' => true ),
            array('id' => 306, 'parent_id' => 3, 'category' => 'doc', 'name' => 'route_node_attribute', 'screen' => 'route_node', 'rus_name' => 'Изменяемые в узле атрибуты',
                'isNonIndependent' => true ),
            array('id' => 401, 'parent_id' => 4, 'category' => 'unit', 'name' => 'unit', 'screen' => 'unit', 'rus_name' => 'Организация/Юр.Лицо/Подразделение'),
            array('id' => 402, 'parent_id' => 4, 'category' => 'unit', 'name' => 'unit_commander', 'screen' => 'unit', 'rus_name' => 'Руководство',
                'isNonIndependent' => true ),
            array('id' => 403, 'parent_id' => 4, 'category' => 'unit', 'name' => 'unit_positions', 'screen' => 'unit', 'rus_name' => 'Штатное расписание',
                'isNonIndependent' => true ),
            array('id' => 404, 'parent_id' => 4, 'category' => 'unit', 'name' => 'unit_doc_types', 'screen' => 'unit', 'rus_name' => 'Типы документов подразделения',
                'isNonIndependent' => true ),
            array('id' => 405, 'parent_id' => 4, 'category' => 'unit', 'name' => 'unit_routes', 'screen' => 'unit', 'rus_name' => 'Маршруты в подразделении',
                'isNonIndependent' => true ),
            array('id' => 406, 'parent_id' => 4, 'category' => 'unit', 'name' => 'unit_enumeration', 'screen' => 'unit', 'rus_name' => 'Нумерация в подразделении',
                'isNonIndependent' => true ),
            array('id' => 10501, 'parent_id' => 105, 'category' => 'base', 'name' => 'countries', 'screen' => 'countries', 'rus_name' => 'Страны'),
            array('id' => 10502, 'parent_id' => 105, 'category' => 'base', 'name' => 'address_types', 'screen' => 'address_types', 'rus_name' => 'Типы адреса'),
            array('id' => 10503, 'parent_id' => 105, 'category' => 'base', 'name' => 'region_types', 'screen' => 'region_types', 'rus_name' => 'Типы региона'),
            array('id' => 10504, 'parent_id' => 105, 'category' => 'base', 'name' => 'regions', 'screen' => 'regions', 'rus_name' => 'Регионы'),
            array('id' => 10505, 'parent_id' => 105, 'category' => 'base', 'name' => 'location_types', 'screen' => 'location_types', 'rus_name' => 'Типы нас. пункта'),
            array('id' => 10506, 'parent_id' => 105, 'category' => 'base', 'name' => 'street_types', 'screen' => 'street_types', 'rus_name' => 'Типы улиц'),
            array('id' => 10507, 'parent_id' => 105, 'category' => 'base', 'name' => 'sex_types', 'screen' => 'sex_types', 'rus_name' => 'Типы пола служащего'),
            array('id' => 106010, 'parent_id' => 106, 'category' => 'base', 'name' => 'period_types', 'screen' => 'period_types', 'rus_name' => 'Типы периодов'),
            array('id' => 106020, 'parent_id' => 106, 'category' => 'base', 'name' => 'enumeration_types', 'screen' => 'enumeration_types', 'rus_name' => 'Типы нумерации'),
            array('id' => 106021, 'parent_id' => 106, 'category' => 'base', 'name' => 'doc_type_groups', 'screen' => 'doc_type_groups', 'rus_name' => 'Группы типов документов'),
            array('id' => 106022, 'parent_id' => 106, 'category' => 'base', 'name' => 'doc_secrecy_types', 'screen' => 'doc_secrecy_types', 'rus_name' => 'Типы секретности документа'),
            array('id' => 106023, 'parent_id' => 106, 'category' => 'base', 'name' => 'doc_urgency_types', 'screen' => 'doc_urgency_types', 'rus_name' => 'Типы срочности документа'),
            array('id' => 106030, 'parent_id' => 106, 'category' => 'base', 'name' => 'doc_types', 'screen' => 'doc_types', 'rus_name' => 'Типы документов'),
            array('id' => 106040, 'parent_id' => 106, 'category' => 'base', 'name' => 'node_types', 'screen' => 'node_types', 'rus_name' => 'Типы узлов маршрута'),
            array('id' => 106050, 'parent_id' => 106, 'category' => 'base', 'name' => 'doc_attributes_types', 'screen' => 'doc_attributes_types', 'rus_name' => 'Типы аттрибутов'),
            array('id' => 106060, 'parent_id' => 106, 'category' => 'base', 'name' => 'enumeration', 'screen' => 'enumeration', 'rus_name' => 'Нумерация')
        );

        $sys = array(
            array('id' => 10501, 'category' => 'base', 'entity' => 'countries', 'screen' => 'countries', 'name' => 'Страны'),
            array('id' => 10502, 'category' => 'base', 'entity' => 'address_types', 'screen' => 'address_types', 'name' => 'Типы адреса'),
            array('id' => 10503, 'category' => 'base', 'entity' => 'region_types', 'screen' => 'region_types', 'name' => 'Типы региона'),
            array('id' => 10504, 'category' => 'base', 'entity' => 'regions', 'screen' => 'regions', 'name' => 'Регионы'),
            array('id' => 10505, 'category' => 'base', 'entity' => 'location_types', 'screen' => 'location_types', 'name' => 'Типы нас. пункта'),
            array('id' => 10506, 'category' => 'base', 'entity' => 'street_types', 'screen' => 'street_types', 'name' => 'Типы улиц'),
            array('id' => 10507, 'category' => 'base', 'entity' => 'sex_types', 'screen' => 'sex_types', 'name' => 'Типы пола служащего'),
        );

        $sys_docs = array(
            array('id' => 106010, 'category' => 'base', 'entity' => 'period_types', 'screen' => 'period_types', 'name' => 'Типы периодов'),
            array('id' => 106020, 'category' => 'base', 'entity' => 'enumeration_types', 'screen' => 'enumeration_types', 'name' => 'Типы нумерации'),
            array('id' => 106021, 'category' => 'base', 'entity' => 'doc_type_groups', 'screen' => 'doc_type_groups', 'name' => 'Группы типов документов'),
            array('id' => 106022, 'category' => 'base', 'entity' => 'secrecy_types', 'screen' => 'doc_secrecy_types', 'name' => 'Типы секретности документа'),
            array('id' => 106023, 'category' => 'base', 'entity' => 'urgency_types', 'screen' => 'doc_urgency_types', 'name' => 'Типы срочности документа'),
            array('id' => 106030, 'category' => 'base', 'entity' => 'doc_types', 'screen' => 'doc_types', 'name' => 'Типы документов'),
            array('id' => 106040, 'category' => 'base', 'entity' => 'node_types', 'screen' => 'node_types', 'name' => 'Типы узлов маршрута'),
            array('id' => 106050, 'category' => 'base', 'entity' => 'attribute_types', 'screen' => 'attribute_types', 'name' => 'Типы аттрибутов'),
            array('id' => 106060, 'category' => 'base', 'entity' => 'enumeration', 'screen' => 'enumeration', 'name' => 'Нумерация'),
        );

        /*BASE 1 LVL */
        $array_base = array(
            array('id' => 101, 'category' => 'base', 'entity' => 'ranks', 'screen' => 'ranks', 'name' => 'Звания'),
            array('id' => 102, 'category' => 'base', 'entity' => 'posts', 'screen' => 'posts', 'name' => 'Должности'),
            array('id' => 103, 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'positions', 'name' => 'Соответствие звания должности',
                'isNonIndependent' => true ),
            array('id' => 104, 'category' => 'base', 'entity' => 'person_document_types', 'screen' => 'person_document_types', 'name' => 'Типы удостоверяющих личность документов'),
            array('id' => 105, 'category' => 'base', 'entity' => 'sys', 'screen' => 'sys', 'name' => 'Основные настройки', 'isNotScreen' => true,
                'childNodes' => $sys),
            array('id' => 106, 'category' => 'base', 'entity' => 'sys_docs', 'screen' => 'sys_docs', 'name' => 'Настройки документов', 'isNotScreen' => true,
                'childNodes' => $sys_docs
            ),
            array('id' => 107, 'category' => 'base', 'entity' => 'commander_types', 'screen' => 'commander_types', 'name' => 'Тип руководства подразделения'),

        );

        $array_staff = array(
            array('id' => 201, 'category' => 'staff', 'entity' => 'person', 'screen' => 'person', 'name' => 'Картотека Личных дел'),
            array('id' => 202, 'category' => 'staff', 'entity' => 'person_position_history', 'screen' => 'person', 'name' => 'История назначений',
                'isNonIndependent' => true ),
            array('id' => 203, 'category' => 'staff', 'entity' => 'person_rank_history', 'screen' => 'person', 'name' => 'История присвоения званий',
                'isNonIndependent' => true ),
            array('id' => 204, 'category' => 'staff', 'entity' => 'person_address', 'screen' => 'person', 'name' => 'Адрес лица',
                'isNonIndependent' => true ),
            array('id' => 205, 'category' => 'staff', 'entity' => 'role', 'screen' => 'person', 'name' => 'Роль служащего',
                'isNonIndependent' => true ),
        );

        $array_doc = array(
            array('id' => 301, 'category' => 'doc', 'entity' => 'doc', 'screen' => 'doc', 'name' => 'Документы'),
            array('id' => 302, 'category' => 'doc', 'entity' => 'doc_attribute', 'screen' => 'doc', 'name' => 'Аттрибуты документа',
                'isNonIndependent' => true ),
            array('id' => 303, 'category' => 'doc', 'entity' => 'pass_docs', 'screen' => 'pass_docs', 'name' => 'Документы удостоверяющие личность'),
            array('id' => 304, 'category' => 'doc', 'entity' => 'route', 'screen' => 'route', 'name' => 'Маршрут'),
            array('id' => 305, 'category' => 'doc', 'entity' => 'route_node', 'screen' => 'route', 'name' => 'Пункт маршрута',
                'isNonIndependent' => true ),
            array('id' => 306, 'category' => 'doc', 'entity' => 'route_node_attribute', 'screen' => 'route_node', 'name' => 'Изменяемые в узле атрибуты',
                'isNonIndependent' => true )
        );

        $array_unit = array(
            array('id' => 401, 'category' => 'unit', 'entity' => 'unit', 'screen' => 'unit', 'name' => 'Организация/Юр.Лицо/Подразделение'),
            array('id' => 402, 'category' => 'unit', 'entity' => 'unit_commander', 'screen' => 'unit', 'name' => 'Руководство',
                'isNonIndependent' => true ),
            array('id' => 403, 'category' => 'unit', 'entity' => 'unit_positions', 'screen' => 'unit', 'name' => 'Штатное расписание',
                'isNonIndependent' => true ),
            array('id' => 404, 'category' => 'unit', 'entity' => 'unit_doc_types', 'screen' => 'unit', 'name' => 'Типы документов подразделения',
                'isNonIndependent' => true ),
            array('id' => 405, 'category' => 'unit', 'entity' => 'unit_routes', 'screen' => 'unit', 'name' => 'Маршруты в подразделении',
                'isNonIndependent' => true ),
            array('id' => 406, 'category' => 'unit', 'entity' => 'unit_enumeration', 'screen' => 'unit', 'name' => 'Нумерация в подразделении',
                'isNonIndependent' => true ),
        );


        $data_array = array(
            array('id' => 1, 'entity' => 'base', 'screen' => 'base', 'name' => 'Базовые определения', 'isNotScreen' => true,
                'childNodes' => $array_base),
            array('id' => 2, 'entity' => 'staff', 'screen' => 'staff', 'name' => 'Персонал', 'isNotScreen' => true,
                'childNodes' => $array_staff),
            array('id' => 3, 'entity' => 'doc', 'screen' => 'doc', 'name' => 'Документы', 'isNotScreen' => true,
                'childNodes' => $array_doc),
            array('id' => 4, 'entity' => 'unit', 'screen' => 'unit', 'name' => 'Подразделение', 'isNotScreen' => true,
                'childNodes' => $array_unit),
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function indexAction()
    {
        $data_array = array(
            array('catalog' => 'controller', 'index' => 'action')
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    /*public function attributetypesAction(){

        $ranks_array =array(
            array('id' => 1, 'name' => 'Рядовой', 'short_name' => 'ряд.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 2, 'name' => 'Ефрейтор','short_name' => 'ефр.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null)
        );

        $data_array = array(
            array('id' => 1, 'name' => 'Начальник Штаба', 'short_name' => 'Нач.штаба', 'allowed_ranks' => $ranks_array),
            array('id' => 2, 'name' => 'Начальник пищеблока', 'short_name' => 'Нач. пищеблока', 'allowed_ranks' => $ranks_array)
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        //$this->getResponse()->setStatusCode(404);
        return $JsonModel;
    }
    */


    public function ranksAction(){

        /*
         * [{id:1, is_officer:false, name:"Рядовой", short_name:null, description:null, created_at:1408439617871, deleted_at:null}]
         * */

        $data_array = '';

        $data_array = array(
            array('id' => 1, 'name' => 'Рядовой', 'short_name' => 'ряд.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 2, 'name' => 'Ефрейтор','short_name' => 'ефр.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 3, 'name' => 'Младший сержарт','short_name' => 'мл. серж.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 4, 'name' => 'Сержант','short_name' => 'серж.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 5, 'name' => 'Старший сержант','short_name' => 'ст. сержант', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null)
        );

        //$data_array = array();

        $request = $this->getRequest();

        if($request->isPost()){

        }
        if($request->isDelete()){
            $data_array = $this->remove($data_array);
        }

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);

        //$this->getResponse()->setStatusCode(404);
        return $JsonModel;
    }

    public function postsAction(){

        $ranks_array =array(
            array('id' => 1, 'name' => 'Рядовой', 'short_name' => 'ряд.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 2, 'name' => 'Ефрейтор','short_name' => 'ефр.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null)
        );

        $data_array = array(
            array('id' => 1, 'name' => 'Начальник Штаба', 'short_name' => 'Нач.штаба', 'allowed_ranks' => $ranks_array),
            array('id' => 2, 'name' => 'Начальник пищеблока', 'short_name' => 'Нач. пищеблока', 'allowed_ranks' => $ranks_array)
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        //$this->getResponse()->setStatusCode(404);
        return $JsonModel;
    }


    public function secrecytypesAction(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'singleNumeration' => 'Единая нумерация');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('id' => 1, 'name' => 'Для Служебного Пользования', 'shortname'=> 'ДПС', 'singleNumeration' => false),
            array('id' => 2, 'name' => 'Секретно', 'shortname'=> 'С', 'singleNumeration' => true),
            array('id' => 3, 'name' => 'Совершенно Секретно', 'shortname'=> 'СС', 'singleNumeration' => true),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function urgencytypesAction(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('id' => 1, 'name' => 'Не срочно', 'shortname'=> 'НС' ),
            array('id' => 2, 'name' => 'Очень Срочно', 'shortname'=> 'ОС'),
            array('id' => 3, 'name' => 'Супер Срочно', 'shortname'=> 'СС'),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function doctypesAction(){
        /*
         * Генерируется из таблиц DocTypeGroupContent и DocTypeGroups
         * */

        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'code' => 'Код',
            'header' => 'Заголовок', 'isService' => 'Служебный', 'secrecy_type' => 'Секретность', 'urgency_type' => 'Срочность');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_doc_type_contents = array(
            array('id' => 1, 'doc_type_id' =>  1, 'doc_group_id' => 1),
            array('id' => 2, 'doc_type_id' =>  2, 'doc_group_id' => 110),
            array('id' => 3, 'doc_type_id' =>  3, 'doc_group_id' => null),
        );

        $third =
            array(
                'id' => 3,
                'name' => 'Точка',
                'description' => 'Точка на карте',
                'base_attr_type' => 9, //составной
                'verify_method' => null,
                'listValues' => array(),
                'max' => null, //не имеет собственного значения
                'min' => null,
                'mask' => null,
                'max_length' => null,
                'parents' => array(5),
                'all_parents' => array(5),
                'attribute_type_childs' => null  //$first, $second 1,2,3 x,y, название точки
            );
        $fourth=
            array(
                'id' => 4,
                'name' => 'Название',
                'description' => 'Тестовое наименование чего-либо',
                'base_attr_type' => 3, //составной
                'verify_method' => null,
                'listValues' => array(),
                'max' => null,
                'min' => null,
                'mask' => null,
                'max_length' => 1024,
                'parents' => array(5, 3),
                'all_parents' => array(5, 3),
                'attribute_type_childs' => null
            );

        $attributes_array = array($third, $fourth);
        $attributes_array_else = array($fourth);

        $data_array = array(
            array('id' => 1, 'doc_group_id' => array(1001, 1002), 'name' => 'Воздушная тревога', 'shortname'=> 'С-ВТ', 'code' => '555',
                'header' => 'Воздушная тревога!', 'is_service' => false, 'secrecy_types' => 2, 'urgency_types' => 3, 'attribute_types' => $attributes_array_else,
                'presentation' => null),
            array('id' => 2, 'doc_group_id' => 110, 'name' => 'Приказ на списание', 'shortname'=> 'ПхСп', 'code' => '1001',
                'header' => '', 'is_service' => false, 'secrecy_types' => 1, 'urgency_types' => 1, 'attribute_types' => $attributes_array_else,
                'presentation' => null),
            array('id' => 3, 'doc_group_id' => null, 'name' => 'Добавление объекта картографии', 'shor_tname'=> 'СК-Д', 'code' => '2001',
                'header' => 'Добавление объекта на общую карту', 'is_service' => true, 'secrecy_types' => 1, 'urgency_types' => 1, 'attribute_types' => $attributes_array,
                'presentation' => null),
        );

        /*
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }
        */

        /* <REST> ------  */
        //$data_array = $this->restApi($data_array);
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        /* </REST> ------  */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function doctypegroupsAction(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'is_service' => 'Служебный документ');
        $prototype_array = array('editable_properties' => $editable_array);

        /*
        $combat = array(
            array('id' => 1001, 'parent_id' => 100, 'name' => 'Общевойсковые', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 1002, 'parent_id' => 100, 'name' => 'Индивидуальные', 'shortname'=> 'ПХ', 'is_service' => false)
        );

        $economic = array(
            array('id' => 1101, 'parent_id' => 110, 'name' => 'Персонал', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 1102, 'parent_id' => 110, 'name' => 'Материальная часть', 'shortname'=> 'ПХ', 'is_service' => false)
        );

        $child_1 = array(
            array('id' => 100, 'parent_id' => 2, 'name' => 'Боевые', 'shortname'=> 'ПБ', 'is_service' => false,
                'childNodes' => $combat),
            array('id' => 110, 'parent_id' => 2, 'name' => 'Хозяйственные', 'shortname'=> 'ПХ', 'is_service' => false,
                'childNodes' => $economic)
        );

        $data_array = array(
            array('id' => 2, 'parent_id' => 1, 'name' => 'Сигналы', 'shortname'=> 'С', 'is_service' => false),
            array('id' => 3, 'parent_id' => 1, 'name' => 'Приказы', 'shortname'=> 'П', 'is_service' => false,
                'childNodes' => $child_1), //                'childNodes' => $child_1
            array('id' => 4, 'parent_id' => 1, 'name' => 'Служебные', 'shortname'=> 'сист.', 'is_service' => true,),
        );

        $new_data_array = array(
            'id' => 1, 'parent_id' => null, 'name' => 'Группы типов документов', 'shortname'=> 'ПХ', 'is_service' => true,
            'childNodes' => $data_array
        );
        */
        $super_new_array = array(
            array('id' => 1, 'parent' => null, 'name' => 'Группы типов документов', 'shortname'=> 'ПХ', 'is_service' => true),
            array('id' => 2, 'parent' => 1, 'name' => 'Сигналы', 'shortname'=> 'С', 'is_service' => false),
            array('id' => 3, 'parent' => 1, 'name' => 'Приказы', 'shortname'=> 'П', 'is_service' => false),
            array('id' => 4, 'parent' => 1, 'name' => 'Служебные', 'shortname'=> 'сист.', 'is_service' => true,),
            array('id' => 100, 'parent' => 3, 'name' => 'Боевые', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 110, 'parent' => 3, 'name' => 'Хозяйственные', 'shortname'=> 'ПХ', 'is_service' => false),
            array('id' => 1101, 'parent' => 110, 'name' => 'Персонал', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 1102, 'parent' => 110, 'name' => 'Материальная часть', 'shortname'=> 'ПХ', 'is_service' => false),
            array('id' => 1001, 'parent' => 100, 'name' => 'Общевойсковые', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 1002, 'parent' => 100, 'name' => 'Индивидуальные', 'shortname'=> 'ПХ', 'is_service' => false)
        );

        //$response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($super_new_array);
        return $JsonModel;
    }

    public function boilplateAction(){

        $data_array = array(
            array('id' => 1, 'name' => ''),
            array('id' => 2, 'name' => '')
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function remove($array){
        $id = null;
        $id = $this->getEvent()->getRouteMatch()->getParam('id', 0);

        if($id!=null){
            $new_array = array();

            foreach($array as $key => $item){
                if($item['id'] != $id){
                    $new_array[] = $item;
                }
            }
            return $new_array;
        }
    }

    public function attributetypesAction(){
        /*
         *       •	целое,  1
                 •	вещественное, 2
                 •	текст,  3
                 •	булевский, 4
                 •	Дата, 5
                 •	Время,  6
                 •	Дата/время, 7
                 •	Список,8
                 •	Составной9.
         * */


            $first =
            array(
                'id' => 1,
                'name' => 'X',
                'description' => 'Координата X',
                'base_attr_type' => 2,
                'verify_method' => null,
                'list_values' => array(),
                'max' => null,
                'min' => null,
                'mask' => null,
                'max_length' => null,
                'parents' => array(3), //уровень выше - точка
                'all_parents' => array(3, 5), //точка и на уровень выше - маршрут
                'attribute_type_childs' => null
            );

        $second =
            array(
                'id' => 2,
                'name' => 'Y',
                'description' => 'Координата Y',
                'base_attr_type' => 2,
                'verify_method' => null,
                'list_values' => array(),
                'max' => null,
                'min' => null,
                'mask' => null,
                'max_length' => null,
                'parents' => array(3),//уровень выше - точка
                'all_parents' => array(3,5),//точка и на уровень выше - маршрут
                'attribute_type_childs' => null
            );
        $third =
            array(
                'id' => 3,
                'name' => 'Точка',
                'description' => 'Точка на карте',
                'base_attr_type' => 9, //составной
                'verify_method' => null,
                'list_values' => array(),
                'max' => null, //не имеет собственного значения
                'min' => null,
                'mask' => null,
                'max_length' => null,
                'parents' => array(5),
                'all_parents' => array(5),
                'attribute_type_childs' => array($first, $second)  //$first, $second 1,2,3 x,y, название точки
            );
            $fourth=
            array(
                'id' => 4,
                'name' => 'Название',
                'description' => 'Тестовое наименование чего-либо',
                'base_attr_type' => 3, //составной
                'verify_method' => null,
                'list_values' => array(),
                'max' => null,
                'min' => null,
                'mask' => null,
                'max_length' => 1024,
                'parents' => array(5, 3),
                'all_parents' => array(5, 3),
                'attribute_type_childs' => null
            );
            $five =
            array(
                'id' => 5,
                'name' => 'Маршрут',
                'description' => 'Маршрут из нескольких точек на карте',
                'base_attr_type' => 9, //составной
                'verify_method' => null,
                'list_values' => array(),
                'max' => null,
                'min' => null,
                'mask' => null,
                'max_length' => null,
                'parents' => null,
                'all_parents' => null,
                'attribute_type_childs' => array($third, $fourth)//$third, $four 3,4 точка, название маршрута
            );
            $six =
                array(
                    'id' => 6,
                    'name' => 'Список',
                    'description' => 'Список с вариантами',
                    'base_attr_type' => 8, //список
                    'verify_method' => null,
                    'list_values' => array(
                        array('id' => 1, 'value' => 1, 'name'=> 'Вариант 1', 'description' => ''),
                        array('id' => 2, 'value' => 2, 'name'=> 'Вариант 2', 'description' => ''),
                        array('id' => 3, 'value' => 3, 'name'=> 'Вариант 3', 'description' => ''),
                        array('id' => 4, 'value' => 4, 'name'=> 'Вариант 4', 'description' => ''),
                        array('id' => 5, 'value' => 5, 'name'=> 'Вариант 5', 'description' => '')
                    ),
                    'max' => null,
                    'min' => null,
                    'mask' => null,
                    'max_length' => null,
                    'parents' => null,
                    'all_parents' => null,
                    'attribute_type_childs' => array($third, $fourth)//$third, $four 3,4 точка, название маршрута
                );

        $data_array = array($first, $second, $third, $fourth, $five, $six);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function persondoctypesAction(){
        /*
         * Предполагается что экшен возращает выборку соответствующих входящему post_id
         * */

        $editable_array = array('name' => 'Название', 'is_full' => 'Полная идентификация',
            'isMain'=> 'Основной', 'isSeries' => 'Используется серия документа', 'seriesMask' => 'Маска серии', 'numberMask' => 'Маска номера', 'validPeriod' => '');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('id' => 1, 'name' => 'Паспорт', 'is_full'=> true, 'is_main' => true, 'is_series' => true,
                'series_mask' => '', 'number_mask' => '', 'valid_period' => ''),
            array('id' => 2, 'name' => 'Водительские права', 'is_full'=> true, 'is_main' => true, 'is_series' => true,
                'series_mask' => '', 'number_mask' => '', 'valid_period' => ''),
            array('id' => 3, 'name' => 'Загранпаспорт гражданина РФ', 'is_full'=> true, 'is_main' => false, 'is_series' => true,
                'series_mask' => '', 'number_mask' => '', 'valid_period' => ''),
        );


        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        //$response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function countriesAction(){
        $editable_array = array('code' => 'Код', 'name' => 'Название', 'fullname' => 'Полное название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'code' => 'ABH', 'name' => 'Абхазия', 'full_name'=> 'Республика Абхазия'),
            array('id' => 2, 'code' => 'AUS', 'name' => 'Австралия', 'full_name'=> 'Австралия'),
            array('id' => 3, 'code' => 'AUT', 'name' => 'Австрия', 'full_name'=> 'Австрийская Республика'),
            array('id' => 4, 'code' => 'AZE', 'name' => 'Азербайджан', 'full_name'=> 'Республика Азербайджан'),
            array('id' => 5, 'code' => 'ALB', 'name' => 'Албания', 'full_name'=> 'Республика Албания'),
            array('id' => 6, 'code' => 'DZA', 'name' => 'Алжир', 'full_name'=> 'Алжирская Народная Демократическая Республика'),
            array('id' => 7, 'code' => 'ASM', 'name' => 'Американское Самоа', 'full_name'=> 'Американское Самоа'),
            array('id' => 8, 'code' => 'AIA', 'name' => 'Ангилья', 'full_name'=> 'Ангилья'),
            array('id' => 9, 'code' => 'AGO', 'name' => 'Ангола', 'full_name'=> 'Республика Ангола'),
            array('id' => 10, 'code' => 'AND', 'name' => 'Андорра', 'full_name'=> 'Княжество Андорра'),
            array('id' => 11, 'code' => 'ATA', 'name' => 'Антарктида', 'full_name'=> 'Антарктида'),
            array('id' => 12, 'code' => 'ATG', 'name' => 'Антигуа и Барбуда', 'full_name'=> 'Антигуа и Барбуда'),
            //array('id' => 12, 'code' => '', 'name' => '', 'fullname'=> ''),

        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function addresstypesAction(){
        $editable_array = array('name' => 'Название', 'priority' => 'Приоритет');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Регистрации', 'priority'=> 1),
            array('id' => 2, 'name' => 'Проживания', 'priority'=> 2),
            array('id' => 3, 'name' => 'Почтовый', 'priority'=> 3),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function regiontypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Республика', 'shortname'=> 'респ.'),
            array('id' => 2, 'name' => 'Край', 'shortname'=> 'к-1.'),
            array('id' => 3, 'name' => 'Область', 'shortname'=> 'обл.'),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function regionsAction(){
        $editable_array = array('code' => 'Код субьекта РФ', 'region_type' => 'Тип региона', 'name' => 'Название', 'description' => 'Описание');
        $prototype_array = array('editable_properties' => $editable_array);

        ///$type_republic =  array('id' => 1, 'name' => 'Республика', 'shortname'=> 'респ.');
        $type_republic =  1;
        //$type_region =  array('id' => 2, 'name' => 'Край', 'shortname'=> 'к-1.');
        $type_region =  2;

        $data_array = array(
            array('id' => 1, 'code' => '1', 'region_types' => $type_republic, 'name' => 'Республика Адыгея', 'description'=> ''),
            array('id' => 2, 'code' => '2', 'region_types' => $type_republic, 'name' => 'Республика Башкортостан', 'description'=> ''),
            array('id' => 3, 'code' => '3', 'region_types' => $type_republic, 'name' => 'Республика Бурятия', 'description'=> ''),
            array('id' => 4, 'code' => '4', 'region_types' => $type_republic, 'name' => 'Республика Алтай', 'description'=> ''),
            array('id' => 5, 'code' => '5', 'region_types' => $type_republic, 'name' => 'Республика Дагестан', 'description'=> ''),
            array('id' => 6, 'code' => '6', 'region_types' => $type_republic, 'name' => 'Республика Ингушетия', 'description'=> ''),
            array('id' => 7, 'code' => '7', 'region_types' => $type_republic, 'name' => 'Кабардино-Балкарская Республика', 'description'=> ''),
            array('id' => 8, 'code' => '8', 'region_types' => $type_republic, 'name' => 'Республика Калмыкия', 'description'=> ''),
            array('id' => 9, 'code' => '9', 'region_types' => $type_republic, 'name' => 'Республика Карачаево-Черкесия', 'description'=> ''),
            array('id' => 10, 'code' => '10', 'region_types' => $type_republic, 'name' => 'Республика Карелия', 'description'=> ''),
            array('id' => 11, 'code' => '11', 'region_types' => $type_republic, 'name' => 'Республика Коми', 'description'=> ''),
            array('id' => 12, 'code' => '12', 'region_types' => $type_republic, 'name' => 'Республика Марий Эл', 'description'=> ''),
            array('id' => 13, 'code' => '13', 'region_types' => $type_republic, 'name' => 'Республика Мордовия', 'description'=> ''),
            array('id' => 14, 'code' => '14', 'region_types' => $type_republic, 'name' => 'Республика Саха (Якутия)', 'description'=> ''),
            array('id' => 15, 'code' => '15', 'region_types' => $type_republic, 'name' => 'Республика Северная Осетия-Алания', 'description'=> ''),
            array('id' => 16, 'code' => '16', 'region_types' => $type_republic, 'name' => 'Республика Татарстан', 'description'=> ''),
            array('id' => 17, 'code' => '17', 'region_types' => $type_republic, 'name' => 'Республика Тыва', 'description'=> ''),
            array('id' => 18, 'code' => '18', 'region_types' => $type_republic, 'name' => 'Удмуртская Республика', 'description'=> ''),
            array('id' => 19, 'code' => '19', 'region_types' => $type_republic, 'name' => 'Республика Хакасия', 'description'=> ''),
            array('id' => 20, 'code' => '20', 'region_types' => $type_republic, 'name' => 'Чувашская Республика', 'description'=> ''),
            array('id' => 21, 'code' => '21', 'region_types' => $type_region, 'name' => 'Алтайский край', 'description'=> ''),
            array('id' => 22, 'code' => '22', 'region_types' => $type_region, 'name' => 'Краснодарский край', 'description'=> ''),
            array('id' => 23, 'code' => '23', 'region_types' => $type_region, 'name' => 'Красноярский край', 'description'=> ''),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function locationtypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Город', 'short_name'=> 'г.'),
            array('id' => 2, 'name' => 'Поселок городского типа', 'short_name'=> 'п.г.т.'),
            array('id' => 3, 'name' => 'Рабочий посёлок', 'short_name'=> 'р.п.'),
            array('id' => 4, 'name' => 'Курортный посёлок', 'short_name'=> 'к.п.'),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function streettypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Аллея', 'short_name'=> 'алл.'),
            array('id' => 2, 'name' => 'Бульвар', 'short_name'=> 'бул.'),
            array('id' => 3, 'name' => 'Проезд', 'short_name'=> 'п-зд.'),
            array('id' => 4, 'name' => 'Переулок', 'short_name'=> 'пер.'),
        );
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function sextypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Мужской', 'short_name'=> 'м'),
            array('id' => 2, 'name' => 'Женский', 'short_name'=> 'ж'),
        );
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function commandertypesAction(){
        $editable_array = array('name' => 'Название', 'priority' => 'Приоритет');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Командир', 'priority'=> 1),
            array('id' => 2, 'name' => 'Начальник', 'priority'=> 2),
            array('id' => 3, 'name' => 'Ответственный исполнитель за обработку корреспонденции', 'priority'=> 3),
        );
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function periodtypesAction(){
        $editable_array = array('name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'День'),
            array('id' => 2, 'name' => 'Месяц'),
            array('id' => 3, 'name' => 'Год'),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;

    }

    public function enumerationtypesAction(){
        $editable_array = array('name' => 'Название', 'mask' => 'Маска', 'isPeriodic' => 'Признак переодичности сброса',
            'period_type' => 'Тип переода для сброса счетчика', 'period_length' => 'Длительность периода', 'start_date' => 'Начало действия',
            'min_index' => 'Стартовое значение при сбросе', 'isDraft' => 'Черновик');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Черновики', 'mask' => 'Ч%y-%n', 'is_periodic' => true, 'period_types' => 1,
                'period_length' => 1, 'start_date' => '01.01.2014','start_index' => 0, 'is_draft' => ''),

            array('id' => 2, 'name' => 'Исходящие документы', 'mask' => 'И%y-%n', 'is_periodic' => true, 'period_types' => 2,
                'period_length' => 1, 'start_date' => '01.01.2014','start_index' => 0, 'is_draft' => ''),

            array('id' => 3, 'name' => 'Секретные', 'mask' => 'С%y-%n', 'is_periodic' => true, 'period_types' => 3,
                'period_length' => 1, 'start_date' => '01.01.2014','start_index' => 0, 'is_draft' => false)
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function nodetypesAction(){
        $editable_array = array(
            'name' => 'Название',
        );
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Автор'),
            array('id' => 2, 'name' => 'Соредактор'),
            array('id' => 3, 'name' => 'Визирующий'),
            array('id' => 4, 'name' => 'Утверждающий'),
            array('id' => 5, 'name' => 'Исполнитель')
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        /* <REST> ------  */
        //$data_array = $this->restApi($data_array);
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        /* </REST> ------  */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function unitsAction(){

        $super_new_array = array(
            array('id' => 1, 'parent' => null, 'name' => 'Брянская областная Дума', 'shortname'=> 'ПХ', 'is_service' => true),
            array('id' => 2, 'parent' => 1, 'name' => 'Секретариат', 'shortname'=> 'С', 'is_service' => false),
            array('id' => 3, 'parent' => 1, 'name' => 'Правовое управление', 'shortname'=> 'П', 'is_service' => false),
            array('id' => 4, 'parent' => 1, 'name' => 'Общий отдел', 'shortname'=> 'сист.', 'is_service' => true,),
            array('id' => 5, 'parent' => 1, 'name' => 'Финансовый отдел', 'shortname'=> 'сист.', 'is_service' => true,),
            array('id' => 6, 'parent' => 1, 'name' => 'Информационно-аналитический отдел', 'shortname'=> 'сист.', 'is_service' => true,),
            array('id' => 100, 'parent' => 3, 'name' => 'Антикоррупционный отдел', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 110, 'parent' => 3, 'name' => 'Экономический отдел', 'shortname'=> 'ПХ', 'is_service' => false),
            array('id' => 1102, 'parent' => 4, 'name' => 'Отдел материально-технического обеспечения', 'shortname'=> 'ПХ', 'is_service' => false),
            array('id' => 1001, 'parent' => 4, 'name' => 'Отдел государственной службы и кадров', 'shortname'=> 'ПБ', 'is_service' => false),
            array('id' => 1002, 'parent' => 4, 'name' => 'Кадровый отдел', 'shortname'=> 'ПХ', 'is_service' => false)
        );

        //$response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($super_new_array);
        return $JsonModel;
    }

    public function personsAction(){
        $super_new_array = array(
            array('id' => 1, 'name' => 'Иван Иванович Батум', 'first_name' => 'Иван',  'patronymic' => 'Иванович', 'family_name' => 'Батум', 'birth_date' => '6.09.57', 'birth_place' => 'г. Москва', 'sex' => 'муж.', 'inn' => '', 'citizenship' => 'Россия'),
            array('id' => 2, 'name' => 'Ольга Петровна Васильева', 'first_name' => 'Ольга', 'patronymic' => 'Петровна', 'family_name' => 'Васильева', 'birth_date' => '12.11.77', 'birth_place' => 'г. Орджоникиндзеград', 'sex' => 'жен.', 'inn' => '', 'citizenship' => 'Россия'),
            array('id' => 3, 'name' => 'Дмитрий Семенович Корчагин', 'first_name' => 'Дмитрий', 'patronymic' => 'Семенович', 'family_name' => 'Корчагин', 'birth_date' => '15.10.72', 'birth_place' => 'г. Омск', 'sex' => 'муж.', 'inn' => '', 'citizenship' => 'Россия'),
            array('id' => 4, 'name' => 'Наталья Жоресовна Патронова', 'first_name' => 'Наталья', 'patronymic' => 'Жоресовна', 'family_name' => 'Патронова', 'birth_date' => '15.10.89', 'birth_place' => 'г. Курсе', 'sex' => 'жен.', 'inn' => '', 'citizenship' => 'Россия'),
            array('id' => 5, 'name' => 'Виктория Вадимовна Симоньян', 'first_name' => 'Виктория', 'patronymic' => 'Вадимовна', 'family_name' => 'Симоньян', 'birth_date' => '25.11.91', 'birth_place' => 'г. Куйбышев', 'sex' => 'жен.', 'inn' => '', 'citizenship' => 'Россия'),
            array('id' => 6, 'name' => 'Жанна Игоревна Иванова', 'first_name' => 'Жанна', 'patronymic' => 'Игоревна', 'family_name' => 'Иванова', 'birth_date' => '15.01.90', 'birth_place' => 'г.Кузбас', 'sex' => 'жен.', 'inn' => '', 'citizenship' => 'Россия'),
            array('id' => 7, 'name' => 'Богдан Викторович Ахметов', 'first_name' => 'Богдан', 'patronymic' => 'Викторович', 'family_name' => 'Ахметов', 'birth_date' => '12.06.81', 'birth_place' => 'г.Ставрополь', 'sex' => 'муж.', 'inn' => '', 'citizenship' => 'Россия')
        );

        /*
            id: null,
                name: null,
                patronymic: null,
                family: null,
                birth_date: null,
                birth_place: null,
                sex: null,
                inn: null,
                citizenship: null,
                deputy: null

        */

        //$response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($super_new_array);
        return $JsonModel;
    }

}

?>
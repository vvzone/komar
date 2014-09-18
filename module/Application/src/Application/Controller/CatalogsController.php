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

        /*$data_array = array(
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
        );*/

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
            array('id' => 106022, 'category' => 'base', 'entity' => 'doc_secrecy_types', 'screen' => 'doc_secrecy_types', 'name' => 'Типы секретности документа'),
            array('id' => 106023, 'category' => 'base', 'entity' => 'doc_urgency_types', 'screen' => 'doc_urgency_types', 'name' => 'Типы срочности документа'),
            array('id' => 106030, 'category' => 'base', 'entity' => 'doc_types', 'screen' => 'doc_types', 'name' => 'Типы документов'),
            array('id' => 106040, 'category' => 'base', 'entity' => 'node_types', 'screen' => 'node_types', 'name' => 'Типы узлов маршрута'),
            array('id' => 106050, 'category' => 'base', 'entity' => 'doc_attributes_types', 'screen' => 'doc_attributes_types', 'name' => 'Типы аттрибутов'),
            array('id' => 106060, 'category' => 'base', 'entity' => 'enumeration', 'screen' => 'enumeration', 'name' => 'Нумерация'),
        );

        /*BASE 1 LVL */
        $array_base = array(
            array('id' => 101, 'category' => 'base', 'entity' => 'ranks', 'screen' => 'ranks', 'name' => 'Звания'),
            array('id' => 102, 'category' => 'base', 'entity' => 'positions', 'screen' => 'positions', 'name' => 'Должности'),
            array('id' => 103, 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'positions', 'name' => 'Соответствие звания должности',
                'isNonIndependent' => true ),
            array('id' => 104, 'category' => 'base', 'entity' => 'pass_doc_types', 'screen' => 'pass_doc_types', 'name' => 'Типы удостоверяющих личность документов'),
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

    public function ranksAction(){

        /*
         * [{id:1, is_officer:false, name:"Рядовой", short_name:null, description:null, created_at:1408439617871, deleted_at:null}]
         * */
        $data_array = array(
            array('id' => 1, 'name' => 'Рядовой', 'short_name' => 'ряд.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 2, 'name' => 'Ефрейтор','short_name' => 'ефр.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 3, 'name' => 'Младший сержарт','short_name' => 'мл. серж.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 4, 'name' => 'Сержант','short_name' => 'серж.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 5, 'name' => 'Старший сержант','short_name' => 'ст. сержант', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null)
        );

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

    public function positionsAction(){

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

    public function doctypegroupsAction(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'is_service' => 'Служебный документ');
        $prototype_array = array('editable_properties' => $editable_array);

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
                'childNodes' => $child_1),
            array('id' => 4, 'parent_id' => 1, 'name' => 'Служебные', 'shortname'=> 'сист.', 'is_service' => true,),
        );

        $new_data_array = array(
            'id' => 1, 'parent_id' => null, 'name' => 'Группы типов документов', 'shortname'=> 'ПХ', 'is_service' => true,
            'childNodes' => $data_array
        );

        //$response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($new_data_array);
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

}

?>
<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        $return_array = array(
            'title' => 'Test title',
            'content' => 'test content'
        );

        //return new JsonModel($return_array);
        return new ViewModel();
    }


    public function testAction(){
        $data_array = 'Запрос к базе';
        $test = 'Test';
        $configArray =  array(
            'driver' => 'Mysqli',
            'database' => 'zend_db_example',
            'username' => 'developer',
            'password' => 'developer-password'
        );

        //$adapter = new Zend\Db\Adapter\Adapter($configArray);
        /*
        $adapter = new Zend\Db\Adapter\Adapter();*/

        //$test = $adapter->query('SELECT * FROM `moskit` WHERE 1');

        //$JsonModel = new JsonModel();
        //$JsonModel->setVariables($data_array);
        //return $JsonModel;
        return $test;
    }

    public function ajaxAction(){
        /*
         * isNonIndependent - output only in the parent screen
         * isNotScreen - no screen output
         * */
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

    public function pageAction(){
        //
    }

    public function ranksAction(){

        $editable_array = array('name' => 'Название', 'name_min' => 'Сокращенное название', 'description'=> 'Описание');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('name' => 'Рядовой', 'id' => 1, 'order' => 1),
            array('name' => 'Ефрейтор', 'id' => 2, 'order' => 2),
            array('name' => 'Младший сержант', 'id' => 3, 'order' => 3),
            array('name' => 'Сержант', 'id' => 4, 'order' => 4),
            array('name' => 'Старший сержант', 'id' => 5, 'order' => 5),
            array('name' => 'Старшина', 'id' => 6, 'order' => 6),
            array('name' => 'Прапорщик', 'id' => 7, 'order' => 7),
            array('name' => 'Старший прапорщик', 'id' => 8, 'order' => 8),
            array('name' => 'Младший лейтенант', 'id' => 9, 'order' => 9),
            array('name' => 'Лейтенант', 'id' => 10, 'order' => 10),
            array('name' => 'Старший лейтенант', 'id' => 11, 'order' => 11),
            array('name' => 'Капитан', 'id' => 12, 'order' => 12),
            array('name' => 'Майор', 'id' => 13, 'order' => 13),
            array('name' => 'Подполковник', 'id' => 14, 'order' => 14),
            array('name' => 'Полковник', 'id' => 15, 'order' => 15),
            array('name' => 'Генерал-майор', 'id' => 16, 'order' => 16),
            array('name' => 'Генерал-лейтенант', 'id' => 17, 'order' => 17),
            array('name' => 'Генерал-полковник', 'id' => 18, 'order' => 18),
            array('name' => 'Генерал армии', 'id' => 19, 'order' => 19),
            array('name' => 'Маршал Российской Федерации', 'id' => 20, 'order' => 20)
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }


        /*
         * old-style
         * */
        /*
        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        */
        /* <REST> ------  */
        $data_array = $this->restApi($data_array);
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        /* </REST> ------  */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function instantSearch($query, $data_array, $id = null){
        $full_data_array = $data_array;
        $data_array = array();

        if($query){
            $strlen = strlen($query);
            if($strlen < 4){
                $data_array = $full_data_array;
            }else{
                foreach($full_data_array as $key => $value){
                        if(strstr($value['name'], $query)){
                            $data_array[] = $full_data_array[$key];
                        }
                }
            }
        }

        if(!$query){
            $data_array = $full_data_array;
        }
        return $data_array;
    }


    public function baseSearchArray($array, $current_id, $search_pole_name){
        $result = array();

        //echo "foreach\n";
        foreach($array as $item){
            if(!is_array($item[$search_pole_name])){ //если поле не массив
                if($current_id == $item[$search_pole_name]){
                    /*echo "1\n";
                    echo "current_id= ".$current_id.' search_pole_value='.$item[$search_pole_name]."\n";*/
                    //ret $item;
                    $result[] = $item;
                }else{
                    /*echo "2-error\n";
                    echo "current_id= ".$current_id.' search_pole_value='.$item[$search_pole_name]."\n";*/
                    if(isset($item['childNodes'])){
                        //echo "2-success\n";
                        $result[] = $this->baseSearchArray($item['childNodes'], $current_id, $search_pole_name);
                    }
                }
            }else{ //если поле массив значений (связная таблица)
                //echo "3\n";
                foreach($item[$search_pole_name] as $value){
                    if($current_id == $value){
                        $result[] = $item;
                    }
                }
            }
        }
        if(count($result)>0){
            return $result;
        }
        return null;
    }

    public function searchArray($array, $current_id, $search_pole_name = null){
        if(!isset($search_pole_name)){
            return $this->baseSearchArray($array, $current_id, 'id');
        }else{ //если задано название поля
            if(!is_array($current_id)){ // current_id не массив
                //echo "search, current_id not array \n";
                return $this->baseSearchArray($array, $current_id, $search_pole_name);
            }else{ //current_id - массив значений
                $tree_array = array();
                foreach($current_id as $id){
                    $tree_array = $this->baseSearchArray($array, $id, $search_pole_name);
                }
                return $tree_array;
            }
        }
    }

    public function searchDependencies($values_array, $array, $search_pole_name){

    }

    public function checkArray($array, $current_id, $search_pole_name = null){

        if(!isset($search_pole_name)){
            foreach($array as $item){
                if($current_id == $item['id']){
                    return true;
                }else{
                    if(isset($item['childNodes'])){
                        return $result = $this->checkArray($item['childNodes'], $current_id);
                    }
                }
            }
        }else{
            foreach($array as $item){
                if($current_id == $item[$search_pole_name]){
                    return true;
                }else{
                    if(isset($item['childNodes'])){
                        return $result = $this->checkArray($item['childNodes'], $current_id, $search_pole_name);
                    }
                }
            }
        }
        return false;
    }

    public function positionsAction(){

        $editable_array = array('name' => 'Название', 'name_min' => 'Сокращенное название', 'description'=> 'Описание');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('name' => 'Командир полка', 'description'=> 'Описание тест описание тест тест описания тест', 'id' => 1, 'order' => 1),
            array('name' => 'Начальник штаба полка', 'id' => 2, 'order' => 2),
            array('name' => 'Начальник тыловой службы', 'id' => 3, 'order' => 3),
            array('name' => 'Начальник финансовой службы', 'id' => 4, 'order' => 4),
            array('name' => 'Заместитель командира полка по воспитательной части', 'id' => 5, 'order' => 5),
            array('name' => 'Заместитель начальника штаба полка', 'id' => 6, 'order' => 7),
            array('name' => 'Заместитель командира полка', 'id' => 7, 'order' => 6),
            array('name' => 'Заместитель начальника тыловой службы', 'id' => 8, 'order' => 8),
            array('name' => 'Заместитель начальника финансовой служб', 'id' => 9, 'order' => 9),
            array('name' => 'Начальник пищеблока', 'id' => 10, 'order' => 10),
            array('name' => 'Начальник пожарной службы', 'id' => 11, 'order' => 11),
            array('name' => 'Заместитель начальника пожарной службы', 'id' => 12, 'order' => 12),
            array('name' => 'Начальник медицинской службы', 'id' => 13, 'order' => 13),
            array('name' => 'Старший врач', 'id' => 14, 'order' => 14),
            array('name' => 'Врач', 'id' => 15, 'order' => 15),
            array('name' => 'Медсестра', 'id' => 16, 'order' => 16),
            array('name' => 'Пожарный', 'id' => 17, 'order' => 17),
            array('name' => 'Бухгалтер', 'id' => 18, 'order' => 18),
            array('name' => 'Сметчик', 'id' => 19, 'order' => 19),
            array('name' => 'Повар', 'id' => 20, 'order' => 20),
            array('name' => 'Водитель', 'id' => 21, 'order' => 21),
            array('name' => 'Сварщик', 'id' => 22, 'order' => 22),
            array('name' => 'Инженер КИПиА', 'id' => 23, 'order' => 23),
            array('name' => 'Монтажник', 'id' => 24, 'order' => 24),
            array('name' => 'Программист', 'id' => 25, 'order' => 25),
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
        $JsonModel->setVariables($response);

        return $JsonModel;

        /*
        $view = new ViewModel(array(
            'message' => 'Hello world',
        ));

        // Disable layouts; use this view model in the MVC event instead
        $view->setTerminal(true);

        return $view;*/
    }

    public function positionsranksAction(){
        /*
         * Предполагается что экшен возращает выборку соответтсвующих входящему post_id
         * */

        $editable_array = array();
        $prototype_array = array('editable_properties' => $editable_array);

        /*$data_array = array(
            1 => array('name' => 'Рядовой', 'id' => 1, 'order' => 1),
            2 => array('name' => 'Сержант', 'id' => 2, 'order' => 2),
            3 => array('name' => 'Старший сержант', 'id' => 3, 'order' => 3),
            4 => array('name' => 'Лейтенант', 'id' => 4, 'order' => 3),
            5 => array('name' => 'Старший лейтенант', 'id' => 5, 'order' => 3)
        );*/

        $data_array = array(
            array('id' => 4, 'order' => 1), //id, rank_id, pos_id, order
            array('id' => 5, 'order' => 2),
            array('id' => 6, 'order' => 3),
            array('id' => 7, 'order' => 4),
            array('id' => 8, 'order' => 5)
        );

        $current_id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        if($current_id){
            $data_array = $this->searchArray($data_array, $current_id);
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }


    public function passdoctypesAction(){
        /*
         * Предполагается что экшен возращает выборку соответтсвующих входящему post_id
         * */

        $editable_array = array('name' => 'Название', 'isFull' => 'Полная идентификация',
                                'isMain'=> 'Основной', 'isSeries' => 'Используется серия документа', 'seriesMask' => 'Маска серии', 'numberMask' => 'Маска номера', 'validPeriod' => '');
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('id' => 1, 'name' => 'Паспорт', 'isFull'=> true, 'isMain' => true, 'isSeries' => true,
            'seriesMask' => '', 'numberMask' => '', 'validPeriod' => ''),
            array('id' => 2, 'name' => 'Водительские права', 'isFull'=> true, 'isMain' => true, 'isSeries' => true,
                'seriesMask' => '', 'numberMask' => '', 'validPeriod' => ''),
            array('id' => 3, 'name' => 'Загранпаспорт гражданина РФ', 'isFull'=> true, 'isMain' => false, 'isSeries' => true,
                'seriesMask' => '', 'numberMask' => '', 'validPeriod' => ''),
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
        $JsonModel->setVariables($response);
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
        $JsonModel->setVariables($response);
        return $JsonModel;

    }

    public function countriesAction(){
        $editable_array = array('code' => 'Код', 'name' => 'Название', 'fullname' => 'Полное название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'code' => 'ABH', 'name' => 'Абхазия', 'fullname'=> 'Республика Абхазия'),
            array('id' => 2, 'code' => 'AUS', 'name' => 'Австралия', 'fullname'=> 'Австралия'),
            array('id' => 3, 'code' => 'AUT', 'name' => 'Австрия', 'fullname'=> 'Австрийская Республика'),
            array('id' => 4, 'code' => 'AZE', 'name' => 'Азербайджан', 'fullname'=> 'Республика Азербайджан'),
            array('id' => 5, 'code' => 'ALB', 'name' => 'Албания', 'fullname'=> 'Республика Албания'),
            array('id' => 6, 'code' => 'DZA', 'name' => 'Алжир', 'fullname'=> 'Алжирская Народная Демократическая Республика'),
            array('id' => 7, 'code' => 'ASM', 'name' => 'Американское Самоа', 'fullname'=> 'Американское Самоа'),
            array('id' => 8, 'code' => 'AIA', 'name' => 'Ангилья', 'fullname'=> 'Ангилья'),
            array('id' => 9, 'code' => 'AGO', 'name' => 'Ангола', 'fullname'=> 'Республика Ангола'),
            array('id' => 10, 'code' => 'AND', 'name' => 'Андорра', 'fullname'=> 'Княжество Андорра'),
            array('id' => 11, 'code' => 'ATA', 'name' => 'Антарктида', 'fullname'=> 'Антарктида'),
            array('id' => 12, 'code' => 'ATG', 'name' => 'Антигуа и Барбуда', 'fullname'=> 'Антигуа и Барбуда'),
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
        $JsonModel->setVariables($response);
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
        $JsonModel->setVariables($response);
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
        $JsonModel->setVariables($response);
        return $JsonModel;

    }

    public function locationtypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Город', 'shortname'=> 'г.'),
            array('id' => 2, 'name' => 'Поселок городского типа', 'shortname'=> 'п.г.т.'),
            array('id' => 3, 'name' => 'Рабочий посёлок', 'shortname'=> 'р.п.'),
            array('id' => 4, 'name' => 'Курортный посёлок', 'shortname'=> 'к.п.'),
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
        $JsonModel->setVariables($response);
        return $JsonModel;

    }

    public function streettypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Аллея', 'shortname'=> 'алл.'),
            array('id' => 2, 'name' => 'Бульвар', 'shortname'=> 'бул.'),
            array('id' => 3, 'name' => 'Проезд', 'shortname'=> 'п-зд.'),
            array('id' => 4, 'name' => 'Переулок', 'shortname'=> 'пер.'),
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
        $JsonModel->setVariables($response);
        return $JsonModel;

    }


    public function sextypesAction(){
        $editable_array = array('shortname' => 'Сокращение', 'name' => 'Название');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Мужской', 'shortname'=> 'м'),
            array('id' => 2, 'name' => 'Женский', 'shortname'=> 'ж'),
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
        $JsonModel->setVariables($response);
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
        $JsonModel->setVariables($response);
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
        $JsonModel->setVariables($response);
        return $JsonModel;

    }

    public function enumerationtypesAction(){
        $editable_array = array('name' => 'Название', 'mask' => 'Маска', 'isPeriodic' => 'Признак переодичности сброса',
            'period_type' => 'Тип переода для сброса счетчика', 'period_length' => 'Длительность периода', 'start_date' => 'Начало действия',
            'min_index' => 'Стартовое значение при сбросе', 'isDraft' => 'Черновик');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'name' => 'Черновики', 'mask' => 'Ч%y-%n', 'isPeriodic' => true, 'period_type' => 3,
                'period_length' => 1, 'start_date' => '01.01.2014','min_index' => 0, 'isDraft' => ''),

            array('id' => 2, 'name' => 'Исходящие документы', 'mask' => 'И%y-%n', 'isPeriodic' => true, 'period_type' => 3,
                'period_length' => 1, 'start_date' => '01.01.2014','min_index' => 0, 'isDraft' => ''),

            array('id' => 3, 'name' => 'Секретные', 'mask' => 'С%y-%n', 'isPeriodic' => true, 'period_type' => 3,
                'period_length' => 1, 'start_date' => '01.01.2014','min_index' => 0, 'isDraft' => false)
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
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function doctypegroupsAction(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'isService' => 'Служебный документ');
        $prototype_array = array('editable_properties' => $editable_array);

        $combat = array(
            array('id' => 1001, 'parent_id' => 100, 'name' => 'Общевойсковые', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1002, 'parent_id' => 100, 'name' => 'Индивидуальные', 'shortname'=> 'ПХ', 'isService' => false)
        );

        $economic = array(
            array('id' => 1101, 'parent_id' => 110, 'name' => 'Персонал', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1102, 'parent_id' => 110, 'name' => 'Материальная часть', 'shortname'=> 'ПХ', 'isService' => false)
        );

        $child_1 = array(
            array('id' => 100, 'parent_id' => 2, 'name' => 'Боевые', 'shortname'=> 'ПБ', 'isService' => false,
                'childNodes' => $combat),
            array('id' => 110, 'parent_id' => 2, 'name' => 'Хозяйственные', 'shortname'=> 'ПХ', 'isService' => false,
                'childNodes' => $economic)
        );

        $data_array = array(
            array('id' => 1, 'parent_id' => null, 'name' => 'Сигналы', 'shortname'=> 'С', 'isService' => false),
            array('id' => 2, 'parent_id' => null, 'name' => 'Приказы', 'shortname'=> 'П', 'isService' => false,
                'childNodes' => $child_1),
            array('id' => 3, 'parent_id' => null, 'name' => 'Служебные', 'shortname'=> 'сист.', 'isService' => true,),
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
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function docsecrecytypesAction(){
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
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function docurgencytypesAction(){
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
        $JsonModel->setVariables($response);
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

        $data_array = array(
            array('id' => 1, 'doc_group_id' => array(1001, 1002), 'name' => 'Воздушная тревога', 'shortname'=> 'С-ВТ', 'code' => '555',
                'header' => 'Воздушная тревога!', 'isService' => false, 'secrecy_type' => 2, 'urgency_type' => 3),
            array('id' => 2, 'doc_group_id' => 110, 'name' => 'Приказ на списание', 'shortname'=> 'ПхСп', 'code' => '1001',
                'header' => '', 'isService' => false, 'secrecy_type' => 1, 'urgency_type' => 1),
            array('id' => 3, 'doc_group_id' => null, 'name' => 'Добавление объекта картографии', 'shortname'=> 'СК-Д', 'code' => '2001',
                'header' => 'Добавление объекта на общую карту', 'isService' => true, 'secrecy_type' => 1, 'urgency_type' => 1),
        );



        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        /* <REST> ------  */
        $data_array = $this->restApi($data_array);
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        /* </REST> ------  */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    /*
     * 5.4.9	Типы атрибутов
Таблица: AttributeType
Содержит информацию о правилах заполнения атрибутов (мета-данные).

№	Поле	Тип	Описание
1	ID	Integer	Идентификатор объекта
2	Name	Varchar(20)
3	Description	Varchar(100)	Название типа документа
4	BaseAttrTypeID	Integer	Идентификатор базового типа
5	VerifyMetod	Integer	Идентификатор метода верификации

     * */
    public function attributetypesAction(){
        /*
         * Лимиты присылает Андрюха вместе с base_attr_type
         * Слишком запутанно. На потом.
         * */
        $base_attr_type = array(0 => 'Целое', 1 => 'Вещественное', 2 => 'Текст', 3 => 'Булевый', 4 => 'Дата', 5 => 'Время', 6 => 'Дата/время', 7 => 'Список',8=> 'Составной');
        $attribute_type_limits = array(
            1 => array('тип' => 'обьект'),
        );

        $attribute_type_list_values = array(
            array()
        );

        $editable_array = array(
            'name' => 'Название',
            'description' => 'Описание типа атрибута',
            'base_attr_type' => 'Базовый тип',
            //'verify_method' => 'Метод верификации',
            'attribute_type_limits' => 'Лимиты'
        );
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array(
                'id' => 1,
                'name' => 'Положительный целый (к)',
                'description' => 'Описание типа атрибута',
                'base_attr_type' => $base_attr_type,
                'verify_method' => 1,
                'attribute_type_limits' => $attribute_type_limits,
                //'attribute_type_list_values' => null/
            ),
            array(
                'id' => 2,
                'name' => 'Материальная ответственность',
                'description' => '',
                'base_attr_type' => 8, //список
                'verify_method' => 2,
                'attribute_type_limits' => array('class' => 'attribute_type_list_values', 'param' => array('id'=> 0))
            ),
            array(
                'id' => 3,
                'name' => 'Положительный целый (б)',
                'description' => 'Описание типа атрибута',
                'base_attr_type' => array('class' => 'base_attr_type', 'param' => 0),
                'verify_method' => 1,
                'attribute_type_limits' => array('class' => 'attribute_type_limits_int', 'param' => array('id'=> 1))
                //'attribute_type_list_values' => null/
            ),
        );

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
            $data_array = $this->instantSearch($query, $data_array);
        }

        /* <REST> ------  */
        $data_array = $this->restApi($data_array);
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        /* </REST> ------  */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function routenodetypesAction(){
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
        $data_array = $this->restApi($data_array);
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        /* </REST> ------  */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function restApi(array $data_array, $query =null){

        $id = $this->getEvent()->getRouteMatch()->getParam('id', 0);
        $property = $this->getEvent()->getRouteMatch()->getParam('property', 0);
        $sub_action = $this->getEvent()->getRouteMatch()->getParam('sub_action', 0);
        $action = $this->getEvent()->getRouteMatch()->getParam('action', 0);

        /*
            echo 'current_id='.$id."\n";
            echo 'current_property='.$property."\n";
            echo 'current_sub_action='.$sub_action."\n";
            echo 'ACTION='.$action."\n";
        */


        if($id){
            //echo "\nid\n";
            if($sub_action){
                //echo "sub_action\n";
                switch($sub_action){
                    case('search'):
                        //echo "case_search\n";
                        return $this->searchArray($data_array, $id, $property);
                    break;
                    case('check'):
                        return $this->checkArray($data_array, $id, $property);
                    break;
                    case('dependency'):
                        //return $this->searchDependencies($data_array, $query, $property);
                        //echo "\n what's wrong with dependency?\n";
                    break;
                }
                //echo "case not found\n";
                return $this->searchArray($data_array, $id, $property);
            }
            return $data_array = $this->searchArray($data_array, $id);
        }else{ //only action
            if($sub_action == 'new'){
                // ibn fact this is not a sub_action. it's second argument
                return $data_array = null;
            }
            return $data_array;
        }

    }

    public function yesAction(){
        $data_array['response'] = true;
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function noAction(){
        $data_array['response'] = false;
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }
}

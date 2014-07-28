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

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }


    public function testAction(){

        $data_array = 'Запрос к базе';

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
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
            array('id' => 106021, 'category' => 'base', 'entity' => 'doc_kinds', 'screen' => 'doc_kinds', 'name' => 'Виды документов'),
            array('id' => 106022, 'category' => 'base', 'entity' => 'doc_secrecy_type', 'screen' => 'doc_secrecy_type', 'name' => 'Типы секретности документа'),
            array('id' => 106023, 'category' => 'base', 'entity' => 'doc_urgency', 'screen' => 'doc_urgency', 'name' => 'Типы срочности документа'),
            array('id' => 106030, 'category' => 'base', 'entity' => 'doc_types', 'screen' => 'doc_types', 'name' => 'Типы документов'),
            array('id' => 106040, 'category' => 'base', 'entity' => 'node_types', 'screen' => 'node_types', 'name' => 'Типы узлов маршрута'),
            array('id' => 106050, 'category' => 'base', 'entity' => 'doc_attributes_types', 'screen' => 'doc_attributes_types', 'name' => 'Типы аттрибутов'),
            array('id' => 106060, 'category' => 'base', 'entity' => 'enumeration', 'screen' => 'enumeration', 'name' => 'Нумерация'),
        );

        /*BASE 1 LVL */
        $array_base = array(
            array('id' => 101, 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Звания'),
            array('id' => 102, 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Должности'),
            array('id' => 103, 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Соответствие звания должности',
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


        /*
        $data_array = array(
        array('id' => '101', 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Звания'),
        array('id' => '109', 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Должность'),
        array('id' => '110', 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Соответствие звания должности'),
        array('id' => '111', 'category' => 'base', 'entity' => 'test_entity', 'screen' => 'testscreen', 'name' => 'Тест',
        'childNodes' => array(
        array('id' => '121', 'category' => 'base', 'entity' => 'child_test1', 'screen' => 'testscreen', 'name' => 'child1'),
        array('id' => '122', 'category' => 'base', 'entity' => 'child_test2', 'screen' => 'testscreen', 'name' => 'child2')
        ))
        );*/

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        //$JsonModel->setVariables($array_base);
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

            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);


            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
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

            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);


            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function positionsranksAction(){
        /*
         * Предполагается что экшен возращает выборку соответтсвующих входящему post_id
         * */

        $editable_array = array();
        $prototype_array = array('editable_properties' => $editable_array);

        $data_array = array(
            array('name' => 'Рядовой', 'id' => 1, 'order' => 1),
            array('name' => 'Сержант', 'id' => 2, 'order' => 2),
            array('name' => 'Старший сержант', 'id' => 3, 'order' => 3),
            array('name' => 'Лейтенант', 'id' => 4, 'order' => 3),
            array('name' => 'Старший лейтенант', 'id' => 5, 'order' => 3)
        );

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

            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);


            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
        }
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;

    }

    public function regionsAction(){
        $editable_array = array('code' => 'Код субьекта РФ', 'region_type' => 'Тип региона', 'name' => 'Название', 'description' => 'Описание');
        $prototype_array = array('editable_properties' => $editable_array);
        $data_array = array(
            array('id' => 1, 'code' => '1', 'region_type' => 1, 'name' => 'Республика Адыгея', 'description'=> ''),
            array('id' => 2, 'code' => '2', 'region_type' => 1, 'name' => 'Республика Башкортостан', 'description'=> ''),
            array('id' => 3, 'code' => '3', 'region_type' => 1, 'name' => 'Республика Бурятия', 'description'=> ''),
            array('id' => 4, 'code' => '4', 'region_type' => 1, 'name' => 'Республика Алтай', 'description'=> ''),
            array('id' => 5, 'code' => '5', 'region_type' => 1, 'name' => 'Республика Дагестан', 'description'=> ''),
            array('id' => 6, 'code' => '6', 'region_type' => 1, 'name' => 'Республика Ингушетия', 'description'=> ''),
            array('id' => 7, 'code' => '7', 'region_type' => 1, 'name' => 'Кабардино-Балкарская Республика', 'description'=> ''),
            array('id' => 8, 'code' => '8', 'region_type' => 1, 'name' => 'Республика Калмыкия', 'description'=> ''),
            array('id' => 9, 'code' => '9', 'region_type' => 1, 'name' => 'Республика Карачаево-Черкесия', 'description'=> ''),
            array('id' => 10, 'code' => '10', 'region_type' => 1, 'name' => 'Республика Карелия', 'description'=> ''),
            array('id' => 11, 'code' => '11', 'region_type' => 1, 'name' => 'Республика Коми', 'description'=> ''),
            array('id' => 12, 'code' => '12', 'region_type' => 1, 'name' => 'Республика Марий Эл', 'description'=> ''),
            array('id' => 13, 'code' => '13', 'region_type' => 1, 'name' => 'Республика Мордовия', 'description'=> ''),
            array('id' => 14, 'code' => '14', 'region_type' => 1, 'name' => 'Республика Саха (Якутия)', 'description'=> ''),
            array('id' => 15, 'code' => '15', 'region_type' => 1, 'name' => 'Республика Северная Осетия-Алания', 'description'=> ''),
            array('id' => 16, 'code' => '16', 'region_type' => 1, 'name' => 'Республика Татарстан', 'description'=> ''),
            array('id' => 17, 'code' => '17', 'region_type' => 1, 'name' => 'Республика Тыва', 'description'=> ''),
            array('id' => 18, 'code' => '18', 'region_type' => 1, 'name' => 'Удмуртская Республика', 'description'=> ''),
            array('id' => 19, 'code' => '19', 'region_type' => 1, 'name' => 'Республика Хакасия', 'description'=> ''),
            array('id' => 20, 'code' => '20', 'region_type' => 1, 'name' => 'Чувашская Республика', 'description'=> ''),
            array('id' => 21, 'code' => '21', 'region_type' => 2, 'name' => 'Алтайский край', 'description'=> ''),
            array('id' => 22, 'code' => '22', 'region_type' => 2, 'name' => 'Краснодарский край', 'description'=> ''),
            array('id' => 23, 'code' => '23', 'region_type' => 2, 'name' => 'Красноярский край', 'description'=> ''),
        );
        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
        }
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function dockindsAction(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'isService' => 'Служебный документ');
        $prototype_array = array('editable_properties' => $editable_array);

        $combat = array(
            array('id' => 1001, 'parent_id' => 100, 'name' => 'Боевой приказ вида 1', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1002, 'parent_id' => 100, 'name' => 'Боевой приказ вида 2', 'shortname'=> 'ПХ', 'isService' => false)
        );

        $economic = array(
            array('id' => 1101, 'parent_id' => 110, 'name' => 'Хозяйственный приказ вида 1', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1102, 'parent_id' => 110, 'name' => 'Хозяйственный приказ вида 2', 'shortname'=> 'ПХ', 'isService' => false)
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
        }
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }

    public function dockindscurrentAction(){

        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'isService' => 'Служебный документ');
        $prototype_array = array('editable_properties' => $editable_array);


        $combat = array(
            array('id' => 1001, 'parent_id' => 100, 'name' => 'Боевой приказ вида 1', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1002, 'parent_id' => 100, 'name' => 'Боевой приказ вида 2', 'shortname'=> 'ПХ', 'isService' => false)
        );

        $economic = array(
            array('id' => 1101, 'parent_id' => 110, 'name' => 'Хозяйственный приказ вида 1', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1102, 'parent_id' => 110, 'name' => 'Хозяйственный приказ вида 2', 'shortname'=> 'ПХ', 'isService' => false)
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
            array('id' => 3, 'parent_id' => null, 'name' => 'Служебные', 'shortname'=> 'сист.', 'isService' => true,)
        );

        $request = $this->getRequest();
        /* Поиск по массиву */


        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){

            $query = $request->getContent();

            //var_dump($query);

            foreach($data_array as $value){
                if($query == $value['id']){
                    $data_array = $value;
                }
            }
        }

        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($response);
        return $JsonModel;
    }


    public function dockinds2Action(){
        $editable_array = array('name' => 'Название', 'shortname' => 'Краткое обозначение (КОД)', 'isService' => 'Служебный документ');
        $prototype_array = array('editable_properties' => $editable_array);

        $combat = array(
            array('id' => 1001, 'parent_id' => 100, 'name' => 'Боевой приказ вида 1', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1002, 'parent_id' => 100, 'name' => 'Боевой приказ вида 2', 'shortname'=> 'ПХ', 'isService' => false)
        );

        $economic = array(
            array('id' => 1101, 'parent_id' => 110, 'name' => 'Хозяйственный приказ вида 1', 'shortname'=> 'ПБ', 'isService' => false),
            array('id' => 1102, 'parent_id' => 110, 'name' => 'Хозяйственный приказ вида 2', 'shortname'=> 'ПХ', 'isService' => false)
        );

        $child_1 = array(
            array('id' => 100, 'parent_id' => 2, 'name' => 'Боевые', 'shortname'=> 'ПБ', 'isService' => false,
                'childNodes' => $combat),
            array('id' => 110, 'parent_id' => 2, 'name' => 'Хозяйственные', 'shortname'=> 'ПХ', 'isService' => false,
                'childNodes' => $economic)
        );

        $data_array = array('id' => 1, 'parent_id' => null, 'name' => 'Сигналы', 'shortname'=> 'С', 'isService' => false, 'childNodes' => $child_1);

        $request = $this->getRequest();
        if ($request->isXmlHttpRequest() and $this->getRequest()->isPost()){
            $query = $request->getContent();
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
            $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
            $JsonModel = new JsonModel();
            $JsonModel->setVariables($response);
            return $JsonModel;
        }
        $response = array('response'=> true, 'prototype' => $prototype_array, 'data' => $data_array);
        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
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

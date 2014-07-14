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
    
    public function ajaxAction(){

        /*
         * isNonIndependent - output only in the parent screen
         * isNotScreen - no screen output
         * */

        $array_base = array(
            array('id' => 101, 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Звания'),
            array('id' => 102, 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Должности'),
            array('id' => 103, 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Соответствие звания должности',
                'isNonIndependent' => true ),
            array('id' => 104, 'category' => 'base', 'entity' => 'pass_doc_types', 'screen' => 'pass_doc_types', 'name' => 'Типы удостоверяющих личность документов'),
            array('id' => 105, 'category' => 'base', 'entity' => 'sys', 'screen' => 'sys', 'name' => 'Основные настройки'),
            array('id' => 106, 'category' => 'base', 'entity' => 'address_types', 'screen' => 'sys', 'name' => 'Типы адреса',
                'isNonIndependent' => true ),
            array('id' => 107, 'category' => 'base', 'entity' => 'sex_types', 'screen' => 'sys', 'name' => 'Пол',
                'isNonIndependent' => true ),
            array('id' => 108, 'category' => 'base', 'entity' => 'countries', 'screen' => 'sys', 'name' => 'Страны',
                'isNonIndependent' => true ),
            array('id' => 109, 'category' => 'base', 'entity' => 'sys_docs', 'screen' => 'sys_docs', 'name' => 'Настройки документов'),
            array('id' => 110, 'category' => 'base', 'entity' => 'period_types', 'screen' => 'sys_docs', 'name' => 'Типы периодов',
                'isNonIndependent' => true ),
            array('id' => 111, 'category' => 'base', 'entity' => 'enumeration_types', 'screen' => 'sys_docs', 'name' => 'Типы нумерации',
                'isNonIndependent' => true ),
            array('id' => 112, 'category' => 'base', 'entity' => 'doc_types', 'screen' => 'sys_docs', 'name' => 'Типы документов',
                'isNonIndependent' => true ),
            array('id' => 113, 'category' => 'base', 'entity' => 'node_types', 'screen' => 'sys_docs', 'name' => 'Типы узлов маршрута',
                'isNonIndependent' => true ),
            array('id' => 114, 'category' => 'base', 'entity' => 'doc_attributes_types', 'screen' => 'sys_docs', 'name' => 'Типы аттрибутов',
                'isNonIndependent' => true ),
            array('id' => 115, 'category' => 'base', 'entity' => 'enumeration', 'screen' => 'sys_docs', 'name' => 'Нумерация',
                'isNonIndependent' => true ),
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
        //$JsonModel->setVariables($data_array);
        $JsonModel->setVariables($array_base);
        return $JsonModel;
    }

    public function pageAction(){
        //
    }

    public function ranksAction(){
        $data_array = array(
            array('name' => 'Рядовой', 'id' => 1, 'order' => 1),
            array('name' => 'Сержант', 'id' => 2, 'order' => 2),
            array('name' => 'Старший сержант', 'id' => 3, 'order' => 3)
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function positionsAction(){
        $data_array = array(
            array('name' => 'Зам по тылу', 'id' => 1, 'order' => 1),
            array('name' => 'Начальник пищеблока', 'id' => 2, 'order' => 2),
            array('name' => 'Командир части', 'id' => 3, 'order' => 3)
        );

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

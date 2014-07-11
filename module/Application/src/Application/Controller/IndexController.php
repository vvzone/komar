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
            array('id' => 103, 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Соответствие звания должности', 'isNonIndependent' => true ),
            array('id' => 104, 'category' => 'base', 'entity' => 'pass_doc_types', 'screen' => 'pass_doc_types', 'name' => '5.2.2	Типы удостоверяющих личность документов'),
            array('id' => 105, 'category' => 'base', 'entity' => 'sys', 'screen' => 'sys', 'name' => 'Основные настройки'),
        );

        $array_staff = array(
            array('id' => 201, 'category' => 'staff', 'entity' => '', 'screen' => '', 'name' => ''),
            array('id' => 201, 'category' => 'staff', 'entity' => '', 'screen' => '', 'name' => ''),
        );

        $array_doc = array(
            array('id' => 301, 'category' => 'doc', 'entity' => '', 'screen' => '', 'name' => ''),
            array('id' => 301, 'category' => 'doc', 'entity' => '', 'screen' => '', 'name' => ''),
        );

        $array_unit = array(
            array('id' => 401, 'category' => 'unit', 'entity' => '', 'screen' => '', 'name' => ''),
            array('id' => 401, 'category' => 'unit', 'entity' => '', 'screen' => '', 'name' => ''),
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
        return $JsonModel;
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

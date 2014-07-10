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

        $data_array = array(
        array('id' => '101', 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Rank'),
        array('id' => '109', 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Position'),
        array('id' => '110', 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Rank for Position'),
        array('id' => '111', 'category' => 'base', 'entity' => 'test_entity', 'screen' => 'testscreen', 'name' => 'Test',
        'childNodes' => array(
        array('id' => '121', 'category' => 'base', 'entity' => 'child_test1', 'screen' => 'testscreen', 'name' => 'child1'),
        array('id' => '122', 'category' => 'base', 'entity' => 'child_test2', 'screen' => 'testscreen', 'name' => 'child2')
        ))
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function ranksAction(){
        $data_array = array(
            array('name' => 'Private', 'id' => 1, 'order' => 1),
            array('name' => 'Sergent', 'id' => 2, 'order' => 2),
            array('name' => 'Sen. Sergent', 'id' => 3, 'order' => 3)
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

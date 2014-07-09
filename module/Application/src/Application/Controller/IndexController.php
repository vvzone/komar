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
 *         $data_array = array(array('id' => '101', 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Звание'),
            array('id' => '109', 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Должность'),
            array('id' => '110', 'category' => 'base', 'entity' => 'position_rabk', 'screen' => 'position', 'name' => 'Соответсвие звания должности'));
*/

        $data_array = array(
            array('id' => '101', 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Rank'),
            array('id' => '109', 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Position'),
            array('id' => '110', 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Rank for Position'),
            array('id' => '111', 'category' => 'base', 'entity' => 'test_entity', 'screen' => 'test', 'name' => 'Test'),
        );

        /**

        $data_array = array(
        array('id' => '101', 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Rank'),
        array('id' => '109', 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Position'),
        array('id' => '110', 'category' => 'base', 'entity' => 'position_rank', 'screen' => 'position', 'name' => 'Rank for Position'),
        array('id' => '111', 'category' => 'base', 'entity' => 'test_entity', 'screen' => 'test', 'name' => 'Test',
        'childNodes' => array(
        array('id' => '121', 'category' => 'base', 'entity' => 'child_test1', 'screen' => 'test', 'name' => 'child1'),
        array('id' => '122', 'category' => 'base', 'entity' => 'child_test2', 'screen' => 'test', 'name' => 'child2')
        ))
        );

         */

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);

        return $JsonModel;

        // Encode PHP object recursively
        //echo phpinfo();

        //$jsonObject = Zend\Json\Json::encode($data_array, true);

        //return $jsonObject;
        
    }
    
}

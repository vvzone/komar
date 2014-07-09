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


        $data_array = array(array('id' => '101', 'category' => 'base', 'entity' => 'rank', 'screen' => 'rank', 'name' => 'Звание'),
            array('id' => '109', 'category' => 'base', 'entity' => 'position', 'screen' => 'position', 'name' => 'Должность'),
            array('id' => '110', 'category' => 'base', 'entity' => 'position_rabk', 'screen' => 'position', 'name' => 'Соответсвие звания должности'));

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);

        return $JsonModel;

        // Encode PHP object recursively
        //echo phpinfo();

        //$jsonObject = Zend\Json\Json::encode($data_array, true);

        //return $jsonObject;
        
    }
    
}

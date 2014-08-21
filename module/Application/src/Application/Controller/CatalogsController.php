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
    public function indexAction()
    {
        $data_array = array(
            array('catalog' => 'controller', 'index' => 'action')
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function ranksAction(){

        /*
         * [{id:1, is_officer:false, name:"Рядовой", short_name:null, description:null, created_at:1408439617871, deleted_at:null}]
         * */
        $data_array = array(
            array('id' => 1, 'name' => 'Рядовой', 'short_name' => 'ряд.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null),
            array('id' => 2, 'name' => 'Ефрейтор','short_name' => 'ефр.', 'description' => null, 'is_officer' => null, 'created_at' => '1407439617871', 'deleted_at' => null)
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
        return $JsonModel;
    }

    public function positionsAction(){

        $data_array = array(
            array('id' => 1, 'name' => ''),
            array('id' => 2, 'name' => '')
        );

        $JsonModel = new JsonModel();
        $JsonModel->setVariables($data_array);
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
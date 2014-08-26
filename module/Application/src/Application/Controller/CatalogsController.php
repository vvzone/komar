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
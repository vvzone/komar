<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

//use Zend\Mvc\Controller\AbstractActionController;\
use Object\Model\Unit;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


//class UnitController extends AbstractActionController
class UnitController extends RestController
{
    protected $unitTable;
    /*-------------- default methods ----------*/

    public function getList()
    {
        $results = $this->getUnitTable()->fetchAll();
        $data = array();
        foreach ($results as $result) {
            $data[] = $result;
        }

        return new JsonModel(array(
                'data' => $data)
        );
    }

    public function get($id)
    {
        $unit = $this->getUnitTable()->getUnit($id);
        return new JsonModel(array("data" => $unit));
    }

    public function create($data)
    {
        $data['id']=0;
        //$form = new UnitForm(); //GREAT IDEA!
        $unit = new Unit();
        //$form->setInputFilter($album->getInputFilter());
        //$form->setData($data);

        $id=0;
        //if ($form->isValid()) {
            //$unit->exchangeArray($form->getData());
            $id = $this->getUnitTable()->saveUnit($unit);
        /*}else {
            print_r(  $form->getMessages());
        }*/

        return new JsonModel(array(
            'data' => $id,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $unit = $this->getUnitTable()->getUnit($id);
        /*$form = new AlbumForm();
        $form->bind($album);
        $form->setInputFilter($album->getInputFilter());
        $form->setData($data);*/

        //if ($form->isValid()) {
            $id = $this->getUnitTable()->saveUnit($unit); //($form->getData());
        //}

        return new JsonModel(array(
            'data' => $id,
        ));
    }

    public function delete($id)
    {
        $this->getUnitTable()->deleteUnit($id);

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }

    public function getUnitTable()
    {
        if (!$this->unitTable) {
            $sm = $this->getServiceLocator();
            $this->unitTable = $sm->get('Object\Model\UnitTable');
        }
        return $this->unitTable;
    }

/*-------------- default methods ----------*/
/* --------------- my methods -------------*/
    /*

    public function indexAction(){

        $result = array();
        foreach($this->getUnitTable()->fetchAll() as $unit){
            //echo $unit->get_name();
            $result[] = $unit;
        }

        $encoded = json_encode($result, JSON_UNESCAPED_UNICODE);

        //echo Zend_Json::encode($result);

        return new JsonModel(array(
            $result
        ));

    }
    /*
    public function addAction()
    {
       echo '->addAction';
    }

    public function editAction()
    {
        echo '->editAction';
    }

    public function deleteAction()
    {
        echo '->editAction';
    }
    */
}
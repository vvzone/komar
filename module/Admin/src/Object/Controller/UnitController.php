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
    protected $unitTableList;

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
        //var_dump($data);
        $data['id']=0;
        //$form = new UnitForm(); //GREAT IDEA!
        $unit = new Unit();
        //$form->setInputFilter($unit->getInputFilter());
        //$form->setData($data);

        //$id=0;
        //if ($form->isValid()) {
            $unit->exchangeArray($data);
            $id = $this->getUnitTable()->saveUnit($unit);
        /*}else {
            print_r(  $form->getMessages());
        }*/
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $unit = $this->getUnitTable()->getUnit($id);
        /*$form = new UnitForm();
        $form->bind($unit);
        $form->setInputFilter($unit->getInputFilter());
        $form->setData($data);*/

        //if ($form->isValid()) {
            //next one - temporary !
            $unit_temp = new Unit();
            $unit_temp->exchangeArray($data); //delete this one after form will be added
            $id = $this->getUnitTable()->saveUnit($unit_temp); //($form->getData());
        //}

        return new JsonModel(array(
            'data' => $data,
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

    /*
    public function getUnitTableList()
    {
        if (!$this->unitTableList) {
            $sm = $this->getServiceLocator();
            $this->unitTableList = $sm->get('Object\Model\UnitTableList');
        }
        return $this->unitTableList;
    }*/

/*-------------- default methods ----------*/
}
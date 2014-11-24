<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Mvc\Controller\AbstractRestfulController;

class UnitController extends AbstractActionController
//class UnitController extends AbstractRestfulController
{
    protected $unitTable;

    public function indexAction()
    {
        echo 'UnitController -> indexAction';

        //echo var_dump($this);

        $i = 0;
        foreach($this->getUnitTable()->fetchAll() as $unit){
            echo $unit->get_name();
        }
        return new ViewModel(array(
            'units' => $this->getUnitTable()->fetchAll(),
        ));
    }

/*-------------- default methods ----------*/

    /*
    public function getList()
    {
        echo 'default methods: getList()';
    }

    public function get($id)
    {
        echo 'default methods: get(id)';
    }

    public function create($data)
    {
        echo 'default methods: create(data)';
    }

    public function update($id, $data)
    {
        echo 'default methods: update(id, data)';
    }

    public function delete($id)
    {
        echo 'default methods: delete(id)';
    }*/

/*-------------- default methods ----------*/
/* --------------- my methods -------------*/


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

    public function getUnitTable()
    {
        if (!$this->unitTable) {
            $sm = $this->getServiceLocator();
            $this->unitTable = $sm->get('Object\Model\UnitTable');
        }
        return $this->unitTable;
    }
}
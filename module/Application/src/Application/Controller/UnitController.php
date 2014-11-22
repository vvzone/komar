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

class UnitController extends AbstractActionController
{
    protected $unitTable;

    public function indexAction()
    {
        echo 'UnitController -> indexAction';

        $i = 0;
        foreach($this->getUnitTable()->fetchAll() as $unit){
            echo $unit->get_name();
        }
        return new ViewModel(array(
            'units' => $this->getUnitTable()->fetchAll(),
        ));
    }

    public function addAction()
    {

    }

    public function editAction()
    {
    }

    public function deleteAction()
    {
    }

    public function getUnitTable()
    {
        if (!$this->unitTable) {
            $sm = $this->getServiceLocator();
            $this->unitTable = $sm->get('Application\Model\UnitTable');
        }
        return $this->unitTable;
    }
}
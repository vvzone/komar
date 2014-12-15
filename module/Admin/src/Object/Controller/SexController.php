<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Model\Client;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Object\Entity\Clients as ClientORM;
use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class SexController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $sexTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        //$results = $objectManager->getRepository('Object\Entity\Clients')->findBy(array('identificationNumber' => 19612));
        $results = $objectManager->getRepository('Object\Entity\Sex')->findAll();

        //var_dump($results);
        //$results = $this->getClientTable()->fetchAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getSexSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $sex = $objectManager->find('Object\Entity\Sex', $id);
        //$client->__load();
        return new JsonModel($sex->getMain());
        //return new JsonModel(array("data" => $client->get_name()));
    }

    public function create($data)
    {
        $data['id'] = 0;
        $sex = new Sex();
        $sex->exchangeArray($data);
        $id = $this->getSexTable()->saveSex($sex);
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $client = $this->getSexTable()->getSex($id);
        $sex_temp = new Sex();

        // on next line may place hydration
        $sex_temp->exchangeArray($data); //delete this one after form will be added
        $id = $this->getSexTable()->saveSex($sex_temp); //($form->getData());

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function delete($id)
    {
        $this->getSexTable()->deleteSex($id);

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    public function getClientTable()
    {
        if (!$this->clientTable) {
            $sm = $this->getServiceLocator();
            $this->clientTable = $sm->get('Object\Model\ClientTable');
        }
        return $this->clientTable;
    }

    public function getUnitTable()
    {
        if (!$this->unitTable) {
            $sm = $this->getServiceLocator();
            $this->unitTable = $sm->get('Object\Model\UnitTable');
        }
        return $this->unitTable;
    }

    public function getSexTable()
    {
        if (!$this->sexTable) {
            $sm = $this->getServiceLocator();
            $this->sexTable = $sm->get('Object\Model\SexTable');
        }
        return $this->sexTable;
    }

/*-------------- default methods ----------*/
}
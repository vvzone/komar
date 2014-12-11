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


class PersonController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $personTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        //$results = $objectManager->getRepository('Object\Entity\Clients')->findBy(array('identificationNumber' => 19612));
        $results = $objectManager->getRepository('Object\Entity\Persons')->findAll();

        //var_dump($results);
        //$results = $this->getClientTable()->fetchAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getPersonSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $client = $this->getClientTable()->getClient($id);
        $unit = $this->getUnitTable()->getUnitByClientId($id);
        $person = $this->getPersonTable()->getPersonByClientId($id);

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        /*
        if($unit){

            $client->is_unit = true;
            $client->unit = $unit;
        }elseif($person){

            $client->is_unit = false;
            $client->person = $person;
        }

        */

        //$client = array_merge($client, $unit);
        //$person = $objectManager->find('Object\Entity\Persons', $id);
        $person = $objectManager->find('Object\Entity\Persons', $id);
        //$client->__load();
        return new JsonModel($person->getAll());
        //return new JsonModel(array("data" => $client->get_name()));
    }

    public function create($data)
    {
        $data['id'] = 0;
        $person = new Person();
        $person->exchangeArray($data);
        $id = $this->getPersonTable()->savePerson($person);
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $client = $this->getPersonTable()->getPerson($id);
        $person_temp = new Person();

        // on next line may place hydration
        $person_temp->exchangeArray($data); //delete this one after form will be added
        $id = $this->getPersonTable()->savePerson($person_temp); //($form->getData());

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function delete($id)
    {
        $this->getPersonTable()->deletePerson($id);

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

    public function getPersonTable()
    {
        if (!$this->personTable) {
            $sm = $this->getServiceLocator();
            $this->personTable = $sm->get('Object\Model\PersonTable');
        }
        return $this->personTable;
    }

/*-------------- default methods ----------*/
}
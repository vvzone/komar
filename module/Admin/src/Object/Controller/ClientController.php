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

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class ClientController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $personTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $results = $this->getClientTable()->fetchAll();
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
        $client = $this->getClientTable()->getClient($id);
        $unit = $this->getUnitTable()->getUnitByClientId($id);
        $person = $this->getPersonTable()->getPersonByClientId($id);

        if($unit){
            $client->is_unit = true;
            $client->unit = $unit;
        }elseif($person){
            $client->is_unit = false;
            $client->person = $person;
        }

        //$client = array_merge($client, $unit);
        return new JsonModel(array("data" => $client));
    }

    public function create($data)
    {
        $data['id'] = 0;
        $client = new Client();
        $client->exchangeArray($data);
        $id = $this->getClientTable()->saveClient($client);
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $client = $this->getClientTable()->getClient($id);
        $client_temp = new Client();

        // on next line may place hydration
        $client_temp->exchangeArray($data); //delete this one after form will be added
        $id = $this->getClientTable()->saveClient($client_temp); //($form->getData());

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function delete($id)
    {
        $this->getClientTable()->deleteClient($id);

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
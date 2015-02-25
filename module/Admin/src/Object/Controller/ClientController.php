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
use Zend\Json\Server\Error;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Object\Entity\Clients as ClientORM;
use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class ClientController extends RestController
{

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('Doctrine\ORM\ClientRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $client = $objectManager->find('Object\Entity\Client', $id);
        if(!$client){
            //throw error 404
        }
        return new JsonModel($client->getAll());
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


}
<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\Person;
use Object\Entity\Client;
use Object\Entity\UnitPost;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;


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

        $results = $objectManager->getRepository('Object\Entity\Person')->findAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getPersonSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $person = $objectManager->find('Object\Entity\Person', $id);
        return new JsonModel($person->getAll());
    }

    public function create($incoming_array)
    {
        $client = new Client();
        $person = new Person();
        $unit_post = new UnitPost();

        $unit_post_id = null;

        if($incoming_array['unit_post']){
            $unit_post_id = $incoming_array['unit_post'];
            unset($incoming_array['unit_post']);
        }

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Person');

        $incoming_array = $this->RESTtoCamelCase($incoming_array);
        $person = $hydrator->hydrate($incoming_array, $person);
        $client_data = array(
            'fullName' => $person->getBigFIO()
        );

        $client = $hydrator->hydrate($client_data, $client);
        $objectManager->persist($client);
        //$objectManager->flush();
        $person->setClient($client);

        if($unit_post_id){
            $unit_post = $objectManager->find('Object\Entity\UnitPost', $unit_post_id);
            //$objectManager->persist($unit_post);
            //$person->addUnitPost($unit_post);
        }

        $objectManager->persist($person);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => $incoming_array,
            'person' => $person,
            'client_id' => $client->getId(),
            'unit_post_id' => $unit_post_id
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $person = new Person();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Person');
        $data = $this->RESTtoCamelCase($data);
        $person = $hydrator->hydrate($data, $person);
        $objectManager->persist($person);
        $objectManager->flush();

        return new JsonModel(
            $data
        );
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $person = $objectManager->find('Object\Entity\Person', $id);
        $objectManager->remove($person);
        $objectManager->flush();

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
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
use Object\Entity\Sex;

use Admin\Controller\RestController;
use Zend\EventManager\EventManagerInterface;

/* filter */
use Zend\InputFilter\Factory;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\Input;
use Zend\Validator;

/* hydra & orm */
use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

/* data out */
//use Zend\Paginator\Paginator as Paginator;
use Object\Paginator\Paginator as Paginator;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Object\Response\JSONResponse;


class PersonController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $personTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('Doctrine\ORM\PersonRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $person = $objectManager->find('Object\Entity\Person', $id);

        $personObject = $person->getAll();

        /*
        $unit_id = $personObject[''];
        $personDeputy =  $objectManager->getRepository('Object\Entity\Person')->getDeputy($unit_id);
        */

        return new JsonModel($personObject);
    }

    public function create($incoming_array)
    {
        $client = new Client();
        $person = new Person();
        $unit_post = new UnitPost();

        $unit_post_id = null;

        if(isset($incoming_array['person_post'])){
            $unit_post_id = $incoming_array['person_post'];
            unset($incoming_array['person_post']);
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
            $objectManager->persist($unit_post);
            $person->addUnitPost($unit_post);
        }

        if(isset($incoming_array['sex_type'])){
            $sex_id =  $incoming_array['sex_type'];
            unset($incoming_array['sex_type']);
            $sex = $objectManager->find('Object\Entity\Sex', $sex_id);
            $person->setSex($sex);
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

        //if($data['sex_types']){
            $sex_id = $data['sex_types'];
            unset($data['sex']);
            unset($data['sex_types']);
            $sex = $objectManager->find('Object\Entity\Sex', (int)$sex_id);
            $person->setSex($sex);
        //}

        $data = $this->RESTtoCamelCase($data);
        $person = $hydrator->hydrate($data, $person);
        $objectManager->persist($person);
        $objectManager->flush();

        return new JsonModel(
            $person->getAll()
            //$sex->getMain()
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
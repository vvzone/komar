<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\Unit;
use Object\Entity\Client;
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

//class UnitController extends AbstractActionController
class UnitController extends RestController
{

    /*-------------- default methods ----------*/
    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $objectManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $repository = $objectManager->getRepository('Object\Entity\Unit');

        $adapter = new \Object\Paginator\Adapter($repository);

        $paginator = new Paginator($adapter);
        $paginator->setPaginationRequest($this->requestedPagination);

        $response = new JSONResponse($paginator->getCurrentItems());
        $response->setAdditional('paginator', $paginator->getAPI());
        return $response->getResponse();
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $unit = $objectManager->find('Object\Entity\Unit', $id);
        return new JsonModel($unit->getAll());
    }

    public function create($incoming_array)
    {
        $client = new Client();
        $unit = new Unit();
        //$unit_post = new UnitPost();

        $unit_post_id = null;
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Unit');

        $incoming_array = $this->RESTtoCamelCase($incoming_array);
        $unit = $hydrator->hydrate($incoming_array, $unit);

        $id_num = (isset($incoming_array['identification_number']))? $incoming_array['identification_number']:null;
        $client_data = array(
            'fullName' => $unit->getName(),
            'identificationNumber' => $id_num
        );

        $client = $hydrator->hydrate($client_data, $client);
        $objectManager->persist($client);
        //$objectManager->flush();
        $unit->setClient($client);
        $objectManager->persist($unit);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => $incoming_array,
            'unit' =>$unit,
            'client_id' => $client->getId()
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $unit = new Unit();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Unit');
        $data = $this->RESTtoCamelCase($data);
        $unit = $hydrator->hydrate($data, $unit);
        $objectManager->persist($unit);
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

        $unit = $objectManager->find('Object\Entity\Unit', $id);
        $objectManager->remove($unit);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
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
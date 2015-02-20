<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

//use Doctrine\ORM\Tools\Pagination\Paginator;
use Object\Entity\Post;
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

class SexController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $sexTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $objectManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $repository = $objectManager->getRepository('Object\Entity\Sex');

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
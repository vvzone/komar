<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

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


class RouteController extends RestController
{

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('Doctrine\ORM\RouteRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $route = $objectManager->find('Object\Entity\Route', $id);
        return new JsonModel($route->getAll());
    }

    public function create($data)
    {
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $route = new Route();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Route');
        $data = $this->RESTtoCamelCase($data);
        $route = $hydrator->hydrate($data, $route);
        $objectManager->persist($route);
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

        $route = $objectManager->find('Object\Entity\Route', $id);
        $objectManager->remove($route);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    /*
    public function getRouteTableList()
    {
        if (!$this->routeTableList) {
            $sm = $this->getServiceLocator();
            $this->routeTableList = $sm->get('Object\Model\RouteTableList');
        }
        return $this->routeTableList;
    }*/

/*-------------- default methods ----------*/
}
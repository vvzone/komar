<?php

namespace Object\Factory;

use Zend\ServiceManager\AbstractFactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

use Object\Paginator\Paginator as Paginator;
use Zend\View\Model\JsonModel;
use Object\Response\JSONResponse;

class PaginatorAbstractFactory implements AbstractFactoryInterface
{
    private $config;
    private $serviceLocator;

    public function canCreateServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

        return (substr($requestedName, -18) === 'RESTListPagination');
    }

    public function createServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

        $entityManager = $serviceLocator->get('Doctrine\ORM\EntityManager');

        try{
            $parts       = explode('\\', $requestedName);
            $entityName  = substr(end($parts), 0, -18);
            $entityClass = 'Object\\Entity\\' . $entityName;

            $repository = $entityManager->getRepository($entityClass);
            //$repository = $entityManager->getRepository("Object\\Entity\\Client");

            $adapter = new \Object\Paginator\Adapter($repository);

            $paginator = new Paginator($adapter);

            /* --- get requested pagination ---*/
            $config = $serviceLocator->get('config');
            $page = (int)$serviceLocator->get('ControllerPluginManager')->get('params')->fromQuery('page', 1);
            $page = ($page<1)?1:$page;

            $records_per_page = (int)$serviceLocator->get('ControllerPluginManager')->get('params')->fromQuery('per_page', $config['paginator']['records_per_page']);
            $records_per_page = ($records_per_page<1)?$config['paginator']['records_per_page']:$records_per_page;
            /* --/ get requested pagination ---*/

            $requested_pagination = array(
                'page' => $page,
                'records_per_page' => $records_per_page
            );

            $paginator->setPaginationRequest($requested_pagination);

            $response = new JSONResponse($paginator->getCurrentItems());
            $response->setAdditional('paginator', $paginator->getAPI());

        } catch (\Exception $e) { //logic errors
            $response = $serviceLocator->get('Response');
            $response->setStatusCode(500);
            $data = array();
            $data['messages'][] = 'ObjectCreateAbstractFactory fail';
            do {
                $data['messages'][] = $e->getMessage();
            } while ($e = $e->getPrevious());

            return new JsonModel(array(
                $data
            ));
        }



        return $response->getResponse();
    }

    /*
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $adapter = $serviceLocator->get('Object\Paginator\Adapter');
        $paginator = new Paginator($adapter);
        return $paginator;
    }
    */
}
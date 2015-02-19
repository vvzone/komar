<?php

namespace Object\Factory;

use Zend\ServiceManager\AbstractFactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

use Object\Paginator\Paginator as Paginator;

class PaginatorAbstractFactory implements AbstractFactoryInterface
{
    private $config;
    private $serviceLocator;

    public function canCreateServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){



    }

    public function createServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

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
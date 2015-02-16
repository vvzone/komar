<?php

namespace Object\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

use Object\Paginator\Paginator as Paginator;

class PaginatorFactory implements FactoryInterface
{
    private $config;
    private $serviceLocator;

    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $adapter = $serviceLocator->get('Object\Paginator\Adapter');
        $paginator = new Paginator($adapter);
        return $paginator;
    }
}
<?php

namespace Authentication\Factory;

use Authentication\Adapter\HeaderAuthentication;
use Object\Repository\UserRepository;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AuthenticationAdapterFactory implements FactoryInterface{

    public function createService(ServiceLocatorInterface $sl)
    {
        $request     = $sl->get('Request');
        //$repository = $sl->get('Object\Repository\UserRepository');
        $om = $sl->get('Doctrine\ORM\EntityManager');
        $repository = $om->getRepository('Object\Entity\User');

        $adapter = new HeaderAuthentication($request, $repository);
        return $adapter;
    }

}
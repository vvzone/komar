<?php

namespace Authentication\Factory;

use Authentication\Listener\ApiAuthenticationListener;

use Authentication\Adapter\HeaderAuthentication;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AuthenticationListenerFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $sl)
    {
        $name    = 'Authentication\Adapter\HeaderAuthentication';
        $adapter = $sl->get($name);
        $listener = new ApiAuthenticationListener($adapter);
        return $listener;
    }
}
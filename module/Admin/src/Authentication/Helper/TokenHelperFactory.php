<?php
namespace Authentication\Helper;

use Authentication\Helper\TokenHelper;
use Zend\ServiceManager\FactoryInterface;

use Zend\ServiceManager\ServiceLocatorInterface;

class TokenHelperFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return TokenHelper
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $helper = new TokenHelper;
        return $helper;
    }
}

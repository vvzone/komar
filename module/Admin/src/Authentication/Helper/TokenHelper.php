<?php
namespace Authentication\Helper;

use Zend\View\Helper\AbstractHelper;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;


class TokenHelper extends AbstractHelper implements ServiceLocatorAwareInterface
{
    /**
     *
     * @var ServiceLocatorInterface
     */
    private $serviceLocator;


    /**
     * Set the service locator.
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return TokenHelper
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
        return $this;
    }

    /**
     * Get the service locator.
     *
     * @return \Zend\ServiceManager\ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }


    public function __invoke()
    {
        $serviceLocator = $this->getServiceLocator();
        //return $this->getToken();
        return $this;
        //return $this;
// use it at will ...
    }

    public function getToken(){
        $serviceLocator = $this->getServiceLocator();
        return '12345';
    }
}

<?php
namespace Authentication\Helper;

use Authentication\Helper\TokenHelper;
use Zend\ServiceManager\FactoryInterface;

class TokenHelperFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        // $sl is instanceof ViewHelperManager, we need the real SL though
        /*
        $rsl = $sl->getServiceLocator();
        $foo = $rsl->get('foo');
        $bar = $rsl->get('bar');
        */

        return new TokenHelper();
    }
}

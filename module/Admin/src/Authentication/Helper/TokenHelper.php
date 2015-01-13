<?php
namespace Authentication\Helper;

use Zend\View\Helper\AbstractHelper;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;


class TokenHelper extends AbstractHelper
{

    public function __construct()
    {
        
    }

    public function __invoke()
    {
    }

    public function getToken(){
        return '12345';
    }
}

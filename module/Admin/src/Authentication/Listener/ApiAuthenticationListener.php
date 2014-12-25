<?php
namespace Authentication\Listener;

use Authentication\Adapter\HeaderAuthentication;
use Zend\Mvc\MvcEvent;

class ApiAuthenticationListener
{
    protected $adapter;

    public function __construct(HeaderAuthentication $adapter)
    {
        $this->adapter = $adapter;
    }


    public function __invoke(MvcEvent $event)
    {
        $result = $this->adapter->authenticate();

        if (!$result->isValid()) {
            $response = $event->getResponse();

            // Set some response content
            $response->setStatusCode(401);
            return $response;
        }

        // All is OK
        $event->setParam('user', $result->getIdentity());
    }
}
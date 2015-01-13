<?php
namespace Authentication\Listener;

use Authentication\Adapter\HeaderAuthentication;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;

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

            $jsonModel = new JsonModel($result->getMessages());

            $serialized = $jsonModel->serialize();
            //$response->setContent($jsonModel);
            $response->setContent($serialized);

            $event->setError('AUTH ERROR!');
            $event->setResult($response);

            return $response;

            //$event->setResult($response);
            //return $response;
            //return $result->getMessages();
        }

        // All is OK
        $event->setParam('user', $result->getIdentity());
    }
}
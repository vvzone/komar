<?php

namespace Admin\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\EventManager\EventManagerInterface;

class RestController extends AbstractRestfulController
{
    protected $allowedCollectionMethods = array(
        'GET',
        'POST',
    );

    protected $allowedResourceMethods = array(
        'GET',
        'PATCH',
        'PUT',
        'DELETE',
    );

    public function setEventManager(EventManagerInterface $events)
    {
        parent::setEventManager($events);
        $events->attach('dispatch', array($this, 'checkOptions'), 10);
    }

    public function checkOptions($e)
    {
        $matches  = $e->getRouteMatch();
        $response = $e->getResponse();
        $request  = $e->getRequest();
        $method   = $request->getMethod();

        // test if we matched an individual resource, and then test
        // if we allow the particular request method
        if ($matches->getParam('id', false)) {
            if (!in_array($method, $this->allowedResourceMethods)) {
                $response->setStatusCode(405);
                return $response;
            }
            return;
        }

        // We matched a collection; test if we allow the particular request
        // method
        if (!in_array($method, $this->allowedCollectionMethods)) {
            $response->setStatusCode(405);
            return $response;
        }
    }
}
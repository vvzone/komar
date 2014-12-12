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

    public function RESTtoCamelCase(array $data){
        foreach($data as $k => $v){
            if(strrpos($k, '_')){
                $new_k = $k;
                unset($data[$k]);
                while($pos = strrpos($new_k, '_')){
                    $new_k = substr_replace($new_k, '', $pos, 1);
                    $capitalized = strtoupper($new_k[$pos]);
                    $new_k[$pos] = $capitalized;
                }
                $data[$new_k] = $v;
            }else{
                $data[$k] = $v;
            }
        }
        return $data;
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
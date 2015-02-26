<?php

namespace Admin\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\EventManager\EventManagerInterface;
use Zend\View\Model\JsonModel;

use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

class RestController extends AbstractRestfulController
{
    protected $eventIdentifier = 'Object\Controller';

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

    protected $requestedPagination;

    /**
     * @param $object
     * @return JsonModel
     */
    public function getOutput($object = null){
        if(!$object){
            $this->response->setStatusCode(404);
            return new JsonModel(
                array(
                    'message' => 'Объект с id#'.$this->params()->fromRoute('id', false).' не найден.'
                )
            );
        }else{
            return new JsonModel($object->getAll());
        }
    }

    //$this->getRouteMatch()->getParam('id', false)

    public function setRequestedPagination($e){
        $request  = $e->getRequest();
        $method   = $request->getMethod();
        if($method == 'GET'){
            $config = $this->getServiceLocator()->get('config');
            $page = (int)$this->params()->fromQuery('page', 1);
            $page = ($page<1)?1:$page;

            $records_per_page = (int)$this->params()->fromQuery('per_page', $config['paginator']['records_per_page']);
            $records_per_page = ($records_per_page<1)?$config['paginator']['records_per_page']:$records_per_page;

            $this->requestedPagination = array(
                'page' => $page,
                'records_per_page' => $records_per_page
            );
        }
    }

    public function getRequestedPagination(){
        return $this->requestedPagination;
    }

    public function setEventManager(EventManagerInterface $events)
    {
        parent::setEventManager($events);
        $events->attach('dispatch', array($this, 'checkOptions'), 10);
        $events->attach('dispatch', array($this, 'setRequestedPagination'), 11);
    }

    public function RESTtoCamelCase($data){
        if(is_array($data)){
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
        }else{

            //$response = $e->getResponse();
            //$response->setStatusCode(401);
        }
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
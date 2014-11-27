<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

use Object\Model\Unit; //use Object\Model\UnitSimple;
use Object\Model\UnitTable;

use Object\Model\Client;
use Object\Model\ClientTable;

use Object\Model\Person;
use Object\Model\PersonTable;

use Object\Model\Post;
use Object\Model\PostTable;

use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;

use Zend\View\Model\JsonModel;

class Module
{
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                    'Object' => __DIR__ . '/src/Object',
                ),
            ),
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }


    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        $eventManager->attach(MvcEvent::EVENT_DISPATCH_ERROR, array($this, 'onDispatchError'), 0);
        $eventManager->attach(MvcEvent::EVENT_RENDER_ERROR, array($this, 'onRenderError'), 0);
    }

    public function onDispatchError($e)
    {
        return $this->getJsonModelError($e);
    }

    public function onRenderError($e)
    {
        return $this->getJsonModelError($e);
    }

    public function getJsonModelError($e)
    {
        $error = $e->getError();
        if (!$error) {
            return;
        }

        $message = 'An error occurred during execution; please try again later.';
        $code = 500;

        $response = $e->getResponse();
        $exception = $e->getParam('exception');
        $exceptionJson = array();
        if ($exception) {
            /*
            $exceptionJson = array(
                'class' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'message' => $exception->getMessage(),
                'stacktrace' => $exception->getTraceAsString(),
                'code' => $exception->getCode()
            );
            */
            $message = $exception->getMessage();
            if($exception->getCode()){
                $response->setStatusCode($code = $exception->getCode());
            }
        }

        if ($error == 'error-router-no-match') {
            $message = $errorJson['message'] = 'Resource not found.';
            $code = 404;
            $response->setStatusCode($code);
        }

        $errorJson = array(
            'message'   => $message,
            'error'     => $error,
            'code'      => $code
        );//'exception' => $exceptionJson,

        $model = new JsonModel(array('errors' => array($errorJson)));

        $e->setResult($model);

        return $model;
    }

    // Add this method:
    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Object\Model\ClientTable' =>  function($sm) {
                        $tableGateway = $sm->get('ClientTableGateway');
                        $table = new ClientTable($tableGateway);
                        return $table;
                    },
                'ClientTableGateway' => function($sm) {
                        $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                        $resultSetPrototype = new ResultSet();
                        $resultSetPrototype->setArrayObjectPrototype(new Client());
                        return new TableGateway('clients', $dbAdapter, null, $resultSetPrototype);
                    },
                /* --- PERSON ---*/
                'Object\Model\PersonTable' =>  function($sm) {
                        $tableGateway = $sm->get('PersonTableGateway');
                        $table = new PersonTable($tableGateway);
                        return $table;
                    },
                'PersonTableGateway' => function($sm) {
                        $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                        $resultSetPrototype = new ResultSet();
                        $resultSetPrototype->setArrayObjectPrototype(new Person());
                        return new TableGateway('persons', $dbAdapter, null, $resultSetPrototype);
                    },

                /* --- POST --- */
                'Object\Model\PostTable' =>  function($sm) {
                        $tableGateway = $sm->get('PostTableGateway');
                        $table = new PostTable($tableGateway);
                        return $table;
                    },
                'PostTableGateway' => function($sm) {
                        $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                        $resultSetPrototype = new ResultSet();
                        $resultSetPrototype->setArrayObjectPrototype(new Post());
                        return new TableGateway('posts', $dbAdapter, null, $resultSetPrototype);
                    },
                /* --- PersonPost */
                'Object\Model\PersonPostActiveRecord' => function($sm){
                        $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                        $resultSetPrototype = new ResultSet();
                        $resultSetPrototype->setArrayObjectPrototype(new PersonPost());
                        return new TableGateway('person_posts', $dbAdapter, null, $resultSetPrototype);
                    },
                /* --- UNIT --- */
                'Object\Model\UnitTable' =>  function($sm) {
                        $tableGateway = $sm->get('UnitTableGateway');
                        $table = new UnitTable($tableGateway);
                        return $table;
                    },
                'UnitTableGateway' => function($sm) {
                        $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                        $resultSetPrototype = new ResultSet();
                        $resultSetPrototype->setArrayObjectPrototype(new Unit());
                        return new TableGateway('units', $dbAdapter, null, $resultSetPrototype);
                    },
                /* --- UnitPost--- */
                'Object\Model\UnitPostTable' =>  function($sm) {
                        $tableGateway = $sm->get('UnitPostTableGateway');
                        $table = new UnitPostTable($tableGateway);
                        return $table;
                    },
                'UnitPostTableGateway' => function($sm) {
                        $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                        $resultSetPrototype = new ResultSet();
                        $resultSetPrototype->setArrayObjectPrototype(new UnitPost());
                        return new TableGateway('unit_posts', $dbAdapter, null, $resultSetPrototype);
                    },
            ),
        );
    }




}

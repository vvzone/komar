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

use Zend\ModuleManager\Feature\ViewHelperProviderInterface;

class Module implements AutoloaderProviderInterface
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
                    'Authentication' => __DIR__ . '/src/Authentication',
                ),
            ),
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }


    public function onBootstrap(MvcEvent $event)
    {
        $application         = $event->getApplication();
        $serviceManager      = $application->getServiceManager();
        $eventManager        = $application->getEventManager();


        $viewModel = $event->getApplication()->getMvcEvent()->getViewModel();

        //$myService = $serviceManager->get('\Authentication\Helper\TokenHelper');
        //$viewModel->token = $myService;
        //$viewModel->token = new \Authentication\Helper\TokenHelper();


        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        //Отключить перед конвертацией ORM
        //$listener = $serviceManager->get('Authentication\Listener\ApiAuthenticationListener');
        //$eventManager->getSharedManager()->attach('Object\Controller', 'dispatch', $listener);

        $eventManager->attach(MvcEvent::EVENT_DISPATCH_ERROR, array($this, 'onDispatchError'), 0);
        $eventManager->attach(MvcEvent::EVENT_RENDER_ERROR, array($this, 'onRenderError'), 0);



        //$eventManager->attach(new \Doctrine\DBAL\Event\Listeners\MysqlSessionInit('utf8', 'utf8_unicode_ci')); //getEventManager()->

        /*
        $e->getApplication()->getEventManager()->addEventSubscriber(new
        \Doctrine\DBAL\Event\Listeners\MysqlSessionInit('utf8', 'utf8_unicode_ci'));
        */
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
        /*if (!$error) {
            return;
        }*/

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
}

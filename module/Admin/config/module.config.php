<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

$routePlugins = new Zend\Mvc\Router\RoutePluginManager();
$plugins = array(
    'hostname' => 'Zend\Mvc\Http\Route\Hostname',
    'literal' => 'Zend\Mvc\Http\Route\Literal',
    'part' => 'Zend\Mvc\Http\Route\Part',
    'regex' => 'Zend\Mvc\Http\Route\Regex',
    'scheme' => 'Zend\Mvc\Http\Route\Scheme',
    'segment' => 'Zend\Mvc\Http\Route\Segment',
    'wildcard' => 'Zend\Mvc\Http\Route\Wildcard',
    'query' => 'Zend\Mvc\Http\Route\Query',
    'method' => 'Zend\Mvc\Http\Route\Method'
);

foreach($plugins as $name => $class) {
    $routePlugins->setInvokableClass($name, $class);
}

return array(
    'router' => array(
        'routes' => array(
            'admin' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admin\Controller',
                        'controller'    => 'Admin\Controller\Index',
                        'action'       => 'index'
                    ),
                ),
                'route_plugins' => $routePlugins,
                'may_terminate' => true, // check-out another time what does this mean
            ),
            /* -= REST =- */
            'rest-endpoint' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin/api/object',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admin\Controller',
                        'controller'    => 'Admin\Controller\Index',
                    ),
                ),
                'route_plugins' => $routePlugins,
                'may_terminate' => true,
                'child_routes' => array(
                    /* ========= OBJECT ROUTES ===========*/
                    'client' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/client[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Client'
                            )
                        )
                    ),
                    'unit' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/unit[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Unit'
                            )
                        )
                    )
                )
            )

            /*
            'child_routes' => array(
                '/admin/object' => array(
                    'type'    => 'segment',
                    'options' => array(
                        'route'    => '/object',
                        'constraints' => array(
                            'action' => 'index'
                        ),
                        'defaults' => array(
                            '__NAMESPACE__' => 'Object\Controller',
                            'controller'    => 'Object\Controller\Index'
                        )
                    ),
                    'may_terminate' => true,
                )
            )
            */
            /*,
            'admin/object' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin/object',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Object\Controller',
                        'controller'    => 'Object\Controller\Index',
                        'action'        => 'index',
                    ),
                ),
                'may_terminate' => true,
            ),*/
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
        ),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Admin\Controller\Index' => 'Admin\Controller\IndexController',
            'Admin\Controller\Catalogs' => 'Admin\Controller\CatalogsController',
            'Admin\Controller\Unit' => 'Admin\Controller\UnitController',
            'Admin\Controller\Rest' => 'Admin\Controller\RestController',

            /* === Object === */
            'Object\Controller\Index' => 'Object\Controller\IndexController',
            'Object\Controller\Unit' => 'Object\Controller\UnitController',
            'Object\Controller\Client' => 'Object\Controller\ClientController',
            //'Object\Controller\Unit' => 'Object\Controller\Test',
        )
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'application/index/ajax' => __DIR__ . '/../view/application/ajax/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml'
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy'
        )
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);

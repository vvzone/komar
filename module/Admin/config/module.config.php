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
            /* login */
            'login' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin/login',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admin\Controller',
                        'controller'    => 'Admin\Controller\Auth',
                        'action'       => 'index'
                    ),
                ),
                'route_plugins' => $routePlugins,
                'may_terminate' => true, // check-out another time what does this mean
            ),
            'logout' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin/logout',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admin\Controller',
                        'controller'    => 'Admin\Controller\Auth',
                        'action'       => 'logout'
                    ),
                ),
                'route_plugins' => $routePlugins,
                'may_terminate' => true, // check-out another time what does this mean
            ),
            /* Menu, end other etc... */
            'sys' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin/sys',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admin\Controller',
                        'controller'    => 'Admin\Controller\Index',
                    ),
                ),
                'route_plugins' => $routePlugins,
                'may_terminate' => true,
                'child_routes' => array(
                    'menu' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/menu[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Admin\Controller',
                                'controller'    => 'Admin\Controller\Index',
                                'action' => 'ajax'
                            )
                        )
                    ),
                    'client_menu' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/client_menu[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            /*
                            'defaults' => array(
                                '__NAMESPACE__' => 'Admin\Controller',
                                'controller'    => 'Admin\Controller\Index',
                                'action' => 'client'
                            )*/
                            'defaults' => array(
                                    '__NAMESPACE__' => 'Object\Controller',
                                    'controller'    => 'Object\Controller\MenuClient',
                            )
                        )
                    ),
                    'client_menu_right' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/client_menu_right[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Admin\Controller',
                                'controller'    => 'Admin\Controller\Index',
                                'action' => 'rightpan'
                            )
                        )
                    )
                )
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
                    'person' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/person[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Person'
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
                    ),
                    'unit_post' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/unit_post[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\UnitPost'
                            )
                        )
                    ),
                    'rank' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/rank[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Rank'
                            )
                        )
                    ),
                    'sex' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/sex[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Sex'
                            )
                        )
                    ),
                    'document' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/document[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Document'
                            )
                        )
                    ),
                    'node_level' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/node_level[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\NodeLevel'
                            )
                        )
                    ),
                    'node' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/node[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Node'
                            )
                        )
                    ),
                    'route' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/route[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Route'
                            )
                        )
                    ),
                    'document_type' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/document_type[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\DocumentType'
                            )
                        )
                    ),
                    'attribute_type' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/attribute_type[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\AttributeType'
                            )
                        )
                    ),
                    'post' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/post[/:id][/page/:page]',
                            'constraints' => array(
                                'id'     => '[0-9]*',
                                'page'   => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\Post'
                            )
                        )
                    ),
                    'user' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/user[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'controller'    => 'Object\Controller\User'
                            )
                        )
                    ),
                    /* ---- === CLIENT ROUTES === ----*/
                    'inbox' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => '/inbox[/:id]',
                            'constraints' => array(
                                'id'     => '[0-9]*'
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Client\Controller',
                                'controller'    => 'Client\Controller\Messages'
                            )
                        )
                    ),
                )
            )
        ),
    ),
    'service_manager' => array(
        'service' => array(
            'Object\Paginator\Adapter' => 'Object\Paginator\Adapter'
        ),
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
            'Authentication\Adapter\HeaderAuthentication' => 'Authentication\Factory\AuthenticationAdapterFactory',
            'Authentication\Listener\ApiAuthenticationListener' => 'Authentication\Factory\AuthenticationListenerFactory',
            'Object\Paginator' => 'Object\Factory\PaginatorFactory'
        ),
        'invokables' => array(
            'Object\Repository\UserRepository' => 'Object\Repository\UserRepository',
            'Object\Repository\PostRepository' => 'Object\Repository\PostRepository',
            'Object\Repository\DocumentRepository' => 'Object\Repository\DocumentRepository',
            'Object\Paginator\Adapter' => 'Object\Paginator\Adapter'
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

            'Admin\Controller\Auth' => 'Admin\Controller\AuthController',

            /* ===  Menu  === */
            'Object\Controller\MenuClient' => 'Object\Controller\MenuClientController',
            /* === Object === */
            'Object\Controller\Index' => 'Object\Controller\IndexController',
            'Object\Controller\Unit' => 'Object\Controller\UnitController',
            'Object\Controller\UnitPost' => 'Object\Controller\UnitPostController',
            'Object\Controller\Client' => 'Object\Controller\ClientController',
            'Object\Controller\Person' => 'Object\Controller\PersonController',
            'Object\Controller\Rank' => 'Object\Controller\RankController',
            'Object\Controller\Sex' => 'Object\Controller\SexController',
            'Object\Controller\Document' => 'Object\Controller\DocumentController',
            'Object\Controller\NodeLevel' => 'Object\Controller\NodeLevelController',
            'Object\Controller\Node' => 'Object\Controller\NodeController',
            'Object\Controller\Route' => 'Object\Controller\RouteController',
            'Object\Controller\DocumentType' => 'Object\Controller\DocumentTypeController',
            'Object\Controller\AttributeType' => 'Object\Controller\AttributeTypeController',
            'Object\Controller\Post' => 'Object\Controller\PostController',
            'Object\Controller\User' => 'Object\Controller\UserController',
            /* === Client === */
            'Client\Controller\Messages' => 'Client\Controller\MessagesController'
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
    // Doctrine config
    'doctrine' => array(
        'eventmanager' => array(
            'orm_default' => array(
                'subscribers' => array(
                    // pick any listeners you need
                    'Gedmo\Tree\TreeListener',
                    //'Gedmo\Timestampable\TimestampableListener',
                    //'Gedmo\Sluggable\SluggableListener',
                    //'Gedmo\Loggable\LoggableListener',
                    //'Gedmo\Sortable\SortableListener'
                ),
            ),
        ),
        'driver' => array(
            'Object_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/Object/Entity')
            ),
            'Object_repositories' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/Object/Repository')
            ),
            'orm_default' => array(
                'drivers' => array(
                   'Object\Entity' => 'Object_driver',
                   'Object\Repository' => 'Object_repositories',
                )
            )
        )
    ),
    //
    // ViewHelpers
    //
    'view_helpers' => array(
        'factories' => array(
            'token' => 'Authentication\Helper\TokenHelperFactory'
        ),
        'shared' => array(
            'token' => false
        ),
    )

);

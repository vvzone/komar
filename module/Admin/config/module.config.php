<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

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
                        'action'        => 'index',
                    ),
                ),
                'may_terminate' => true
            ),
            'admin/object' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/admin/object',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Object\Controller',
                        'controller'    => 'Object\Controller\Unit',
                        'action'        => 'index',
                    ),
                ),
                'may_terminate' => true,
                /*'child_routes' => array(
                    'default' => array(
                        'type'    => 'Segment',
                        'options' => array(
                            'route'    => '/admin/object[:controller[/:id]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                /*'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',*//*
                                'id'     => '[0-9]*',
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Object\Controller',
                                'id'            => '',
                                'controller'    => 'Index',
                                'action'        => 'index'
                            )
                        )
                    )
                )*/
            ),
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

            'Object\Controller\Unit' => 'Object\Controller\IndexController',
            //'Object\Controller\Unit' => 'Object\Controller\Test',
            /* === Object === */
            'Index' => 'Object\Controller\IndexController',
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
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),        
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);

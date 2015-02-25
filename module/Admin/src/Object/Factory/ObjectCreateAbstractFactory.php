<?php

namespace Object\Factory;

use Zend\ServiceManager\AbstractFactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/* filter */
use Zend\InputFilter\Factory;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\Input;
use Zend\Validator;

use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Object\Response\JSONResponse;
use Zend\View\Model\JsonModel;

class ObjectCreateAbstractFactory implements AbstractFactoryInterface
{
    private $config;
    private $serviceLocator;

    public function canCreateServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

        return (substr($requestedName, -16) === '_REST_API_Create');
    }

    public function createServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

        $entityManager = $serviceLocator->get('Doctrine\ORM\EntityManager');

        $parts       = explode('\\', $requestedName);
        $entityName  = substr(end($parts), 0, -16);
        $entityClass = 'Object\\Entity\\' . $entityName;

        $Object = new $entityClass;
        $objectManager = $serviceLocator
            ->get('Doctrine\ORM\EntityManager');

        $data = '';
        $inputFilter= $Object->getInputFilter();

        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager, $entityClass);

            //$data = $this->RESTtoCamelCase($data);

            $Object = $hydrator->hydrate($data, $Object);

            $objectManager->persist($Object);
            $objectManager->flush();

        }else{
            $response = $this->getResponse();
            $response->setStatusCode(400);
            $data = $inputFilter->getMessages();
        }

        return new JsonModel($data);
    }

}
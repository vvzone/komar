<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\StreetType;
use Admin\Controller\RestController;
use Zend\EventManager\EventManagerInterface;

/* filter */
use Zend\InputFilter\Factory;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\Input;
use Zend\Validator;

/* hydra & orm */
use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

/* data out */
use Zend\View\Model\JsonModel;

use Object\Response\JSONResponse;


class StreetTypeController extends RestController
{

    /*-------------- default methods ----------*/
    public function checkInputJson($data){

    }

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('Doctrine\ORM\StreetTypeRESTListPagination');
        return $result;
    }


    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $post = $objectManager->find('Object\Entity\StreetType', $id);
        return new JsonModel($post->getAll());
    }

    public function create($data)
    {
        $post = new StreetType();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter= $post->getInputFilter();
        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\StreetType');
            $data = $this->RESTtoCamelCase($data);
            $post = $hydrator->hydrate($data, $post);
            $objectManager->persist($post);
            $objectManager->flush();

        }else{
            $response = $this->getResponse();
            $response->setStatusCode(400);
            $data = $inputFilter->getMessages();
        }

        return new JsonModel(array(
            $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $post = new StreetType();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter= $post->getInputFilter();
        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\StreetType');
            $data = $this->RESTtoCamelCase($data);
            $post = $hydrator->hydrate($data, $post);
            $objectManager->persist($post);
            $objectManager->flush();
        }else{
            $response = $this->getResponse();
            $response->setStatusCode(400);
            $data = $inputFilter->getMessages();
        };

        return new JsonModel(
            $data
        );
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $post = $objectManager->find('Object\Entity\StreetType', $id);
        $objectManager->remove($post);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }

/*-------------- default methods ----------*/
}
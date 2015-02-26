<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Admin\Controller\RestController;
use Zend\View\Model\JsonModel;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

class RegionTypeController extends RestController
{

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('RegionTypeRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $object = $objectManager->find('Object\Entity\RegionType', $id);
        return $this->getOutput($object);
    }

    public function create($data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('RegionTypeRESTAPICreate');


        /*
        $post = new \Object\Entity\RegionType();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter = $post->getInputFilter();
        if ($inputFilter->setData($data)->isValid()) {
            $hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\Rank');
            $data = $this->RESTtoCamelCase($data);
            $post = $hydrator->hydrate($data, $post);
            $objectManager->persist($post);
            $objectManager->flush();

        } else {
            $response = $this->getResponse();
            $response->setStatusCode(400);
            $data = $inputFilter->getMessages();
        }
        return new JsonModel(array(
            $data,
        ));
        */

        return $result;
    }

    public function update($id, $data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('RegionTypeRESTAPICreate');
        return $result;
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $object = $objectManager->find('Object\Entity\RegionType', $id);
        $objectManager->remove($object);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }
}
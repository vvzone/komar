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

class DocumentAttributeCollectionController extends RestController
{

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('DocumentAttributeCollectionRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $object = $objectManager->find('Object\Entity\DocumentAttributeCollection', $id);
        return $this->getOutput($object);
    }


    public function createComplex($data){
        $serviceLocator = $this
            ->getServiceLocator();
        $objectManager = $serviceLocator
            ->get('Doctrine\ORM\EntityManager');
        $objectManager->getRepository('Object\Entity\DocumentAttributeCollection')->getSubAttributesByAttributeType();
    }

    public function create($data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('DocumentAttributeCollectionRESTAPICreate');
        return $result;
    }

    public function update($id, $data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('DocumentAttributeCollectionRESTAPICreate');
        return $result;
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $object = $objectManager->find('Object\Entity\DocumentAttributeCollection', $id);
        $objectManager->remove($object);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }
}
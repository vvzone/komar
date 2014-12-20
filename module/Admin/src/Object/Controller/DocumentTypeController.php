<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

//use Zend\Mvc\Controller\AbstractActionController;\
use Object\Entity\DocumentType;
use Object\Entity\Post;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class DocumentTypeController extends RestController
{

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\DocumentType')->findAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getDocumentTypeSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $document_type = $objectManager->find('Object\Entity\DocumentType', $id);
        return new JsonModel($document_type->getAll());
    }

    public function create($data)
    {
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $document_type = new DocumentType();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\DocumentType');
        $data = $this->RESTtoCamelCase($data);
        $document_type = $hydrator->hydrate($data, $document_type);
        $objectManager->persist($document_type);
        $objectManager->flush();

        return new JsonModel(
            $data
        );
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $document_type = $objectManager->find('Object\Entity\DocumentType', $id);
        $objectManager->remove($document_type);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    /*
    public function getDocumentTypeTableList()
    {
        if (!$this->document_typeTableList) {
            $sm = $this->getServiceLocator();
            $this->document_typeTableList = $sm->get('Object\Model\DocumentTypeTableList');
        }
        return $this->document_typeTableList;
    }*/

/*-------------- default methods ----------*/
}
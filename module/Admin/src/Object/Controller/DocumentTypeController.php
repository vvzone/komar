<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\DocumentType;
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
//use Zend\Paginator\Paginator as Paginator;
use Object\Paginator\Paginator as Paginator;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Object\Response\JSONResponse;

class DocumentTypeController extends RestController
{

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('Doctrine\ORM\DocumentTypeRESTListPagination');
        return $result;
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
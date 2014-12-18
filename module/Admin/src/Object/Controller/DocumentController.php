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
use Object\Entity\Document;
use Object\Entity\Post;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


//class DocumentController extends AbstractActionController
class DocumentController extends RestController
{
    protected $documentTable;
    protected $documentTableList;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\Document')->findAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getDocumentSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $document = $objectManager->find('Object\Entity\Document', $id);
        return new JsonModel($document->getAll());
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
        $document = new Document();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Document');
        $data = $this->RESTtoCamelCase($data);
        $document = $hydrator->hydrate($data, $document);
        $objectManager->persist($document);
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

        $document = $objectManager->find('Object\Entity\Document', $id);
        $objectManager->remove($document);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    /*
    public function getDocumentTableList()
    {
        if (!$this->documentTableList) {
            $sm = $this->getServiceLocator();
            $this->documentTableList = $sm->get('Object\Model\DocumentTableList');
        }
        return $this->documentTableList;
    }*/

/*-------------- default methods ----------*/
}
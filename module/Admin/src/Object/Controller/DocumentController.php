<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\Post;
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


//class DocumentController extends AbstractActionController
class DocumentController extends RestController
{
    protected $documentTable;
    protected $documentTableList;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $objectManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $repository = $objectManager->getRepository('Object\Entity\Document');

        $adapter = new \Object\Paginator\Adapter($repository);

        $paginator = new Paginator($adapter);
        $paginator->setPaginationRequest($this->requestedPagination);

        $response = new JSONResponse($paginator->getCurrentItems());
        $response->setAdditional('paginator', $paginator->getAPI());
        return $response->getResponse();
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
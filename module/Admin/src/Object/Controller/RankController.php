<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\Rank;
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

class RankController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $ranksTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $objectManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $repository = $objectManager->getRepository('Object\Entity\Rank');

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
        $rank = $objectManager->find('Object\Entity\Rank', $id);
        return new JsonModel($rank->getAll());
    }

    public function create($data)
    {
        $post = new Rank();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter= $post->getInputFilter();
        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Rank');
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
        $post = new Rank();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter= $post->getInputFilter();
        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Rank');
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
        //$this->getRanksTable()->deleteRank($id);
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $rank = $objectManager->find('Object\Entity\Rank', $id);
        $objectManager->remove($rank);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }

}
<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

//use Doctrine\ORM\Tools\Pagination\Paginator;
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
use Zend\Paginator\Paginator as Paginator;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class PostController extends RestController
{

    /*-------------- default methods ----------*/
    public function checkInputJson($data){

    }

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $repository = $objectManager->getRepository('Object\Entity\Post');
        $adapter = new \Object\Paginator\Adapter($repository);

        $paginator = new Paginator($adapter);
        $paginator->setDefaultItemCountPerPage('5');
        
        $page = 2;

        $paginator->setCurrentPageNumber($page);

        //$data = array();
        $data = $paginator->getCurrentItems();

        /*
        foreach ($results as $result) {
            $data[] = $result->getPostSimple();
        }
        */

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $post = $objectManager->find('Object\Entity\Post', $id);
        return new JsonModel($post->getAll());
    }

    public function create($data)
    {
        $post = new Post();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter= $post->getInputFilter();
        if($inputFilter->setData($data)->isValid()){
            /*
            $data = array(
                'isValid' => true,
                'data' => $data,
                'filtered' => $inputFilter->getValues()
            );*/

            $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Post');
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
        $post = new Post();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $inputFilter= $post->getInputFilter();
        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Post');
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

        $post = $objectManager->find('Object\Entity\Post', $id);
        $objectManager->remove($post);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }

/*-------------- default methods ----------*/
}
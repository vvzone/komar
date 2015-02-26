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
use Object\Entity\NodeLevel;
use Object\Entity\Post;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class NodeLevelController extends RestController
{

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\NodeLevel')->findAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getNodeLevelSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $node_level = $objectManager->find('Object\Entity\NodeLevel', $id);
        return new JsonModel($node_level->getAll());
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
        $node_level = new NodeLevel();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\NodeLevel');
        $data = $this->RESTtoCamelCase($data);
        $node_level = $hydrator->hydrate($data, $node_level);
        $objectManager->persist($node_level);
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

        $node_level = $objectManager->find('Object\Entity\NodeLevel', $id);
        $objectManager->remove($node_level);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    /*
    public function getNodeLevelTableList()
    {
        if (!$this->node_levelTableList) {
            $sm = $this->getServiceLocator();
            $this->node_levelTableList = $sm->get('Object\Model\NodeLevelTableList');
        }
        return $this->node_levelTableList;
    }*/

/*-------------- default methods ----------*/
}
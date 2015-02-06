<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\Node;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;

use Object\Entity\Client as ClientORM;
use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;


class NodeController extends RestController
{
    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\Node')->findAll(); //TEST!
        $data = array();

        foreach($results as $user){
            $data[] = $user->getNodeSimple(); //getAll - for with Person
        }
        return new JsonModel(
           $data
        );
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\Node')->findByToken($id)->getResult();

        foreach($results as $user){
            $data[] = $user->getLogin();
        }

        return new JsonModel(array(
            $results
        ));
    }

    public function create($data)
    {
        //$data['id'] = 0; --????
        $user = new Node();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Node');

        $data = $this->RESTtoCamelCase($data);
        $user = $hydrator->hydrate($data, $user);
        $objectManager->persist($user);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $user = new Node();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Node');
        $data = $this->RESTtoCamelCase($data);
        $user = $hydrator->hydrate($data, $user);
        $objectManager->persist($user);
        $objectManager->flush();

        return new JsonModel(
            $data
        );
    }

    public function delete($id)
    {
        //$this->getNodesTable()->deleteNode($id);
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $user = $objectManager->find('Object\Entity\Node', $id);
        $objectManager->remove($user);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


}
<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\MenuClient;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;

use Object\Entity\Client as ClientORM;
use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Object\Entity\MenuClientTree;

class MenuClientController extends RestController
{
    public function getList(){
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $arrayTree = array();
        //$repo = $objectManager->getRepository('Object\Entity\MenuClientTree');
        $repo = $objectManager->getRepository('Object\Entity\MenuClient')->findAll();
        //$arrayTree = $repo->childrenHierarchy();

        foreach($repo as $menu){
            $arrayTree[] = $menu->getMenuClientSimple(); //getAll - for with Person
        }

        return new JsonModel(
            array(
                'requested_data' => $arrayTree
            )
        );
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $menuElement = $objectManager->find('Object\Entity\MenuClient', $id);

        return new JsonModel(array(
            $menuElement->getAll()
        ));
    }

    public function create($data)
    {
        //$data['id'] = 0; --????
        $menuElement = new MenuClient();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\MenuClient');

        $data = $this->RESTtoCamelCase($data);
        $menuElement = $hydrator->hydrate($data, $menuElement);

        $objectManager->persist($menuElement);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $user = new MenuClient();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\MenuClient');
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
        //$this->getMenuClientsTable()->deleteMenuClient($id);
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $user = $objectManager->find('Object\Entity\MenuClient', $id);
        $objectManager->remove($user);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


}
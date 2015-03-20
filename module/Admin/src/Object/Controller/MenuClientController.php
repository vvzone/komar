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

class MenuClientController extends RestController
{

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        //$result = $serviceLocator->get('MenuClientRESTListPagination');

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        /*
        $result = $objectManager->getRepository('Object\Entity\MenuClient')->findAll();
        return $result;
        */
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
        $object = $objectManager->find('Object\Entity\MenuClient', $id);
        return $this->getOutput($object);
    }

    public function create($data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('MenuClientRESTAPICreate');
        return $result;
    }

    public function update($id, $data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('MenuClientRESTAPICreate');
        return $result;
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $object = $objectManager->find('Object\Entity\MenuClient', $id);
        $objectManager->remove($object);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }
}
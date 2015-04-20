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

use Object\Entity\NodeLevel;

class NodeController extends RestController
{

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('NodeRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $object = $objectManager->find('Object\Entity\Node', $id);
        return $this->getOutput($object);
    }

    public function create($data)
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('NodeRESTAPICreate');
        return $result;
    }

    public function update($id, $data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $objectManager = $serviceLocator->get('Doctrine\ORM\EntityManager');


        $CurrentNodeLevel = $objectManager->find('Object\Entity\NodeLevel', $data['node_level']);
        $CurrentNodes = $CurrentNodeLevel->getNodes();

        $CurrentRoute = $objectManager->find('Object\Entity\Route', $data['node_level']);

        $level_completed = true;
        foreach($CurrentNodes as $node){
            if($node['node_state']['code_name'] != 'confirmed'){
                $level_completed = false;
            }
        }

        if($level_completed){
            $CurrentNodeLevels = $CurrentRoute->getNodeLevels();
            $current_level_order = $CurrentNodeLevel->getLevelOrder();

            $current_level_id =  $CurrentNodeLevel->getId();

            foreach($CurrentNodeLevels as $NodeLevel){
                if($NodeLevel['level_order'] > $current_level_order){
                    $current_level_id = $NodeLevel['id'];
                    break;
                }
            }
            $CurrentRoute['current_level']= $current_level_id;
        }


        $result = $serviceLocator->get('NodeRESTAPICreate');
        return $result;
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $object = $objectManager->find('Object\Entity\Node', $id);
        $objectManager->remove($object);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }
}
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
use Object\Entity\AttributeType;
use Object\Entity\Post;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class AttributeTypeController extends RestController
{

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\AttributeType')->findAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getAttributeTypeSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $attribute_type = $objectManager->find('Object\Entity\AttributeType', $id);
        return new JsonModel($attribute_type->getAll());
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
        $attribute_type = new AttributeType();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\AttributeType');
        $data = $this->RESTtoCamelCase($data);
        $attribute_type = $hydrator->hydrate($data, $attribute_type);
        $objectManager->persist($attribute_type);
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

        $attribute_type = $objectManager->find('Object\Entity\AttributeType', $id);
        $objectManager->remove($attribute_type);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    /*
    public function getAttributeTypeTableList()
    {
        if (!$this->attribute_typeTableList) {
            $sm = $this->getServiceLocator();
            $this->attribute_typeTableList = $sm->get('Object\Model\AttributeTypeTableList');
        }
        return $this->attribute_typeTableList;
    }*/

/*-------------- default methods ----------*/
}
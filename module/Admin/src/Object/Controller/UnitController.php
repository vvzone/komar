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
use Object\Entity\Unit;
use Object\Entity\Post;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


//class UnitController extends AbstractActionController
class UnitController extends RestController
{
    protected $unitTable;
    protected $unitTableList;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $results = $objectManager->getRepository('Object\Entity\Unit')->findAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getUnitSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $unit = $objectManager->find('Object\Entity\Unit', $id);
        return new JsonModel($unit->getAll());
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
        $unit = new Unit();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Unit');
        $data = $this->RESTtoCamelCase($data);
        $unit = $hydrator->hydrate($data, $unit);
        $objectManager->persist($unit);
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

        $unit = $objectManager->find('Object\Entity\Unit', $id);
        $objectManager->remove($unit);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    /*
    public function getUnitTableList()
    {
        if (!$this->unitTableList) {
            $sm = $this->getServiceLocator();
            $this->unitTableList = $sm->get('Object\Model\UnitTableList');
        }
        return $this->unitTableList;
    }*/

/*-------------- default methods ----------*/
}
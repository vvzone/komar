<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Object\Entity\Ranks as Ranks;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;

use Object\Entity\Clients as ClientORM;
use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;


class RankController extends RestController
{
    protected $clientTable;
    //protected $clientTableList;
    protected $unitTable;
    protected $ranksTable;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        //$results = $objectManager->getRepository('Object\Entity\Clients')->findBy(array('identificationNumber' => 19612));
        $results = $objectManager->getRepository('Object\Entity\Rank')->findAll();

        //var_dump($results);
        //$results = $this->getClientTable()->fetchAll();
        $data = array();

        foreach ($results as $result) {
            $data[] = $result->getRankSimple();
        }

        return new JsonModel($data);
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $rank = $objectManager->find('Object\Entity\Ranks', $id);
        return new JsonModel($rank->getAll());
    }

    public function create($data)
    {
        //$data['id'] = 0; --????
        $rank = new Ranks();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Ranks');

        $data = $this->RESTtoCamelCase($data);
        $rank = $hydrator->hydrate($data, $rank);
        $objectManager->persist($rank);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;
        $rank = new Ranks();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Ranks');
        $data = $this->RESTtoCamelCase($data);
        $rank = $hydrator->hydrate($data, $rank);
        $objectManager->persist($rank);
        $objectManager->flush();

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

        $rank = $objectManager->find('Object\Entity\Ranks', $id);
        $objectManager->remove($rank);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }


    public function getClientTable()
    {
        if (!$this->clientTable) {
            $sm = $this->getServiceLocator();
            $this->clientTable = $sm->get('Object\Model\ClientTable');
        }
        return $this->clientTable;
    }

    public function getUnitTable()
    {
        if (!$this->unitTable) {
            $sm = $this->getServiceLocator();
            $this->unitTable = $sm->get('Object\Model\UnitTable');
        }
        return $this->unitTable;
    }

    public function getRanksTable()
    {
        if (!$this->ranksTable) {
            $sm = $this->getServiceLocator();
            $this->ranksTable = $sm->get('Object\Model\RanksTable');
        }
        return $this->ranksTable;
    }

/*-------------- default methods ----------*/
}
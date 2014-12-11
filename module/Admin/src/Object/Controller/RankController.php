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
        $results = $objectManager->getRepository('Object\Entity\Ranks')->findAll();

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
        //$client = $this->getClientTable()->getClient($id);
        //$unit = $this->getUnitTable()->getUnitByClientId($id);
        //$rank = $this->getRanksTable()->getRankByClientId($id);

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        /*
        if($unit){

            $client->is_unit = true;
            $client->unit = $unit;
        }elseif($rank){

            $client->is_unit = false;
            $client->person = $rank;
        }

        */

        //$client = array_merge($client, $unit);
        //$rank = $objectManager->find('Object\Entity\Ranks', $id);
        $rank = $objectManager->find('Object\Entity\Ranks', $id);
        //$client->__load();
        return new JsonModel($rank->getAll());
        //return new JsonModel(array("data" => $client->get_name()));
    }

    public function create($data)
    {
        $data['id'] = 0;
        $rank = new Rank();
        $rank->exchangeArray($data);
        $id = $this->getRanksTable()->saveRank($rank);
        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function update($id, $data)
    {
        $data['id'] = $id;

        /*
        $rank = $this->getRanksTable()->getRank($id);
        $rank_temp = new Rank();

        // on next line may place hydration
        $rank_temp->exchangeArray($data); //delete this one after form will be added
        $id = $this->getRanksTable()->saveRank($rank_temp); //($form->getData());
        */

        /*$rank = new Ranks();
        $hydrator = new DoctrineHydrator($entityManager,'Nomina\Entity\Empleado');
        $data = $request->getPost()
        $empleado = $hydrator($data, $empleado);
        $entityManager->persist($empleado);
        $entityManager->flush();*/

        $rank = new Ranks();
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager,'Object\Entity\Ranks');

        /*
        $filter = new UnderscoreToCamelCase();
        $data = $filter->filter($data);
        foreach($data as $k => $v){
            $filtered[$filter->filter($k)] = $v ;
        }
        var_dump($filtered);
        */
        $rank = $hydrator->hydrate($data, $rank);
        $objectManager->persist($rank);
        $objectManager->flush();

        return new JsonModel(
            $data
        );
    }

    public function delete($id)
    {
        $this->getRanksTable()->deleteRank($id);

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
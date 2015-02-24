<?php

namespace Object\Repository;

use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class ClientRepository extends EntityRepository implements ServiceLocatorAwareInterface
{
    protected $services;

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->services = $serviceLocator;
    }

    public function getServiceLocator()
    {
        return $this->services;
    }

    /**
     * Counts how many posts there are in the database
     *
     * @return int
     */
    public function count()
    {
        $query = $this->getEntityManager()->createQueryBuilder();
        $query->select(array('c.id'))
            ->from('Object\Entity\Client', 'c');

        $result = $query->getQuery()->getResult();

        return count($result);
    }

    /**
     * Returns a list of users
     *
     * @param int $offset           Offset
     * @param int $itemCountPerPage Max results
     *
     * @return array
     */
    public function getItems($offset, $itemCountPerPage)
    {
        $query = $this->getEntityManager()->createQueryBuilder();
        $query->select(array('c.id', 'c.fullName as full_name'))
            ->from('Object\Entity\Client', 'c')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }

    public function getOnlyPersons()
    {
        $qb= $this->_em->createQueryBuilder();

        /*
         * SELECT * FROM `clients` as c RIGHT JOIN `persons` as p ON c.id=p.client
         * */

        return $qb->getQuery();
    }

}
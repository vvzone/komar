<?php

namespace Object\Repository;

use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class StreetTypeRepository extends EntityRepository implements ServiceLocatorAwareInterface
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
        $query->select(array('a.id'))
            ->from('Object\Entity\StreetType', 'a');

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
        $query->select(array('a.id', 'a.name'))
            ->from('Object\Entity\StreetType', 'a')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }

}

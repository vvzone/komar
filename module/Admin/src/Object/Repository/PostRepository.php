<?php

namespace Object\Repository;

use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class PostRepository extends EntityRepository implements ServiceLocatorAwareInterface
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
        $query->select(array('p.id'))
            ->from('Object\Entity\Post', 'p');

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
        $query->select(array('p.id', 'p.name'))
            ->from('Object\Entity\Post', 'p')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }


    /**
     * @param $token
     * @return array
     */
    public function findByToken($token)
    {
        $filter[1] = $token;

        $queryBuilder = $this->_em->createQueryBuilder();
        $queryBuilder->select('user')
            ->from('Object\Entity\User', 'user')
            ->where('user.token = ?1')
            ->setParameters($filter)
            ->setMaxResults(1);
        $query = $this->_em->createQuery('SELECT u.login, u.password FROM Object\Entity\User u WHERE u.token = :token');
        $query->setParameter('token', $token);
        $result = $query->getOneOrNullResult();
        return $result;
    }

}

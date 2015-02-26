<?php

namespace Object\Repository;

use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class PersonRepository extends EntityRepository implements ServiceLocatorAwareInterface
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
        $query->select(array('r.id'))
            ->from('Object\Entity\Person', 'r');

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
        $query->select(array("p.id", "concat(p.familyName, ' ', p.firstName, ' ', p.patronymicName) as name"))
            ->from('Object\Entity\Person', 'p')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }

    public function test()
    {
        return 'PersonRepository -> test';
    }

    public function getDeputy($unit_id){

        $filter[1] = $unit_id;


        /*
        $queryBuilder = $this->_em->createQueryBuilder();
        $queryBuilder->select('person')
            ->from('Object\Entity\Person', 'person')
            ->where('person. = ?1')
            ->setParameters($filter)
            ->setMaxResults(1);
        $query = $this->_em->createQuery('SELECT u.login, u.password FROM Object\Entity\User u WHERE u.token = :token');
        $query->setParameter('token', $token);*/

        $result= $query->getQuery();


        return $result;
    }

    public function getByCredentials($credentials){


        $query = $this->_em->createQuery('SELECT u.login, u.token FROM Object\Entity\User u WHERE u.login = :login AND u.password = :password');
        $query->setParameters(array(
            'login' => $credentials['login'],
            'password'=> $credentials['password']
        ));


        //$query->setParameters('password', $credentials['password']);

        $result = $query->getOneOrNullResult();
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

    public function findByCredentials($authorizationPair){
        $login = $authorizationPair[0];
        $password = $authorizationPair[1];

        return 'error method';
    }

}

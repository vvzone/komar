<?php

namespace Object\Repository;

use \Doctrine\ORM\Query;

class User extends PageableRepository
{
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
        $query->select(array('u.id', 'u.login'))
            ->from('Object\Entity\User', 'u')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

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
        /*
        $qb = $this->_em->createQueryBuilder();
        $filter[1] = $token;

        $qb->add('select', new Select(array('u')))
            ->add('from', new From('Object\Entity\User', 'u'))
            ->add('where', 'u.token = ?1')
            ->add('orderBy', new OrderBy('u.id', 'DESC'))
            ->setParameters($filter);
        ;
                //$query = $qb->getQuery();
        //$query = $queryBuilder->getQuery();
        */

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

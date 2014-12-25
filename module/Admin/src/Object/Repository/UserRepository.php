<?php

namespace Object\Repository;

use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

class UserRepository extends EntityRepository
{
    public function test()
    {
        return 'UserRepository -> test';
    }

    public function findByToken($token)
    {
        $qb = $this->_em->createQueryBuilder();

        $filter[1] = $token;

        $qb->add('select', new Select(array('u')))
            ->add('from', new From('Object\Entity\User', 'u'))
            ->add('where', 'u.token = ?1')
            ->add('orderBy', new OrderBy('u.id', 'DESC'))
            ->setParameters($filter);
        ;

        return $qb->getQuery();
    }

}

//
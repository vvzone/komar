<?php
namespace Object\Repository;

use Doctrine\ORM\EntityRepository;
use DoctrineORMModule\Proxy\__CG__\Object\Entity\Clients;

class ClientsRepository extends EntityRepository
{

    public function getOnlyPersons()
    {
        $qb= $this->_em->createQueryBuilder();

        /*
         * SELECT * FROM `clients` as c RIGHT JOIN `persons` as p ON c.id=p.client
         * */

        return $qb->getQuery();
    }

}
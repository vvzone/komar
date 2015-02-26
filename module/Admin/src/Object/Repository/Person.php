<?php

namespace Object\Repository;

use \Doctrine\ORM\Query;

class Person extends PageableRepository
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
        $query->select(array("p.id", "concat(p.familyName, ' ', p.firstName, ' ', p.patronymicName) as name"))
            ->from('Object\Entity\Person', 'p')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }
}

<?php

namespace Object\Repository;

use \Doctrine\ORM\Query;

class Address extends PageableRepository
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
        $query->select(array('address.id', 'address.address'))
            ->from($this->getCurrentEntityClass(), 'address')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }
}

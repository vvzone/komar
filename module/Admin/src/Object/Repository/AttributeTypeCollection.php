<?php

namespace Object\Repository;

use \Doctrine\ORM\Query;

class AttributeTypeCollection extends PageableRepository
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

        /*
        $queryBuilder = $this->_em->createQueryBuilder();
        $queryBuilder->select('attribute_type.name')
            ->from('Object\Entity\User', 'attribute_type')
            ->where('user.token = ?1')
            ->setParameters($filter)
            ->setMaxResults(1);
        */

        $query->select(array('collection.id'))
            ->from($this->getCurrentEntityClass(), 'collection')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        return $result;
    }

}

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


    public function getItemsNew($offset, $itemCountPerPage)
    {
        $result = $this->getEntityManager()->createQuery('SELECT p FROM Object\Entity\Person p')
            ->getResult();

        $output = array();
        foreach($result as $obj){
            $output[] = $obj->getEntityTable();
        }

        return $output;
    }

    public function getItems($offset, $itemCountPerPage, $sortBy = null, $sortOrder = null)
    {
        //echo 'ALARM!!';
        //echo 'sort_order'.$sortBy;

        $query = $this->getEntityManager()->createQueryBuilder();


        $query->select('entity')
            ->from('Object\Entity\Person', 'entity')
            ->orderBy($this->getSortBy($sortBy), $this->getSortOrder($sortOrder))
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);
        /*
        $query->select(array("p.id", "concat(p.familyName, ' ', p.firstName, ' ', p.patronymicName) as name"))
            ->from('Object\Entity\Person', 'p')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);
        */

        //$result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);
        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);

        $result = $this->resultCamelConvert($result);

        return $result;
    }
}

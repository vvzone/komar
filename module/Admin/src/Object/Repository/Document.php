<?php

namespace Object\Repository;

class Document extends PageableRepository
{
    /**
     * Authored, != draft
     * @param $person_id
     * @return array
     */
    public function getSent($person_id){
        $filter[1] = $person_id;
        $query = $this->_em->createQuery(
            "SELECT D FROM Object\Entity\Document D JOIN D.currentNodeLevel CNL JOIN CNL.nodeLevelType NLT WITH NLT.code != 'draft' WHERE D.documentAuthor = :person_id"
        );

        $query->setParameter('person_id', $person_id);
        $result = $query->getResult();
        return $result;
    }

    /**
     * Authored + draft
     * @param $person_id
     * @return array
     */
    public function getDraft($person_id){
        $filter[1] = $person_id;
        $query = $this->_em->createQuery(
            "SELECT D FROM Object\Entity\Document D JOIN D.currentNodeLevel CNL JOIN CNL.nodeLevelType NLT WITH NLT.code = 'draft' WHERE D.documentAuthor = :person_id"
        );

        $query->setParameter('person_id', $person_id);
        $result = $query->getResult();
        return $result;

    }

    public function getAuthored($person_id){
        $filter[1] = $person_id;
        $query = $this->_em->createQuery(
            "SELECT D FROM Object\Entity\Document D WHERE D.documentAuthor = :person_id"
        );
        $query->setParameter('person_id', $person_id);
        $result = $query->getResult();
        return $result;
    }



    public function getInbox($person_id){
        //Не учитывается стейт and nor Draft
        $client_id  = $this->getClientIdFromPersonId($person_id);
        $filter[1] = $client_id;
        $query = $this->_em->createQuery(
            "SELECT d FROM Object\Entity\Document d JOIN d.currentNodeLevel CNL WITH CNL.id=
            (SELECT NL.id FROM Object\Entity\NodeLevel NL JOIN NL.nodes N WITH N.id IN (SELECT n.id FROM Object\Entity\Node n WHERE n.client = :client_id))"
        );
        $query->setParameter('client_id', $client_id);
        $result = $query->getResult(); //->getArrayResult()

        return $result;
    }

    public function getClientIdFromPersonId($person_id){
        $filter[1] = $person_id;
        $query = $this->_em->createQuery(
            "SELECT c.id FROM Object\Entity\Client c JOIN c.personInfo p WHERE p.id = :person_id"
        );
        $query->setParameter('person_id', $person_id);
        $result = $query->getOneOrNullResult();
        return $result;
    }
}

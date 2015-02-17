<?php

namespace Object\Repository;

use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class DocumentRepository extends EntityRepository implements ServiceLocatorAwareInterface
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

    public function getInbox($client_id)
    {
        //SELECT * FROM document LEFT JOIN node_level on document.current_node_level_id = node_level.id WHERE node_level.id =1

        /*

        SELECT * FROM document
            LEFT JOIN node_level on document.current_node_level_id = node_level.id
            WHERE node_level.id IN
        (SELECT node_level.id
FROM node_level
LEFT JOIN node on node_level.id = node.node_level_id
WHERE node.id IN
(SELECT id FROM node WHERE node.client_id = 24))


        =======
SELECT id
FROM node_level
LEFT JOIN node on node_level.id = node.node_level_id
WHERE node.id IN
(SELECT id FROM node WHERE node.client_id = 24)
        */
        $filter[1] = $client_id;

        /*
                 $query = $this->_em->createQuery(
            'SELECT d FROM Object\Entity\Document d
            LEFT JOIN Object\Entity\NodeLevel node_level ON d.current_node_level_id = node_level.id
            WHERE node_level.id IN
            (SELECT NL.id FROM Object\Entity\NodeLevel NL
            LEFT JOIN node on node_level.id = node.node_level_id
            WHERE node.id IN (
            SELECT N.id FROM Object\Entity\Node N WHERE N.client_id = :client_id))'
        );
         * */

        //SELECT u, count(g.id) FROM Entities\User u JOIN u.groups g GROUP BY u.id
        $query = $this->_em->createQuery(
            "SELECT d FROM Object\Entity\Document d JOIN d.currentNodeLevel CNL WHERE CNL.id=
            (SELECT NL.id FROM Object\Entity\NodeLevel NL JOIN NL.nodes N WITH N.id IN (SELECT n.id FROM Object\Entity\Node n WHERE n.client = :client_id))"
        );

        //SELECT d FROM Object\Entity\Document d JOIN d.currentNodeLevel CNL WHERE CNL.id=2
        //SELECT NL.id FROM Object\Entity\NodeLevel NL JOIN NL.nodes N WITH N.id IN (SELECT n.id FROM Object\Entity\Node n WHERE n.client = :client_id)

        //SELECT NL.id FROM Object\Entity\NodeLevel NL JOIN NL.nodes N WITH N.id =1

        // (SELECT N.id FROM Object\Entity\Node N WHERE N.client = :client_id)

        $query->setParameter('client_id', $client_id);
        $result = $query->getOneOrNullResult();

        return $result;
    }

}

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
            WHERE node_level.id =
        (SELECT id FROM node_level
            LEFT JOIN node on nodel_level.id = node.id
            WHERE node.client_id = 24)

        */
        $filter[1] = $client_id;

        $query = $this->_em->createQuery('SELECT u.login, u.password FROM Object\Entity\User u WHERE u.token = :token');
        $query->setParameter('client_id', $client_id);
        $result = $query->getOneOrNullResult();

        return $result;
    }

}

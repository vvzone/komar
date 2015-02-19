<?php

namespace Object\Paginator;

use Zend\Paginator\Adapter\AdapterInterface;


class Adapter implements AdapterInterface{

    protected $repository;
    protected $pageCount;

    /**
     * Construct
     *
     *  @param \Doctrine\ORM\EntityRepository $repository Repository class
     */
    public function __construct($repository){
        $this->repository = $repository;
    }

    /**
     * @param int $offset
     * @param int $itemCountPerPage
     * @return array
     */
    public function getItems($offset, $itemCountPerPage){
        return $this->repository->getItems($offset, $itemCountPerPage);

    }



    /**
     * @return int|void
     */
    public function count(){
        return $this->repository->count();
    }

}
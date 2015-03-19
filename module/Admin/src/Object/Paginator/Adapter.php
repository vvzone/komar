<?php

namespace Object\Paginator;

use Zend\Paginator\Adapter\AdapterInterface;


class Adapter implements AdapterInterface{

    protected $repository;
    protected $pageCount;

    protected $sortBy;
    protected $sortOrder;

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
        return $this->repository->getItems($offset, $itemCountPerPage, $this->sortBy, $this->sortOrder);
    }

    public function setSortOrder($requestedSorting){
        $this->sortBy = $requestedSorting['sort_by'];
        $this->sortOrder = $requestedSorting['sort_order'];
    }


    /**
     * @return int|void
     */
    public function count(){
        return $this->repository->count();
    }

}
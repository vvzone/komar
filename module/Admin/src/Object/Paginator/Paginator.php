<?php
/**
 * Created by PhpStorm.
 * User: Victor
 * Date: 16.02.15
 * Time: 17:31
 */

namespace Object\Paginator;

use Zend\Paginator\Paginator as ZendPaginator;

class Paginator extends ZendPaginator{

    protected $paginator;
    protected $adapter;

    /**
     * @param $adapter
     */
    public function __constructor($adapter){
        $this->adapter = $adapter;

    }

    public function setPaginationRequest($requestedPagination){
        $this->setDefaultItemCountPerPage($requestedPagination['records_per_page']);
        $this->setCurrentPageNumber($requestedPagination['page']);
    }

    /**
     * @return array
     */
    public function getAPI(){
        return array(
            'current_page' => $this->getCurrentPageNumber(),
            'total_pages' => $this->count(),
            'records_per_page' => $this->getItemCountPerPage()
        );
    }

}
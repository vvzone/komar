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

    public function __constructor($adapter){
        $this->adapter = $adapter;
        //$this->paginator = new ZendPaginator();
    }

    public function paginatedList(){
        $page = 1;
        $records_per_page = 5;

        //$page = (int)$this->params()->fromQuery('page', 1);
        //$records_per_page = (int)$this->params()->fromQuery('limit', 10);

        $records_per_page = ($records_per_page<1)?10:$records_per_page;

        $this->setDefaultItemCountPerPage($records_per_page);
        $this->setCurrentPageNumber((int)$page);

        return $this->getCurrentItems();
    }

}
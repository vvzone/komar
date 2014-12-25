<?php
/**
 * Created by PhpStorm.
 * User: Victor
 * Date: 25.12.14
 * Time: 13:52
 */

namespace Authentification\Adapter;

use Zend\Authentication\Adapter\AdapterInterface;
use Zend\Authentication\Result;
use Zend\Http\Request;


class HeaderAuthentication implements AdapterInterface{
    protected $request;
    protected $repository;

    public function __construct(Request $request, UserRepository $repository) {
        $this->request    = $request;
        $this->repository = $repository;
    }

    public function authenticate()
    {
        // authenticate the request here
    }
}
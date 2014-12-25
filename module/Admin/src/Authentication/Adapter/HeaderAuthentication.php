<?php

namespace Authentication\Adapter;

use Object\Repository\UserRepository;

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




    public function getRequest(){
        return $this->request;
    }

    public function getUserRepository(){
        return $this->repository;
    }



    public function authenticate()
    {
        $request = $this->getRequest();
        $headers = $request->getHeaders();

        // Check Authorization header presence

        if (!$headers->has('Authorization')) {
            return new Result(Result::FAILURE, null, array(
                'Authorization header missing'
            ));
        }


        // Check Authorization prefix

        $authorization = $headers->get('Authorization')->getFieldValue();
        /*
        if (strpos($authorization, 'PRE') !== 0) {
            return new Result(Result::FAILURE, null, array(
                'Missing PRE prefix'
            ));
        }
        */

        // Validate public key
        //$publicKey = $this->extractPublicKey($authorization);
        //$user      = $this->getUserRepository()->findByPublicKey($publicKey);

        $user      = $this->getUserRepository()->findByToken($authorization);

        if (null === $user) {
            $code = Result::FAILURE_IDENTITY_NOT_FOUND;
            return new Result($code, null, array(
                'User not found based on token'
            ));
        }

        // Validate signature
        /*
        $signature = $this->extractSignature($authorization);
        $hmac      = $this->getHmac($request, $user);
        if ($signature !== $hmac) {
            $code = Result::FAILURE_CREDENTIAL_INVALID;
            return new Result($code, null, array(
                'Signature does not match'
            ));
        }
        */

        return new Result(Result::SUCCESS, $user);
    }
}
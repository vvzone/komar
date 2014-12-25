<?php

namespace Object\Repository;

use Doctrine\ORM\EntityRepository;

class UserRepository extends EntityRepository
{
    public function test()
    {
        return 'UserRepository -> test';
    }
}
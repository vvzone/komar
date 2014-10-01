<?php

namespace Application\TestModel;

use Application\Model\Rank;
use PHPUnit_Framework_TestCase;

class RankTest extends PHPUnit_Framework_TestCase{

    public function testRankInitialState()
    {
        $rank = new Rank();

        $this->assertNull($rank->id, '"id" should initially be null');
        $this->assertNull($rank->name, '"title" should initially be null');
        $this->assertNull($rank->short_name, '"title" should initially be null');
        $this->assertNull($rank->description, '"title" should initially be null');
        $this->assertNull($rank->order, '"title" should initially be null');
    }

}
<?php

namespace Object\Model;

class UnitPost{

    public $id;
    public $unit;
    public $post;
    public $start_date;
    public $stop_date;
    public $description;

    public function exchangeArray($data)
    {
        //var_dump($data);
        $this->id     = (isset($data['id'])) ? $data['id'] : null;
        $this->unit = (isset($data['unit'])) ? $data['unit'] : null;
        $this->post  = (isset($data['post'])) ? $data['post'] : null;
        $this->start_date  = (isset($data['start_date'])) ? $data['start_date'] : null;
        $this->stop_date  = (isset($data['stop_date'])) ? $data['stop_date'] : null;
    }

}
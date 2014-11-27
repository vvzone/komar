<?php

namespace Object\Model;

class PersonPost{

    public $id;
    public $person;
    public $unit_post; //unit_post.id
    public $document;
    public $start_date;
    public $stop_date;
    public $description;

    public function exchangeArray($data)
    {
        //var_dump($data);
        $this->id     = (isset($data['id'])) ? $data['id'] : null;
        $this->person  = (isset($data['person'])) ? $data['person'] : null;
        $this->unit_post = (isset($data['unit_post'])) ? $data['unit_post'] : null;
        $this->document = (isset($data['document'])) ? $data['document'] : null;
        $this->start_date  = (isset($data['start_date'])) ? $data['start_date'] : null;
        $this->stop_date  = (isset($data['stop_date'])) ? $data['stop_date'] : null;
        $this->description  = (isset($data['description'])) ? $data['description'] : null;
    }

}
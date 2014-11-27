<?php

namespace Object\Model;

class Client{

    public $id;
    public $identification_number;
    public $full_name;
    public $is_unit;
    public $is_external;

    public $unit;
    public $person;

    public function exchangeArray($data)
    {
        //var_dump($data);
        $this->id     = (isset($data['id'])) ? $data['id'] : null;
        $this->full_name = (isset($data['full_name'])) ? $data['full_name'] : null;
        $this->identification_number  = (isset($data['identification_number'])) ? $data['identification_number'] : null;
        $this->is_unit  = (isset($data['is_unit'])) ? $data['is_unit'] : null;
        $this->is_external  = (isset($data['is_external'])) ? $data['is_external'] : null;

        /* --- SubModels --- */
        $this->unit  = (isset($data['unit'])) ? $data['unit'] : null;
        $this->person  = (isset($data['person'])) ? $data['person'] : null;
    }

    public function get_name(){
        return $this->full_name;
    }

}
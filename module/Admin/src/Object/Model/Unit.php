<?php

namespace Object\Model;

class Unit{

    public $id;
    public $name;
    public $identification_number;
    public $short_name;
    public $own_numeration;
    public $is_legal;
    public $parent;
    public $commander;
    public $deputy;
    public $on_duty;

    public function exchangeArray($data)
    {
        //var_dump($data);

        $this->id     = (isset($data['id'])) ? $data['id'] : null;
        $this->name = (isset($data['name'])) ? $data['name'] : null;
        $this->identification_number  = (isset($data['identification_number'])) ? $data['identification_number'] : null;
        $this->short_name  = (isset($data['short_name'])) ? $data['short_name'] : null;
        $this->own_numeration  = (isset($data['own_numeration'])) ? $data['own_numeration'] : null;
        $this->is_legal  = (isset($data['is_legal'])) ? $data['is_legal'] : null;
        $this->parent  = (isset($data['parent'])) ? $data['parent'] : null;
        $this->commander  = (isset($data['commander'])) ? $data['commander'] : null;
        $this->deputy  = (isset($data['deputy'])) ? $data['deputy'] : null;
        $this->on_duty  = (isset($data['on_duty'])) ? $data['on_duty'] : null;
    }

    public function get_name(){
        return $this->name;
    }

}
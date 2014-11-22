<?php

namespace Application\Model;

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
        $this->id     = (!empty($data['id'])) ? $data['id'] : null;
        $this->name = (!empty($data['name'])) ? $data['name'] : null;
        $this->identification_number  = (!empty($data['identification_number'])) ? $data['identification_number'] : null;
        $this->short_name  = (!empty($data['short_name'])) ? $data['short_name'] : null;
        $this->own_numeration  = (!empty($data['own_numeration'])) ? $data['own_numeration'] : null;
        $this->is_legal  = (!empty($data['is_legal'])) ? $data['is_legal'] : null;
        $this->parent  = (!empty($data['parent'])) ? $data['parent'] : null;
        $this->commander  = (!empty($data['commander'])) ? $data['commander'] : null;
        $this->deputy  = (!empty($data['deputy'])) ? $data['deputy'] : null;
        $this->on_duty  = (!empty($data['on_duty'])) ? $data['on_duty'] : null;
    }

    public function get_name(){
        return $this->name;
    }

}
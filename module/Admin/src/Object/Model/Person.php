<?php

namespace Object\Model;

class Person{

    public $id;
    public $first_name;
    public $patronymic_name;
    public $family_name;
    public $birth_date;
    public $birth_place;
    public $sex;
    public $inn;
    public $citizenship;
    public $deputy;

    public function exchangeArray($data)
    {
        //var_dump($data);
    
        $this->id     = (isset($data['id'])) ? $data['id'] : null;
        $this->first_name = (isset($data['first_name'])) ? $data['first_name'] : null;
        $this->patronymic_name  = (isset($data['patronymic_name'])) ? $data['patronymic_name'] : null;
        $this->family_name  = (isset($data['family_name'])) ? $data['family_name'] : null;
        $this->birth_date  = (isset($data['birth_date'])) ? $data['birth_date'] : null;
        $this->birth_place  = (isset($data['birth_place'])) ? $data['birth_place'] : null;
        $this->sex  = (isset($data['sex'])) ? $data['sex'] : null;
        $this->inn  = (isset($data['inn'])) ? $data['inn'] : null;
        $this->citizenship  = (isset($data['citizenship'])) ? $data['citizenship'] : null;
        $this->deputy  = (isset($data['deputy'])) ? $data['deputy'] : null;
    }

    public function get_name(){
        return $this->first_name;
    }

}
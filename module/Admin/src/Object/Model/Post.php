<?php

namespace Object\Model;

class Post{

    public $id;
    public $name;
    public $short_name;
    public $description;

    public function exchangeArray($data)
    {
        //var_dump($data);
        $this->id     = (isset($data['id'])) ? $data['id'] : null;
        $this->name = (isset($data['name'])) ? $data['name'] : null;
        $this->short_name  = (isset($data['short_name'])) ? $data['short_name'] : null;
        $this->description  = (isset($data['description'])) ? $data['description'] : null;
    }

    public function get_name(){
        return $this->name;
    }

}
<?php
namespace Object\Entity;
use Zend\EventManager\EventManager;

class Filtered{

    protected $inputFilter;
    protected $EntityName = null;

    public function getEntityName(){
        $classNameWNameSpace =  get_called_class();
        $classNameArray = explode('\\', $classNameWNameSpace);
        return end($classNameArray);
    }

    public function setInputFilter(){
        $EntityName = $this->getEntityName();
        $FilterName  = 'Object\\InputFilter\\'.$EntityName; //.'Filter'

        $filter = new $FilterName;
        $filter->init();
        $this->inputFilter = $filter;
    }

    /**
     * @return \Object\InputFilter\PostFilter
     */
    public function getInputFilter(){
        if(!$this->inputFilter){
            $this->setInputFilter();
        }
        return $this->inputFilter;
    }
}
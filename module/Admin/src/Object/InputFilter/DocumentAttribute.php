<?php

namespace Object\InputFilter;

use Zend\InputFilter\InputFilter;


class DocumentAttribute extends InputFilter{
    public function init(){

        /*
        $this->add(array(
            'name' => 'type',
            'required' => true,
            'filters' => array(
                array('type' => 'StripTags'),
                array('type' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'type' => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min' => 2,
                        'max' => 64,
                    ),
                ),
            )
        ));
        */
    }
}
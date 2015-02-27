<?php

namespace Object\InputFilter;

use Zend\InputFilter\InputFilter;


class StreetType extends InputFilter{
    public function init(){

        $this->add(array(
            'name' => 'name',
            'required' => true,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'name' => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min' => 2,
                        'max' => 64,
                    ),
                ),
            )
        ));

        $this->add(array(
            'name' => 'short_name',
            'required' => false,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'name' => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min' => 2,
                        'max' => 12,
                    ),
                ),
            )
        ));

        $this->add(array(
            'name' => 'description',
            'required' => false,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            )
        ));

        $this->add(array(
            'name' => 'allowed_ranks',
            'required' => false
        ));


    }
}
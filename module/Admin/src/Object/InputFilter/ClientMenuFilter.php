<?php

namespace Object\InputFilter;

use Zend\InputFilter\InputFilter;


class ClientMenuFilter extends InputFilter{
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
            'name' => 'description',
            'required' => false,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            )
        ));

        $this->add(array(
            'name' => 'entity',
            'required' => false,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            )
        ));

        $this->add(array(
            'name' => 'is_not_screen',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'Boolean'
                )
            )

        ));
        $this->add(array(
            'name' => 'entity',
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
                array(
                    'name' => 'Alpha'
                )
            )
        ));


        $this->add(array(
            'name' => 'type',
            'required' => false,
            'filters' => array(
                array('name' => 'Alnum'),
            )
        ));

        $this->add(array(
            'name' => 'icon',
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
                        'max' => 22,
                    ),
                ),
                array(
                    'name' => 'Alpha'
                )
            )
        ));
    }
}
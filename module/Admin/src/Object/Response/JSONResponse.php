<?php
/**
 * Created by PhpStorm.
 * User: Victor
 * Date: 19.02.15
 * Time: 13:16
 */

namespace Object\Response;
use Zend\View\Model\JsonModel;

class JSONResponse{

    protected $requested_data;
    protected $optional_fields;

    /**
     * @param Array $requested_data
     */
    public function __construct($requested_data){
        $this->setRequestedData($requested_data);
    }

    public function setRequestedData($data){
        if ($data instanceof \Traversable) {
            $data = iterator_to_array($data, true);
        }
        $this->requested_data = $data;
        return $this;
    }

    /**
     * @param string $name
     * @param array $data
     * @return mixed
     */
    public function setAdditional($name = null, $data){
        if(!$name){
            return $this->optional_fields[] = $data;
        }
        return $this->optional_fields[$name] = $data;
    }

    public function getRequestedData(){
        return $this->requested_data;
    }

    public function getResponse(){
        $response = array();
        $response['requested_data'] = $this->getRequestedData();
        if($this->optional_fields){
            foreach($this->optional_fields as $key => $value){
                $response[$key] = $value;
            }
        }
        return new JsonModel($response);
    }

}
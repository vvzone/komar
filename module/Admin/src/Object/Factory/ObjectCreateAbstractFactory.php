<?php

namespace Object\Factory;

use Zend\ServiceManager\AbstractFactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/* filter */
use Zend\InputFilter\Factory;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\Input;
use Zend\Validator;

use Zend\Filter\Word\UnderscoreToCamelCase as UnderscoreToCamelCase;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Object\Response\JSONResponse;
use Zend\View\Model\JsonModel;

use Zend\Json\Json;

class ObjectCreateAbstractFactory implements AbstractFactoryInterface
{
    const CONTENT_TYPE_JSON = 'json';
    private $config;
    private $serviceLocator;

    /**
     * @var array
     */
    protected $contentTypes = array(
        self::CONTENT_TYPE_JSON => array(
            'application/hal+json',
            'application/json'
        )
    );

    /**
     * @var int From Zend\Json\Json
     */
    protected $jsonDecodeType = Json::TYPE_ARRAY;

    /**
     * Check if request has certain content type
     *
     * @param  \Zend\Http\PhpEnvironment\Request $request
     * @param  string|null $contentType
     * @return bool
     */
    public function requestHasContentType(\Zend\Http\PhpEnvironment\Request $request, $contentType = '')
    {
        /** @var $headerContentType \Zend\Http\Header\ContentType */
        $headerContentType = $request->getHeaders()->get('content-type');
        if (!$headerContentType) {
            return false;
        }

        $requestedContentType = $headerContentType->getFieldValue();
        if (strstr($requestedContentType, ';')) {
            $headerData = explode(';', $requestedContentType);
            $requestedContentType = array_shift($headerData);
        }
        $requestedContentType = trim($requestedContentType);
        if (array_key_exists($contentType, $this->contentTypes)) {
            foreach ($this->contentTypes[$contentType] as $contentTypeValue) {
                if (stripos($contentTypeValue, $requestedContentType) === 0) {
                    return true;
                }
            }
        }

        return false;
    }

    public function canCreateServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

        return (substr($requestedName, -13) === 'RESTAPICreate');
    }

    public function createServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName){

        $entityManager = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $parts       = explode('\\', $requestedName);
        $entityName  = substr(end($parts), 0, -13);
        $entityClass = 'Object\\Entity\\' . $entityName;

        $Object = new $entityClass;
        $objectManager = $serviceLocator
            ->get('Doctrine\ORM\EntityManager');

        /* ---- get & parse request --- */
        $request = $serviceLocator->get('Request');
        if ($this->requestHasContentType($request, self::CONTENT_TYPE_JSON)) {
            $data = Json::decode($request->getContent(), $this->jsonDecodeType);
        } else {
            $data = $request->getPost()->toArray();
        }
        /* --- /get & parse request --- */

        $inputFilter= $Object->getInputFilter();

        if($inputFilter->setData($data)->isValid()){
            $hydrator = new DoctrineHydrator($objectManager, $entityClass);

            $data = $this->RESTtoCamelCase($data);
            if($this->getIdentifier($serviceLocator)){
                $data['id'] =  $this->getIdentifier($serviceLocator);
            }
            $Object = $hydrator->hydrate($data, $Object);

            $objectManager->persist($Object);
            $objectManager->flush();
            //$data = array('id' => $Object->getId());
            $data = $hydrator->extract($Object);

        }else{
            $response = $serviceLocator->get('Response');
            $response->setStatusCode(400);
            $data = $inputFilter->getMessages();
        }

        return new JsonModel(array(
            $data
        ));
    }

    public function getIdentifier(ServiceLocatorInterface $serviceLocator){
        $id = (int)$serviceLocator->get('ControllerPluginManager')->get('params')->fromRoute('id', null);
        if($id !== false){
            return $id;
        }

        $id = $serviceLocator->get('Request')->getQuery()->get('id', false);
        if ($id !== false) {
            return $id;
        }

        return false;

    }
    public function RESTtoCamelCase($data){
        if(is_array($data)){
            foreach($data as $k => $v){
                if(strrpos($k, '_')){
                    $new_k = $k;
                    unset($data[$k]);
                    while($pos = strrpos($new_k, '_')){
                        $new_k = substr_replace($new_k, '', $pos, 1);
                        $capitalized = strtoupper($new_k[$pos]);
                        $new_k[$pos] = $capitalized;
                    }
                    $data[$new_k] = $v;
                }else{
                    $data[$k] = $v;
                }
            }
            return $data;
        }else{

            //$response = $e->getResponse();
            //$response->setStatusCode(401);
        }
    }

}
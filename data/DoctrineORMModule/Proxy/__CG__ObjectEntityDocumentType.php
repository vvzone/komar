<?php

namespace DoctrineORMModule\Proxy\__CG__\Object\Entity;

/**
 * DO NOT EDIT THIS FILE - IT WAS CREATED BY DOCTRINE'S PROXY GENERATOR
 */
class DocumentType extends \Object\Entity\DocumentType implements \Doctrine\ORM\Proxy\Proxy
{
    /**
     * @var \Closure the callback responsible for loading properties in the proxy object. This callback is called with
     *      three parameters, being respectively the proxy object to be initialized, the method that triggered the
     *      initialization process and an array of ordered parameters that were passed to that method.
     *
     * @see \Doctrine\Common\Persistence\Proxy::__setInitializer
     */
    public $__initializer__;

    /**
     * @var \Closure the callback responsible of loading properties that need to be copied in the cloned object
     *
     * @see \Doctrine\Common\Persistence\Proxy::__setCloner
     */
    public $__cloner__;

    /**
     * @var boolean flag indicating if this object was already initialized
     *
     * @see \Doctrine\Common\Persistence\Proxy::__isInitialized
     */
    public $__isInitialized__ = false;

    /**
     * @var array properties to be lazy loaded, with keys being the property
     *            names and values being their default values
     *
     * @see \Doctrine\Common\Persistence\Proxy::__getLazyProperties
     */
    public static $lazyPropertiesDefaults = array();



    /**
     * @param \Closure $initializer
     * @param \Closure $cloner
     */
    public function __construct($initializer = null, $cloner = null)
    {

        $this->__initializer__ = $initializer;
        $this->__cloner__      = $cloner;
    }







    /**
     * 
     * @return array
     */
    public function __sleep()
    {
        if ($this->__isInitialized__) {
            return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'name', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'shortName', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'code', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'defaultHeader', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'isService', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'secrecyType', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'urgencyType', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'presentation', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'directionTypeCode', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'description', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'attributeType', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'route');
        }

        return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'name', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'shortName', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'code', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'defaultHeader', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'isService', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'secrecyType', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'urgencyType', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'presentation', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'directionTypeCode', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'description', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'attributeType', '' . "\0" . 'Object\\Entity\\DocumentType' . "\0" . 'route');
    }

    /**
     * 
     */
    public function __wakeup()
    {
        if ( ! $this->__isInitialized__) {
            $this->__initializer__ = function (DocumentType $proxy) {
                $proxy->__setInitializer(null);
                $proxy->__setCloner(null);

                $existingProperties = get_object_vars($proxy);

                foreach ($proxy->__getLazyProperties() as $property => $defaultValue) {
                    if ( ! array_key_exists($property, $existingProperties)) {
                        $proxy->$property = $defaultValue;
                    }
                }
            };

        }
    }

    /**
     * 
     */
    public function __clone()
    {
        $this->__cloner__ && $this->__cloner__->__invoke($this, '__clone', array());
    }

    /**
     * Forces initialization of the proxy
     */
    public function __load()
    {
        $this->__initializer__ && $this->__initializer__->__invoke($this, '__load', array());
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific loading logic
     */
    public function __isInitialized()
    {
        return $this->__isInitialized__;
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific loading logic
     */
    public function __setInitialized($initialized)
    {
        $this->__isInitialized__ = $initialized;
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific loading logic
     */
    public function __setInitializer(\Closure $initializer = null)
    {
        $this->__initializer__ = $initializer;
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific loading logic
     */
    public function __getInitializer()
    {
        return $this->__initializer__;
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific loading logic
     */
    public function __setCloner(\Closure $cloner = null)
    {
        $this->__cloner__ = $cloner;
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific cloning logic
     */
    public function __getCloner()
    {
        return $this->__cloner__;
    }

    /**
     * {@inheritDoc}
     * @internal generated method: use only when explicitly handling proxy specific loading logic
     * @static
     */
    public function __getLazyProperties()
    {
        return self::$lazyPropertiesDefaults;
    }

    
    /**
     * {@inheritDoc}
     */
    public function getId()
    {
        if ($this->__isInitialized__ === false) {
            return (int)  parent::getId();
        }


        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getId', array());

        return parent::getId();
    }

    /**
     * {@inheritDoc}
     */
    public function setName($name)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setName', array($name));

        return parent::setName($name);
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getName', array());

        return parent::getName();
    }

    /**
     * {@inheritDoc}
     */
    public function setShortName($shortName)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setShortName', array($shortName));

        return parent::setShortName($shortName);
    }

    /**
     * {@inheritDoc}
     */
    public function getShortName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getShortName', array());

        return parent::getShortName();
    }

    /**
     * {@inheritDoc}
     */
    public function setCode($code)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setCode', array($code));

        return parent::setCode($code);
    }

    /**
     * {@inheritDoc}
     */
    public function getCode()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getCode', array());

        return parent::getCode();
    }

    /**
     * {@inheritDoc}
     */
    public function setDefaultHeader($defaultHeader)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setDefaultHeader', array($defaultHeader));

        return parent::setDefaultHeader($defaultHeader);
    }

    /**
     * {@inheritDoc}
     */
    public function getDefaultHeader()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getDefaultHeader', array());

        return parent::getDefaultHeader();
    }

    /**
     * {@inheritDoc}
     */
    public function setIsService($isService)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setIsService', array($isService));

        return parent::setIsService($isService);
    }

    /**
     * {@inheritDoc}
     */
    public function getIsService()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getIsService', array());

        return parent::getIsService();
    }

    /**
     * {@inheritDoc}
     */
    public function setSecrecyType($secrecyType)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setSecrecyType', array($secrecyType));

        return parent::setSecrecyType($secrecyType);
    }

    /**
     * {@inheritDoc}
     */
    public function getSecrecyType()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getSecrecyType', array());

        return parent::getSecrecyType();
    }

    /**
     * {@inheritDoc}
     */
    public function setUrgencyType($urgencyType)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setUrgencyType', array($urgencyType));

        return parent::setUrgencyType($urgencyType);
    }

    /**
     * {@inheritDoc}
     */
    public function getUrgencyType()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getUrgencyType', array());

        return parent::getUrgencyType();
    }

    /**
     * {@inheritDoc}
     */
    public function setPresentation($presentation)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setPresentation', array($presentation));

        return parent::setPresentation($presentation);
    }

    /**
     * {@inheritDoc}
     */
    public function getPresentation()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPresentation', array());

        return parent::getPresentation();
    }

    /**
     * {@inheritDoc}
     */
    public function setDirectionTypeCode($directionTypeCode)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setDirectionTypeCode', array($directionTypeCode));

        return parent::setDirectionTypeCode($directionTypeCode);
    }

    /**
     * {@inheritDoc}
     */
    public function getDirectionTypeCode()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getDirectionTypeCode', array());

        return parent::getDirectionTypeCode();
    }

    /**
     * {@inheritDoc}
     */
    public function setDescription($description)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setDescription', array($description));

        return parent::setDescription($description);
    }

    /**
     * {@inheritDoc}
     */
    public function getDescription()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getDescription', array());

        return parent::getDescription();
    }

    /**
     * {@inheritDoc}
     */
    public function addAttributeType(\Object\Entity\AttributeType $attributeType)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'addAttributeType', array($attributeType));

        return parent::addAttributeType($attributeType);
    }

    /**
     * {@inheritDoc}
     */
    public function removeAttributeType(\Object\Entity\AttributeType $attributeType)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'removeAttributeType', array($attributeType));

        return parent::removeAttributeType($attributeType);
    }

    /**
     * {@inheritDoc}
     */
    public function getAttributeType()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getAttributeType', array());

        return parent::getAttributeType();
    }

    /**
     * {@inheritDoc}
     */
    public function getRoute()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getRoute', array());

        return parent::getRoute();
    }

    /**
     * {@inheritDoc}
     */
    public function getAll()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getAll', array());

        return parent::getAll();
    }

    /**
     * {@inheritDoc}
     */
    public function getDocumentTypeSimple()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getDocumentTypeSimple', array());

        return parent::getDocumentTypeSimple();
    }

}

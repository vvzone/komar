<?php

namespace DoctrineORMModule\Proxy\__CG__\Object\Entity;

/**
 * DO NOT EDIT THIS FILE - IT WAS CREATED BY DOCTRINE'S PROXY GENERATOR
 */
class AttributeType extends \Object\Entity\AttributeType implements \Doctrine\ORM\Proxy\Proxy
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
            return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'name', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'machineName', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'description', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'baseAttributeTypeCode', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'verificationCommand', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'documentType', 'inputFilter', 'EntityName');
        }

        return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'name', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'machineName', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'description', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'baseAttributeTypeCode', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'verificationCommand', '' . "\0" . 'Object\\Entity\\AttributeType' . "\0" . 'documentType', 'inputFilter', 'EntityName');
    }

    /**
     * 
     */
    public function __wakeup()
    {
        if ( ! $this->__isInitialized__) {
            $this->__initializer__ = function (AttributeType $proxy) {
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
    public function setMachineName($machineName)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setMachineName', array($machineName));

        return parent::setMachineName($machineName);
    }

    /**
     * {@inheritDoc}
     */
    public function getMachineName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getMachineName', array());

        return parent::getMachineName();
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
    public function setBaseAttributeTypeCode($baseAttributeTypeCode)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setBaseAttributeTypeCode', array($baseAttributeTypeCode));

        return parent::setBaseAttributeTypeCode($baseAttributeTypeCode);
    }

    /**
     * {@inheritDoc}
     */
    public function getBaseAttributeTypeCode()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getBaseAttributeTypeCode', array());

        return parent::getBaseAttributeTypeCode();
    }

    /**
     * {@inheritDoc}
     */
    public function setVerificationCommand($verificationCommand)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setVerificationCommand', array($verificationCommand));

        return parent::setVerificationCommand($verificationCommand);
    }

    /**
     * {@inheritDoc}
     */
    public function getVerificationCommand()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getVerificationCommand', array());

        return parent::getVerificationCommand();
    }

    /**
     * {@inheritDoc}
     */
    public function addDocumentType(\Object\Entity\DocumentType $documentType)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'addDocumentType', array($documentType));

        return parent::addDocumentType($documentType);
    }

    /**
     * {@inheritDoc}
     */
    public function removeDocumentType(\Object\Entity\DocumentType $documentType)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'removeDocumentType', array($documentType));

        return parent::removeDocumentType($documentType);
    }

    /**
     * {@inheritDoc}
     */
    public function getDocumentType()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getDocumentType', array());

        return parent::getDocumentType();
    }

    /**
     * {@inheritDoc}
     */
    public function getAttributeTypeSimple()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getAttributeTypeSimple', array());

        return parent::getAttributeTypeSimple();
    }

    /**
     * {@inheritDoc}
     */
    public function getPlain()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPlain', array());

        return parent::getPlain();
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
    public function getEntityName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getEntityName', array());

        return parent::getEntityName();
    }

    /**
     * {@inheritDoc}
     */
    public function setInputFilter()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setInputFilter', array());

        return parent::setInputFilter();
    }

    /**
     * {@inheritDoc}
     */
    public function getInputFilter()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getInputFilter', array());

        return parent::getInputFilter();
    }

}

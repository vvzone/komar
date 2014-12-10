<?php

namespace DoctrineORMModule\Proxy\__CG__\Object\Entity;

/**
 * DO NOT EDIT THIS FILE - IT WAS CREATED BY DOCTRINE'S PROXY GENERATOR
 */
class Clients extends \Object\Entity\Clients implements \Doctrine\ORM\Proxy\Proxy
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
            return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'fullName', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'identificationNumber', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'isExternal', 'personInfo', 'unitInfo', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'person_id');
        }

        return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'fullName', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'identificationNumber', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'isExternal', 'personInfo', 'unitInfo', '' . "\0" . 'Object\\Entity\\Clients' . "\0" . 'person_id');
    }

    /**
     * 
     */
    public function __wakeup()
    {
        if ( ! $this->__isInitialized__) {
            $this->__initializer__ = function (Clients $proxy) {
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
    public function setFullName($fullName)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setFullName', array($fullName));

        return parent::setFullName($fullName);
    }

    /**
     * {@inheritDoc}
     */
    public function getFullName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getFullName', array());

        return parent::getFullName();
    }

    /**
     * {@inheritDoc}
     */
    public function setIdentificationNumber($identificationNumber)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setIdentificationNumber', array($identificationNumber));

        return parent::setIdentificationNumber($identificationNumber);
    }

    /**
     * {@inheritDoc}
     */
    public function getIdentificationNumber()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getIdentificationNumber', array());

        return parent::getIdentificationNumber();
    }

    /**
     * {@inheritDoc}
     */
    public function setIsExternal($isExternal)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setIsExternal', array($isExternal));

        return parent::setIsExternal($isExternal);
    }

    /**
     * {@inheritDoc}
     */
    public function getIsExternal()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getIsExternal', array());

        return parent::getIsExternal();
    }

    /**
     * {@inheritDoc}
     */
    public function getPersonId()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPersonId', array());

        return parent::getPersonId();
    }

    /**
     * {@inheritDoc}
     */
    public function addPersonInfo(\Object\Entity\Persons $personInfo)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'addPersonInfo', array($personInfo));

        return parent::addPersonInfo($personInfo);
    }

    /**
     * {@inheritDoc}
     */
    public function getPersonInfo2()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPersonInfo2', array());

        return parent::getPersonInfo2();
    }

    /**
     * {@inheritDoc}
     */
    public function getPersonInfo()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPersonInfo', array());

        return parent::getPersonInfo();
    }

    /**
     * {@inheritDoc}
     */
    public function getPerson()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPerson', array());

        return parent::getPerson();
    }

    /**
     * {@inheritDoc}
     */
    public function getUnitInfo()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getUnitInfo', array());

        return parent::getUnitInfo();
    }

    /**
     * {@inheritDoc}
     */
    public function getUnit()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getUnit', array());

        return parent::getUnit();
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
    public function getClientSimple()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getClientSimple', array());

        return parent::getClientSimple();
    }

}

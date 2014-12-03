<?php

namespace DoctrineORMModule\Proxy\__CG__\Object\Entity;

/**
 * DO NOT EDIT THIS FILE - IT WAS CREATED BY DOCTRINE'S PROXY GENERATOR
 */
class Persons extends \Object\Entity\Persons implements \Doctrine\ORM\Proxy\Proxy
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
            return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'id', 'client', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'firstName', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'patronymicName', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'familyName', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'birthDate', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'birthPlace', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'sex', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'inn', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'citizenship', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'deputy', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'personPost');
        }

        return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'id', 'client', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'firstName', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'patronymicName', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'familyName', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'birthDate', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'birthPlace', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'sex', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'inn', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'citizenship', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'deputy', '' . "\0" . 'Object\\Entity\\Persons' . "\0" . 'personPost');
    }

    /**
     * 
     */
    public function __wakeup()
    {
        if ( ! $this->__isInitialized__) {
            $this->__initializer__ = function (Persons $proxy) {
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
    public function setClient($client)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setClient', array($client));

        return parent::setClient($client);
    }

    /**
     * {@inheritDoc}
     */
    public function getClient()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getClient', array());

        return parent::getClient();
    }

    /**
     * {@inheritDoc}
     */
    public function setFirstName($firstName)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setFirstName', array($firstName));

        return parent::setFirstName($firstName);
    }

    /**
     * {@inheritDoc}
     */
    public function getFirstName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getFirstName', array());

        return parent::getFirstName();
    }

    /**
     * {@inheritDoc}
     */
    public function setPatronymicName($patronymicName)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setPatronymicName', array($patronymicName));

        return parent::setPatronymicName($patronymicName);
    }

    /**
     * {@inheritDoc}
     */
    public function getPatronymicName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPatronymicName', array());

        return parent::getPatronymicName();
    }

    /**
     * {@inheritDoc}
     */
    public function setFamilyName($familyName)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setFamilyName', array($familyName));

        return parent::setFamilyName($familyName);
    }

    /**
     * {@inheritDoc}
     */
    public function getFamilyName()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getFamilyName', array());

        return parent::getFamilyName();
    }

    /**
     * {@inheritDoc}
     */
    public function setBirthDate($birthDate)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setBirthDate', array($birthDate));

        return parent::setBirthDate($birthDate);
    }

    /**
     * {@inheritDoc}
     */
    public function getBirthDate()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getBirthDate', array());

        return parent::getBirthDate();
    }

    /**
     * {@inheritDoc}
     */
    public function setBirthPlace($birthPlace)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setBirthPlace', array($birthPlace));

        return parent::setBirthPlace($birthPlace);
    }

    /**
     * {@inheritDoc}
     */
    public function getBirthPlace()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getBirthPlace', array());

        return parent::getBirthPlace();
    }

    /**
     * {@inheritDoc}
     */
    public function setSex($sex)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setSex', array($sex));

        return parent::setSex($sex);
    }

    /**
     * {@inheritDoc}
     */
    public function getSex()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getSex', array());

        return parent::getSex();
    }

    /**
     * {@inheritDoc}
     */
    public function setInn($inn)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setInn', array($inn));

        return parent::setInn($inn);
    }

    /**
     * {@inheritDoc}
     */
    public function getInn()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getInn', array());

        return parent::getInn();
    }

    /**
     * {@inheritDoc}
     */
    public function setCitizenship($citizenship)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setCitizenship', array($citizenship));

        return parent::setCitizenship($citizenship);
    }

    /**
     * {@inheritDoc}
     */
    public function getCitizenship()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getCitizenship', array());

        return parent::getCitizenship();
    }

    /**
     * {@inheritDoc}
     */
    public function setDeputy($deputy)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setDeputy', array($deputy));

        return parent::setDeputy($deputy);
    }

    /**
     * {@inheritDoc}
     */
    public function getDeputy()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getDeputy', array());

        return parent::getDeputy();
    }

    /**
     * {@inheritDoc}
     */
    public function setPersonPost($personPost)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setPersonPost', array($personPost));

        return parent::setPersonPost($personPost);
    }

    /**
     * {@inheritDoc}
     */
    public function getPersonPost()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPersonPost', array());

        return parent::getPersonPost();
    }

}

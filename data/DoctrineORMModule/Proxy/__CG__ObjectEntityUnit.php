<?php

namespace DoctrineORMModule\Proxy\__CG__\Object\Entity;

/**
 * DO NOT EDIT THIS FILE - IT WAS CREATED BY DOCTRINE'S PROXY GENERATOR
 */
class Unit extends \Object\Entity\Unit implements \Doctrine\ORM\Proxy\Proxy
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
            return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'parent', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'name', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'shortName', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'ownNumeration', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'isLegal', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'commander', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'deputy', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'onDuty', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'client', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'posts');
        }

        return array('__isInitialized__', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'id', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'parent', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'name', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'shortName', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'ownNumeration', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'isLegal', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'commander', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'deputy', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'onDuty', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'client', '' . "\0" . 'Object\\Entity\\Unit' . "\0" . 'posts');
    }

    /**
     * 
     */
    public function __wakeup()
    {
        if ( ! $this->__isInitialized__) {
            $this->__initializer__ = function (Unit $proxy) {
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
    public function setParent($parent)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setParent', array($parent));

        return parent::setParent($parent);
    }

    /**
     * {@inheritDoc}
     */
    public function getParent()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getParent', array());

        return parent::getParent();
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
    public function setOwnNumeration($ownNumeration)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setOwnNumeration', array($ownNumeration));

        return parent::setOwnNumeration($ownNumeration);
    }

    /**
     * {@inheritDoc}
     */
    public function getOwnNumeration()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getOwnNumeration', array());

        return parent::getOwnNumeration();
    }

    /**
     * {@inheritDoc}
     */
    public function setIsLegal($isLegal)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setIsLegal', array($isLegal));

        return parent::setIsLegal($isLegal);
    }

    /**
     * {@inheritDoc}
     */
    public function getIsLegal()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getIsLegal', array());

        return parent::getIsLegal();
    }

    /**
     * {@inheritDoc}
     */
    public function setCommander($commander)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setCommander', array($commander));

        return parent::setCommander($commander);
    }

    /**
     * {@inheritDoc}
     */
    public function getCommander()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getCommander', array());

        return parent::getCommander();
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
    public function setOnDuty($onDuty)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'setOnDuty', array($onDuty));

        return parent::setOnDuty($onDuty);
    }

    /**
     * {@inheritDoc}
     */
    public function getOnDuty()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getOnDuty', array());

        return parent::getOnDuty();
    }

    /**
     * {@inheritDoc}
     */
    public function setClient(\Object\Entity\Client $client = NULL)
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
    public function addPost(\Object\Entity\Post $Post)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'addPost', array($Post));

        return parent::addPost($Post);
    }

    /**
     * {@inheritDoc}
     */
    public function removePost(\Object\Entity\Post $Post)
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'removePost', array($Post));

        return parent::removePost($Post);
    }

    /**
     * {@inheritDoc}
     */
    public function getPosts()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPosts', array());

        return parent::getPosts();
    }

    /**
     * {@inheritDoc}
     */
    public function getPostsList()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getPostsList', array());

        return parent::getPostsList();
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
    public function getUnitSimple()
    {

        $this->__initializer__ && $this->__initializer__->__invoke($this, 'getUnitSimple', array());

        return parent::getUnitSimple();
    }

}

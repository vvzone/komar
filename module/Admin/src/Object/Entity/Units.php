<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Units
 *
 * @ORM\Table(name="units", indexes={@ORM\Index(name="client", columns={"client"})})
 * @ORM\Entity
 */
class Units
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="parent", type="integer", nullable=true)
     */
    private $parent;

    /**
     * @var integer
     *
     * @ORM\Column(name="client", type="integer", nullable=false)
     */
    private $client;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=64, nullable=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="short_name", type="string", length=10, nullable=true)
     */
    private $shortName;

    /**
     * @var boolean
     *
     * @ORM\Column(name="own_numeration", type="boolean", nullable=true)
     */
    private $ownNumeration;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_legal", type="boolean", nullable=true)
     */
    private $isLegal;

    /**
     * @var integer
     *
     * @ORM\Column(name="identification_number", type="integer", nullable=true)
     */
    private $identificationNumber;

    /**
     * @var integer
     *
     * @ORM\Column(name="commander", type="integer", nullable=true)
     */
    private $commander;

    /**
     * @var integer
     *
     * @ORM\Column(name="deputy", type="integer", nullable=true)
     */
    private $deputy;

    /**
     * @var integer
     *
     * @ORM\Column(name="on_duty", type="integer", nullable=true)
     */
    private $onDuty;



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set parent
     *
     * @param integer $parent
     * @return Units
     */
    public function setParent($parent)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent
     *
     * @return integer 
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set client
     *
     * @param integer $client
     * @return Units
     */
    public function setClient($client)
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get client
     *
     * @return integer 
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Units
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set shortName
     *
     * @param string $shortName
     * @return Units
     */
    public function setShortName($shortName)
    {
        $this->shortName = $shortName;

        return $this;
    }

    /**
     * Get shortName
     *
     * @return string 
     */
    public function getShortName()
    {
        return $this->shortName;
    }

    /**
     * Set ownNumeration
     *
     * @param boolean $ownNumeration
     * @return Units
     */
    public function setOwnNumeration($ownNumeration)
    {
        $this->ownNumeration = $ownNumeration;

        return $this;
    }

    /**
     * Get ownNumeration
     *
     * @return boolean 
     */
    public function getOwnNumeration()
    {
        return $this->ownNumeration;
    }

    /**
     * Set isLegal
     *
     * @param boolean $isLegal
     * @return Units
     */
    public function setIsLegal($isLegal)
    {
        $this->isLegal = $isLegal;

        return $this;
    }

    /**
     * Get isLegal
     *
     * @return boolean 
     */
    public function getIsLegal()
    {
        return $this->isLegal;
    }

    /**
     * Set identificationNumber
     *
     * @param integer $identificationNumber
     * @return Units
     */
    public function setIdentificationNumber($identificationNumber)
    {
        $this->identificationNumber = $identificationNumber;

        return $this;
    }

    /**
     * Get identificationNumber
     *
     * @return integer 
     */
    public function getIdentificationNumber()
    {
        return $this->identificationNumber;
    }

    /**
     * Set commander
     *
     * @param integer $commander
     * @return Units
     */
    public function setCommander($commander)
    {
        $this->commander = $commander;

        return $this;
    }

    /**
     * Get commander
     *
     * @return integer 
     */
    public function getCommander()
    {
        return $this->commander;
    }

    /**
     * Set deputy
     *
     * @param integer $deputy
     * @return Units
     */
    public function setDeputy($deputy)
    {
        $this->deputy = $deputy;

        return $this;
    }

    /**
     * Get deputy
     *
     * @return integer 
     */
    public function getDeputy()
    {
        return $this->deputy;
    }

    /**
     * Set onDuty
     *
     * @param integer $onDuty
     * @return Units
     */
    public function setOnDuty($onDuty)
    {
        $this->onDuty = $onDuty;

        return $this;
    }

    /**
     * Get onDuty
     *
     * @return integer 
     */
    public function getOnDuty()
    {
        return $this->onDuty;
    }
}

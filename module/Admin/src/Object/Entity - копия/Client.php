<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Client
 *
 * @ORM\Table(name="client")
 * @ORM\Entity
 */
class Client
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
     * @var string
     *
     * @ORM\Column(name="full_name", type="text", nullable=false)
     */
    private $fullName;

    /**
     * @var integer
     *
     * @ORM\Column(name="identification_number", type="integer", nullable=true)
     */
    private $identificationNumber;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_external", type="boolean", nullable=true)
     */
    private $isExternal;



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
     * Set fullName
     *
     * @param string $fullName
     * @return Client
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;

        return $this;
    }

    /**
     * Get fullName
     *
     * @return string 
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set identificationNumber
     *
     * @param integer $identificationNumber
     * @return Client
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
     * Set isExternal
     *
     * @param boolean $isExternal
     * @return Client
     */
    public function setIsExternal($isExternal)
    {
        $this->isExternal = $isExternal;

        return $this;
    }

    /**
     * Get isExternal
     *
     * @return boolean 
     */
    public function getIsExternal()
    {
        return $this->isExternal;
    }
}

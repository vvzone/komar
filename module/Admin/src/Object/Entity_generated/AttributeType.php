<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AttributeType
 *
 * @ORM\Table(name="attribute_type", indexes={@ORM\Index(name="base_attribute_type_code", columns={"base_attribute_type_code"})})
 * @ORM\Entity
 */
class AttributeType
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
     * @ORM\Column(name="name", type="string", length=45, nullable=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="machine_name", type="string", length=45, nullable=true)
     */
    private $machineName;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", length=16777215, nullable=true)
     */
    private $description;

    /**
     * @var integer
     *
     * @ORM\Column(name="verification_command", type="integer", nullable=true)
     */
    private $verificationCommand;

    /**
     * @var \Object\Entity\BaseAttributeTypeCode
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\BaseAttributeTypeCode")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="base_attribute_type_code", referencedColumnName="id")
     * })
     */
    private $baseAttributeTypeCode;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\DocumentType", mappedBy="attributeType")
     */
    private $documentType;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->documentType = new \Doctrine\Common\Collections\ArrayCollection();
    }


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
     * Set name
     *
     * @param string $name
     * @return AttributeType
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
     * Set machineName
     *
     * @param string $machineName
     * @return AttributeType
     */
    public function setMachineName($machineName)
    {
        $this->machineName = $machineName;

        return $this;
    }

    /**
     * Get machineName
     *
     * @return string 
     */
    public function getMachineName()
    {
        return $this->machineName;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return AttributeType
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set verificationCommand
     *
     * @param integer $verificationCommand
     * @return AttributeType
     */
    public function setVerificationCommand($verificationCommand)
    {
        $this->verificationCommand = $verificationCommand;

        return $this;
    }

    /**
     * Get verificationCommand
     *
     * @return integer 
     */
    public function getVerificationCommand()
    {
        return $this->verificationCommand;
    }

    /**
     * Set baseAttributeTypeCode
     *
     * @param \Object\Entity\BaseAttributeTypeCode $baseAttributeTypeCode
     * @return AttributeType
     */
    public function setBaseAttributeTypeCode(\Object\Entity\BaseAttributeTypeCode $baseAttributeTypeCode = null)
    {
        $this->baseAttributeTypeCode = $baseAttributeTypeCode;

        return $this;
    }

    /**
     * Get baseAttributeTypeCode
     *
     * @return \Object\Entity\BaseAttributeTypeCode 
     */
    public function getBaseAttributeTypeCode()
    {
        return $this->baseAttributeTypeCode;
    }

    /**
     * Add documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return AttributeType
     */
    public function addDocumentType(\Object\Entity\DocumentType $documentType)
    {
        $this->documentType[] = $documentType;

        return $this;
    }

    /**
     * Remove documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     */
    public function removeDocumentType(\Object\Entity\DocumentType $documentType)
    {
        $this->documentType->removeElement($documentType);
    }

    /**
     * Get documentType
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDocumentType()
    {
        return $this->documentType;
    }
}

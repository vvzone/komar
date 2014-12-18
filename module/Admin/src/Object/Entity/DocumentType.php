<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DocumentType
 *
 * @ORM\Table(name="document_type")
 * @ORM\Entity
 */
class DocumentType
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
     * @ORM\Column(name="short_name", type="string", length=45, nullable=true)
     */
    private $shortName;

    /**
     * @var integer
     *
     * @ORM\Column(name="code", type="integer", nullable=true)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="default_header", type="string", length=45, nullable=true)
     */
    private $defaultHeader;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_service", type="boolean", nullable=true)
     */
    private $isService;

    /**
     * @var integer
     *
     * @ORM\Column(name="secrecy_type", type="integer", nullable=true)
     */
    private $secrecyType;

    /**
     * @var integer
     *
     * @ORM\Column(name="urgency_type", type="integer", nullable=true)
     */
    private $urgencyType;

    /**
     * @var string
     *
     * @ORM\Column(name="presentation", type="text", nullable=true)
     */
    private $presentation;

    /**
     * @var integer
     *
     * @ORM\Column(name="direction_type_code", type="integer", nullable=true)
     */
    private $directionTypeCode;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\AttributeType", inversedBy="documentType")
     * @ORM\JoinTable(name="document_type_attribute_type",
     *   joinColumns={
     *     @ORM\JoinColumn(name="document_type_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="attribute_type_id", referencedColumnName="id")
     *   }
     * )
     */
    private $attributeType;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->attributeType = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return DocumentType
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
     * @return DocumentType
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
     * Set code
     *
     * @param integer $code
     * @return DocumentType
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return integer 
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set defaultHeader
     *
     * @param string $defaultHeader
     * @return DocumentType
     */
    public function setDefaultHeader($defaultHeader)
    {
        $this->defaultHeader = $defaultHeader;

        return $this;
    }

    /**
     * Get defaultHeader
     *
     * @return string 
     */
    public function getDefaultHeader()
    {
        return $this->defaultHeader;
    }

    /**
     * Set isService
     *
     * @param boolean $isService
     * @return DocumentType
     */
    public function setIsService($isService)
    {
        $this->isService = $isService;

        return $this;
    }

    /**
     * Get isService
     *
     * @return boolean 
     */
    public function getIsService()
    {
        return $this->isService;
    }

    /**
     * Set secrecyType
     *
     * @param integer $secrecyType
     * @return DocumentType
     */
    public function setSecrecyType($secrecyType)
    {
        $this->secrecyType = $secrecyType;

        return $this;
    }

    /**
     * Get secrecyType
     *
     * @return integer 
     */
    public function getSecrecyType()
    {
        return $this->secrecyType;
    }

    /**
     * Set urgencyType
     *
     * @param integer $urgencyType
     * @return DocumentType
     */
    public function setUrgencyType($urgencyType)
    {
        $this->urgencyType = $urgencyType;

        return $this;
    }

    /**
     * Get urgencyType
     *
     * @return integer 
     */
    public function getUrgencyType()
    {
        return $this->urgencyType;
    }

    /**
     * Set presentation
     *
     * @param string $presentation
     * @return DocumentType
     */
    public function setPresentation($presentation)
    {
        $this->presentation = $presentation;

        return $this;
    }

    /**
     * Get presentation
     *
     * @return string 
     */
    public function getPresentation()
    {
        return $this->presentation;
    }

    /**
     * Set directionTypeCode
     *
     * @param integer $directionTypeCode
     * @return DocumentType
     */
    public function setDirectionTypeCode($directionTypeCode)
    {
        $this->directionTypeCode = $directionTypeCode;

        return $this;
    }

    /**
     * Get directionTypeCode
     *
     * @return integer 
     */
    public function getDirectionTypeCode()
    {
        return $this->directionTypeCode;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return DocumentType
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
     * Add attributeType
     *
     * @param \Object\Entity\AttributeType $attributeType
     * @return DocumentType
     */
    public function addAttributeType(\Object\Entity\AttributeType $attributeType)
    {
        $this->attributeType[] = $attributeType;

        return $this;
    }

    /**
     * Remove attributeType
     *
     * @param \Object\Entity\AttributeType $attributeType
     */
    public function removeAttributeType(\Object\Entity\AttributeType $attributeType)
    {
        $this->attributeType->removeElement($attributeType);
    }

    /**
     * Get attributeType
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getAttributeType()
    {
        return $this->attributeType;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName(),
            'code' => $this->getCode(),
            'default_header' => $this->getDefaultHeader(),
            'is_service' => $this->getIsService(),
            'secrecy_type' => $this->getSecrecyType(),
            'urgency_type' => $this->getUrgencyType(),
            'presentation' => $this->getPresentation(),
            'direction_type' => $this->getDirectionTypeCode(),
            'description' => $this->getDescription(),
            'attribute_type' => $this->getAttributeType()
        );
    }
}

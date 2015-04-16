<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CurrentDocumentType
 *
 * @ORM\Table(name="current_document_type", indexes={@ORM\Index(name="document_type_id", columns={"document_type_id"})})
 * @ORM\Entity
 */
class CurrentDocumentType
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
     * @ORM\Column(name="presentation", type="text", length=16777215, nullable=true)
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
     * @ORM\Column(name="description", type="text", length=16777215, nullable=true)
     */
    private $description;

    /**
     * @var \Object\Entity\DocumentType
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\DocumentType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_type_id", referencedColumnName="id")
     * })
     */
    private $documentType;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\DocumentAttributeCollection", inversedBy="cdt")
     * @ORM\JoinTable(name="cdt_has_dac",
     *   joinColumns={
     *     @ORM\JoinColumn(name="cdt_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="dac_id", referencedColumnName="id")
     *   }
     * )
     */
    private $dac;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Route", inversedBy="currentDocumentType")
     * @ORM\JoinTable(name="current_document_type_has_route",
     *   joinColumns={
     *     @ORM\JoinColumn(name="current_document_type_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="route_id", referencedColumnName="id")
     *   }
     * )
     */
    private $route;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->dac = new \Doctrine\Common\Collections\ArrayCollection();
        $this->route = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * @return CurrentDocumentType
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
     * Set documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return CurrentDocumentType
     */
    public function setDocumentType(\Object\Entity\DocumentType $documentType = null)
    {
        $this->documentType = $documentType;

        return $this;
    }

    /**
     * Get documentType
     *
     * @return \Object\Entity\DocumentType 
     */
    public function getDocumentType()
    {
        return $this->documentType;
    }

    /**
     * Add dac
     *
     * @param \Object\Entity\DocumentAttributeCollection $dac
     * @return CurrentDocumentType
     */
    public function addDac(\Object\Entity\DocumentAttributeCollection $dac)
    {
        $this->dac[] = $dac;

        return $this;
    }

    /**
     * Remove dac
     *
     * @param \Object\Entity\DocumentAttributeCollection $dac
     */
    public function removeDac(\Object\Entity\DocumentAttributeCollection $dac)
    {
        $this->dac->removeElement($dac);
    }

    /**
     * Get dac
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDac()
    {
        return $this->dac;
    }

    /**
     * Add route
     *
     * @param \Object\Entity\Route $route
     * @return CurrentDocumentType
     */
    public function addRoute(\Object\Entity\Route $route)
    {
        $this->route[] = $route;

        return $this;
    }

    /**
     * Remove route
     *
     * @param \Object\Entity\Route $route
     */
    public function removeRoute(\Object\Entity\Route $route)
    {
        $this->route->removeElement($route);
    }

    /**
     * Get route
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getRoute()
    {
        return $this->route;
    }
}

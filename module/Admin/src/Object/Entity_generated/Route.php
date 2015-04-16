<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Route
 *
 * @ORM\Table(name="route", indexes={@ORM\Index(name="fk_route_route1_idx", columns={"prototype_route_id"})})
 * @ORM\Entity
 */
class Route
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
     * @ORM\Column(name="description", type="text", length=16777215, nullable=true)
     */
    private $description;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_main", type="boolean", nullable=true)
     */
    private $isMain;

    /**
     * @var \Object\Entity\Route
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Route")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="prototype_route_id", referencedColumnName="id")
     * })
     */
    private $prototypeRoute;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\CurrentDocumentType", mappedBy="route")
     */
    private $currentDocumentType;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\DocumentType", mappedBy="route")
     */
    private $documentType;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->currentDocumentType = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Route
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
     * Set description
     *
     * @param string $description
     * @return Route
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
     * Set isMain
     *
     * @param boolean $isMain
     * @return Route
     */
    public function setIsMain($isMain)
    {
        $this->isMain = $isMain;

        return $this;
    }

    /**
     * Get isMain
     *
     * @return boolean 
     */
    public function getIsMain()
    {
        return $this->isMain;
    }

    /**
     * Set prototypeRoute
     *
     * @param \Object\Entity\Route $prototypeRoute
     * @return Route
     */
    public function setPrototypeRoute(\Object\Entity\Route $prototypeRoute = null)
    {
        $this->prototypeRoute = $prototypeRoute;

        return $this;
    }

    /**
     * Get prototypeRoute
     *
     * @return \Object\Entity\Route 
     */
    public function getPrototypeRoute()
    {
        return $this->prototypeRoute;
    }

    /**
     * Add currentDocumentType
     *
     * @param \Object\Entity\CurrentDocumentType $currentDocumentType
     * @return Route
     */
    public function addCurrentDocumentType(\Object\Entity\CurrentDocumentType $currentDocumentType)
    {
        $this->currentDocumentType[] = $currentDocumentType;

        return $this;
    }

    /**
     * Remove currentDocumentType
     *
     * @param \Object\Entity\CurrentDocumentType $currentDocumentType
     */
    public function removeCurrentDocumentType(\Object\Entity\CurrentDocumentType $currentDocumentType)
    {
        $this->currentDocumentType->removeElement($currentDocumentType);
    }

    /**
     * Get currentDocumentType
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCurrentDocumentType()
    {
        return $this->currentDocumentType;
    }

    /**
     * Add documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return Route
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

<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Route
 *
 * @ORM\Table(name="route", indexes={@ORM\Index(name="fk_route_document_type1_idx", columns={"document_type_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\Route")
 */
class Route extends Filtered
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
     * @ORM\Column(name="description", type="text", nullable=true)
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
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\OneToMany(targetEntity="NodeLevel", mappedBy="route", cascade={"all"}, orphanRemoval=true)
     */
    private $nodeLevel;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->currentDocumentType = new \Doctrine\Common\Collections\ArrayCollection();
        $this->documentType = new \Doctrine\Common\Collections\ArrayCollection();
        $this->nodeLevel = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Set id
     *
     * @param integer $id
     * @return Route
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
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
     * Add NodeLevel
     *
     * @param \Object\Entity\NodeLevel $node_level
     * @return NodeLevel
     */
    public function addNodeLevel(\Object\Entity\NodeLevel $node_level)
    {
        $this->nodeLevel[] = $node_level;

        return $this;
    }

    /**
     * Remove NodeLevel
     *
     * @param \Object\Entity\NodeLevel $node_level
     */
    public function removeNodeLevel(\Object\Entity\NodeLevel $node_level)
    {
        $this->nodeLevel->removeElement($node_level);
    }

    public function getNodeLevels(){
        //return $this->node_levels;
        $node_levels = array();
        foreach($this->nodeLevel as $node){
            $node_levels[] = $node->getAll();
        }
        return $node_levels;
    }

    public function getRouteSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName()
        );
    }

    public function getAll(){

        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'node_level' => $this->getNodeLevels()
        );
    }
}

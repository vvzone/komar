<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Route
 *
 * @ORM\Table(name="route", indexes={@ORM\Index(name="fk_route_document_type1_idx", columns={"document_type_id"})})
 * @ORM\Entity
 */
class Route
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
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
     * @var \Object\Entity\DocumentType
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\DocumentType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_type_id", referencedColumnName="id")
     * })
     */
    private $documentType;

    /*
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Document", inversedBy="route")
     * @ORM\JoinTable(name="route_has_document",
     *   joinColumns={
     *     @ORM\JoinColumn(name="route_id", referencedColumnName="id"),
     *     @ORM\JoinColumn(name="route_document_type_id", referencedColumnName="document_type_id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="document_id", referencedColumnName="id"),
     *     @ORM\JoinColumn(name="document_document_author_id", referencedColumnName="document_author_id"),
     *     @ORM\JoinColumn(name="document_document_type_id", referencedColumnName="document_type_id"),
     *     @ORM\JoinColumn(name="document_current_node_level_id", referencedColumnName="current_node_level_id")
     *   }
     * )
     */
    private $document;

    /**
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\OneToMany(targetEntity="NodeLevel", mappedBy="route", cascade={"all"}, orphanRemoval=true)
     */
    private $node_levels;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->document = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return Route
     */
    public function setDocumentType(\Object\Entity\DocumentType $documentType)
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
     * Add document
     *
     * @param \Object\Entity\Document $document
     * @return Route
     */
    public function addDocument(\Object\Entity\Document $document)
    {
        $this->document[] = $document;

        return $this;
    }

    /**
     * Remove document
     *
     * @param \Object\Entity\Document $document
     */
    public function removeDocument(\Object\Entity\Document $document)
    {
        $this->document->removeElement($document);
    }

    /**
     * Get document
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * Add NodeLevel
     *
     * @param \Object\Entity\NodeLevel $node_level
     * @return NodeLevel
     */
    public function addNodeLevel(\Object\Entity\NodeLevel $node_level)
    {
        $this->node_levels[] = $node_level;

        return $this;
    }

    /**
     * Remove NodeLevel
     *
     * @param \Object\Entity\NodeLevel $node_level
     */
    public function removeNodeLevel(\Object\Entity\NodeLevel $node_level)
    {
        $this->document->removeElement($node_level);
    }

    public function getNodeLevels(){
        //return $this->node_levels;
        $node_levels = array();
        foreach($this->node_levels as $node){
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
            'document_type' => $this->getDocumentType()->getId(),
            'node_levels' => $this->getNodeLevels()
        );
    }
}

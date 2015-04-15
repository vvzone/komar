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
     * @var integer
     *
     * @ORM\Column(name="document_type_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $documentTypeId = '0';

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
     * Set documentTypeId
     *
     * @param integer $documentTypeId
     * @return Route
     */
    public function setDocumentTypeId($documentTypeId)
    {
        $this->documentTypeId = $documentTypeId;

        return $this;
    }

    /**
     * Get documentTypeId
     *
     * @return integer 
     */
    public function getDocumentTypeId()
    {
        return $this->documentTypeId;
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
}
<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Document
 *
 * @ORM\Table(name="document", indexes={@ORM\Index(name="fk_document_persons1_idx", columns={"document_author_id"}), @ORM\Index(name="fk_document_node_level1_idx", columns={"current_node_level_id"}), @ORM\Index(name="current_document_type_id", columns={"current_document_type_id"}), @ORM\Index(name="document_type_id", columns={"document_type_id"})})
 * @ORM\Entity
 */
class Document
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
     * @ORM\Column(name="name", type="string", length=64, nullable=true)
     */
    private $name;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date", nullable=true)
     */
    private $date;

    /**
     * @var \Object\Entity\DocumentType
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\DocumentType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_type_id", referencedColumnName="id")
     * })
     */
    private $documentType;

    /**
     * @var \Object\Entity\CurrentDocumentType
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\CurrentDocumentType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="current_document_type_id", referencedColumnName="id")
     * })
     */
    private $currentDocumentType;

    /**
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\NodeLevel")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="current_node_level_id", referencedColumnName="id")
     * })
     */
    private $currentNodeLevel;

    /**
     * @var \Object\Entity\Person
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Person")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_author_id", referencedColumnName="id")
     * })
     */
    private $documentAuthor;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\LinkedDocument", inversedBy="document")
     * @ORM\JoinTable(name="document_has_linked_document",
     *   joinColumns={
     *     @ORM\JoinColumn(name="document_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="linked_document_id", referencedColumnName="id")
     *   }
     * )
     */
    private $linkedDocument;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Route", mappedBy="document")
     */
    private $route;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->linkedDocument = new \Doctrine\Common\Collections\ArrayCollection();
        $this->route = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Set id
     *
     * @param integer $id
     * @return Document
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
     * @return Document
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
     * Set date
     *
     * @param \DateTime $date
     * @return Document
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime 
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return Document
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
     * Set currentDocumentType
     *
     * @param \Object\Entity\CurrentDocumentType $currentDocumentType
     * @return Document
     */
    public function setCurrentDocumentType(\Object\Entity\CurrentDocumentType $currentDocumentType = null)
    {
        $this->currentDocumentType = $currentDocumentType;

        return $this;
    }

    /**
     * Get currentDocumentType
     *
     * @return \Object\Entity\CurrentDocumentType 
     */
    public function getCurrentDocumentType()
    {
        return $this->currentDocumentType;
    }

    /**
     * Set currentNodeLevel
     *
     * @param \Object\Entity\NodeLevel $currentNodeLevel
     * @return Document
     */
    public function setCurrentNodeLevel(\Object\Entity\NodeLevel $currentNodeLevel)
    {
        $this->currentNodeLevel = $currentNodeLevel;

        return $this;
    }

    /**
     * Get currentNodeLevel
     *
     * @return \Object\Entity\NodeLevel 
     */
    public function getCurrentNodeLevel()
    {
        return $this->currentNodeLevel;
    }

    /**
     * Set documentAuthor
     *
     * @param \Object\Entity\Person $documentAuthor
     * @return Document
     */
    public function setDocumentAuthor(\Object\Entity\Person $documentAuthor)
    {
        $this->documentAuthor = $documentAuthor;

        return $this;
    }

    /**
     * Get documentAuthor
     *
     * @return \Object\Entity\Person 
     */
    public function getDocumentAuthor()
    {
        return $this->documentAuthor;
    }

    /**
     * Add linkedDocument
     *
     * @param \Object\Entity\LinkedDocument $linkedDocument
     * @return Document
     */
    public function addLinkedDocument(\Object\Entity\LinkedDocument $linkedDocument)
    {
        $this->linkedDocument[] = $linkedDocument;

        return $this;
    }

    /**
     * Remove linkedDocument
     *
     * @param \Object\Entity\LinkedDocument $linkedDocument
     */
    public function removeLinkedDocument(\Object\Entity\LinkedDocument $linkedDocument)
    {
        $this->linkedDocument->removeElement($linkedDocument);
    }

    /**
     * Get linkedDocument
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getLinkedDocument()
    {
        return $this->linkedDocument;
    }

    /**
     * Add route
     *
     * @param \Object\Entity\Route $route
     * @return Document
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

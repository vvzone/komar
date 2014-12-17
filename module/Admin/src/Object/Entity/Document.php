<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Document
 *
 * @ORM\Table(name="document", indexes={@ORM\Index(name="fk_Document_Document_Type_idx", columns={"document_type_id"}), @ORM\Index(name="fk_Document_Node_Level1_idx", columns={"current_node_level_id"}), @ORM\Index(name="fk_document_persons1_idx", columns={"document_author_id"})})
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
     * @ORM\Column(name="document_number", type="string", length=45, nullable=true)
     */
    private $documentNumber;

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
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\NodeLevel")
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
     * Constructor
     */
    public function __construct()
    {
        $this->linkedDocument = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set documentNumber
     *
     * @param string $documentNumber
     * @return Document
     */
    public function setDocumentNumber($documentNumber)
    {
        $this->documentNumber = $documentNumber;

        return $this;
    }

    /**
     * Get documentNumber
     *
     * @return string 
     */
    public function getDocumentNumber()
    {
        return $this->documentNumber;
    }

    /**
     * Set documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return Document
     */
    public function setDocumentType(DocumentType $documentType = null)
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
     * Set currentNodeLevel
     *
     * @param \Object\Entity\NodeLevel $currentNodeLevel
     * @return Document
     */
    public function setCurrentNodeLevel(NodeLevel $currentNodeLevel = null)
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
    public function setDocumentAuthor(Person $documentAuthor)
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
    public function addLinkedDocument(LinkedDocument $linkedDocument)
    {
        $this->linkedDocument[] = $linkedDocument;

        return $this;
    }

    /**
     * Remove linkedDocument
     *
     * @param \Object\Entity\LinkedDocument $linkedDocument
     */
    public function removeLinkedDocument(LinkedDocument $linkedDocument)
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
}

<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * LinkedDocument
 *
 * @ORM\Table(name="linked_document")
 * @ORM\Entity
 */
class LinkedDocument
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
     * @var integer
     *
     * @ORM\Column(name="sort_order", type="integer", nullable=true)
     */
    private $sortOrder;

    /**
     * @var integer
     *
     * @ORM\Column(name="linked_document_type_code", type="integer", nullable=true)
     */
    private $linkedDocumentTypeCode;

    /**
     * @var integer
     *
     * @ORM\Column(name="linked_document_number", type="integer", nullable=true)
     */
    private $linkedDocumentNumber;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="linked_document_date", type="datetime", nullable=true)
     */
    private $linkedDocumentDate;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Document", mappedBy="linkedDocument")
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
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set sortOrder
     *
     * @param integer $sortOrder
     * @return LinkedDocument
     */
    public function setSortOrder($sortOrder)
    {
        $this->sortOrder = $sortOrder;

        return $this;
    }

    /**
     * Get sortOrder
     *
     * @return integer 
     */
    public function getSortOrder()
    {
        return $this->sortOrder;
    }

    /**
     * Set linkedDocumentTypeCode
     *
     * @param integer $linkedDocumentTypeCode
     * @return LinkedDocument
     */
    public function setLinkedDocumentTypeCode($linkedDocumentTypeCode)
    {
        $this->linkedDocumentTypeCode = $linkedDocumentTypeCode;

        return $this;
    }

    /**
     * Get linkedDocumentTypeCode
     *
     * @return integer 
     */
    public function getLinkedDocumentTypeCode()
    {
        return $this->linkedDocumentTypeCode;
    }

    /**
     * Set linkedDocumentNumber
     *
     * @param integer $linkedDocumentNumber
     * @return LinkedDocument
     */
    public function setLinkedDocumentNumber($linkedDocumentNumber)
    {
        $this->linkedDocumentNumber = $linkedDocumentNumber;

        return $this;
    }

    /**
     * Get linkedDocumentNumber
     *
     * @return integer 
     */
    public function getLinkedDocumentNumber()
    {
        return $this->linkedDocumentNumber;
    }

    /**
     * Set linkedDocumentDate
     *
     * @param \DateTime $linkedDocumentDate
     * @return LinkedDocument
     */
    public function setLinkedDocumentDate($linkedDocumentDate)
    {
        $this->linkedDocumentDate = $linkedDocumentDate;

        return $this;
    }

    /**
     * Get linkedDocumentDate
     *
     * @return \DateTime 
     */
    public function getLinkedDocumentDate()
    {
        return $this->linkedDocumentDate;
    }

    /**
     * Add document
     *
     * @param \Object\Entity\Document $document
     * @return LinkedDocument
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

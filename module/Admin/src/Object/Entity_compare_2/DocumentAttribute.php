<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DocumentAttribute
 *
 * @ORM\Table(name="document_attribute", indexes={@ORM\Index(name="fk_document_attribute_persons1_idx", columns={"author_id"}), @ORM\Index(name="document_attribute_collection_id", columns={"document_attribute_collection_id"})})
 * @ORM\Entity
 */
class DocumentAttribute
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
     * @ORM\Column(name="array_index", type="integer", nullable=true)
     */
    private $arrayIndex;

    /**
     * @var string
     *
     * @ORM\Column(name="data", type="text", length=16777215, nullable=true)
     */
    private $data;

    /**
     * @var \Object\Entity\DocumentAttributeCollection
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\DocumentAttributeCollection")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_attribute_collection_id", referencedColumnName="id")
     * })
     */
    private $documentAttributeCollection;

    /**
     * @var \Object\Entity\Person
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Person")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     * })
     */
    private $author;



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
     * Set arrayIndex
     *
     * @param integer $arrayIndex
     * @return DocumentAttribute
     */
    public function setArrayIndex($arrayIndex)
    {
        $this->arrayIndex = $arrayIndex;

        return $this;
    }

    /**
     * Get arrayIndex
     *
     * @return integer 
     */
    public function getArrayIndex()
    {
        return $this->arrayIndex;
    }

    /**
     * Set data
     *
     * @param string $data
     * @return DocumentAttribute
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get data
     *
     * @return string 
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set documentAttributeCollection
     *
     * @param \Object\Entity\DocumentAttributeCollection $documentAttributeCollection
     * @return DocumentAttribute
     */
    public function setDocumentAttributeCollection(\Object\Entity\DocumentAttributeCollection $documentAttributeCollection = null)
    {
        $this->documentAttributeCollection = $documentAttributeCollection;

        return $this;
    }

    /**
     * Get documentAttributeCollection
     *
     * @return \Object\Entity\DocumentAttributeCollection 
     */
    public function getDocumentAttributeCollection()
    {
        return $this->documentAttributeCollection;
    }

    /**
     * Set author
     *
     * @param \Object\Entity\Person $author
     * @return DocumentAttribute
     */
    public function setAuthor(\Object\Entity\Person $author = null)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return \Object\Entity\Person 
     */
    public function getAuthor()
    {
        return $this->author;
    }
}

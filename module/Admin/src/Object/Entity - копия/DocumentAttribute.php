<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DocumentAttribute
 *
 * @ORM\Table(name="document_attribute", indexes={@ORM\Index(name="fk_Document_Attribute_Document1_idx", columns={"document_id"}), @ORM\Index(name="fk_Document_Attribute_ Attribute_Type1_idx", columns={"attribute_type_id"}), @ORM\Index(name="fk_document_attribute_persons1_idx", columns={"author_id"})})
 * @ORM\Entity
 */
class DocumentAttribute
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
     * @ORM\Column(name="composite_attribute_id", type="integer", nullable=true)
     */
    private $compositeAttributeId;

    /**
     * @var integer
     *
     * @ORM\Column(name="array_index", type="integer", nullable=true)
     */
    private $arrayIndex;

    /**
     * @var string
     *
     * @ORM\Column(name="data", type="text", nullable=true)
     */
    private $data;

    /**
     * @var \Object\Entity\Document
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Document")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_id", referencedColumnName="id")
     * })
     */
    private $document;

    /**
     * @var \Object\Entity\AttributeType
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\AttributeType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="attribute_type_id", referencedColumnName="id")
     * })
     */
    private $attributeType;

    /**
     * @var \Object\Entity\Person
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Person")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     * })
     */
    private $author;



    /**
     * Set id
     *
     * @param integer $id
     * @return DocumentAttribute
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
     * Set compositeAttributeId
     *
     * @param integer $compositeAttributeId
     * @return DocumentAttribute
     */
    public function setCompositeAttributeId($compositeAttributeId)
    {
        $this->compositeAttributeId = $compositeAttributeId;

        return $this;
    }

    /**
     * Get compositeAttributeId
     *
     * @return integer 
     */
    public function getCompositeAttributeId()
    {
        return $this->compositeAttributeId;
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
     * Set document
     *
     * @param \Object\Entity\Document $document
     * @return DocumentAttribute
     */
    public function setDocument(\Object\Entity\Document $document)
    {
        $this->document = $document;

        return $this;
    }

    /**
     * Get document
     *
     * @return \Object\Entity\Document 
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * Set attributeType
     *
     * @param \Object\Entity\AttributeType $attributeType
     * @return DocumentAttribute
     */
    public function setAttributeType(\Object\Entity\AttributeType $attributeType)
    {
        $this->attributeType = $attributeType;

        return $this;
    }

    /**
     * Get attributeType
     *
     * @return \Object\Entity\AttributeType 
     */
    public function getAttributeType()
    {
        return $this->attributeType;
    }

    /**
     * Set author
     *
     * @param \Object\Entity\Person $author
     * @return DocumentAttribute
     */
    public function setAuthor(\Object\Entity\Person $author)
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

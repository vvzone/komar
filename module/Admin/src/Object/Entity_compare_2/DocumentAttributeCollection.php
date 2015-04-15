<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DocumentAttributeCollection
 *
 * @ORM\Table(name="document_attribute_collection", indexes={@ORM\Index(name="attribute_type_id", columns={"attribute_type_id"}), @ORM\Index(name="parent_document_attribute_id", columns={"parent_document_attribute_id"})})
 * @ORM\Entity
 */
class DocumentAttributeCollection
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
     * @var \Object\Entity\AttributeType
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\AttributeType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="attribute_type_id", referencedColumnName="id")
     * })
     */
    private $attributeType;

    /**
     * @var \Object\Entity\DocumentAttribute
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\DocumentAttribute")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="parent_document_attribute_id", referencedColumnName="id")
     * })
     */
    private $parentDocumentAttribute;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\CurrentDocumentType", mappedBy="dac")
     */
    private $cdt;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->cdt = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set attributeType
     *
     * @param \Object\Entity\AttributeType $attributeType
     * @return DocumentAttributeCollection
     */
    public function setAttributeType(\Object\Entity\AttributeType $attributeType = null)
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
     * Set parentDocumentAttribute
     *
     * @param \Object\Entity\DocumentAttribute $parentDocumentAttribute
     * @return DocumentAttributeCollection
     */
    public function setParentDocumentAttribute(\Object\Entity\DocumentAttribute $parentDocumentAttribute = null)
    {
        $this->parentDocumentAttribute = $parentDocumentAttribute;

        return $this;
    }

    /**
     * Get parentDocumentAttribute
     *
     * @return \Object\Entity\DocumentAttribute 
     */
    public function getParentDocumentAttribute()
    {
        return $this->parentDocumentAttribute;
    }

    /**
     * Add cdt
     *
     * @param \Object\Entity\CurrentDocumentType $cdt
     * @return DocumentAttributeCollection
     */
    public function addCdt(\Object\Entity\CurrentDocumentType $cdt)
    {
        $this->cdt[] = $cdt;

        return $this;
    }

    /**
     * Remove cdt
     *
     * @param \Object\Entity\CurrentDocumentType $cdt
     */
    public function removeCdt(\Object\Entity\CurrentDocumentType $cdt)
    {
        $this->cdt->removeElement($cdt);
    }

    /**
     * Get cdt
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCdt()
    {
        return $this->cdt;
    }
}

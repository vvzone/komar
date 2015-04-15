<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AttributeTypeCollection
 *
 * @ORM\Table(name="attribute_type_collection", indexes={@ORM\Index(name="attribute_type_id", columns={"attribute_type_id"}), @ORM\Index(name="fk_attribute_type_collection_document_attribute1_idx", columns={"document_attribute_id"})})
 * @ORM\Entity
 */
class AttributeTypeCollection
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
     * @ORM\Column(name="min_da", type="integer", nullable=false)
     */
    private $minDa;

    /**
     * @var integer
     *
     * @ORM\Column(name="max_da", type="integer", nullable=false)
     */
    private $maxDa;

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
     *   @ORM\JoinColumn(name="document_attribute_id", referencedColumnName="id")
     * })
     */
    private $documentAttribute;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\CurrentDocumentType", mappedBy="atc")
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
     * Set minDa
     *
     * @param integer $minDa
     * @return AttributeTypeCollection
     */
    public function setMinDa($minDa)
    {
        $this->minDa = $minDa;

        return $this;
    }

    /**
     * Get minDa
     *
     * @return integer 
     */
    public function getMinDa()
    {
        return $this->minDa;
    }

    /**
     * Set maxDa
     *
     * @param integer $maxDa
     * @return AttributeTypeCollection
     */
    public function setMaxDa($maxDa)
    {
        $this->maxDa = $maxDa;

        return $this;
    }

    /**
     * Get maxDa
     *
     * @return integer 
     */
    public function getMaxDa()
    {
        return $this->maxDa;
    }

    /**
     * Set attributeType
     *
     * @param \Object\Entity\AttributeType $attributeType
     * @return AttributeTypeCollection
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
     * Set documentAttribute
     *
     * @param \Object\Entity\DocumentAttribute $documentAttribute
     * @return AttributeTypeCollection
     */
    public function setDocumentAttribute(\Object\Entity\DocumentAttribute $documentAttribute = null)
    {
        $this->documentAttribute = $documentAttribute;

        return $this;
    }

    /**
     * Get documentAttribute
     *
     * @return \Object\Entity\DocumentAttribute 
     */
    public function getDocumentAttribute()
    {
        return $this->documentAttribute;
    }

    /**
     * Add cdt
     *
     * @param \Object\Entity\CurrentDocumentType $cdt
     * @return AttributeTypeCollection
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

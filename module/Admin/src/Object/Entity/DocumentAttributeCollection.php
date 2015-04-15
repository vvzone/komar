<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DocumentAttributeCollection
 *
 * @ORM\Table(name="document_attribute_collection", indexes={@ORM\Index(name="attribute_type_id", columns={"attribute_type_id"}), @ORM\Index(name="fk_attribute_type_collection_document_attribute1_idx", columns={"document_attribute_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\DocumentAttributeCollection")
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
     * @var \Object\Entity\AttributeTypeCollection
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\AttributeTypeCollection")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="attribute_type_collection_id", referencedColumnName="id")
     * })
     */
    private $attributeTypeCollection;

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
     * @var \Doctrine\Common\Collections\ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="Object\Entity\DocumentAttribute", mappedBy="documentAttributeCollection", cascade={"all"}, orphanRemoval=true)
     */
    private $documentAttribute;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->cdt = new \Doctrine\Common\Collections\ArrayCollection();
        $this->documentAttribute = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @param \Object\Entity\AttributeTypeCollection $attributeTypeCollection
     * @return DocumentAttributeCollection
     */
    public function setAttributeTypeCollection(\Object\Entity\AttributeTypeCollection $attributeTypeCollection = null)
    {
        $this->attributeType = $attributeTypeCollection;

        return $this;
    }

    /**
     * Get attributeType
     *
     * @return \Object\Entity\AttributeTypeCollection
     */
    public function getAttributeTypeCollection()
    {
        return $this->attributeTypeCollection->getAll();
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

    public function getDocumentAttribute(){
        if($this->documentAttribute){
            $dac = array();
            foreach($this->documentAttribute as $da){
                $dac[] = $da->getAll();
            }
            return $dac;
        }
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'attribute_type_collection' => 'test',
            //'attribute_type_collection' => $this->getAttributeTypeCollection(),
            //'parent_document_attribute_type' => $this->getParentDocumentAttribute(),
            'document_attribute' => $this->getDocumentAttribute()
        );
    }
}

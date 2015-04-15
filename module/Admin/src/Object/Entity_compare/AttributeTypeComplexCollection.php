<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AttributeTypeComplexCollection
 *
 * @ORM\Table(name="attribute_type_complex_collection", indexes={@ORM\Index(name="parent_attribute_id", columns={"parent_attribute_id"}), @ORM\Index(name="attribute_id", columns={"attribute_id"})})
 * @ORM\Entity
 */
class AttributeTypeComplexCollection
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
     * @ORM\Column(name="min", type="integer", nullable=false)
     */
    private $min;

    /**
     * @var integer
     *
     * @ORM\Column(name="max", type="integer", nullable=false)
     */
    private $max;

    /**
     * @var \Object\Entity\AttributeType
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\AttributeType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="attribute_id", referencedColumnName="id")
     * })
     */
    private $attribute;

    /**
     * @var \Object\Entity\AttributeType
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\AttributeType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="parent_attribute_id", referencedColumnName="id")
     * })
     */
    private $parentAttribute;



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
     * Set min
     *
     * @param integer $min
     * @return AttributeTypeComplexCollection
     */
    public function setMin($min)
    {
        $this->min = $min;

        return $this;
    }

    /**
     * Get min
     *
     * @return integer 
     */
    public function getMin()
    {
        return $this->min;
    }

    /**
     * Set max
     *
     * @param integer $max
     * @return AttributeTypeComplexCollection
     */
    public function setMax($max)
    {
        $this->max = $max;

        return $this;
    }

    /**
     * Get max
     *
     * @return integer 
     */
    public function getMax()
    {
        return $this->max;
    }

    /**
     * Set attribute
     *
     * @param \Object\Entity\AttributeType $attribute
     * @return AttributeTypeComplexCollection
     */
    public function setAttribute(\Object\Entity\AttributeType $attribute = null)
    {
        $this->attribute = $attribute;

        return $this;
    }

    /**
     * Get attribute
     *
     * @return \Object\Entity\AttributeType 
     */
    public function getAttribute()
    {
        return $this->attribute;
    }

    /**
     * Set parentAttribute
     *
     * @param \Object\Entity\AttributeType $parentAttribute
     * @return AttributeTypeComplexCollection
     */
    public function setParentAttribute(\Object\Entity\AttributeType $parentAttribute = null)
    {
        $this->parentAttribute = $parentAttribute;

        return $this;
    }

    /**
     * Get parentAttribute
     *
     * @return \Object\Entity\AttributeType 
     */
    public function getParentAttribute()
    {
        return $this->parentAttribute;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'parent_attribute_type' => $this->getParentAttribute(),
            'attribute_type' => $this->getAttribute(),
            'min' => $this->getMin(),
            'max' => $this->getMax()
        );
    }
}

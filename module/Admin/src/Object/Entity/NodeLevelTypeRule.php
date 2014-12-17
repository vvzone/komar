<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NodeLevelTypeRule
 *
 * @ORM\Table(name="node_level_type_rule", indexes={@ORM\Index(name="fk_Node_Level_Type_Rule_Node_Level_Type1_idx", columns={"node_level_type_id"})})
 * @ORM\Entity
 */
class NodeLevelTypeRule
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
     * @ORM\Column(name="existing_level_type", type="integer", nullable=true)
     */
    private $existingLevelType;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_exist", type="boolean", nullable=true)
     */
    private $isExist;

    /**
     * @var \Object\\Entity\NodeLevelType
     *
     * @ORM\ManyToOne(targetEntity="Object\\Entity\NodeLevelType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="node_level_type_id", referencedColumnName="id")
     * })
     */
    private $nodeLevelType;



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
     * Set existingLevelType
     *
     * @param integer $existingLevelType
     * @return NodeLevelTypeRule
     */
    public function setExistingLevelType($existingLevelType)
    {
        $this->existingLevelType = $existingLevelType;

        return $this;
    }

    /**
     * Get existingLevelType
     *
     * @return integer 
     */
    public function getExistingLevelType()
    {
        return $this->existingLevelType;
    }

    /**
     * Set isExist
     *
     * @param boolean $isExist
     * @return NodeLevelTypeRule
     */
    public function setIsExist($isExist)
    {
        $this->isExist = $isExist;

        return $this;
    }

    /**
     * Get isExist
     *
     * @return boolean 
     */
    public function getIsExist()
    {
        return $this->isExist;
    }

    /**
     * Set nodeLevelType
     *
     * @param \Object\\Entity\NodeLevelType $nodeLevelType
     * @return NodeLevelTypeRule
     */
    public function setNodeLevelType(\Object\\Entity\NodeLevelType $nodeLevelType = null)
    {
        $this->nodeLevelType = $nodeLevelType;

        return $this;
    }

    /**
     * Get nodeLevelType
     *
     * @return \Object\\Entity\NodeLevelType 
     */
    public function getNodeLevelType()
    {
        return $this->nodeLevelType;
    }
}

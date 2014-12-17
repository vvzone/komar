<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NodeLevel
 *
 * @ORM\Table(name="node_level", indexes={@ORM\Index(name="fk_Node_Level_Node_Level_Type1_idx", columns={"node_level_type_id"})})
 * @ORM\Entity
 */
class NodeLevel
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
     * @ORM\Column(name="route", type="integer", nullable=true)
     */
    private $route;

    /**
     * @var integer
     *
     * @ORM\Column(name="level_order", type="integer", nullable=true)
     */
    private $levelOrder;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=45, nullable=true)
     */
    private $name;

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
     * Set route
     *
     * @param integer $route
     * @return NodeLevel
     */
    public function setRoute($route)
    {
        $this->route = $route;

        return $this;
    }

    /**
     * Get route
     *
     * @return integer 
     */
    public function getRoute()
    {
        return $this->route;
    }

    /**
     * Set levelOrder
     *
     * @param integer $levelOrder
     * @return NodeLevel
     */
    public function setLevelOrder($levelOrder)
    {
        $this->levelOrder = $levelOrder;

        return $this;
    }

    /**
     * Get levelOrder
     *
     * @return integer 
     */
    public function getLevelOrder()
    {
        return $this->levelOrder;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return NodeLevel
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
     * Set nodeLevelType
     *
     * @param \Object\\Entity\NodeLevelType $nodeLevelType
     * @return NodeLevel
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

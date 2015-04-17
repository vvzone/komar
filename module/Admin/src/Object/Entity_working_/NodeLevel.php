<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NodeLevel
 *
 * @ORM\Table(name="node_level", indexes={@ORM\Index(name="fk_node_level_node_level_type1_idx", columns={"node_level_type_id"}), @ORM\Index(name="fk_node_level_route1_idx", columns={"route_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\NodeLevel")
 */
class NodeLevel extends Filtered
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
     * @var \Object\Entity\NodeLevelType
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\NodeLevelType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="node_level_type_id", referencedColumnName="id")
     * })
     */
    private $nodeLevelType;

    /*
     * @var \Object\Entity\Route
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Route")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="route_id", referencedColumnName="id")
     * })
     */


    /**
     * @var \Object\Entity\Route
     *
     * @ORM\ManyToOne(targetEntity="Route", inversedBy="node_levels")
     */
    private $route;

    /**
     * @ORM\OneToMany(targetEntity="Node", mappedBy="node_level", cascade={"all"}, orphanRemoval=true)
     */
    private $node;

    public function __construct()
    {
        $this->node = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Set id
     *
     * @param integer $id
     * @return NodeLevel
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
     * @param \Object\Entity\NodeLevelType $nodeLevelType
     * @return NodeLevel
     */
    public function setNodeLevelType(\Object\Entity\NodeLevelType $nodeLevelType)
    {
        $this->nodeLevelType = $nodeLevelType;

        return $this;
    }

    /**
     * Get nodeLevelType
     *
     * @return \Object\Entity\NodeLevelType 
     */
    public function getNodeLevelType()
    {
        if($this->nodeLevelType){
            return $this->nodeLevelType->getAll();
            //return $this->nodeLevelType->getId();
        }
        return null;
    }

    /**
     * Set route
     *
     * @param \Object\Entity\Route $route
     * @return NodeLevel
     */
    public function setRoute(\Object\Entity\Route $route)
    {
        $this->route = $route;

        return $this;
    }

    /**
     * Get route
     *
     * @return \Object\Entity\Route 
     */
    public function getRoute()
    {
        return $this->route;
    }

    /**
     * Add Node
     *
     * @param \Object\Entity\Node $node
     * @return Node
     */
    public function addNode(\Object\Entity\Node $node)
    {
        $this->node[] = $node;

        return $this;
    }

    /**
     * Remove Node
     *
     * @param \Object\Entity\Node $node
     */
    public function removeNode(\Object\Entity\Node $node)
    {
        $this->node->removeElement($node);
    }

    public function getNodes(){
        //return $this->nodes;
        if($this->node->count()>0){
            $nodes = array();
            foreach($this->node as $node){
                $nodes[] = $node->getAll();
            }
            return $nodes;
        }

        return null;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'node_level_type' => $this->getNodeLevelType(),
            //'node_level_type' => $this->getNodeLevelType(),
            'level_order' => $this->getLevelOrder(),
            'nodes' => $this->getNodes(),
            'route' => $this->getRoute()->getId()
        );
    }

    public function getNodeLevelSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'order' => $this->getLevelOrder()
        );
    }
}

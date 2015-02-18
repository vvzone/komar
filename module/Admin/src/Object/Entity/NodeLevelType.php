<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NodeLevelType
 *
 * @ORM\Table(name="node_level_type")
 * @ORM\Entity
 */
class NodeLevelType
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
     * @ORM\Column(name="code", type="integer", nullable=true)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=45, nullable=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="default_node_level_name", type="string", length=45, nullable=true)
     */
    private $defaultNodeLevelName;



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
     * Set code
     *
     * @param integer $code
     * @return NodeLevelType
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return integer 
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return NodeLevelType
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
     * Set defaultNodeLevelName
     *
     * @param string $defaultNodeLevelName
     * @return NodeLevelType
     */
    public function setDefaultNodeLevelName($defaultNodeLevelName)
    {
        $this->defaultNodeLevelName = $defaultNodeLevelName;

        return $this;
    }

    /**
     * Get defaultNodeLevelName
     *
     * @return string 
     */
    public function getDefaultNodeLevelName()
    {
        return $this->defaultNodeLevelName;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'code' => $this->getCode(),
            'name' => $this->getName(),
            'default_name' => $this->getDefaultNodeLevelName()
        );
    }
}

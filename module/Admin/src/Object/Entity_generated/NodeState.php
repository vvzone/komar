<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * NodeState
 *
 * @ORM\Table(name="node_state")
 * @ORM\Entity
 */
class NodeState
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
     * @ORM\Column(name="code", type="integer", nullable=false)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="code_name", type="string", length=16, nullable=false)
     */
    private $codeName;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=16, nullable=false)
     */
    private $name;



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
     * @return NodeState
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
     * Set codeName
     *
     * @param string $codeName
     * @return NodeState
     */
    public function setCodeName($codeName)
    {
        $this->codeName = $codeName;

        return $this;
    }

    /**
     * Get codeName
     *
     * @return string 
     */
    public function getCodeName()
    {
        return $this->codeName;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return NodeState
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
}

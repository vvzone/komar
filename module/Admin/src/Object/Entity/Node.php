<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Node
 *
 * @ORM\Table(name="node", indexes={@ORM\Index(name="fk_node_node_level1_idx", columns={"node_level_id"}), @ORM\Index(name="fk_node_client1_idx", columns={"client_id"})})
 * @ORM\Entity
 */
class Node
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
     * @ORM\Column(name="sort_order", type="integer", nullable=true)
     */
    private $sortOrder;

    /**
     * @var string
     *
     * @ORM\Column(name="task", type="text", nullable=true)
     */
    private $task;

    /**
     * @var integer
     *
     * @ORM\Column(name="node_state_id", type="integer", nullable=true)
     */
    private $nodeStateId;

    /**
     * @var integer
     *
     * @ORM\Column(name="period_type_id", type="integer", nullable=true)
     */
    private $periodTypeId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="time_stamp", type="datetime", nullable=true)
     */
    private $timeStamp;

    /**
     * @var integer
     *
     * @ORM\Column(name="period_length", type="integer", nullable=true)
     */
    private $periodLength;

    /*
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\NodeLevel")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="node_level_id", referencedColumnName="id")
     * })
     */

    /**
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\ManyToOne(targetEntity="Client", inversedBy="nodes")
     */
    private $node_level;

    /**
     * @var \Object\Entity\Client
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Client")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="client_id", referencedColumnName="id")
     * })
     */
    private $client;



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
     * Set sortOrder
     *
     * @param integer $sortOrder
     * @return Node
     */
    public function setSortOrder($sortOrder)
    {
        $this->sortOrder = $sortOrder;

        return $this;
    }

    /**
     * Get sortOrder
     *
     * @return integer 
     */
    public function getSortOrder()
    {
        return $this->sortOrder;
    }

    /**
     * Set task
     *
     * @param string $task
     * @return Node
     */
    public function setTask($task)
    {
        $this->task = $task;

        return $this;
    }

    /**
     * Get task
     *
     * @return string 
     */
    public function getTask()
    {
        return $this->task;
    }

    /**
     * Set nodeStateId
     *
     * @param integer $nodeStateId
     * @return Node
     */
    public function setNodeStateId($nodeStateId)
    {
        $this->nodeStateId = $nodeStateId;

        return $this;
    }

    /**
     * Get nodeStateId
     *
     * @return integer 
     */
    public function getNodeStateId()
    {
        return $this->nodeStateId;
    }

    /**
     * Set periodTypeId
     *
     * @param integer $periodTypeId
     * @return Node
     */
    public function setPeriodTypeId($periodTypeId)
    {
        $this->periodTypeId = $periodTypeId;

        return $this;
    }

    /**
     * Get periodTypeId
     *
     * @return integer 
     */
    public function getPeriodTypeId()
    {
        return $this->periodTypeId;
    }

    /**
     * Set timeStamp
     *
     * @param \DateTime $timeStamp
     * @return Node
     */
    public function setTimeStamp($timeStamp)
    {
        $this->timeStamp = $timeStamp;

        return $this;
    }

    /**
     * Get timeStamp
     *
     * @return \DateTime 
     */
    public function getTimeStamp()
    {
        return $this->timeStamp;
    }

    /**
     * Set periodLength
     *
     * @param integer $periodLength
     * @return Node
     */
    public function setPeriodLength($periodLength)
    {
        $this->periodLength = $periodLength;

        return $this;
    }

    /**
     * Get periodLength
     *
     * @return integer 
     */
    public function getPeriodLength()
    {
        return $this->periodLength;
    }

    /**
     * Set nodeLevel
     *
     * @param \Object\Entity\NodeLevel $nodeLevel
     * @return Node
     */
    public function setNodeLevel(\Object\Entity\NodeLevel $nodeLevel = null)
    {
        $this->nodeLevel = $nodeLevel;

        return $this;
    }

    /**
     * Get nodeLevel
     *
     * @return \Object\Entity\NodeLevel 
     */
    public function getNodeLevel()
    {
        return $this->node_level;
    }

    /**
     * Set client
     *
     * @param \Object\Entity\Client $client
     * @return Node
     */
    public function setClient(\Object\Entity\Client $client = null)
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get client
     *
     * @return \Object\Entity\Client 
     */
    public function getClient()
    {
        //return $this->client;
        return $this->client->getAll();
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'node_level_id' => $this->node_level->getId(),
            'recipient_type' => array(
                'id' => 234,
                'code' => 4,
                'name' => 'Визирующее лицо'
            ),
            'sort_order' => $this->getSortOrder(),
            'task' => $this->getTask(),
            'node_state' => $this->getNodeStateId(),
            'period_length' => $this->getPeriodLength(),
            'node_level' => $this->getNodeLevel(),
            'client' => $this->getClient()
        );
    }
}

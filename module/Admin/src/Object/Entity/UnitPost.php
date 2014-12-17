<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UnitPost
 *
 * @ORM\Table(name="unit_post", indexes={@ORM\Index(name="unit", columns={"unit_id"}), @ORM\Index(name="post", columns={"post_id"})})
 * @ORM\Entity
 */
class UnitPost
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
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="date", nullable=true)
     */
    private $startDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="stop_date", type="date", nullable=true)
     */
    private $stopDate;

    /**
     * @var \Object\\Entity\Post
     *
     * @ORM\ManyToOne(targetEntity="Object\\Entity\Post")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     * })
     */
    private $post;

    /**
     * @var \Object\\Entity\Unit
     *
     * @ORM\ManyToOne(targetEntity="Object\\Entity\Unit")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="unit_id", referencedColumnName="id")
     * })
     */
    private $unit;



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
     * Set startDate
     *
     * @param \DateTime $startDate
     * @return UnitPost
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime 
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set stopDate
     *
     * @param \DateTime $stopDate
     * @return UnitPost
     */
    public function setStopDate($stopDate)
    {
        $this->stopDate = $stopDate;

        return $this;
    }

    /**
     * Get stopDate
     *
     * @return \DateTime 
     */
    public function getStopDate()
    {
        return $this->stopDate;
    }

    /**
     * Set post
     *
     * @param \Object\\Entity\Post $post
     * @return UnitPost
     */
    public function setPost(\Object\\Entity\Post $post = null)
    {
        $this->post = $post;

        return $this;
    }

    /**
     * Get post
     *
     * @return \Object\\Entity\Post 
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * Set unit
     *
     * @param \Object\\Entity\Unit $unit
     * @return UnitPost
     */
    public function setUnit(\Object\\Entity\Unit $unit = null)
    {
        $this->unit = $unit;

        return $this;
    }

    /**
     * Get unit
     *
     * @return \Object\\Entity\Unit 
     */
    public function getUnit()
    {
        return $this->unit;
    }
}

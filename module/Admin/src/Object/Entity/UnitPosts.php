<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UnitPosts
 *
 * @ORM\Table(name="unit_posts", indexes={@ORM\Index(name="unit", columns={"unit"}), @ORM\Index(name="post", columns={"post"})})
 * @ORM\Entity
 */
class UnitPosts
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
     * @var \Object\Entity\Posts
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Posts")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="post", referencedColumnName="id")
     * })
     */
    private $post;

    /**
     * @var \Object\Entity\Units
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Units")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="unit", referencedColumnName="id")
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
     * @return UnitPosts
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
     * @return UnitPosts
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
     * @param \Object\Entity\Posts $post
     * @return UnitPosts
     */
    public function setPost(\Object\Entity\Posts $post = null)
    {
        $this->post = $post;

        return $this;
    }

    /**
     * Get post
     *
     * @return \Object\Entity\Posts 
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * Set unit
     *
     * @param \Object\Entity\Units $unit
     * @return UnitPosts
     */
    public function setUnit(\Object\Entity\Units $unit = null)
    {
        $this->unit = $unit;

        return $this;
    }

    /**
     * Get unit
     *
     * @return \Object\Entity\Units 
     */
    public function getUnit()
    {
        return $this->unit;
    }

    public function getMain(){
        return array(
            'id' => $this->getId(),
            'start_date' => $this->getStartDate(),
            'stop_date' => $this->getStopDate(),
            'post' => $this->getPost(),
            'unit' => $this->getUnit()
        );
    }
}

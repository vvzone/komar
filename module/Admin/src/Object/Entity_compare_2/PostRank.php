<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PostRank
 *
 * @ORM\Table(name="post_rank", indexes={@ORM\Index(name="post_id", columns={"post_id", "rank_id"}), @ORM\Index(name="rank_id", columns={"rank_id"}), @ORM\Index(name="IDX_412C8FEE4B89032C", columns={"post_id"})})
 * @ORM\Entity
 */
class PostRank
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
     * @var \Object\Entity\Post
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Post")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     * })
     */
    private $post;

    /**
     * @var \Object\Entity\Rank
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Rank")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="rank_id", referencedColumnName="id")
     * })
     */
    private $rank;



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
     * Set post
     *
     * @param \Object\Entity\Post $post
     * @return PostRank
     */
    public function setPost(\Object\Entity\Post $post = null)
    {
        $this->post = $post;

        return $this;
    }

    /**
     * Get post
     *
     * @return \Object\Entity\Post 
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * Set rank
     *
     * @param \Object\Entity\Rank $rank
     * @return PostRank
     */
    public function setRank(\Object\Entity\Rank $rank = null)
    {
        $this->rank = $rank;

        return $this;
    }

    /**
     * Get rank
     *
     * @return \Object\Entity\Rank 
     */
    public function getRank()
    {
        return $this->rank;
    }
}

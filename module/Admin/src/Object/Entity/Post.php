<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;
//use Object\InputFilter\PostFilter;


/**
 * Post
 *
 * @ORM\Entity(repositoryClass="Object\Repository\PostRepository")
 * @ORM\Table(name="post")
 */
class Post extends _Filtered
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=64, nullable=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="short_name", type="string", length=12, nullable=true)
     */
    private $shortName;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var \Doctrine\Common\Collections\ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Rank")
     * @ORM\JoinTable(name="post_rank",
     *   joinColumns={
     *     @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="rank_id", referencedColumnName="id")
     *   }
     * )
     */
    private $allowedRanks;

    /*
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Unit", mappedBy="posts")
     * */
    private $unitsHaveCurrentPost;

    public function __construct()
    {
        $this->unitsHaveCurrentPost = new \Doctrine\Common\Collections\ArrayCollection();
        $this->allowedRanks = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set name
     *
     * @param string $name
     * @return Post
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
     * Set shortName
     *
     * @param string $shortName
     * @return Post
     */
    public function setShortName($shortName)
    {
        $this->shortName = $shortName;

        return $this;
    }

    /**
     * Get shortName
     *
     * @return string
     */
    public function getShortName()
    {
        return $this->shortName;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Post
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Add AllowedRank
     *
     * @param \Doctrine\Common\Collections\Collection
     * @return Post
     */
    public function addAllowedRanks(\Doctrine\Common\Collections\Collection $AllowedRanks)
    {
        foreach($AllowedRanks as $Rank){
            if( ! $this->allowedRanks->contains($Rank)) {
                $this->allowedRanks->add($Rank);
            }
        }
        return $this;
    }

    /**
     * Remove AllowedRank
     *
     * @param \Doctrine\Common\Collections\Collection
     */
    public function removeAllowedRanks(\Doctrine\Common\Collections\Collection $AllowedRanks)
    {
        foreach($AllowedRanks as $Rank){
            $this->allowedRanks->removeElement($Rank);
        }
    }

    /*
     * @return \Doctrine\Common\Collections\Collection
     * */

    public function getAllowedRanks(){
        return $this->allowedRanks;
    }

    public function getAllowedRanksObj(){
        if($this->getAllowedRanks()->count()>0){
            $allowed_ranks = array();
            foreach($this->getAllowedRanks() as $Rank){
                $allowed_ranks[] = $Rank->getAll();
            }
            return $allowed_ranks;
        }
        return array();
    }

    /**
     * Add unit
     *
     * @param \Object\Entity\Unit $unit
     * @return Post
     */
    public function addUnitsHaveCurrentPost(\Object\Entity\Unit $unit)
    {
        $this->unitsHaveCurrentPost[] = $unit;

        return $this;
    }

    /**
     * Remove unit
     *
     * @param \Object\Entity\Unit $unit
     */
    public function removeUnitsHaveCurrentPost(\Object\Entity\Unit $unit)
    {
        $this->unitsHaveCurrentPost->removeElement($unit);
    }

    /**
     * Get unitsHaveCurrentPost
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUnitsHaveCurrentPost()
    {
        return $this->unitsHaveCurrentPost;
    }

    public function getPostSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName()
        );
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName(),
            'description' => $this->getDescription(),
            'unit' => '',
            'allowed_ranks' => $this->getAllowedRanksObj(),
            'unitsHaveCurrentPost' => $this->getUnitsHaveCurrentPost()
        );
    }
}

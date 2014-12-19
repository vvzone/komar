<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Unit
 *
 * @ORM\Table(name="unit", indexes={@ORM\Index(name="fk_unit_client1_idx", columns={"client_id"})})
 * @ORM\Entity
 */
class Unit
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
     * @ORM\Column(name="parent", type="integer", nullable=true)
     */
    private $parent;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=64, nullable=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="short_name", type="string", length=10, nullable=true)
     */
    private $shortName;

    /**
     * @var boolean
     *
     * @ORM\Column(name="own_numeration", type="boolean", nullable=true)
     */
    private $ownNumeration;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_legal", type="boolean", nullable=true)
     */
    private $isLegal;

    /**
     * @var integer
     *
     * @ORM\Column(name="commander", type="integer", nullable=true)
     */
    private $commander;

    /**
     * @var integer
     *
     * @ORM\Column(name="deputy", type="integer", nullable=true)
     */
    private $deputy;

    /**
     * @var integer
     *
     * @ORM\Column(name="on_duty", type="integer", nullable=true)
     */
    private $onDuty;

    /*
     * @var \Object\Entity\Client
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Client")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="client_id", referencedColumnName="id")
     * })
     */
    /**
     * @var \Object\Entity\Client
     *
     * @ORM\ManyToOne(targetEntity="Client", inversedBy="unitInfo")
     */
    private $client;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Post", inversedBy="unitsHaveCurrentPost")
     * @ORM\JoinTable(name="unit_post",
     *   joinColumns={
     *     @ORM\JoinColumn(name="unit_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     *   }
     * )
     * */
    private $posts;

    /*
     * Constructor
     * */
    public function __construct(){
        $this->posts = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set parent
     *
     * @param integer $parent
     * @return Unit
     */
    public function setParent($parent)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent
     *
     * @return integer 
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Unit
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
     * @return Unit
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
     * Set ownNumeration
     *
     * @param boolean $ownNumeration
     * @return Unit
     */
    public function setOwnNumeration($ownNumeration)
    {
        $this->ownNumeration = $ownNumeration;

        return $this;
    }

    /**
     * Get ownNumeration
     *
     * @return boolean 
     */
    public function getOwnNumeration()
    {
        return $this->ownNumeration;
    }

    /**
     * Set isLegal
     *
     * @param boolean $isLegal
     * @return Unit
     */
    public function setIsLegal($isLegal)
    {
        $this->isLegal = $isLegal;

        return $this;
    }

    /**
     * Get isLegal
     *
     * @return boolean 
     */
    public function getIsLegal()
    {
        return $this->isLegal;
    }

    /**
     * Set commander
     *
     * @param integer $commander
     * @return Unit
     */
    public function setCommander($commander)
    {
        $this->commander = $commander;

        return $this;
    }

    /**
     * Get commander
     *
     * @return integer 
     */
    public function getCommander()
    {
        return $this->commander;
    }

    /**
     * Set deputy
     *
     * @param integer $deputy
     * @return Unit
     */
    public function setDeputy($deputy)
    {
        $this->deputy = $deputy;

        return $this;
    }

    /**
     * Get deputy
     *
     * @return integer 
     */
    public function getDeputy()
    {
        return $this->deputy;
    }

    /**
     * Set onDuty
     *
     * @param integer $onDuty
     * @return Unit
     */
    public function setOnDuty($onDuty)
    {
        $this->onDuty = $onDuty;

        return $this;
    }

    /**
     * Get onDuty
     *
     * @return integer 
     */
    public function getOnDuty()
    {
        return $this->onDuty;
    }

    /**
     * Set client
     *
     * @param \Object\Entity\Client $client
     * @return Unit
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
        return $this->client;
    }

    /**
     * Add Post
     *
     * @param \Object\Entity\Post $Post
     * @return Person
     */
    public function addPost(\Object\Entity\Post $Post)
    {
        $this->posts[] = $Post;

        return $this;
    }

    /**
     * Remove Post
     *
     * @param \Object\Entity\Post $Post
     */
    public function removePost(\Object\Entity\Post $Post)
    {
        $this->posts->removeElement($Post);
    }

    /*
     * @return \Doctrine\Common\Collections\Collection
     * */

    public function getPosts(){
        return $this->posts;
    }

    public function getPostsList(){
        $list = array();
        foreach($this->getPosts() as $post){
            $list[$post->getId()] =
                array(
                    'name' => $post->getName(),
                    'short_name' => $post->getShortName()
                );
        }

        return $list;
    }

    /* === Business logic ==== */

    public function getPlain(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName(),
            'own_numeration' => $this->getOwnNumeration()
        );
    }

    public function getAll()
    {
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName(),
            'own_numeration' => $this->getOwnNumeration(),
            'unit_posts' => $this->getPostsList()
        );
    }

    public function getUnitSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName()
        );
    }
}

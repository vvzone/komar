<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MenuClient
 *
 * @ORM\Table(name="menu_client", indexes={@ORM\Index(name="parent_id", columns={"parent_id"}), @ORM\Index(name="type", columns={"type"})})
 * @ORM\Entity
 */
class MenuClient
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
     * @ORM\Column(name="entity", type="string", length=128, nullable=true)
     */
    private $entity;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_not_screen", type="boolean", nullable=true)
     */
    private $isNotScreen;

    /**
     * @var string
     *
     * @ORM\Column(name="icon", type="string", length=64, nullable=true)
     */
    private $icon;

    /**
     * @var \Object\Entity\MenuClient
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\MenuClient")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="parent_id", referencedColumnName="id")
     * })
     */
    private $parent;

    /**
     * @var \Object\Entity\MenuClientType
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\MenuClientType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="type", referencedColumnName="id")
     * })
     */
    private $type;



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
     * @return MenuClient
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
     * Set entity
     *
     * @param string $entity
     * @return MenuClient
     */
    public function setEntity($entity)
    {
        $this->entity = $entity;

        return $this;
    }

    /**
     * Get entity
     *
     * @return string 
     */
    public function getEntity()
    {
        return $this->entity;
    }

    /**
     * Set isNotScreen
     *
     * @param boolean $isNotScreen
     * @return MenuClient
     */
    public function setIsNotScreen($isNotScreen)
    {
        $this->isNotScreen = $isNotScreen;

        return $this;
    }

    /**
     * Get isNotScreen
     *
     * @return boolean 
     */
    public function getIsNotScreen()
    {
        return $this->isNotScreen;
    }

    /**
     * Set icon
     *
     * @param string $icon
     * @return MenuClient
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Get icon
     *
     * @return string 
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * Set parent
     *
     * @param \Object\Entity\MenuClient $parent
     * @return MenuClient
     */
    public function setParent(\Object\Entity\MenuClient $parent = null)
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * Get parent
     *
     * @return \Object\Entity\MenuClient 
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set type
     *
     * @param \Object\Entity\MenuClientType $type
     * @return MenuClient
     */
    public function setType(\Object\Entity\MenuClientType $type = null)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return \Object\Entity\MenuClientType 
     */
    public function getType()
    {
        return $this->type;
    }
}

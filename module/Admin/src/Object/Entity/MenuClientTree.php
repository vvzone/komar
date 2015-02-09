<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * MenuClient
 *
 * @Gedmo\Tree(type="nested")
 * @ORM\Table(name="menu_client")
 *
 * @ORM\Entity(repositoryClass="Gedmo\Tree\Entity\Repository\NestedTreeRepository")
 */
class MenuClientTree
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
     * @var string
     *
     * @ORM\Column(name="icon", type="string", length=64, nullable=true)
     */
    private $icon;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_not_screen", type="boolean", nullable=true)
     */
    private $isNotScreen;

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
     * @ORM\gedmo:TreeLeft
     * @ORM\Column(name="lft", type="integer")
     */
    private $lft;

    /**
     * @ORM\gedmo:TreeRight
     * @ORM\Column(name="rgt", type="integer")
     */
    private $rgt;

    /**
     * @ORM\gedmo:TreeParent
     * @ManyToOne(targetEntity="Object\Entity\MenuClient", inversedBy="children")
     */
    private $parent;

    /**
     *
     * @OneToMany(targetEntity="Category", mappedBy="parent")
     * @OrderBy({"lft" = "ASC"})
     */
    private $children;



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

    public function getChildren(){
        return $this->children;
    }

    public function getMenuClientTree(){

    }

    public function getMenuClientSimple(){
        $simpleObj =array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'entity' => $this->getEntity(),
            'is_not_screen' => $this->getIsNotScreen(),
            'type' => $this->getType()->getName(),
            'parent_id' => $this->getParent(),
            'icon' => $this->getIcon(),
        );

        /*
        if($this->getChildren()->count() > 0){
            $simpleObj['children'] = $this->getChildren();
        }*/
        return $simpleObj;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'entity' => $this->getEntity(),
            'is_not_screen' => $this->getIsNotScreen(),
            'type' => $this->getType(),
            'icon' => $this->getIcon(),
            'children' => $this->getChildren()
        );
    }

    /*
     *         "id": 2,
        "entity": "inbox",
        "screen": "base",
        "name": "Входящие документы",
        "is_not_screen": true,
        "type": "msg_box",
        "messages": {
            "total": 45,
            "new": 1
        },
        "icon": "fa fa-inbox"
     * */
}

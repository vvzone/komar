<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\Common\Collections\ArrayCollection;

/**
 *
 * @Gedmo\Tree(type="nested")
 * @ORM\Table(name="menu_client_tree")
 *
 * @ORM\Entity(repositoryClass="Gedmo\Tree\Entity\Repository\NestedTreeRepository")
 * custom rep:
 * ORM\Entity(repositoryClass="Entity\Repository\ClientMenuRepository")
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
     * @ORM\Column(name="name", type="string", length=64, nullable=false)
     */
    private $name;

    /**
     * @var string
     * @ORM\Column(name="entity", type="string", length=128, nullable=true)
     */
    private $entity;

    /**
     * @var string
     * @ORM\Column(name="icon", type="string", length=64, nullable=true)
     */
    private $icon;

    /**
     * @var boolean
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
     * @Gedmo\TreeLeft
     * @ORM\Column(name="lft", type="integer")
     */
    private $lft;

    /**
     * @Gedmo\TreeLevel
     * @ORM\Column(name="lvl", type="integer")
     */
    private $lvl;

    /**
     * @Gedmo\TreeRight
     * @ORM\Column(name="rgt", type="integer")
     */
    private $rgt;

    /**
     * @Gedmo\TreeRoot
     * @ORM\Column(name="root", type="integer", nullable=true)
     */
    private $root;

    /**
     * @Gedmo\TreeParent
     * @ORM\ManyToOne(targetEntity="Object\Entity\MenuClientTree", inversedBy="children")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $parent;

    /**
     * @ORM\OneToMany(targetEntity="Object\Entity\MenuClientTree", mappedBy="parent")
     * @ORM\OrderBy({"lft" = "ASC"})
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
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
     * @return MenuClientTree
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
     * @return MenuClientTree
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
     * @return MenuClientTree
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
     * @return MenuClientTree
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
     * @return MenuClientTree
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
     * @param \Object\Entity\MenuClientTree $parent
     * @return MenuClientTree
     */
    public function setParent(\Object\Entity\MenuClientTree $parent = null)
    {
        $this->parent = $parent;
    
        return $this;
    }

    /**
     * Get parent
     *
     * @return \Object\Entity\MenuClientTree
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

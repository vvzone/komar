<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * MenuClientType
 *
 * @ORM\Table(name="menu_client_type")
 * @ORM\Entity(repositoryClass="Object\Repository\MenuClientType")
 */
class MenuClientType extends Filtered
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
     * @ORM\Column(name="name", type="string", length=8, nullable=false)
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
     * Set name
     *
     * @param string $name
     * @return MenuClientType
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

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName()
        );
    }
}

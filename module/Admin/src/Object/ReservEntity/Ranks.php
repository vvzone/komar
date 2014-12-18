<?php

namespace Object\ReservEntity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ranks
 *
 * @ORM\Table(name="ranks")
 * @ORM\Entity
 */
class Ranks
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
     * @ORM\Column(name="short_name", type="string", length=15, nullable=true)
     */
    private $shortName;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_officer", type="boolean", nullable=false)
     */
    private $isOfficer;



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
     * @return Ranks
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
     * @return Ranks
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
     * @return Ranks
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
     * Set isOfficer
     *
     * @param boolean $isOfficer
     * @return Ranks
     */
    public function setIsOfficer($isOfficer)
    {
        $this->isOfficer = $isOfficer;

        return $this;
    }

    /**
     * Get isOfficer
     *
     * @return boolean 
     */
    public function getIsOfficer()
    {
        return $this->isOfficer;
    }

    public function getAll()
    {
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName(),
            'description' => $this->getDescription(),
            'is_officer' => $this->getIsOfficer()
        );
    }

    public function getRankSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName()
        );
    }
}
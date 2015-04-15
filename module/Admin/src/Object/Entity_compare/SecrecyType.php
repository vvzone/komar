<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * SecrecyType
 *
 * @ORM\Table(name="secrecy_type")
 * @ORM\Entity
 */
class SecrecyType
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
     * @ORM\Column(name="name", type="string", length=32, nullable=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="short_name", type="string", length=12, nullable=true)
     */
    private $shortName;

    /**
     * @var integer
     *
     * @ORM\Column(name="single_numeration", type="integer", nullable=true)
     */
    private $singleNumeration;

    /**
     * @var integer
     *
     * @ORM\Column(name="level", type="integer", nullable=true)
     */
    private $level;



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
     * @return SecrecyType
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
     * @return SecrecyType
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
     * Set singleNumeration
     *
     * @param integer $singleNumeration
     * @return SecrecyType
     */
    public function setSingleNumeration($singleNumeration)
    {
        $this->singleNumeration = $singleNumeration;

        return $this;
    }

    /**
     * Get singleNumeration
     *
     * @return integer 
     */
    public function getSingleNumeration()
    {
        return $this->singleNumeration;
    }

    /**
     * Set level
     *
     * @param integer $level
     * @return SecrecyType
     */
    public function setLevel($level)
    {
        $this->level = $level;

        return $this;
    }

    /**
     * Get level
     *
     * @return integer 
     */
    public function getLevel()
    {
        return $this->level;
    }
}

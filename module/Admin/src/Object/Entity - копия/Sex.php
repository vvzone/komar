<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Sex
 *
 * @ORM\Table(name="sex")
 * @ORM\Entity
 */
class Sex
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
     * @ORM\Column(name="short_name", type="string", length=5, nullable=false)
     */
    private $shortName;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Object\Entity\Person", mappedBy="sex_id", cascade={"all"}, orphanRemoval=true)
     */
    private $person;

    public function __construct()
    {
        $this->person = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Sex
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
     * @return Sex
     */
    public function setShortName($shortName)
    {
        $this->shortName = $shortName;

        return $this;
    }


    public function getPerson(){
        //return $this->person;
        $persons = array();
        foreach($this->person as $person){
            $persons[] = $person->getPersonSimple();
        }
        return $persons;
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

    public function getSexSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName()
        );
    }

    public function getMain(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'short_name' => $this->getShortName(),
            //'person' => $this->getPerson()
        );
    }
}

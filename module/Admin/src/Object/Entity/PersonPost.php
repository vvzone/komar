<?php

namespace Object\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Object\Entity\Persons;

/**
 * PersonPost
 *
 * @ORM\Table(name="person_post", indexes={@ORM\Index(name="person", columns={"person"}), @ORM\Index(name="unit_post", columns={"unit_post"})})
 * @ORM\Entity
 */
class PersonPost
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
     * @ORM\Column(name="document", type="integer", nullable=false)
     */
    private $document;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="date", nullable=false)
     */
    private $startDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date", type="date", nullable=true)
     */
    private $endDate;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     *
     * @ORM\ManyToOne(targetEntity="Persons", inversedBy="personPost")
     * @ORM\JoinColumn(name="person", referencedColumnName="id")
     */
    private $person;

    /**
     *
     * @var integer;
     **/
    private $unitPost;

    public function __construct()
    {
        $this->person = new ArrayCollection();
        //$this->unitPost = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set document
     *
     * @param integer $document
     * @return PersonPost
     */
    public function setDocument($document)
    {
        $this->document = $document;

        return $this;
    }

    /**
     * Get document
     *
     * @return integer 
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * Set startDate
     *
     * @param \DateTime $startDate
     * @return PersonPost
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime 
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate
     * @return PersonPost
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime 
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return PersonPost
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
     * Set person
     *
     * @param \Object\Entity\Persons $person
     * @return PersonPost
     */
    public function setPerson(\Object\Entity\Persons $person = null)
    {
        $this->person = $person;

        return $this;
    }

    /**
     * Get person
     *
     * @return \Object\Entity\Persons 
     */
    public function getPerson()
    {
        return $this->person;
    }

    /**
     * Set unitPost
     *
     * @param \Object\Entity\UnitPosts $unitPost
     * @return PersonPost
     */
    public function setUnitPost(\Object\Entity\UnitPosts $unitPost = null)
    {
        $this->unitPost = $unitPost;

        return $this;
    }

    /**
     * Get unitPost
     *
     * @return UnitPosts
     */
    public function getUnitPost()
    {
        //var_dump($this->unitPost);
        return $this->unitPost->getMain();
    }

    public function getPersonToUnitPostSide(){
        return array(
            'id' => $this->getId(),
            'start_date' => $this->getStartDate(),
            'end_date' => $this->getEndDate(),
            'document' => $this->getDocument(),
            'unit_post' => $this->getUnitPost()
        );

    }
}

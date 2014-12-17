<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Person
 *
 * @ORM\Table(name="person", indexes={@ORM\Index(name="fk_person_sex1_idx", columns={"sex_id"}), @ORM\Index(name="fk_person_client1_idx", columns={"client_id"})})
 * @ORM\Entity
 */
class Person
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="first_name", type="string", length=64, nullable=false)
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(name="patronymic_name", type="string", length=64, nullable=true)
     */
    private $patronymicName;

    /**
     * @var string
     *
     * @ORM\Column(name="family_name", type="string", length=64, nullable=false)
     */
    private $familyName;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="birth_date", type="date", nullable=true)
     */
    private $birthDate;

    /**
     * @var string
     *
     * @ORM\Column(name="birth_place", type="string", length=64, nullable=true)
     */
    private $birthPlace;

    /**
     * @var integer
     *
     * @ORM\Column(name="inn", type="integer", nullable=true)
     */
    private $inn;

    /**
     * @var string
     *
     * @ORM\Column(name="citizenship", type="string", length=64, nullable=true)
     */
    private $citizenship;

    /**
     * @var integer
     *
     * @ORM\Column(name="deputy", type="integer", nullable=true)
     */
    private $deputy;

    /**
     * @var \Object\Entity\Sex
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Sex")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="sex_id", referencedColumnName="id")
     * })
     */
    private $sex;

    /**
     * @var \Object\Entity\Client
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Client")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="client_id", referencedColumnName="id")
     * })
     */
    private $client;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\UnitPost", inversedBy="person")
     * @ORM\JoinTable(name="person_has_unit_post",
     *   joinColumns={
     *     @ORM\JoinColumn(name="person_id", referencedColumnName="id"),
     *     @ORM\JoinColumn(name="person_sex_id", referencedColumnName="sex_id"),
     *     @ORM\JoinColumn(name="person_client_id", referencedColumnName="client_id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="unit_post_unit_id", referencedColumnName="unit_id"),
     *     @ORM\JoinColumn(name="unit_post_unit_client_id", referencedColumnName="unit_client_id"),
     *     @ORM\JoinColumn(name="unit_post_post_id", referencedColumnName="post_id")
     *   }
     * )
     */
    private $unitPostUnit;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->unitPostUnit = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Set id
     *
     * @param integer $id
     * @return Person
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
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
     * Set firstName
     *
     * @param string $firstName
     * @return Person
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set patronymicName
     *
     * @param string $patronymicName
     * @return Person
     */
    public function setPatronymicName($patronymicName)
    {
        $this->patronymicName = $patronymicName;

        return $this;
    }

    /**
     * Get patronymicName
     *
     * @return string 
     */
    public function getPatronymicName()
    {
        return $this->patronymicName;
    }

    /**
     * Set familyName
     *
     * @param string $familyName
     * @return Person
     */
    public function setFamilyName($familyName)
    {
        $this->familyName = $familyName;

        return $this;
    }

    /**
     * Get familyName
     *
     * @return string 
     */
    public function getFamilyName()
    {
        return $this->familyName;
    }

    /**
     * Set birthDate
     *
     * @param \DateTime $birthDate
     * @return Person
     */
    public function setBirthDate($birthDate)
    {
        $this->birthDate = $birthDate;

        return $this;
    }

    /**
     * Get birthDate
     *
     * @return \DateTime 
     */
    public function getBirthDate()
    {
        return $this->birthDate;
    }

    /**
     * Set birthPlace
     *
     * @param string $birthPlace
     * @return Person
     */
    public function setBirthPlace($birthPlace)
    {
        $this->birthPlace = $birthPlace;

        return $this;
    }

    /**
     * Get birthPlace
     *
     * @return string 
     */
    public function getBirthPlace()
    {
        return $this->birthPlace;
    }

    /**
     * Set inn
     *
     * @param integer $inn
     * @return Person
     */
    public function setInn($inn)
    {
        $this->inn = $inn;

        return $this;
    }

    /**
     * Get inn
     *
     * @return integer 
     */
    public function getInn()
    {
        return $this->inn;
    }

    /**
     * Set citizenship
     *
     * @param string $citizenship
     * @return Person
     */
    public function setCitizenship($citizenship)
    {
        $this->citizenship = $citizenship;

        return $this;
    }

    /**
     * Get citizenship
     *
     * @return string 
     */
    public function getCitizenship()
    {
        return $this->citizenship;
    }

    /**
     * Set deputy
     *
     * @param integer $deputy
     * @return Person
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
     * Set sex
     *
     * @param \Object\Entity\Sex $sex
     * @return Person
     */
    public function setSex(\Object\Entity\Sex $sex)
    {
        $this->sex = $sex;

        return $this;
    }

    /**
     * Get sex
     *
     * @return \Object\Entity\Sex 
     */
    public function getSex()
    {
        return $this->sex;
    }

    /**
     * Set client
     *
     * @param \Object\Entity\Client $client
     * @return Person
     */
    public function setClient(\Object\Entity\Client $client)
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
     * Add unitPostUnit
     *
     * @param \Object\Entity\UnitPost $unitPostUnit
     * @return Person
     */
    public function addUnitPostUnit(\Object\Entity\UnitPost $unitPostUnit)
    {
        $this->unitPostUnit[] = $unitPostUnit;

        return $this;
    }

    /**
     * Remove unitPostUnit
     *
     * @param \Object\Entity\UnitPost $unitPostUnit
     */
    public function removeUnitPostUnit(\Object\Entity\UnitPost $unitPostUnit)
    {
        $this->unitPostUnit->removeElement($unitPostUnit);
    }

    /**
     * Get unitPostUnit
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUnitPostUnit()
    {
        return $this->unitPostUnit;
    }
}

<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;
//use Object\Entity\Clients as Client;

/**
 * Persons
 *
 * @ORM\Table(name="persons")
 * @ORM\Entity
 */
class Persons
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
     * @ORM\ManyToOne(targetEntity="Clients", inversedBy="personInfo")
     * @ORM\JoinColumn(name="client", referencedColumnName="id")
     **/
    protected $client; //private

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
     * @ORM\Column(name="sex", type="integer", nullable=true)
     */
    private $sex;

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
     * @var integer
     *
     * @ORM\Column(name="person_post", type="integer", nullable=true)
     */
    private $personPost;



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
     * Set client
     *
     * @param integer $client
     * @return Persons
     */
    public function setClient($client)
    {
        $this->client = $client;

        return $this;
    }

    /**
     * Get client
     *
     * @return integer 
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     * @return Persons
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
     * @return Persons
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
     * @return Persons
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
     * @return Persons
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
     * @return Persons
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
     * Set sex
     *
     * @param integer $sex
     * @return Persons
     */
    public function setSex($sex)
    {
        $this->sex = $sex;

        return $this;
    }

    /**
     * Get sex
     *
     * @return integer 
     */
    public function getSex()
    {
        return $this->sex;
    }

    /**
     * Set inn
     *
     * @param integer $inn
     * @return Persons
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
     * @return Persons
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
     * @return Persons
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
     * Set personPost
     *
     * @param integer $personPost
     * @return Persons
     */
    public function setPersonPost($personPost)
    {
        $this->personPost = $personPost;

        return $this;
    }

    /**
     * Get personPost
     *
     * @return integer 
     */
    public function getPersonPost()
    {
        return $this->personPost;
    }
}

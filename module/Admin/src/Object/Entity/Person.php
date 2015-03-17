<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Person
 *
 * @ORM\Table(name="person", indexes={@ORM\Index(name="fk_person_sex1_idx", columns={"sex_id"}), @ORM\Index(name="fk_person_client1_idx", columns={"client_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\Person")
 */
class Person extends Filtered
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
     * @ORM\ManyToOne(targetEntity="Object\Entity\Sex")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="sex_id", referencedColumnName="id")
     * })
     */
    private $sex;

    /**
     * @var \Object\Entity\Client
     *
     * @ORM\ManyToOne(targetEntity="Object\Entity\Client")
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
     *     @ORM\JoinColumn(name="person_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="unit_post_id", referencedColumnName="id")
     *   }
     * )
     */
    private $unitPost;

    /**
     *  @ORM\OneToMany(targetEntity="Object\Entity\User", mappedBy="person", cascade={"all"}, orphanRemoval=true)
     */
    private $user;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->unitPost = new \Doctrine\Common\Collections\ArrayCollection();
        $this->user = new \Doctrine\Common\Collections\ArrayCollection();

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
        if($this->birthDate){
            $this->birthDate->format('d.m.Y');
        }

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
    public function setSex(\Object\Entity\Sex $sex = null)
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

    public function getSexId(){
       if($this->getSex() instanceof \Object\Entity\Sex){
           return $this->getSex()->getId();
       }else{
           return 3;
       }
    }
    /**
     * Set client
     *
     * @param \Object\Entity\Client $client
     * @return Person
     */
    public function setClient(\Object\Entity\Client $client = null)
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
     * Add unitPost
     *
     * @param \Object\Entity\UnitPost $unitPost
     * @return Person
     */
    public function addUnitPost(\Object\Entity\UnitPost $unitPost)
    {
        $this->unitPost[] = $unitPost;

        return $this;
    }

    /**
     * Remove unitPost
     *
     * @param \Object\Entity\UnitPost $unitPost
     */
    public function removeUnitPost(\Object\Entity\UnitPost $unitPost)
    {
        $this->unitPost->removeElement($unitPost);
    }

    /**
     * Get unitPost
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUnitPost()
    {
        //return $this->unitPost->last()->getPost()->getName();
        //$unitPost = $this->unitPost->last();
        return $this->unitPost;
    }

    public function getUser(){
        if($this->user->count() > 1)
        {
            throw new \Exception('Fatal. DB corruption detected. More than one user to current person-record.', 500);
        }
        $user = $this->user->last();
        if($user){
            return $user->getUserSimple();
        }
        return false;
    }

    public function setUser($user){
       $this->user = $user;
    }

    public function addUser($user){

    }

    public function getUnitPostsList(){
        $list = array();
        foreach($this->getUnitPost() as $unit_post){
            $list[$unit_post->getId()] =
                array(
                    $unit_post->getAll()
                    /*
                    'name' => $unit_post->getPost()->getName(),
                    'short_name' => $unit_post->getPost()->getShortName(),
                    'unit' => $this->getPost()
                    */
                );
        }

        return $list;
    }

    /* ============= Business-logic Methods... =================*/

    public function getInitials()
    {
        $initials = null;
        $first_name = $this->getFirstName();
        ($this->getFirstName())? $initials = mb_substr($this->getFirstName(), 0, 1, 'utf-8').'.' : null;
        ($this->getPatronymicName())? $initials =  $initials.mb_substr($this->getPatronymicName(), 0, 1, 'utf-8').'.' : null;
        return $initials;
    }

    public function getBigFIO(){
        $fio = null;
        ($this->getFamilyName())? $fio = $this->getFamilyName() : null;
        ($this->getFirstName())? $fio .= ' '.$this->getFirstName() : null;
        ($this->getPatronymicName())? $fio .= ' '.$this->getPatronymicName() : null;
        return $fio;
    }

    public function getFIO(){
        $fio = null;
        ($this->getFamilyName())? $fio = $this->getFamilyName() : null;
        ($this->getInitials())? $fio =$fio.' '.$this->getInitials() : null;
        return $fio;
    }

    public function getPlain(){
        return array(
            'id' => $this->getId(),
            //'name' => $this->getBigFIO(),
            //'short_name' => $this->getFIO(),
            'first_name' => $this->getFirstName(),
            'patronymic_name' => $this->getPatronymicName(),
            'family_name' => $this->getFamilyName(),
            'birth_date' => $this->getBirthDate(),
            'birth_place' => $this->getBirthPlace(),
            'sex_type' => $this->getSexId(),
            'inn' => $this->getInn(),
            'citizenship' => $this->getCitizenship()
        );
    }

    public function getAll()
    {
        return array(
            'id' => $this->getId(),
            //'name' => $this->getBigFIO(),
            //'short_name' => $this->getFIO(),
            'first_name' => $this->getFirstName(),
            'patronymic_name' => $this->getPatronymicName(),
            'family_name' => $this->getFamilyName(),
            'birth_date' => $this->getBirthDate(),
            'birth_place' => $this->getBirthPlace(),
            'sex_type' => $this->getSexId(),
            'inn' => $this->getInn(),
            'citizenship' => $this->getCitizenship(),
            'deputy' => $this->getDeputy(),
            'user' => $this->getUser()
            //'person_post' => $this->getUnitPostsList(),
            //'client' => $this->getClient()->getAll()
            //'person_post_count' => $this->personPost->count()
        );
    }

    public function getPersonSimple(){
        $name = null;
        /*if($this->getPerson()){
            $name = $this->getPerson()->getFIO();
        }
        if($this->getUnit()){
            $name = $this->getUnit()->getName();
        }*/
        return array(
            'id' => $this->getId(),
            'name' => $this->getFIO()
        );
    }


}

<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Clients
 *
 * @ORM\Table(name="clients")
 * @ORM\Entity
 */
class Clients
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
     * @ORM\Column(name="full_name", type="string", length=64, nullable=false)
     */
    private $fullName;

    /**
     * @var integer
     *
     * @ORM\Column(name="identification_number", type="integer", nullable=true)
     */
    private $identificationNumber;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_external", type="boolean", nullable=true)
     */
    private $isExternal;


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
     * Set fullName
     *
     * @param string $fullName
     * @return Clients
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;

        return $this;
    }

    /**
     * Get fullName
     *
     * @return string 
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set identificationNumber
     *
     * @param integer $identificationNumber
     * @return Clients
     */
    public function setIdentificationNumber($identificationNumber)
    {
        $this->identificationNumber = $identificationNumber;

        return $this;
    }

    /**
     * Get identificationNumber
     *
     * @return integer 
     */
    public function getIdentificationNumber()
    {
        return $this->identificationNumber;
    }

    /**
     * Set isExternal
     *
     * @param boolean $isExternal
     * @return Clients
     */
    public function setIsExternal($isExternal)
    {
        $this->isExternal = $isExternal;

        return $this;
    }

    /**
     * Get isExternal
     *
     * @return boolean 
     */
    public function getIsExternal()
    {
        return $this->isExternal;
    }


    /**
     * @ORM\OneToOne(targetEntity="Persons")
     * @ORM\JoinColumn(name="person_id", referencedColumnName="id")
     */
    private $person_id;

    public function getPersonId(){
        return $this->person_id;
    }

    /**
     * @ORM\OneToMany(targetEntity="Persons", mappedBy="client", cascade={"all"}, orphanRemoval=true)
     */
    protected $personInfo;

    public function __construct()
    {
        $this->personInfo = new ArrayCollection();
    }

    /**
     * Add personInfo
     *
     * @param Persons $personInfo
     */
    public function addPersonInfo(Persons $personInfo){
        $this->personInfo = $personInfo;
    }

    /**
     * Get personInfo
     *
     * @return Persons
     */
    public function getPersonInfo2(){
        //return $this->personInfo;
        $result = 'test';
        foreach($this->personInfo as $p_info){
            $result = $p_info->getFirstName();
        }
        return $result;
    }


    /**
     * Get personInfo
     *
     * @throws \Exception
     * @return Persons
     */
    public function getPersonInfo(){
        if($this->personInfo->count() > 1)
        {
            throw new \Exception('Fatal. DB corruption detected. More than one person-extension to current client-record.', 500);
        }
        return $this->personInfo;
    }

    public function getAll()
    {
        return array(
            'id' => $this->getId(),
            'full_name' => $this->getFullName(),
            'identification_number' => $this->getIdentificationNumber(),
            'is_external' => $this->getIsExternal(),
            'person_id' => $this->getPersonId()->getFirstName(), //Lazy loading!
            'person' => $this->getPersonInfo()->last()->getMain(),
        );
    }
}

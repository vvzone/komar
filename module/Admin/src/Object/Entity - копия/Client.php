<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
/**
 * Client
 *
 * @ORM\Table(name="client")
 * @ORM\Entity
 */
class Client
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
     * @ORM\Column(name="full_name", type="text", nullable=false)
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
     * @ORM\OneToMany(targetEntity="Object\Entity\Person", mappedBy="client", cascade={"all"}, orphanRemoval=true)
     */
    protected $personInfo;

    /**
     * Only if has Unit-extension!
     * @ORM\OneToMany(targetEntity="Object\Entity\Unit", mappedBy="client", cascade={"all"}, orphanRemoval=true)
     */
    protected $unitInfo;

    public function __construct()
    {
        $this->personInfo = new ArrayCollection();
        $this->unitInfo = new ArrayCollection();
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
     * Set fullName
     *
     * @param string $fullName
     * @return Client
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
     * @return Client
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
     * @return Client
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
     * Get personInfo
     *
     * @throws \Exception
     * @return Person
     */
    public function getPersonInfo(){
        if($this->personInfo->count() > 1)
        {
            throw new \Exception('Fatal. DB corruption detected. More than one unit-extension to current client-record. unitInfo->count='.$this->unitInfo->count(), 500);
        }
        $person = $this->personInfo->last();
        if($person){
            return $person->getPlain();
        }
        return null;
    }

    /**
     * Get unitInfo
     * Only if Client is a Unit
     *
     * @throws \Exception
     * @return Unit
     */
    public function getUnitInfo(){
        if($this->unitInfo->count() > 1)
        {
            throw new \Exception('Fatal. DB corruption detected. More than one unit-extension to current client-record. unitInfo->count='.$this->unitInfo->count(), 500);
        }
        $unit = $this->unitInfo->last();
        if($unit){
            return $unit->getPlain();
        }
        //return null;

        //2-do
        return $this->unitInfo->last();
    }

    public function getAll()
    {
        return array(
            'id' => $this->getId(),
            'full_name' => $this->getFullName(),
            'identification_number' => $this->getIdentificationNumber(),
            'is_external' => $this->getIsExternal(),
            //'person_id' => $this->getPersonId()->getFirstName(), //Lazy loading!
            'person' => $this->getPersonInfo(),
            'unit' => $this->getUnitInfo()
        );
    }

    public function getClientSimple(){
        /*$name = null;
        if($this->getPerson()){
            $name = $this->getPerson()->getFIO();
        }
        if($this->getUnit()){
            $name = $this->getUnit()->getName();
        }*/
        return array(
            'id' => $this->getId(),
            'name' => $this->getFullName()
        );
    }
}

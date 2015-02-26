<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

use Object\InputFilter\AddressTypeFilter;

/**
 * AddressType
 *
 * @ORM\Table(name="address_type")
 * @ORM\Entity(repositoryClass="Object\Repository\AddressType")
 */
class AddressType extends Filtered
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
     * @var integer
     *
     * @ORM\Column(name="priotity", type="integer", nullable=true)
     */
    private $priotity;



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
     * @return AddressType
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
     * Set priotity
     *
     * @param integer $priotity
     * @return AddressType
     */
    public function setPriotity($priotity)
    {
        $this->priotity = $priotity;

        return $this;
    }

    /**
     * Get priotity
     *
     * @return integer 
     */
    public function getPriotity()
    {
        return $this->priotity;
    }

    protected $inputFilter;

    public function setInputFilter(){
        $filter = new AddressTypeFilter();
        $filter->init();
        $this->inputFilter = $filter;
    }

    /**
     * @return \Object\InputFilter\PostFilter
     */
    public function getInputFilter(){
        if(!$this->inputFilter){
            $this->setInputFilter();
        }
        return $this->inputFilter;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'priotiry' => $this->getPriotity()
        );
    }
}

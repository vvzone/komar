<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Region
 *
 * @ORM\Table(name="region", indexes={@ORM\Index(name="fk_Region_region_type_idx", columns={"region_type_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\RegionRepository")
 */
class Region extends Filtered
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
     * @ORM\Column(name="code", type="integer", nullable=false)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", length=16777215, nullable=true)
     */
    private $description;

    /**
     * @var \Object\Entity\RegionType
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\RegionType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="region_type_id", referencedColumnName="id")
     * })
     */
    private $regionType;

    /**
     * Set id
     *
     * @param integer $id
     * @return Region
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
     * Set name
     *
     * @param string $name
     * @return Region
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
     * Set code
     *
     * @param integer $code
     * @return Region
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return integer 
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Region
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
     * Set regionType
     *
     * @param \Object\Entity\RegionType $regionType
     * @return Region
     */
    public function setRegionType(\Object\Entity\RegionType $regionType)
    {
        $this->regionType = $regionType;

        return $this;
    }

    /**
     * Get regionType
     *
     * @return \Object\Entity\RegionType 
     */
    public function getRegionType()
    {
        return $this->regionType;
    }

    public function getRegionTypeObj(){
        return $this->regionType->getAll();
    }

    public function getRegionSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName()
        );
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'code' => $this->getCode(),
            'description' => $this->getDescription(),
            'region_type' => $this->getRegionTypeObj()
        );
    }
}

<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Address
 *
 * @ORM\Table(name="address", indexes={@ORM\Index(name="fk_address_address_type1_idx", columns={"address_type_id"}), @ORM\Index(name="fk_address_region1_idx", columns={"region_id"}), @ORM\Index(name="fk_address_location_type1_idx", columns={"location_type_id"}), @ORM\Index(name="fk_address_street_type1_idx", columns={"street_type_id"})})
 * @ORM\Entity
 */
class Address
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
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="datetime", nullable=true)
     */
    private $startDate;

    /**
     * @var string
     *
     * @ORM\Column(name="address", type="text", length=16777215, nullable=true)
     */
    private $address;

    /**
     * @var string
     *
     * @ORM\Column(name="post_code", type="string", length=45, nullable=true)
     */
    private $postCode;

    /**
     * @var integer
     *
     * @ORM\Column(name="is_main", type="integer", nullable=true)
     */
    private $isMain;

    /**
     * @var string
     *
     * @ORM\Column(name="area", type="string", length=45, nullable=true)
     */
    private $area;

    /**
     * @var string
     *
     * @ORM\Column(name="location", type="string", length=45, nullable=true)
     */
    private $location;

    /**
     * @var string
     *
     * @ORM\Column(name="street", type="string", length=45, nullable=true)
     */
    private $street;

    /**
     * @var integer
     *
     * @ORM\Column(name="house", type="integer", nullable=true)
     */
    private $house;

    /**
     * @var string
     *
     * @ORM\Column(name="house_suffix", type="string", length=3, nullable=true)
     */
    private $houseSuffix;

    /**
     * @var integer
     *
     * @ORM\Column(name="building", type="integer", nullable=true)
     */
    private $building;

    /**
     * @var integer
     *
     * @ORM\Column(name="flat", type="integer", nullable=true)
     */
    private $flat;

    /**
     * @var integer
     *
     * @ORM\Column(name="post_box", type="integer", nullable=true)
     */
    private $postBox;

    /**
     * @var \Object\Entity\AddressType
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\AddressType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="address_type_id", referencedColumnName="id")
     * })
     */
    private $addressType;

    /**
     * @var \Object\Entity\LocationType
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\LocationType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="location_type_id", referencedColumnName="id")
     * })
     */
    private $locationType;

    /**
     * @var \Object\Entity\Region
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Region")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="region_id", referencedColumnName="id")
     * })
     */
    private $region;

    /**
     * @var \Object\Entity\StreetType
     *
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\StreetType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="street_type_id", referencedColumnName="id")
     * })
     */
    private $streetType;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Client", mappedBy="address")
     */
    private $client;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->client = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Set id
     *
     * @param integer $id
     * @return Address
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
     * Set startDate
     *
     * @param \DateTime $startDate
     * @return Address
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
     * Set address
     *
     * @param string $address
     * @return Address
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string 
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set postCode
     *
     * @param string $postCode
     * @return Address
     */
    public function setPostCode($postCode)
    {
        $this->postCode = $postCode;

        return $this;
    }

    /**
     * Get postCode
     *
     * @return string 
     */
    public function getPostCode()
    {
        return $this->postCode;
    }

    /**
     * Set isMain
     *
     * @param integer $isMain
     * @return Address
     */
    public function setIsMain($isMain)
    {
        $this->isMain = $isMain;

        return $this;
    }

    /**
     * Get isMain
     *
     * @return integer 
     */
    public function getIsMain()
    {
        return $this->isMain;
    }

    /**
     * Set area
     *
     * @param string $area
     * @return Address
     */
    public function setArea($area)
    {
        $this->area = $area;

        return $this;
    }

    /**
     * Get area
     *
     * @return string 
     */
    public function getArea()
    {
        return $this->area;
    }

    /**
     * Set location
     *
     * @param string $location
     * @return Address
     */
    public function setLocation($location)
    {
        $this->location = $location;

        return $this;
    }

    /**
     * Get location
     *
     * @return string 
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set street
     *
     * @param string $street
     * @return Address
     */
    public function setStreet($street)
    {
        $this->street = $street;

        return $this;
    }

    /**
     * Get street
     *
     * @return string 
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * Set house
     *
     * @param integer $house
     * @return Address
     */
    public function setHouse($house)
    {
        $this->house = $house;

        return $this;
    }

    /**
     * Get house
     *
     * @return integer 
     */
    public function getHouse()
    {
        return $this->house;
    }

    /**
     * Set houseSuffix
     *
     * @param string $houseSuffix
     * @return Address
     */
    public function setHouseSuffix($houseSuffix)
    {
        $this->houseSuffix = $houseSuffix;

        return $this;
    }

    /**
     * Get houseSuffix
     *
     * @return string 
     */
    public function getHouseSuffix()
    {
        return $this->houseSuffix;
    }

    /**
     * Set building
     *
     * @param integer $building
     * @return Address
     */
    public function setBuilding($building)
    {
        $this->building = $building;

        return $this;
    }

    /**
     * Get building
     *
     * @return integer 
     */
    public function getBuilding()
    {
        return $this->building;
    }

    /**
     * Set flat
     *
     * @param integer $flat
     * @return Address
     */
    public function setFlat($flat)
    {
        $this->flat = $flat;

        return $this;
    }

    /**
     * Get flat
     *
     * @return integer 
     */
    public function getFlat()
    {
        return $this->flat;
    }

    /**
     * Set postBox
     *
     * @param integer $postBox
     * @return Address
     */
    public function setPostBox($postBox)
    {
        $this->postBox = $postBox;

        return $this;
    }

    /**
     * Get postBox
     *
     * @return integer 
     */
    public function getPostBox()
    {
        return $this->postBox;
    }

    /**
     * Set addressType
     *
     * @param \Object\Entity\AddressType $addressType
     * @return Address
     */
    public function setAddressType(\Object\Entity\AddressType $addressType)
    {
        $this->addressType = $addressType;

        return $this;
    }

    /**
     * Get addressType
     *
     * @return \Object\Entity\AddressType 
     */
    public function getAddressType()
    {
        return $this->addressType;
    }

    /**
     * Set locationType
     *
     * @param \Object\Entity\LocationType $locationType
     * @return Address
     */
    public function setLocationType(\Object\Entity\LocationType $locationType)
    {
        $this->locationType = $locationType;

        return $this;
    }

    /**
     * Get locationType
     *
     * @return \Object\Entity\LocationType 
     */
    public function getLocationType()
    {
        return $this->locationType;
    }

    /**
     * Set region
     *
     * @param \Object\Entity\Region $region
     * @return Address
     */
    public function setRegion(\Object\Entity\Region $region)
    {
        $this->region = $region;

        return $this;
    }

    /**
     * Get region
     *
     * @return \Object\Entity\Region 
     */
    public function getRegion()
    {
        return $this->region;
    }

    /**
     * Set streetType
     *
     * @param \Object\Entity\StreetType $streetType
     * @return Address
     */
    public function setStreetType(\Object\Entity\StreetType $streetType)
    {
        $this->streetType = $streetType;

        return $this;
    }

    /**
     * Get streetType
     *
     * @return \Object\Entity\StreetType 
     */
    public function getStreetType()
    {
        return $this->streetType;
    }

    /**
     * Add client
     *
     * @param \Object\Entity\Client $client
     * @return Address
     */
    public function addClient(\Object\Entity\Client $client)
    {
        $this->client[] = $client;

        return $this;
    }

    /**
     * Remove client
     *
     * @param \Object\Entity\Client $client
     */
    public function removeClient(\Object\Entity\Client $client)
    {
        $this->client->removeElement($client);
    }

    /**
     * Get client
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getClient()
    {
        return $this->client;
    }
}

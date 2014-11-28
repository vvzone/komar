<?php

namespace Object\Model;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;



/**
 * Person
 *
 * @ORM\Table(name="persons")
 * @ORM\Entity
 */
class Person{

    /**
     * @var int
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * Get id.
     *
     * @return integer
     */
    public function getId(){
        return $this->id;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $first_name;

    /**
     * Set first_name.
     *
     * @param string $first_name
     *
     * @return void
     */
    public function setFirstName($first_name){
        $this->first_name = $first_name;
    }

    /**
     * Get first_name.
     *
     * @return string
     */
    public function getFirstName(){
        return $this->first_name;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $patronymic_name;

    /**
     * Set patronymic_name.
     *
     * @param string $patronymic_name
     *
     * @return void
     */
    public function setPatronymicName($patronymic_name){
        $this->patronymic_name = $patronymic_name;
    }

    /**
     * Get patronymic_name.
     *
     * @return string
     */
    public function getPatronymicName(){
        return $this->patronymic_name;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $family_name;

    /**
     * Set family_name.
     *
     * @param string $family_name
     *
     * @return void
     */
    public function setFamilyName($family_name){
        $this->family_name = $family_name;
    }

    /**
     * Get family_name.
     *
     * @return string
     */
    public function getFamilyName(){
        return $this->family_name;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $birth_date;

    /**
     * Set birth_date.
     *
     * @param string $birth_date
     *
     * @return void
     */
    public function setBirthDate($birth_date){
        $this->birth_date = $birth_date;
    }

    /**
     * Get birth_date.
     *
     * @return string
     */
    public function getBirthDate(){
        return $this->birth_date;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $birth_place;

    /**
     * Set birth_place.
     *
     * @param string $birth_place
     *
     * @return void
     */
    public function setBirthPlace($birth_place){
        $this->birth_place = $birth_place;
    }

    /**
     * Get birth_place.
     *
     * @return string
     */
    public function getBirthPlace(){
        return $this->birth_place;
    }

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $sex;

    /**
     * Set sex.
     *
     * @param integer $sex
     *
     * @return void
     */
    public function setSex($sex){
        $this->sex = $sex;
    }

    /**
     * Get sex.
     *
     * @return integer
     */
    public function getSex(){
        return $this->sex;
    }

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $inn;

    /**
     * Set inn.
     *
     * @param integer $inn
     *
     * @return void
     */
    public function setInn($inn){
        $this->inn = $inn;
    }

    /**
     * Get inn.
     *
     * @return integer
     */
    public function getInn(){
        return $this->inn;
    }

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $citizenship;

    /**
     * Set citizenship.
     *
     * @param string $citizenship
     *
     * @return void
     */
    public function setCitizenship($citizenship){
        $this->citizenship = $citizenship;
    }

    /**
     * Get citizenship.
     *
     * @return string
     */
    public function getCitizenship(){
        return $this->citizenship;
    }

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $deputy;

    /**
     * Set deputy.
     *
     * @param integer $deputy
     *
     * @return void
     */
    public function setDeputy($deputy){
        $this->deputy = $deputy;
    }

    /**
     * Get deputy.
     *
     * @return integer
     */
    public function getDeputy(){
        return $this->deputy;
    }



    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $person_post; // -> person_post.id

    /**
     * Set person_post.
     *
     * @param integer $person_post
     *
     * @return void
     */
    public function setPersonPost($person_post){
        $this->person_post = $person_post;
    }

    /**
     * Get person_post.
     *
     * @return integer
     */
    public function getPersonPost(){
        return $this->person_post;
    }


    public function exchangeArray($data)
    {
        //var_dump($data);
        $this->id     = (isset($data['id'])) ? $data['id'] : null;;
        $this->first_name = (isset($data['first_name'])) ? $data['first_name'] : null;
        $this->patronymic_name  = (isset($data['patronymic_name'])) ? $data['patronymic_name'] : null;
        $this->family_name  = (isset($data['family_name'])) ? $data['family_name'] : null;
        $this->birth_date  = (isset($data['birth_date'])) ? $data['birth_date'] : null;
        $this->birth_place  = (isset($data['birth_place'])) ? $data['birth_place'] : null;
        $this->sex  = (isset($data['sex'])) ? $data['sex'] : null;
        $this->inn  = (isset($data['inn'])) ? $data['inn'] : null;
        $this->citizenship  = (isset($data['citizenship'])) ? $data['citizenship'] : null;
        $this->deputy  = (isset($data['deputy'])) ? $data['deputy'] : null;

        $this->person_post  = (isset($data['person_post'])) ? $data['person_post'] : null;
    }

    public function get_name(){
        return $this->first_name;
    }
}
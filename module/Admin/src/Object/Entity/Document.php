<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Document
 *
 * @ORM\Table(name="document", indexes={@ORM\Index(name="fk_document_persons1_idx", columns={"document_author_id"}), @ORM\Index(name="fk_document_document_type1_idx", columns={"document_type_id"}), @ORM\Index(name="fk_document_node_level1_idx", columns={"current_node_level_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\Document")
 */
class Document extends Filtered
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
     * @ORM\Column(name="name", type="string", length=64, nullable=true)
     */
    private $name;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date", nullable=true)
     */
    private $date;
    /**
     * @var string
     *
     * @ORM\Column(name="document_number", type="string", length=45, nullable=true)
     */
    private $documentNumber;

    /**
     * @var \Object\Entity\Person
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Person")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_author_id", referencedColumnName="id")
     * })
     */
    private $documentAuthor;

    /**
     * @var \Object\Entity\DocumentType
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\DocumentType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="document_type_id", referencedColumnName="id")
     * })
     */
    private $documentType;

    /*
     * @var \Object\Entity\NodeLevel
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\NodeLevel")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="current_node_level_id", referencedColumnName="id")
     * })
     */

    /**
     * @var \Object\Entity\NodeLevel
     *
     * @ORM\OneToOne(targetEntity="Object\Entity\NodeLevel")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="current_node_level_id", referencedColumnName="id")
     * })
     */
    private $currentNodeLevel;


    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * Запрос к Node_Level_Type -> вычисление через Node_Level_
     */
    private $availableNodes;

    /*
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\LinkedDocument", inversedBy="document")
     * @ORM\JoinTable(name="document_has_linked_document",
     *   joinColumns={
     *     @ORM\JoinColumn(name="document_id", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="linked_document_id", referencedColumnName="id")
     *   }
     * )
     */
    private $linkedDocument;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Object\Entity\Route", mappedBy="document")
     */
    private $route;


    /**
     *
     * @ORM\OneToMany(targetEntity="Object\Entity\DocumentAttribute", mappedBy="document")
     */
    private $documentAttributes;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->linkedDocument = new \Doctrine\Common\Collections\ArrayCollection();
        $this->route = new \Doctrine\Common\Collections\ArrayCollection();
        $this->documentAttributes = new \Doctrine\Common\Collections\ArrayCollection();
    }


    /**
     * Set id
     *
     * @param integer $id
     * @return Document
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
     * Set Name
     *
     * @param string $name
     * @return Document
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get Name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set Date
     *
     * @param \DateTime $date
     * @return Document
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get Date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date->format('d.m.Y');
    }

    /**
     * Set documentNumber
     *
     * @param string $documentNumber
     * @return Document
     */
    public function setDocumentNumber($documentNumber)
    {
        $this->documentNumber = $documentNumber;

        return $this;
    }

    /**
     * Get documentNumber
     *
     * @return string 
     */
    public function getDocumentNumber()
    {
        return $this->documentNumber;
    }

    /**
     * Set documentAuthor
     *
     * @param \Object\Entity\Person $documentAuthor
     * @return Document
     */
    public function setDocumentAuthor(\Object\Entity\Person $documentAuthor)
    {
        $this->documentAuthor = $documentAuthor;

        return $this;
    }

    /**
     * Get documentAuthor
     *
     * @return \Object\Entity\Person 
     */
    public function getDocumentAuthor()
    {
        //return $this->documentAuthor;

        return $this->documentAuthor;
    }

    /**
     * Set documentType
     *
     * @param \Object\Entity\DocumentType $documentType
     * @return Document
     */
    public function setDocumentType(\Object\Entity\DocumentType $documentType)
    {
        $this->documentType = $documentType;

        return $this;
    }

    /**
     * Get documentType
     *
     * @return \Object\Entity\DocumentType 
     */
    public function getDocumentType()
    {
        return $this->documentType;
        //return $this->documentType->getName();
        //return $this->documentType->getAll();
    }

    public function getDocumentTypeName(){
        return $this->documentType->getName();
    }

    /**
     * Set currentNodeLevel
     *
     * @param \Object\Entity\NodeLevel $currentNodeLevel
     * @return Document
     */
    public function setCurrentNodeLevel(\Object\Entity\NodeLevel $currentNodeLevel)
    {
        $this->currentNodeLevel = $currentNodeLevel;

        return $this;
    }

    /**
     * Get currentNodeLevel
     *
     * @return \Object\Entity\NodeLevel 
     */
    public function getCurrentNodeLevel()
    {
        return $this->currentNodeLevel;
    }

    /**
     * Add linkedDocument
     *
     * @param \Object\Entity\LinkedDocument $linkedDocument
     * @return Document
     */
    public function addLinkedDocument(\Object\Entity\LinkedDocument $linkedDocument)
    {
        $this->linkedDocument[] = $linkedDocument;

        return $this;
    }

    /**
     * Remove linkedDocument
     *
     * @param \Object\Entity\LinkedDocument $linkedDocument
     */
    public function removeLinkedDocument(\Object\Entity\LinkedDocument $linkedDocument)
    {
        $this->linkedDocument->removeElement($linkedDocument);
    }

    /**
     * Get linkedDocument
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getLinkedDocument()
    {
        return $this->linkedDocument;
    }

    /**
     * Add route
     *
     * @param \Object\Entity\Route $route
     * @return Document
     */
    public function addRoute(\Object\Entity\Route $route)
    {
        $this->route[] = $route;

        return $this;
    }

    /**
     * Remove route
     *
     * @param \Object\Entity\Route $route
     */
    public function removeRoute(\Object\Entity\Route $route)
    {
        $this->route->removeElement($route);
    }

    /**
     * Get route
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getRoute()
    {
        return $this->route;
    }

    /**
     * @param \Object\Entity\DocumentAttribute $attribute;
     *
     * @return Document;
     */
    public function addDocumentAttributes($attribute){
        $this->documentAttributes[] = $attribute;
        return $this;
    }

    /**
     * remove DocumentAttribute
     *
     * @param \Object\Entity\DocumentAttribute $attribute
     */
    public function removeDocumentAttributes($attribute){
        $this->documentAttributes->removeElement($attribute);
    }

    public function getDocumentAttributes(){
        //return $this->documentAttributes;
        $attributes = array();
        foreach($this->documentAttributes as $attribute){
            $attributes[$attribute->getId()] = array(
                'id' => $attribute->getId(),
                'type' => $attribute->getAttributeType()->getMachineName(),
                'data' => $attribute->getData()
            );
        }
        return $attributes;
    }
    public function getDocumentName(){
        $type = $this->getDocumentTypeName();
        $date = ' от '.$this->getDate();
        $attribute_name = '"'.$this->getName().'"';
        $name = $type.' '.$date.' '.$attribute_name;
        return $name;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            'generated_name' => $this->getDocumentName(),
            'name' => $this->getName(),
            'document_name' => $this->getName(),
            'date' => $this->getDate(),
            'document_author' => $this->getDocumentAuthor()->getFIO(),
            'document_type' => $this->getDocumentType()->getAll(),
            'secrecy_type' => $this->getDocumentType()->getSecrecyType(),
            'urgency_type' => $this->getDocumentType()->getUrgencyType(),
            'document_attributes' => $this->getDocumentAttributes(),
            'current_node' => $this->getCurrentNodeLevel()->getName()
        );
    }

    public function getDocumentSimple(){
        return array(
            'id' => $this->getId(),
            'name' => $this->getName(),
            'date' => $this->getDate()
        );
    }
}

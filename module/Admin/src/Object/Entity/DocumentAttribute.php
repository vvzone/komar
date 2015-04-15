<?php

namespace Object\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DocumentAttribute
 *
 * @ORM\Table(name="document_attribute", indexes={@ORM\Index(name="fk_Document_Attribute_Document1_idx", columns={"document_id"}), @ORM\Index(name="fk_Document_Attribute_ Attribute_Type1_idx", columns={"attribute_type_id"}), @ORM\Index(name="fk_document_attribute_persons1_idx", columns={"author_id"})})
 * @ORM\Entity(repositoryClass="Object\Repository\DocumentAttribute")
 */
class DocumentAttribute extends Filtered
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="array_index", type="integer", nullable=true)
     */
    private $arrayIndex;

    /**
     * @var string
     *
     * @ORM\Column(name="data", type="text", nullable=true)
     */
    private $data;



    /**
     * @var \Object\Entity\Person
     *
     * ORM\Id
     * ORM\GeneratedValue(strategy="NONE")
     * @ORM\OneToOne(targetEntity="Object\Entity\Person")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     * })
     */
    private $author;



    /**
     * Set id
     *
     * @param integer $id
     * @return DocumentAttribute
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
     * Set arrayIndex
     *
     * @param integer $arrayIndex
     * @return DocumentAttribute
     */
    public function setArrayIndex($arrayIndex)
    {
        $this->arrayIndex = $arrayIndex;

        return $this;
    }

    /**
     * Get arrayIndex
     *
     * @return integer
     */
    public function getArrayIndex()
    {
        return $this->arrayIndex;
    }

    /**
     * Set data
     *
     * @param string $data
     * @return DocumentAttribute
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get data
     *
     * @return string
     */
    public function getData()
    {
        return $this->data;
    }


    /**
     * Set author
     *
     * @param \Object\Entity\Person $author
     * @return DocumentAttribute
     */
    public function setAuthor(\Object\Entity\Person $author)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return \Object\Entity\Person
     */
    public function getAuthor()
    {
        if($this->author){
            return $this->author->getBigFIO();
        }
        return $this->author;
    }

    public function getAll(){
        return array(
            'id' => $this->getId(),
            //'composite_attribute_id' => $this->getCompositeAttributeId(),
            'array_index' => $this->getArrayIndex(),
            'data' => $this->getData(),
            //'attribute_type' => $this->getAttributeType()->getMachineName(),
            'author' => $this->getAuthor()
        );
    }
}

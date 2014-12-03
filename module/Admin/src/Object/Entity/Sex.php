<?php

namespace Object\\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Sex
 *
 * @ORM\Table(name="sex")
 * @ORM\Entity
 */
class Sex
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
     * @var string
     *
     * @ORM\Column(name="short_name", type="string", length=5, nullable=false)
     */
    private $shortName;


}

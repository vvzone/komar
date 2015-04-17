<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Object\Controller;

use Admin\Controller\RestController;
use Zend\View\Model\JsonModel;

use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Object\Entity\CurrentDocumentType;

use Object\Entity\DocumentAttribute;
use Object\Entity\DocumentAttributeCollection;

use Object\Entity\AttributeType;
use Object\Entity\AttributeTypeCollection;


class CurrentDocumentTypeController extends RestController
{
    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('CurrentDocumentTypeRESTListPagination');
        return $result;
    }

    public function get($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');
        $object = $objectManager->find('Object\Entity\CurrentDocumentType', $id);
        return $this->getOutput($object);
    }

    public function create($data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\CurrentDocumentType');
        $data = $this->RESTtoCamelCase($data);


        $CurrentDocumentType = new CurrentDocumentType();
        $CurrentDocumentType = $hydrator->hydrate($data, $CurrentDocumentType);



        //$DocumentType =  $objectManager->find('Object\Entity\DocumentType', $CurrentDocumentType->getDocumentType);

        $DocumentType =  $CurrentDocumentType->getDocumentType();


        $ATC_collection =  $DocumentType->getAttributeTypeCollection();





        $ATC_collection2 = array();
        foreach($ATC_collection as $ATC){


            /*
            $ATC_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\AttributeTypeCollection');
            $DAC_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\DocumentAttributeCollection');
            $DAC = new DocumentAttributeCollection();

            $da_data = $ATC_hydrator->extract($ATC);

            $da_data['attribute_type_collection_id'] = $da_data['id'];
            $da_data['id'] = null; //reset id

            //unset($da_data['attribute_id']);
            $DAC = $DAC_hydrator->hydrate($da_data, $DAC);

            $DA = new DocumentAttribute();
            $DA->setAuthor(5); //Temporary!

            //$objectManager->persist($DA);
            //$objectManager->flush();

            //$DAC->addDocumentAttribute($DA);

            $objectManager->persist($DAC);

            $objectManager->flush(); //все скопом
            */

            $ATC_collection2[] = $ATC;
        }




        //$data = array('id' => $Object->getId());
        $data = $hydrator->extract($CurrentDocumentType);


        $objectManager->persist($CurrentDocumentType);
        $objectManager->flush();


        $result = $data;
        return (
            new JsonModel(
                array(
                    'result' => $result,
                    //'document_type' => $DocumentType->getAll(),
                    //'attribute_type_collection' => $DocumentType->getAttributeTypeCollection(),
                    'ATC' => $ATC_collection2
                )
            )
        );
        ///return $this->getOutput($result);
    }

    public function update($id, $data)
    {
        $serviceLocator = $this
            ->getServiceLocator();

        $result = $serviceLocator->get('CurrentDocumentTypeRESTAPICreate');
        return $result;
    }

    public function delete($id)
    {
        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $object = $objectManager->find('Object\Entity\CurrentDocumentType', $id);
        $objectManager->remove($object);
        $objectManager->flush();

        return new JsonModel(array(
            'data' => 'deleted',
        ));
    }
}
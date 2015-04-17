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

use Object\Entity\Route;
use Object\Entity\NodeLevel;
use Object\Entity\Node;

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

    public function createDacFromAtc($objectManager, $ATC){

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



            //$this->createDacFromAtc($objectManager, $ATC);

            $ATC_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\AttributeTypeCollection');
            $DAC_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\DocumentAttributeCollection');
            $DAC = new DocumentAttributeCollection();

            //$AttributeTypeCollection = new AttributeTypeCollection();

            //$da_data = $ATC_hydrator->extract($ATC);
            $dac_data = $ATC;

            $dac_data['attribute_type_collection_id'] = $dac_data['id'];
            $dac_data['id'] = null; //reset id

            $DAC = $DAC_hydrator->hydrate($dac_data, $DAC);


            $DA = new DocumentAttribute();
            $DA_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\DocumentAttribute');
            $da_data = array(
                'author' => 5 //Temporary!
            );
            $DA = $DA_hydrator->hydrate($da_data, $DA);

            $DA->setDocumentAttributeCollection($DAC);

            $objectManager->persist($DA);

            $AttributeTypeCollection = new AttributeTypeCollection();
            $ATC = $ATC_hydrator->hydrate($ATC, $AttributeTypeCollection);
            $DAC->setAttributeTypeCollection($ATC);
            $DAC->addDocumentAttribute($DA);

            $objectManager->persist($DAC);


            //$ATC_collection2[] = $dac_data;
           //$ATC_collection2[] = $ATC->getAll();
            $ATC_collection3[] = $DAC->getAll(); //test

            $CurrentDocumentType->addDac($DAC);
        }



        /* --- Создание Роута по прототипу --- */

        $RoutePrototype = $DocumentType->getRoute();

        $RoutePrototypeLevels = $RoutePrototype['node_level'];

        $route_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\Route');
        $CurrentRoute = new Route();

        $RoutePrototypePreparedData = $RoutePrototype;
        $RoutePrototypePreparedData['prototype_route_id'] = $RoutePrototypePreparedData['id'];

        $RoutePrototypePreparedData['id'] = null;

        $CurrentRoute = $route_hydrator->hydrate($RoutePrototypePreparedData, $CurrentRoute);

        $current_node_levels = array(); //REMOVE!!!
        $what_hydrated = array(); //REMOVE!!!
        //check

        if($RoutePrototypeLevels){
            foreach($RoutePrototypeLevels as $NodeLevelPrototype){
                $CurrentNodeLevel = new NodeLevel;
                $node_level_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\NodeLevel');

                //unset($NodeLevelPrototype['id']);
                $NodeLevelPrototype['id'] = null;
                $NodeLevelPrototype['route'] = null;

                $NodeLevelPrototype['nodeLevelType'] = $NodeLevelPrototype['node_level_type'];
                unset($NodeLevelPrototype['node_level_type']);
                $NodeLevelPrototype['levelOrder'] = $NodeLevelPrototype['level_order'];
                unset($NodeLevelPrototype['level_order']);

                $what_hydrated[] = $NodeLevelPrototype; //REMOVE!!!

                $CurrentNodeLevel = $node_level_hydrator->hydrate($NodeLevelPrototype, $CurrentNodeLevel);

                //$CurrentNodeLevel->setNodeLevelType();

                $CurrentNodeLevel->setRoute($CurrentRoute);

                $current_node_levels[] = $CurrentNodeLevel->getAll(); //REMOVE!!!

                /* --- Создание Нод из прототипа ---*/
                $NodeLevelPrototypeNodes = $NodeLevelPrototype['nodes'];


                if($NodeLevelPrototypeNodes){
                    //check
                    foreach($NodeLevelPrototypeNodes as $NodePrototype){
                        $CurrentNode = new Node();
                        $node_hydrator = new DoctrineHydrator($objectManager, 'Object\Entity\Node');

                        unset($NodePrototype['id']);
                        unset($NodePrototype['node_level_id']);
                        unset($NodePrototype['time_stamp']);

                        $CurrentNode = $node_hydrator->hydrate($NodePrototype, $CurrentNode);
                        $CurrentNode->setNodeLevel($CurrentNodeLevel);

                        $date = new \DateTime();
                        $CurrentNode->setTimeStamp($date->getTimestamp());

                        //$objectManager->persist($CurrentNode);
                        $CurrentNodeLevel->addNode($CurrentNode);
                    }
                }

                $CurrentRoute->addNodeLevel($CurrentNodeLevel);
                //$objectManager->persist($CurrentNodeLevel);
            }
        }

        //$objectManager->persist($CurrentRoute);
        $CurrentDocumentType->addRoute($CurrentRoute);

        //$data = array('id' => $Object->getId());
        //$data = $hydrator->extract($CurrentDocumentType);


        $objectManager->persist($CurrentDocumentType);
        $objectManager->flush();


        $result = $data;
        return (
            new JsonModel(
                array(
                    //'result' => $result,
                    //'document_type' => $DocumentType->getAll(),
                    //'attribute_type_collection' => $DocumentType->getAttributeTypeCollection(),
                    //'ATC' => $ATC_collection,
                    //'ATC2' => $ATC_collection2,
                    //'ATC3' => $ATC_collection3
                    //'CDT' => $CurrentDocumentType->getAll()
                    'Route Prototype' => $RoutePrototype,
                    'Current Route' => $CurrentRoute->getAll(),
                    //'current_node_levels' => $current_node_levels,
                    //'what_hydrated' => $what_hydrated
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
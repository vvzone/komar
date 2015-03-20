<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Client\Controller;

//use Zend\Mvc\Controller\AbstractActionController;\
use Object\Entity\Document;
use Object\Entity\Post;

use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

use Zend\EventManager\EventManagerInterface;
use Admin\Controller\RestController;


class InboxController extends RestController
{
    protected $documentTable;
    protected $documentTableList;

    /*-------------- default methods ----------*/

    public function getList()
    {
        $serviceLocator = $this
            ->getServiceLocator();
        $result = $serviceLocator->get('InboxMessagesTablePaginated');
        return $result;
    }

    public function get($id)
    {
        return new JsonModel(
            array(
                'get id' => $id
            )
        );
    }

    public function create($data)
    {
        return new JsonModel(array(
            'create data' => $data
        ));
    }

    public function update($id, $data)
    {
        return new JsonModel(
            array(
                'update id' => $id
            )
        );
    }

    public function delete($id)
    {
        return new JsonModel(array(
            'delete id' => $id
        ));
    }

}
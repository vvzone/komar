<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admin\Controller;

use Zend\Json\Server\Response;

use Zend\Mvc\Controller\AbstractActionController;
use Admin\Controller\RestController;

use Zend\ServiceManager\ServiceManager;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class AuthController extends AbstractActionController
{
    public function indexAction()
    {
        $headers_old= $this->params()->fromHeader();
        $paramsPost = $this->params()->fromPost();
        $request = $this->getRequest();
        $headers = $request->getHeaders();

        //$authorization = $headers->get('Authorization')->getFieldValue();
        $response = $this->getResponse();
        $params = $request->getPost()->toArray();

        if($request->isPost()){
            //post with form data
            $params = $request->getPost()->toArray();
            $response = $this->getResponse();

            if(!isset($params['login'] ) ||!isset($params['password'])){
                $response->setStatusCode(401);
                return new JsonModel(
                    array(
                        'login-pair are not set',
                        $request->getPost()->toArray()
                    )
                );
            }

        }else{
            //get with parameters
            $params = $this->params()->fromQuery();
            $this->checkLoginPair($params);
        }

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');

        $result = $objectManager->getRepository('Object\Entity\User')->getByCredentials($params);

        /*
        return new JsonModel(
            array(
                'params' => $params,
                'user' => $user
            )
        );*/

        if($result){
            return new JsonModel(
                array(
                    $result
                )
            );
        }else{
            $response = $this->getResponse()->setStatusCode(401);
            return new JsonModel(
                array('Неправильное имя пользователя или пароль...')
            );
        }
    }


}

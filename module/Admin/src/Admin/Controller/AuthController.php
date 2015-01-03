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
        $request = $this->getRequest();
        $headers = $request->getHeaders();

        $objectManager = $this
            ->getServiceLocator()
            ->get('Doctrine\ORM\EntityManager');


        if (!$headers->has('Authorization')) {
            $response = $this->getResponse()->setStatusCode(400);
            return new JsonModel(
                array('Неправильный заголовок запроса...')
            );
        }

        $authorization = $headers->get('Authorization')->getFieldValue();

        if (strpos($authorization, 'BASE') != 0) {
            //$response = $this->getResponse()->setStatusCode(400);
            return new JsonModel(
                array(
                    'Неправильный заголовок авторизации...',
                    $authorization,
                    strpos($authorization, 'BASE'),
                    strpos('BASE YWRtaW46dGVzdA==', 'BASE')
                )
            );
        }

        $authorizationPairs = $this->extractCredentials($authorization);

        $params['login'] =  $authorizationPairs[0];
        $params['password'] = $authorizationPairs[1];

        $result = $objectManager->getRepository('Object\Entity\User')->getByCredentials($params);

        if($result){
            return new JsonModel(
                array(
                    'result' => $result
                )
            );
        }else{
            $response = $this->getResponse()->setStatusCode(401);
            return new JsonModel(
                array(
                    'Неправильное имя пользователя или пароль...' => '',
                    'login' => $params['login'],
                    'password' => $params['password'],
                    'authorizationPairs' => $authorizationPairs,
                )
            );
        }
    }

    public function extractCredentials($authorizationHeader){
        $authorizationHash = substr($authorizationHeader, 5);
        $authorization = base64_decode($authorizationHash);
        if (!preg_match('/[^\:]*\:.*/i', $authorization)) {
            //$this->_redirectInvalidRequest($request);
            return;
        }

        $authorizationParts = explode(':', $authorization);
        $username = $authorizationParts[0];
        $password = $authorizationParts[1];
        return $authorizationParts;
    }

}

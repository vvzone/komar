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
        $params = $this->params()->fromQuery();

        $request = $this->getRequest();
        $headers = $request->getHeaders();
        $authorization = $headers->get('Authorization')->getFieldValue();

        if($params['login'] == 'root' && $params['password'] == 'root'){
            $token = '832320hbewhr2384u2';
            return new JsonModel(
                array(
                    $token,
                    $authorization,
                    $request
                )
            );
        }else{
            $response = $this->getResponse()->setStatusCode(401);
            return new JsonModel(
                array('Unauthorized...')
            );
        }
    }
}

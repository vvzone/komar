<?php

namespace Object\Repository;


use \Doctrine\ORM\EntityRepository;
use \Doctrine\ORM\Query;
use \Doctrine\ORM\Query\Expr\Select;
use \Doctrine\ORM\Query\Expr\From;
use \Doctrine\ORM\Query\Expr\OrderBy;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

use Zend\Filter\Word\UnderscoreToCamelCase;
use Zend\Filter\Word\CamelCaseToUnderscore;

class PageableRepository extends EntityRepository implements ServiceLocatorAwareInterface
{
    protected $services;

    public function getCurrentEntityClass(){
        $parts       = explode('\\', get_called_class());
        $entityName  = end($parts);
        $entityClass = 'Object\\Entity\\' . $entityName;
        return $entityClass;
    }

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->services = $serviceLocator;
    }

    public function getServiceLocator()
    {
        return $this->services;
    }

    /**
     * Counts how many posts there are in the database
     *
     * @return int
     */
    public function count()
    {
        $query = $this->getEntityManager()->createQueryBuilder();
        $query->select(array('entity.id'))
            ->from($this->getCurrentEntityClass(), 'entity');

        $result = $query->getQuery()->getResult();

        return count($result);
    }

    /**
     * Returns a list of users
     *
     * @param int $offset           Offset
     * @param int $itemCountPerPage Max results
     *
     * @return array
     */
    public function getItems($offset, $itemCountPerPage)
    {
        $query = $this->getEntityManager()->createQueryBuilder();
        $query->select(array('entity.id', 'entity.name'))
            ->from($this->getCurrentEntityClass(), 'entity')
            ->setFirstResult($offset)
            ->setMaxResults($itemCountPerPage);

        $result = $query->getQuery()->getResult(Query::HYDRATE_ARRAY);
        return $result;
    }

    public function from_camel_case($input) {
        preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $input, $matches);
        $ret = $matches[0];
        foreach ($ret as &$match) {
            $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
        }
        return implode('_', $ret);
    }

    public function UnderscoreToCamelCase($k){
        if (strrpos($k, '_')) {
            $new_k = $k;
            while ($pos = strrpos($new_k, '_')) {
                $new_k = substr_replace($new_k, '', $pos, 1);
                $capitalized = strtoupper($new_k[$pos]);
                $new_k[$pos] = $capitalized;
            }
            return $new_k;
        }
        return $k;
    }

    public function objectConvert($object){
        $converted_object = array();
        foreach ($object as $prop => $result) {
            $output = $this->from_camel_case($prop);
            $converted_object[$output] = $result;
        }
        return $converted_object;
    }

    public function resultCamelConvert($result){
        $new_result = array();
        foreach($result as $key => $object){
            $new_result[$key] = $this->objectConvert($object);
        }
        return $new_result;
    }

    /* -- Sorting -- */

    public function getSortBy($requestedSortBy = null){
        $sortBy = 'id';
        if($requestedSortBy){
            $requestedSortBy = $this->UnderscoreToCamelCase($requestedSortBy);
            if(property_exists($this->getCurrentEntityClass(), $requestedSortBy)){
                $sortBy = $requestedSortBy;
            }else{
                echo 'Wrong sortBy-property='.$requestedSortBy;
            }
        }
        return 'entity.'.$sortBy;
    }

    public function getSortOrder($requestedSortOrder = null){
        $sortOrder = 'ASC';
        if($requestedSortOrder){
            switch($requestedSortOrder){
                case('desc'):
                    $sortOrder = 'DESC';
                    break;
                case('DESC'):
                    $sortOrder = 'DESC';
                    break;
                default:
                    $sortOrder = 'ASC';
                    break;
            }

        }
        return $sortOrder;
    }




}

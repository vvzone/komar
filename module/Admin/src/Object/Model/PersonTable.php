<?php

namespace Object\Model;

use Zend\Db\TableGateway\TableGateway;
use Object\Model\Person;

class PersonTable{

    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
            $resultSet = $this->tableGateway->select();
            /* --- <Paginator> ---*/
        /*  not working
            $resultSet->buffer();
            $resultSet->next();
        */
            /* --- </Paginator> --- */
            return $resultSet;
    }

    public function getPerson($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }
        return $row;
    }

    public function getPersonByClientId($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('client' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }
        return $row;
    }

    public function savePerson(Person $person)
    {
        $data = array(
            'id' => $this->id,
            'first_name' => $this->first_name,
            'patronymic_name' => $this->patronymic_name,
            'family_name' => $this->family_name,
            'birth_date' => $this->birth_date,
            'birth_place' => $this->birth_place,
            'sex' => $this->sex,
            'inn' => $this->inn,
            'citizenship' => $this->citizenship,
            'deputy' => $this->deputy,
        );

        $id = (int) $person->id;
        if ($id == 0) {
            if (!array_filter($data)) {
                throw new \Exception('Trying to save empty model', 500);
            }else{
                $this->tableGateway->insert($data);
            }
        } else {
            if ($this->getPerson($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception('Person id does not exist', 404);
            }
        }
    }

    public function deletePerson($id)
    {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}
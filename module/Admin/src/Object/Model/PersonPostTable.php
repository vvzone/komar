<?php

namespace Object\Model;

use Zend\Db\TableGateway\TableGateway;
use Object\Model\PersonPost;

class PersonPostTable{

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

    public function getPersonPost($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }
        return $row;
    }

    public function getPersonPostByClientId($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('client' => $id));
        $row = $rowset->current();
        if (!$row) {
            //throw new \Exception("Could not find row $id", 404);
            return null;
        }
        return $row;
    }

    public function savePersonPost(PersonPost $person_post)
    {
        $data = array(
            'id' => $person_post->id,
            'person' => $person_post->person,
            'unit_post' => $person_post->unit_post,
            'start_date' => $person_post->start_date,
            'stop_date' => $person_post->stop_date,
            'description' => $person_post->description
        );

        $id = (int) $person_post->id;
        if ($id == 0) {
            if (!array_filter($data)) {
                throw new \Exception('Trying to save empty model', 500);
            }else{
                $this->tableGateway->insert($data);
            }
        } else {
            if ($this->getPersonPost($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception('PersonPost id does not exist', 404);
            }
        }
    }

    public function deletePersonPost($id)
    {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}
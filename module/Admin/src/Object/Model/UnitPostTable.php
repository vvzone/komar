<?php

namespace Object\Model;

use Zend\Db\TableGateway\TableGateway;
use Object\Model\UnitPost;

class UnitPostTable{

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

    public function getUnitPost($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }
        return $row;
    }

    public function getUnitPostByClientId($id)
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

    public function saveUnitPost(UnitPost $unit_post)
    {
        $data = array(
            'id' => $unit_post->id,
            'unit' => $unit_post->unit,
            'post' => $unit_post->post,
            'start_date' => $unit_post->start_date,
            'stop_date' => $unit_post->stop_date,
            'description' => $unit_post->description
        );

        $id = (int) $unit_post->id;
        if ($id == 0) {
            if (!array_filter($data)) {
                throw new \Exception('Trying to save empty model', 500);
            }else{
                $this->tableGateway->insert($data);
            }
        } else {
            if ($this->getUnitPost($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception('UnitPost id does not exist', 404);
            }
        }
    }

    public function deleteUnitPost($id)
    {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}
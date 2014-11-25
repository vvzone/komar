<?php

namespace Object\Model;

use Zend\Db\TableGateway\TableGateway;
use Object\Model\Unit;

class UnitTable{

    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    public function getUnit($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }
        return $row;
    }

    public function saveUnit(Unit $unit)
    {
        $data = array(
            'id' => $unit->id,
            'name' => $unit->name,
            'identification_number' => $unit->identification_number,
            'short_name' => $unit->short_name,
            'own_numeration' => $unit->own_numeration,
            'is_legal' => $unit->is_legal,
            'parent' => $unit->parent,
            'commander' => $unit->commander,
            'deputy' => $unit->deputy,
            'on_duty' => $unit->on_duty
        );

        $id = (int) $unit->id;
        if ($id == 0) {
            if (!array_filter($data)) {
                throw new \Exception('Trying to save empty model', 500);
            }else{
                $this->tableGateway->insert($data);
            }
        } else {
            if ($this->getUnit($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception('Unit id does not exist', 404);
            }
        }
    }

    public function deleteUnit($id)
    {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}
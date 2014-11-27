<?php

namespace Object\Model;

use Zend\Db\TableGateway\TableGateway;
use Object\Model\Client;
use Object\Model\Unit;

class ClientTable{

    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $resultSet = $this->tableGateway->select();
        /* --- <Paginator> ---*/
        /*
            $resultSet->buffer();
            $resultSet->next();
        */
        /* --- </Paginator> --- */
        return $resultSet;
    }

    public function getClient($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }

        return $row;
    }

    public function saveClient(Client $client)
    {
        $data = array(
            'id' => $client->id,
            'full_name' => $client->full_name,
            'identification_number' => $client->identification_number,
            'is_external' => $client->is_external,
        );

        $id = (int) $client->id;
        if ($id == 0) {
            if (!array_filter($data)) {
                throw new \Exception('trying to save empty model', 500);
            }else{
                $this->tableGateway->insert($data);
            }
        } else {
            if ($this->getClient($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception('client id does not exist', 404);
            }
        }
    }

    public function deleteClient($id)
    {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}
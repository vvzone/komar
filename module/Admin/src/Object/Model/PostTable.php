<?php

namespace Object\Model;

use Zend\Db\TableGateway\TableGateway;
use Object\Model\Post;

class PostTable{

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

    public function getPost($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id", 404);
        }
        return $row;
    }

    public function getPostByClientId($id)
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

    public function savePost(Post $post)
    {
        $data = array(
            'id' => $post->id,
            'name' => $post->name,
            'short_name' => $post->short_name,
            'description' => $post->description
        );

        $id = (int) $post->id;
        if ($id == 0) {
            if (!array_filter($data)) {
                throw new \Exception('Trying to save empty model', 500);
            }else{
                $this->tableGateway->insert($data);
            }
        } else {
            if ($this->getPost($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception('Post id does not exist', 404);
            }
        }
    }

    public function deletePost($id)
    {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}
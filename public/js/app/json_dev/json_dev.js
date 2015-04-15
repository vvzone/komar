
var Assigned_DT ={
    id: 1,
    document_type: 10,
    document_attribute_collection: [
        {
            id: 100,
            attribute_type: {
                id: 1000,
                name: 'Маршрут',
                type: 'complex'
                //без потомков
            },
            document_attribute: [
                /*
                if(complex)
                --> POST: id: null, parent: 100, attribute_type: 1000
                *
                * */
                /* <-- GET: */
                {
                    id: 9001,
                    attribute_type: 1000,
                    parent_attribute_collection: 100,
                    data: null,
                    document_attribute_collection: [
                        {
                            id: 101,
                            attribute_type: {
                                id: 1001,
                                name: 'Название',
                                type: 'string'
                            },
                            document_attribute: [
                                {
                                    id: 9002,
                                    attribute_type: 1001,
                                    parent_at_collection: 101,
                                    data: 'Маршрут движения к району наблюдения'
                                }
                            ],
                            min: 1,
                            max: 1
                        },
                        {
                            id: 102,
                            attribute_type: {
                                id: 1002,
                                name: 'Точка',
                                type: 'complex',
                                children: [
                                    {
                                        //x
                                    },
                                    {
                                        //y
                                    }
                                ]
                            },
                            min: 1,
                            max: 999,
                            document_attribute: [
                                {
                                    id: 99000,
                                    attribute_type: 1002,
                                    parent_at_coll: 102,
                                    data: null,
                                    document_attribute_collection: [
                                        {
                                            name: 'x',
                                            att_type: {
                                              name: 'type-x'
                                            },
                                            da: [
                                                {
                                                    //x
                                                }
                                            ]
                                        },
                                        {
                                            name: 'y',
                                            att_type: {
                                                name: 'type-y'
                                            },
                                            da: [
                                                {
                                                    //y
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {//точка 2
                                    id: 99001,
                                    attribute_type: 1002,
                                    parent_at_coll: 102,
                                    data: null
                                }
                            ]
                        }
                    ]
                },
                { // Маршрут 2
                    id: 9002,
                    attribute_type: 1000,
                    parent_attribute_collection: 100
                }
            ],
            min: 1,
            max: 2
        },
        {
            id: 199,
            attribute_type: {

            }
        }
    ]
};


/*

 children: [
 {
 id: 1001,
 name: 'Точка',
 type: 'complex',
 children: [
 {},
 {
 id: 1004,
 name: 'Метка',
 type: 'string'
 }
 ],
 min: 1,
 max: 9999
 },
 {
 id: 1002,
 name: 'Цвет',
 type: 'string',
 min: 1,
 max: 1
 }
 ]

 */
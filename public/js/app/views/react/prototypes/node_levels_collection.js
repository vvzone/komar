define(
    'views/react/prototypes/node_levels_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'views/react/prototypes/nodes_collection',
        'models/client'
    ],function($, _, Backbone, React, apiUrl, NodesCollection, ClientModel){
        console.log('models/test_collection');

        var node_state = [
            {node_state_code: 1, node_state_name: 'Назначено'},
            {node_state_code: 2, node_state_name: 'Получено'},
            {node_state_code: 3, node_state_name: 'Прочитано'},
            {node_state_code: 4, node_state_name: 'Согласовано'},
            {node_state_code: 5, node_state_name: 'Исполнено'}
        ];

        var level_types = [
            {id: 945, level_type_name: 'Согласование'},
            {id: 943, level_type_name: 'Проверка'},
            {id: 944, level_type_name: 'Подпись'}
        ];

        /*
        var recipient_type = [
            {id: 34847, code: 1, name: 'Узел'}, //0
            {id: 2,     code: 2, name: 'Подразделение'}, //1
            {id: 124,   code: 3, name: 'Автор'}, //2
            {id: 24,    code: 4, name: 'Начальник'}, //3
            {id: 3248,  code: 5, name: 'Визирующее лицо'} //4
        ];*/

        var recipient_type = [
            {id: 34847, code: 1, name: 'Узел/Подразделение'}, //0
            {id: 124,   code: 2, name: 'Автор'}, //1
            {id: 24,    code: 3, name: 'Начальник'}, //2
            {id: 3248,  code: 4, name: 'Визирующее лицо'} //3
        ];

        var clients = [
            {
                id:2345378,
                full_name: 'Петров Петр Игоревич',
                person: {
                    name: 'Петр',
                    patronymic: 'Игоревич',
                    family_name: 'Петров',
                    birth_date: '11.05.67',
                    birth_place: 'г. Киев',
                    sex: 'мужской',
                    inn: '',
                    citizenship: 'Россия',
                    deputy: 'нет'
                }
            },
            {
                id:23872,
                full_name: 'Отдел материально-технического снабжения',
                unit: {
                    short_name: 'Отдел МТО',
                    own_numeration: true,
                    is_legal: false,
                    parent: 23,
                    legals: null
                }
            },
            {
                id:23872,
                full_name: 'Воинская часть 245891',
                unit: {
                    short_name: 'В/Ч 245891',
                    own_numeration: true,
                    is_legal: true,
                    parent: 2324,
                    legals: null
                }
            },
            {
                id:2015378,
                full_name: 'Иван Сергеевич Велкопоповицкий',
                person: {
                    name: 'Иван',
                    patronymic: 'Сергеевич',
                    family_name: 'Велкопоповецкий',
                    birth_date: '11.05.77',
                    birth_place: 'г. Прага',
                    sex: 'мужской',
                    inn: '',
                    citizenship: 'Россия',
                    deputy: 'нет'
                }
            },
            {
                id:2045178,
                full_name: 'Емельян Федорович Таврищенко',
                person: {
                    name: 'Емельян',
                    patronymic: 'Федорович',
                    family_name: 'Таврищенко',
                    birth_date: '11.05.87',
                    birth_place: 'г. Курск',
                    sex: 'мужской',
                    inn: '',
                    citizenship: 'Россия',
                    deputy: 'нет'
                }
            },
            {
                id:2005118,
                full_name: 'Георгий Константинович Битлов',
                person: {
                    name: 'Георгий',
                    patronymic: 'Константинович',
                    family_name: 'Битлов',
                    birth_date: '11.05.57',
                    birth_place: 'г. Свердловск',
                    sex: 'мужской',
                    inn: '',
                    citizenship: 'Россия',
                    deputy: 'нет'
                }
            },
            {
                id:1005178,
                full_name: 'Денис Ианович Толстопузов',
                person: {
                    name: 'Денис',
                    patronymic: 'Ианович',
                    family_name: 'Толстопузов',
                    birth_date: '11.05.95',
                    birth_place: 'г. Северокамск',
                    sex: 'мужской',
                    inn: '',
                    citizenship: 'Россия',
                    deputy: 'нет'
                }
            },
            {
                id:23072,
                full_name: 'Бухгалтерия В/Ч 245891',
                unit: {
                    short_name: 'Бухгалтерия',
                    own_numeration: true,
                    is_legal: false,
                    parent: 2324,
                    legals: null
                }
            },
            {
                id:23372,
                full_name: 'Административно-хозяйственный отдел В/Ч 245891',
                unit: {
                    short_name: 'АХО',
                    own_numeration: true,
                    is_legal: false,
                    parent: 2324,
                    legals: null
                }
            }
        ];

        var nodes = [
            {id: 3007, node_level_id: 101, sort_order: 0,
                recipient_type: recipient_type[4], client: new ClientModel(clients[4]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//0
            {id: 3008, node_level_id: 102, sort_order: 0,
                recipient_type: recipient_type[4], client: new ClientModel(clients[5]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//1
            {id: 3006, node_level_id: 102, sort_order: 1,
                recipient_type: recipient_type[4], client: new ClientModel(clients[3]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//2
            {id: 3009, node_level_id: 103, sort_order: 0,
                recipient_type: recipient_type[0], client: new ClientModel(clients[6]) ,
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//3
            {id: 45609, node_level_id: 103, sort_order: 0,
                recipient_type: recipient_type[1], client: new ClientModel(clients[2]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//4
            {id: 35609, node_level_id: 101, sort_order: 0,
                recipient_type: recipient_type[3], client: new ClientModel(clients[8]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//5
            {id: 3343209, node_level_id: 101, sort_order: 0,
                recipient_type: recipient_type[2], client: new ClientModel(clients[7]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//6
            {id: 4, node_level_id: 101, sort_order: 0,
                recipient_type: recipient_type[4], client: new ClientModel(clients[0]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1},//7
            {id: 4509, node_level_id: 101, sort_order: 0,
                recipient_type: recipient_type[4], client: new ClientModel(clients[0]),
                task: 'Проверить',
                node_state: node_state[2],
                period_type: 1, time_stamp: null, period_length: 1}//8
        ];
        var node_levels = [
            {id: 101, route: 1, level_order: 1, level_type: level_types[0], name: 'Согласование 1', nodes: [nodes[0], nodes[5], nodes[6], nodes[8]]},
            {id: 103, route: 1, level_order: 3, level_type: level_types[2], name: 'Исполняющие', nodes: [nodes[1], nodes[2]]},
            {id: 102, route: 1, level_order: 2, level_type: level_types[0], name: 'Согласование 2', nodes: [nodes[3], nodes[4], nodes[7], nodes[5]]}
        ];

        var NodeLevelModel = Backbone.Model.extend({
            defaults: {
                id: null,
                route: null,
                level_order: null,
                level_type: null,
                name: null,
                nodes: []
            },
            attr_rus_names: {
                route: 'Маршрут',
                level_order: 'Порядок в пределах маршрута',
                level_type: 'Тип уровня',
                name: 'Название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'test_model',
            model_rus_name: '',
            url: function() {
                return apiUrl('test_model', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                /*this.on('change', function(){
                    console.error('model -> change');
                }, this);*/
                console.info('model init, this:');
                console.info(this);

                // Для продакшена заменить на аналогичные действия в parse
                if(_.size(this.get('nodes'))>0){
                    console.warn('_size(nodes)>0');
                    this.set('nodes', new NodesCollection(this.get('nodes')));
                }else{
                    console.info('this.get(nodes):');
                    console.info(this.get('nodes'));
                    this.set('nodes', new NodesCollection(null));
                }
            },
            parse: function(response, xhr){
                console.info('NodeLevelModel -> parse, response:');
                console.log(response);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        var NodeLevelCollection = Backbone.Collection.extend({
            model: NodeLevelModel,
            collection_rus_name: 'Коллекция для тестирования',
            collection_name: 'test_collection',
            url: function() {
                return apiUrl('test_collection');
            },
            comparator: function(model){
                return model.get('level_order');
            },
            initialize: function(){
                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return new NodeLevelCollection(node_levels);
        //return new TestCollection(null);
    }
);
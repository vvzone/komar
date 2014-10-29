define(
    'models/constants',
    [],function(){
        var constants = [];
        var base_attr_type = [
            {id: 1, name: 'Целое'},
            {id: 2, name: 'Вещественное'},
            {id: 3, name: 'Текст'},
            {id: 4, name: 'Булевский'},
            {id: 5, name: 'Дата'},
            {id: 6, name: 'Время'},
            {id: 7, name: 'Дата/время'},
            {id: 8, name: 'Список'},
            {id: 9, name: 'Составной'}
        ];

        var doc_state = [
            {id: 1, name: 'Черновик'},
            {id: 2, name: 'Совместная разработка'},
            {id: 3, name: 'Сформирован'},
            {id: 4, name: 'Исполнен'},
            {id: 5, name: 'Отвергнут'},
            {id: 5, name: 'Отозван'}
        ];

        constants['base_attr_type'] = base_attr_type;
        constants['document_state'] = doc_state;
        return constants;
    }
);

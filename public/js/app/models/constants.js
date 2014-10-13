define(
    'models/constants',
    [],function(){
        var constants = [];
        /*
         * Системные типы:
         •	целое,  1
         •	вещественное, 2
         •	текст,  3
         •	булевский, 4
         •	Дата, 5
         •	Время,  6
         •	Дата/время, 7
         •	Список,8
         •	Составной.
         * */
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
        constants['base_attr_type'] = base_attr_type;

        return constants;
    }
);

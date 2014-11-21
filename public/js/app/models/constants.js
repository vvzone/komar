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

        var commanders = [
            {id:1, name:'Голиков Владимир Васильевич'},
            {id:2, name:'Чумаков Владимир Николаевич'},
            {id:3, name:'Савенкова Анна Николаевна'}
        ];

        var deputy = [
            {id:4, name:'Ольга Петровна Васильева'},
            {id:5, name:'Гуров Владимир Иванович'},
            {id:6, name:'Алешина Елена Михайловна'}
        ];

        var on_duty = [
            {id:7, name:'Ададурова Людмила Петровна'},
            {id:8, name:'Елисеева Елена Васильевна'},
            {id:9, name:'Кузькин Владимир Степанович'}
        ];
        
        var sex = [
            {id:1, name:'муж.'},
            {id:2, name:'жен.'}           
        ];

        constants['base_attr_type'] = base_attr_type;
        constants['document_state'] = doc_state;
        constants['commander'] = commanders;
        constants['deputy'] = deputy;
        constants['on_duty'] = on_duty;
        constants['sex'] = sex;
        
        return constants;
    }
);

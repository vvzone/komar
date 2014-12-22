define(
    'views/react/controls/controls_config',
    [],function(){
        var properties_types = [];


        properties_types['name'] = 'tiny_text';
        properties_types['short_name'] = 'tiny_text';
        properties_types['patronymic_name'] = 'tiny_text';

        properties_types['full_name'] = 'small_text';

        properties_types['description'] = 'small_text';
        properties_types['is_officer'] = 'bool_select';

        properties_types['allowed_ranks'] = 'list_box'; /* old name - allowed_ranks */
        properties_types['attribute_type_childs'] = 'list_box'; /* old name - allowed_ranks */


        /* pass_doc_types */
        properties_types['seriesMask'] = 'tiny_text';
        properties_types['numberMask'] = 'tiny_text';

        properties_types['isFull'] = 'bool_select';
        properties_types['is_full'] = 'bool_select';
        properties_types['isMain'] = 'bool_select';
        properties_types['is_main'] = 'bool_select';
        properties_types['isSeries'] = 'bool_select';
        properties_types['is_series'] = 'bool_select';

        properties_types[''] = 'bool_select';

        /* address_types */
        properties_types['priority'] = 'tiny_text';

        /* countries */
        properties_types['code'] = 'tiny_text';

        properties_types['region_types'] = 'simple_select';

        /* ? many */
        properties_types['short_name'] = 'tiny_text';

        /* docs */
        properties_types['mask'] = 'tiny_text';
        properties_types['isPeriodic'] = 'bool_select';
        properties_types['is_periodic'] = 'bool_select';

        properties_types['period_types'] = 'simple_select';
        properties_types['period_length'] = 'tiny_text';
        properties_types['start_date'] = 'tiny_text'; /* Заменить на календарь! */
        properties_types['min_index'] = 'tiny_text';

        properties_types['isDraft'] = 'bool_select';
        properties_types['is_draft'] = 'bool_select';

        properties_types['singleNumeration'] = 'bool_select';

        properties_types['isService'] = 'bool_select';
        properties_types['is_service'] = 'bool_select';

        /* doc_types */
        properties_types['default_header'] = 'tiny_text';
        properties_types['urgency_types'] = 'simple_select';
        properties_types['urgency_type'] = 'simple_select';
        //properties_types['urgency_types'] = 'list_box';
        properties_types['secrecy_types'] = 'simple_select';
        properties_types['secrecy_type'] = 'simple_select';

        properties_types['attribute_types'] = 'list_box';
        properties_types['current_node'] = 'list_box';
        //properties_types['secrecy_types'] = 'list_box';
        //properties_types['attribute_types'] = '';


        /* attribute types */
        properties_types['base_attr_type'] = 'simple_select';
        //properties_types['verification_type'] = 'simple_select';
        properties_types['min'] = 'tiny_text';
        properties_types['max'] = 'tiny_text';

        properties_types['listValues'] = 'simple_list';
        properties_types['list_values'] = 'simple_list';
        properties_types['mask'] = 'tiny_text';
        properties_types['max_length'] = 'tiny_text';
        properties_types['value'] = 'tiny_text';
        //properties_types['parents'] = 'info_list'; needed new!
        
        properties_types['identification_number'] = 'tiny_text';
        properties_types['commander'] = 'simple_select';
        properties_types['deputy'] = 'simple_select';
        properties_types['on_duty'] = 'simple_select';

        properties_types['is_legal'] = 'bool_select';
        properties_types['own_numeration'] = 'bool_select';

        properties_types['first_name'] = 'tiny_text';
        properties_types['patronymic'] = 'tiny_text';
        properties_types['family_name'] = 'tiny_text';
        properties_types['birth_date'] = 'tiny_text';
        properties_types['birth_place'] = 'tiny_text';

        properties_types['sex'] = 'simple_select';
        properties_types['sex_types'] = 'simple_select';

        properties_types['inn'] = 'tiny_text';
        properties_types['citizenship'] = 'tiny_text';

        properties_types['route'] = 'simple_select';
        properties_types['node_levels'] = 'node_levels';





        return properties_types;
    }
);

define(
    'views/react/controls/controls_config',
    [
        'jquery',
        'react'
    ],function($, React){
        var properties_types = [];


        properties_types['name'] = 'tiny_text';
        properties_types['short_name'] = 'tiny_text';
        properties_types['description'] = 'small_text';
        properties_types['is_officer'] = 'bool_select';
        properties_types['allowed_ranks'] = 'list_box';

        /* pass_doc_types */
        properties_types['seriesMask'] = 'tiny_text';
        properties_types['numberMask'] = 'tiny_text';

        properties_types['isFull'] = 'bool_select';
        properties_types['is_full'] = 'bool_select';
        properties_types['isMain'] = 'bool_select';
        properties_types['is_main'] = 'bool_select';
        properties_types['isSeries'] = 'bool_select';
        properties_types['is_series'] = 'bool_select';

        /* address_types */
        properties_types['priority'] = 'tiny_text';

        /* countries */
        properties_types['code'] = 'tiny_text';
        properties_types['fullname'] = 'small_text';

        /* ? many */
        properties_types['shortname'] = 'tiny_text';

        /* docs */
        properties_types['mask'] = 'tiny_text';
        properties_types['isPeriodic'] = 'bool_select';
        properties_types['is_periodic'] = 'bool_select';

        properties_types['period_length'] = 'tiny_text';
        properties_types['start_date'] = 'tiny_text'; /* Заменить на календарь! */
        properties_types['min_index'] = 'tiny_text';

        properties_types['isDraft'] = 'bool_select';
        properties_types['is_draft'] = 'bool_select';

        properties_types['singleNumeration'] = 'bool_select';

        properties_types['isService'] = 'bool_select';
        properties_types['is_service'] = 'bool_select';

        return properties_types;
    }
);

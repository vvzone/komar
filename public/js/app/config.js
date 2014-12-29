define(
    'config',
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function($, _, Backbone){

        console.info('config loaded...');

        var Config = {
            debug: {
                debug_menu: null,
                debug_collection_router: null,
                debug_models_and_collections: null,
                apiUrl: null,
                debug_list: null,
                debug_main_list: null,
                debug_modals: null,
                debug_item_edit: null,
                debug_control_router: null,
                debug_route_levels_control: null,
                debug_login: 1,
                debug_router: 1
            },
            collections_router: [
                {ranks: 'list'},
                {posts: 'list'},
                {secrecy_types: 'list'},
                {urgency_types: 'list'},
                {document_type: 'list'},
                {doc_type_groups: 'tree'},
                {doc_type_groups_plain: 'list'},
                {attribute_types: 'list'},
                {person_document_types: 'list'},
                {countries: 'list'},
                {address_types: 'list'},
                {region_types: 'list'},
                {regions: 'list'},
                {location_types: 'list'},
                {street_types: 'list'},
                {sex_types: 'list'},
                {commander_types: 'list'},
                {period_types: 'list'},
                {enumeration_types: 'list'},
                {enumeration: 'list'},
                {node_types: 'list'},
                {persons: 'list'},
                {units: 'list'},
                {units_tree: 'tree'},
                {clients: 'list'},
                {units_plain: 'list'},
                {documents: 'list'},
                {route: 'list'},
                {very_urgency: 'list'}
            ],
            local_server: 1,
            temp: null,
            host: {
                local_server: 'zend-test:9080',
                production_server: 'localhost:1337'
            },
            login_url: {
                local_server: '/admin/login',
                production_server: '/admin/api/commands/get_token'
            }

        };

        return Config;
    }
);

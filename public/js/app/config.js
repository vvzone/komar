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
                debug_collection_router: 1,
                debug_models_and_collections: null,
                apiUrl: 1,
                debug_list: null,
                debug_main_list: null,
                debug_modals: null,
                debug_item_edit: null,
                debug_control_router: null,
                debug_route_levels_control: null,
                debug_login: null,
                debug_router: 1,
                debug_map: 1,
                debug_tree: 1
            },
            collections_router: [
                {ranks: 'list'},
                {posts: 'list'},
                {secrecy_types: 'list'},
                {urgency_types: 'list'},
                {document_types: 'list'},
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
                {documents: 'client_list'},
                //{documents_output: 'client_list'},
                {route: 'list'},
                {very_urgency: 'list'},
                {client_menu: 'tree'}
            ],
            local_server: true,
            temp: null,
            host: {
                local_server: 'zend-test:9080',
                production_server: '127.0.0.1:1337'
            },
            login_url: {
                local_server: '/admin/login',
                production_server: '/admin/api/login'
            },
            logout_url: {
                local_server: '/admin/logout',
                production_server: '/admin/api/commands/return_token'
            },
            menu_group_classes: {
                menu_new_doc: ['new_document'],
                menu_msg: ['inbox', 'sent'],
                menu_warn: ['notification'],
                menu_map: ['classifier', 'documents_on_map', 'layers']
            },
            cookie_name: 'moskit',
            csrf_token: false
        };

        return Config;
    }
);


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
                debug_app_registry: null,
                debug_menu: null,
                debug_collection_router: null,
                debug_models_and_collections: null,
                apiUrl: null,
                debug_list: null,
                debug_main_list: 1,
                debug_modals: null,
                debug_item_edit: 1,
                debug_control_router: null,
                debug_route_levels_control: null,
                debug_login: null,
                debug_router: null,
                debug_map: null,
                debug_tree: null,
                debug_paginator: 1,
                debug_controls: {
                    tiny_text: null,
                    simple_select: null
                }
            },
            collections_router: [
                {attribute_types: 'list'},
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
                {users: 'list'},
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
            csrf_token: false,
            paginator: {
                default_per_page: 10,
                default_raginator_range: 9,
                per_page_options: [5, 10, 20, 30, 50]
            },
            component_list: {
                max_name_length: 75
            },
            component_table: {
                max_name_length: 55
            }
        };

        return Config;
    }
);


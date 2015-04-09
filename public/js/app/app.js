define(
    'app',
    [
        'jquery',
        'underscore',

        'backbone',
        'backbone_validation',
        'backbone_query_parameters',
        'backbone_paginator',

        'react',
        'config',

        'jsx!views/react/modals/error',
        'jsx!views/react/modals/success',
        'jsx!views/react/modals/edit',
        'jsx!views/react/modals/open',
        'jsx!views/react/modals/delete_confirmation',
        'jsx!views/react/modals/add',

        'router', // Request router.js
        'event_bus',
        'app_registry'
    ],
    function($, _,
             Backbone, BackboneValidation, BackboneQueryParameters, BackbonePaginator,
             React, Config,
             ModalWindowError, ModalWindowSuccess, ModalWindowEdit, ModalWindowOpen, ModalWindowDeleteConfirmation, ModalWindowAdd,
             Router, EventBus, app_registry){ //, UserBarComponent

        console.log('app loaded...');
        var debug_modals = (Config['debug'] && Config['debug']['debug_modals'])? 1:null;

    var init = function(){
        Backbone.Validation.configure({
            forceUpdate: true
        });

        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
        Backbone.Collection.prototype.parse = function(response){
            return response.requested_data;
        };

        Backbone.PageableCollection.prototype.parse = function(response){
            return response.requested_data;
        };
        /*
        Backbone.PageableCollection.queryParams = {
            // `Backbone.PageableCollection#queryParams` converts to ruby's
            // will_paginate keys by default.
            currentPage: "current_page",
            pageSize: "page_size"
        };
        */

        _.extend(Backbone.Validation.callbacks, {
            valid: function (view, attr, selector) {
                console.info(['valid =', view, attr, selector]);
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                $group.removeClass('has-error');
                $group.find('.help-block').html('').addClass('hidden');
            },
            invalid: function (view, attr, error, selector) {
                console.info(['invalid =',view, attr, error, selector]);
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                $group.addClass('has-error');
                $group.find('.help-block').html(error).removeClass('hidden');
            }
        });


        //2 do: убрать основные эвенты окон в другой модуль нихера не понятно

        EventBus.on('error', function(header, msg, response){
            (debug_modals)?console.info('EventBus.on error catch'):null;
            EventBus.trigger('windows-close');

            React.renderComponent(
                 ModalWindowError({
                     header: header,
                     msg: msg,
                     response: response
                 }), document.getElementById("global_modal")
             );
        });

        EventBus.on('item-add', function(model){
            if((debug_modals)){
                console.info('EventBus -> item-add, model:');
                console.log(model);
            }

            React.renderComponent(
                ModalWindowEdit({
                    model: model
                }), $('.modal_window').filter(':last')[0] //document.getElementById("global_modal")
            );
        });

        EventBus.on('item-open', function(model){
            if((debug_modals)){
                console.info('EventBus -> item-open, model:');
                console.log(model);
            }
            var id = model.get('id');

            model.fetch({
                success: function(){
                    React.renderComponent(
                        ModalWindowOpen({
                            model: model
                        }), $('.modal_window').filter(':last')[0]  //document.getElementById("global_modal")
                    );
                }
            }); //try to get full-model
        });

        EventBus.on('item-edit', function(model_old){
            if((debug_modals)){
                console.info('EventBus -> item-edit, model:');
                console.log(model_old);
            }

            var collection = model_old.collection;
            var id = model_old.get('id');
            var new_collection  = collection.clone(); //save collection with simple objects

            collection.remove(model_old); //cut-off from parent collection
            var model = new_collection.get(id);


            console.info(['model', model]);

            //model.silentFetch
            model.fetch({
                success: function(){
                    React.renderComponent(
                        ModalWindowEdit({
                            model: model
                        }), $('.modal_window').filter(':last')[0]  //document.getElementById("global_modal")
                    );
                }
            }); //try to get full-model

        });

        EventBus.on('item-delete', function(model){
            if((debug_modals)){
                console.info('EventBus -> item-delete, model:');
                console.log(model);
            }
            EventBus.trigger('windows-close');
            var unmount = React.unmountComponentAtNode($('#global_modal')[0]);
            (debug_modals)?console.log('unmount='+unmount):null;
            $('#global_modal').html('');
            React.renderComponent(
                ModalWindowDeleteConfirmation({
                    model: model
                }), document.getElementById("global_modal")
            );
        });

        EventBus.on('success', function(header, msg){
            console.info('EventBus -> success');
            var last_window = $('.modal_window').filter(':last')[0];

            /*
            var parent_window = $('.modal_window').filter(function(index){
                return $('.modal_window', this).length-2;
            })[0];
            var grandfather_window = $('.modal_window').filter(function(index){
                return $('.modal_window', this).length-3;
            })[0];
            var test_window = $('.modal_window').filter(function(index){
                return $('.modal_window', this).length-2;
            });
            */

            React.renderComponent(
                ModalWindowSuccess({
                    header: header,
                    msg: msg
                }), last_window
            );

        });

        // Pass in our Router module and call it's initialize function
        console.log('app initialization...');
        app_registry.init();
        Router.initialize();

    };

    return {
        init: init
    };
});

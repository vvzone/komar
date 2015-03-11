/** @jsx React.DOM */

define(
    'views/react/item_edit/save_form',
    [
        'jquery',
        'bootstrap',
        'react',
        'config',
        'event_bus'
    ],function($, Bootstrap, React, Config, EventBus){
        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        return function(){
            return {
                saveForm: function () {
                    var mySelf = this;
                    this.state.model.validate();
                    (debug)?console.info(['saveForm-> item to save:', this.state.model]):null;

                    if(this.state.model.isValid()){
                        console.info('this.state.model.validate', this.state.model.validate());
                        console.info('this.state.model.isValid', this.state.model.isValid(true));

                        this.state.model.save(null, {
                            success:  function(model, response){
                                (debug)?console.info('item_edit -> save success!'):null;
                                mySelf.state.model.collection.fetch({
                                    success: function(){
                                        EventBus.trigger('success', 'Изменения синхронизированы.')
                                    },
                                    error: function(){
                                        EventBus.trigger('error', 'Ошибка', 'Изменения сохранены, однако, при попытке синхронизироваться с сервером возникла ошибка.', response);
                                    }
                                });
                                EventBus.trigger('success', 'Изменения сохранены.');
                            },
                            error: function(model, response){
                                EventBus.trigger('error', 'Ошибка', 'Не удалось сохранить изменения', response);
                            }
                        });
                    }else{
                        alert('error');
                        console.warn(['this.state.model.validationErrors',this.state.model.validationErrors]);
                        var validation_errors = [];
                        if(this.state.model.validationErrors){
                            validation_errors = _.each(this.state.model.validationErrors, function(error){
                                return error;
                            });
                        }

                        EventBus.trigger('error', 'Ошибка', validation_errors);
                    }
                }
            };
        };
    }
);
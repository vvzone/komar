/** @jsx React.DOM */

define(
    'views/react/item_edit/update_item',
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
                itemUpdate: function (property, parent_property) {
                    (debug)?console.info(['itemUpdate, property:', property]):null;

                    var current_item = this.state.model;
                    if(parent_property){
                        _.has(current_item.attributes, parent_property);
                        console.info(['_.has(current_item.attributes, parent_property)', _.has(current_item.attributes, parent_property)]);
                    }

                    for (var key in property) {
                        (debug)?console.log(['property[key], key='+key, property[key], 'current_item['+key+'] old:', current_item.attributes[key]]):null;
                        if(property[key] == "true" || property[key] == "false"){
                            if(property[key] == "true"){
                                current_item.set(key, true);
                            }else{
                                current_item.set(key, false);
                            }
                        }else{
                            current_item.set(key, property[key]);
                        }
                        (debug)?console.log(['current_item['+key+'] now:', current_item.attributes[key]]):null;
                    }
                    this.setState({model: current_item}); //не нужно так как обновляется модель - не факт ибо нет ре-рендера
                },
                itemUpdateDependency: function(e){
                    alert('Dependency Update');
                    (debug)?console.log(e):null;
                }
            };
        }();
    }
);
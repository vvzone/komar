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
                itemUpdate: function (property) {
                    (debug)?console.info(['itemUpdate, property:', property]):null;
                    var current_item = this.state.model;
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
/** @jsx React.DOM */

define(
    'views/react/item_edit/process_hidden_field',
    [
        'jquery',
        'bootstrap',
        'react',
        'config',
        'event_bus'
    ],function($, Bootstrap, React, Config, EventBus){
        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        // add lodash sometime....

        return function(){
            return {
                processHiddenFiled: function(model, prop){
                    (debug)?console.info(['model.hidden_fields['+prop+']', model.hidden_fields[prop]]):null;
                    var control;
                    var rule_obj = model.hidden_fields[prop];
                    if(rule_obj){
                        for(var field in rule_obj){
                            var rule_value = rule_obj[field];
                            var model_value = model.get(field);
                            if(_.isArray(rule_value)){
                                //search in array
                                var check_array = false;
                                for(var key in rule_value){
                                    if(rule_value[key] == model_value){
                                        check_array = true;
                                    }
                                }
                                if(check_array ){
                                    control = this.callControlRouter(model, prop);
                                }
                            }
                            else{ //if(_.isString(rule_value) || _.isNumber(rule_value)){
                                (debug)?console.log('model_value='+model_value+' rule_value='+rule_value):null;
                                if(model_value == rule_value){
                                    (debug)?console.info('rule_value non array, output hidden field['+prop+']=='):null;
                                    control = this.callControlRouter(model, prop);
                                }
                            }
                        }
                    }

                    return control;
                }
            }
        }
    }
);
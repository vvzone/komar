/** @jsx React.DOM */

define(
    'views/react/item_edit/call_control_router',
    [
        'jquery',
        'bootstrap',
        'react',
        'config',
        'event_bus',

        'views/react/controls/controls_config',
        'jsx!views/react/controls/controls_router',
        'jsx!views/react/item_edit/sub_form'
    ],function($, Bootstrap, React, Config, EventBus,
               DefaultControlsConfig, ControlsRouter, SubForm){
        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        return function(){
            return {
                //Main
                callControlRouter: function(model, prop){
                    // Коллекция может быть еще не получена и тогда это приведет к неправильному Контролл-Роуту
                    // коллекция ведь зависит от State
                    (debug)?console.log('-> callControlRouter'):null;

                    //Model have a dependency-description for current field
                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        console.log(['typeof(this.props.model.attr_dependencies['+prop+')', typeof(this.props.model.attr_dependencies[prop])]);
                        (debug)?console.log('this.props.model.attr_dependencies['+prop+']='+this.props.model.attr_dependencies[prop]):null;

                        if(this.state.dependency_array != null){
                            if(debug){
                                (debug)?console.log(['this.state.dependency_array['+prop+']',this.state.dependency_array[prop]]):null;
                            }
                            return this.initWithDependency(model, prop);
                        }
                    }
                    if(this.props.model.form != null && typeof(this.props.model.form[prop])!='undefined'){
                        return this.initModelDescribed(model, prop);
                    }

                    return this.initDefault(model, prop);
                },
                initWithDependency: function(model, prop){
                    console.warn('initWithDependency');
                    var control_type = '';
                    if(DefaultControlsConfig[prop]){
                        control_type = DefaultControlsConfig[prop];
                    }else{
                        control_type = model.form[prop];
                    }

                    return <ControlsRouter
                                type={control_type}
                                model={model}
                                value={model.attributes[prop]}
                                dependency_array = {this.state.dependency_array[prop]}
                                name={prop}
                                russian_name={model.attr_rus_names[prop]}
                                callback={this.itemUpdate}
                                key={prop}
                            />;
                },
                initModelDescribed: function(model, prop){
                    (debug)?console.log(['initModelDescribed model.get('+prop+')', model.get(prop)]):null;
                    console.warn('initModelDescribed');
                    var error={};
                    //var current_node = 'sub_form_'+prop;

                    var prop_description = model.form[prop];
                    if(prop_description == 'model'){
                        //return <div id={current_node}>{this.getSubForm(prop, model.get(prop))}</div>;
                        return (this.getSubForm(prop, model.get(prop)));
                    }

                    if(typeof(prop_description) == 'object'){
                        console.warn(['prop_description is object', prop, prop_description]);
                        var sub_controls = [];
                        var self = this;
                        _.each(prop_description, function(sub_prop_control, sub_prop_name){
                            sub_controls.push(
                                <ControlsRouter
                                type={sub_prop_control}
                                model={model}
                                value={model.get(prop).get(sub_prop_name)}
                                name={sub_prop_name}
                                russian_name={model.attr_rus_names[prop][sub_prop_name]}
                                callback={self.itemUpdate}
                                key={sub_prop_name}
                                error={error}
                                />
                            );
                        });
                        return sub_controls;


                    }

                    return <ControlsRouter
                                type={model.form[prop]}
                                value={model.get(prop)}
                                model={model}
                                name={prop}
                                russian_name={model.attr_rus_names[prop]}
                                callback={this.itemUpdate}
                                key={prop}
                                error={error}
                            />;
                },
                initDefault: function(model, prop){
                    if(debug){
                        console.info('controlRouterCall-> model.attributes['+prop+']');
                        console.info(model.attributes[prop]);
                    }
                    var error = [];
                    if(this.state.model.validationErrors){
                        console.warn(['validationErrors!',this.state.model.validationErrors]);
                        if(this.state.model.validationErrors[prop]){
                            console.warn(['this.state.model.validationErrors['+prop+']', this.state.model.validationErrors[prop]]);
                            error = this.state.model.validationErrors[prop];
                        }
                    }

                    console.warn('initDefault');
                    return <ControlsRouter
                                type={DefaultControlsConfig[prop]}
                                value={model.attributes[prop]}
                                model={model}
                                name={prop}
                                russian_name={model.attr_rus_names[prop]}
                                callback={this.itemUpdate}
                                key={prop}
                                error={error}
                            />;
                }
            }
        }()
    }
);
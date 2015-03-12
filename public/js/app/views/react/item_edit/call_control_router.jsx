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
        'jsx!views/react/controls/controls_router'
    ],function($, Bootstrap, React, Config, EventBus, DefaultControlsConfig, ControlsRouter){
        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        return function(){
            return {
                //Main
                callControlRouter: function(model, prop){
                    // Коллекция может быть еще не получена и тогда это приведет к неправильному Контролл-Роуту
                    // коллекция ведь зависит от State

                    (debug)?console.warn('-> callControlRouter'):null;

                    //Model have a dependency-description for current field
                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        (debug)?console.log('this.props.model.attr_dependencies['+prop+']='+this.props.model.attr_dependencies[prop]):null;

                        if(this.state.dependency_array != null){
                            if(debug){
                                console.error('call to ControlRouter -> this.controlRouterCallWithDependency');
                                console.log(['this.state.dependency_array['+prop+']',this.state.dependency_array[prop]]);
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
                    return <ControlsRouter
                                type={DefaultControlsConfig[prop]}
                                value={model.attributes[prop]}
                                dependency_array = {this.state.dependency_array[prop]}
                                name={prop}
                                russian_name={model.attr_rus_names[prop]}
                                callback={this.itemUpdate}
                                key={prop}
                            />;
                },
                initModelDescribed: function(model, prop){
                    (debug)?console.log(['initModelDescribed model, prop', model, prop]):null;
                    var error={};

                    (debug)?console.info(['model', model]):null;
                    (debug)?console.info(['model.get('+prop+')', model.get(prop)]):null;
                    (debug)?console.info(['model.attributes', model.attributes]):null;

                    return <ControlsRouter
                                type={model.form[prop]}
                                value={model.get(prop)}
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

                    return <ControlsRouter
                                type={DefaultControlsConfig[prop]}
                                value={model.attributes[prop]}
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
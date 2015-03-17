/** @jsx React.DOM */

define(
    'views/react/item_edit/get_dependency',
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
                getDependency: function(prop){
                    (debug)?console.warn('current model.attr_dependencies['+prop+'] NOT constant'):null;
                    var self = this;

                    require([
                        'models/'+this.props.model.attr_dependencies[prop]+'_collection'
                    ], function(DependencyCollectionClass){
                            var DependencyCollection = new DependencyCollectionClass;
                            var dependency_array= self.state.dependency_array;
                            DependencyCollection.fetch({
                                error: function(obj, response){
                                    (debug)?console.warn('error, response: '+response):null;
                                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                                },
                                success: function(){
                                    (debug)?console.info(['dependency collection:', DependencyCollection.toJSON()]):null;
                                    var current_dependency = DependencyCollection.toJSON();
                                    dependency_array[prop] = current_dependency;

                                    (debug)?console.log(['prop', prop, 'current_dependency', current_dependency]):null;

                                    //this why field name in model, and dependency should be equivalent BAD! Decision, but required for require Js use

                                    self.setState({
                                        dependency_array: dependency_array
                                    });
                                }
                            });

                        }
                    );
                }
            };
        }()
    }
);
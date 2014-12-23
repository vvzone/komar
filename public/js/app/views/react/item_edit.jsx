define(
    'views/react/item_edit',
    [
        'underscore',
        'jquery',
        'react',
        'config',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'event_bus',
        'views/react/controls/controls_config',
        'jsx!views/react/controls/controls_router',
        'models/constants'
    ],function(_, $, React, Config, BootstrapModal, EventBus, ControlsConfig, ControlsRouter, Constants){

        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        var ItemEditBox = React.createClass({
            /*
             * Props:
             * old: <<<<<<<<<<<<
             * item - item array
             * prototype.editable_properties - from server
             * dependencies - from entity
             * >>>>>>>>>>>>>>>>>>>
             * new: model
             *
             * */
            getInitialState: function () {
                return {
                    model: [],
                    dependency_array: {}
                }
            },
            saveForm: function () {
                //this.props.model.save;
                if(debug){
                    console.info('saveForm-> item to save:');
                    console.info(this.state.model);
                }

                var mySelf = this;

                this.state.model.save(null, {
                    success:  function(model, response){
                        (debug)?console.info('item_edit -> save success!'):null;
                        //mySelf.props.callback('save');
                        mySelf.state.model.collection.fetch({
                            success: function(){
                                //sync
                                //EventBus.trigger('success', 'Изменения синхронизированы.');
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
            },
            itemUpdate: function (property) {
                (debug)?console.info('itemUpdate'):null;
                var current_item = this.state.model;
                if(debug){
                    console.log('property:');
                    console.log(property);
                }

                for (var key in property) {
                    if(debug){
                        console.log('property[key], key='+key);
                        console.log(property[key]);
                        console.log('current_item['+key+'] old:');
                        console.log(current_item.attributes[key]);
                    }
                    if(property[key] == "true" || property[key] == "false"){
                        if(property[key] == "true"){
                            current_item.attributes[key] = true;
                        }else{
                            current_item.attributes[key] = false;
                        }
                    }else{
                        current_item.attributes[key] = property[key];
                    }
                    if(debug){
                        console.log('current_item['+key+'] now:');
                        console.log(current_item.attributes[key]);
                    }
                }
                this.setState({model: current_item}); //не нужно так как обновляется модель - не факт ибо нет ре-рендера
            },
            itemUpdateDependency: function(e){
                alert('Dependency Update');
                (debug)?console.log(e):null;
            },
            callControlRouter: function(model, prop){
                // Коллекция может быть еще не получена и тогда это приведет к неправильному Контролл-Роуту
                // коллекция ведь зависит от State
                // а может и нет - хз

                (debug)?console.warn('-> callControlRouter'):null;
                if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                    (debug)?console.log('this.props.model.attr_dependencies['+prop+']='+this.props.model.attr_dependencies[prop]):null;
                    if(this.state.dependency_array != null){
                        if(debug){
                            console.error('call to ControlRouter -> this.controlRouterCallWithDependency');
                            console.log('this.state.dependency_array['+prop+']');
                            console.log(this.state.dependency_array[prop]);
                        }
                            return this.controlRouterCallWithDependency(model, prop);
                    }
                }
                return this.controlRouterCall(model, prop);
            },
            controlRouterCallWithDependency: function(model, prop){
                if(debug){
                    console.info('controlRouterCallWithDependency');
                    console.info('this.state.dependency_array['+prop+']');
                    console.info(this.state.dependency_array[prop]);
                    console.info('model.attributes['+prop+']');
                    console.info(model.attributes[prop]);
                }
                return <ControlsRouter
                type={ControlsConfig[prop]}
                value={model.attributes[prop]}
                dependency_array = {this.state.dependency_array[prop]}
                name={prop}
                russian_name={model.attr_rus_names[prop]}
                callback={this.itemUpdate} key={prop} />;
            },
            controlRouterCall: function(model, prop){
                if(debug){
                    console.info('controlRouterCall-> model.attributes['+prop+']');
                    console.info(model.attributes[prop]);
                }
                return <ControlsRouter
                type={ControlsConfig[prop]}
                value={model.attributes[prop]}
                name={prop}
                russian_name={model.attr_rus_names[prop]}
                callback={this.itemUpdate} key={prop} />;
            },
            componentDidMount: function(){
                var cur_node = $(this.getDOMNode())[0];
                _.extend(cur_node, Backbone.Events);
                if(debug){
                    console.warn('=====================cur_node========================');
                    console.warn(cur_node);
                }
                cur_node.on('saveButtonClick', this.saveForm);
            },
            componentWillMount: function () {
                var self = this;
                for(var prop in this.props.model.attr_rus_names){
                    (debug)?console.log('mounting, prop: '+prop):null;
                    //check if he have sub-model to output

                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        if(debug){
                            console.warn(prop+' have dependency from ['+this.props.model.attr_dependencies[prop] +']');
                            console.log('loading models/'+this.props.model.attr_dependencies[prop]+'_collection');
                        }
                        if(this.props.model.attr_dependencies[prop]!='constant'){
                            if(debug){
                                console.warn('current model.attr_dependencies['+prop+'] NOT constant');
                            }
                            require([
                                'models/'+this.props.model.attr_dependencies[prop]+'_collection'
                            ], function(DependencyCollectionClass){
                                    var DependencyCollection = new DependencyCollectionClass;
                                    var dependency_array= self.state.dependency_array;
                                    if(debug){
                                        console.info('=*LOAD DEPENDENCY COLLECTION CLASS*=');
                                        console.info('TRYING FETCH!');
                                    }
                                    DependencyCollection.fetch({
                                        error: function(obj, response){
                                            (debug)?console.warn('error, response: '+response):null;
                                            EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                                        },
                                        success: function(){
                                            if(debug){
                                                console.info('success & Current collection:');
                                                console.info(DependencyCollection.toJSON());
                                            }
                                            var current_dependency = DependencyCollection.toJSON();
                                            dependency_array[DependencyCollection.collection_name] = current_dependency; //this why field name in model, and dependency should be equivalent BAD! Decision, but required for require Js use
                                            if(debug){
                                                console.info('current_dependency after fetch:');
                                                console.info(current_dependency);
                                                console.info('dependency array:');
                                                console.info(dependency_array);
                                            }
                                            self.setState({
                                                dependency_array: dependency_array
                                            });
                                        }
                                    });

                                }
                            );



                        }else{
                            (debug)?console.warn('current model.attr_dependencies['+prop+'] == constant'):null;

                            if(typeof Constants[prop] != 'undefined'){
                                var dep = {};
                                dep[prop] = Constants[prop];
                                self.setState({
                                    dependency_array: dep
                                })
                            }else{
                                EventBus.trigger('error', 'Ошибка', 'Зависимость определена как константа, но не найдена в списке констант.');
                            }
                        }
                    }
                }

                this.setState({
                    model: this.props.model
                });
            },
            componentWillUnmount: function () {
                //window.removeEventListener("saveButtonClick", this.saveForm, true);
            },
            render: function () {
                //var editable = this.props.prototype.editable_properties;
                var model = this.state.model;
                if(debug){
                    console.info('ItemEditBox -> RENDER');
                    console.log('ItemEditBox, model:');
                    console.log(model);
                    console.log('ItemEditBox, this.state:');
                    console.log(this.state);
                }
                var controls = [];
                var counter = 0;
                var dependencies_by_place = {};

                if(this.state.dependency_array!=null){
                if(model.dependency_values_fields!= null){
                    for(var dependency in model.dependency_values_fields){
                        if(debug){
                            console.info('this.state.dependency_array:');
                            console.info(this.state.dependency_array);
                            console.info('trying set to model...');
                        }
                        var target_field = model.dependency_values_fields[dependency];
                        var dependency_array = this.state.dependency_array;

                        _.each(dependency_array, function(dep_obj, key){
                            if(debug){
                                console.info('dep_obj');
                                console.info(dep_obj);
                                console.info('model.set('+target_field+', '+dep_obj[0][target_field]+')');
                            }
                            model.set('document_'+target_field, dep_obj[0][target_field]);
                        });


                        /*
                        for(var dependency_object in this.state.dependency_array){
                            var value = this.state.dependency_array[dependency_object];
                            console.info('value');
                            console.info(value[0].target_field);
                            console.info('model.set('+target_field+', '+value+')');
                            model.set(target_field, value[target_field]);
                        }*/
                    }
                }
                }

                if(debug){
                    console.info('ItemEditBox -> RENDER');
                    console.log('ItemEditBox, model:');
                    console.log(model);
                    console.log('ItemEditBox, this.state:');
                    console.log(this.state);
                }


                // Поля для зависимости
                for(var prop in model.attr_rus_names){
                    if(debug){
                        console.log('ControlsConfig['+prop+']='+ControlsConfig[prop]);
                        console.log('model.attributes['+prop+']='+model.attributes[prop]);

                    }

                    //Выводить скрытые поля для Добавления Нового
                    if(typeof model.hidden_fields != 'undefined' && model.hidden_fields != null){
                        (debug)?console.log('had hidden fields...'):null;
                        if(typeof model.hidden_fields[prop] != 'undefined'){
                            //console.info('hidden field['+prop+']! search for rules of output!');
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
                                        if(check_array == true){
                                            controls.push(
                                                this.callControlRouter(model, prop)
                                            );
                                        }
                                    }
                                    else{ //if(_.isString(rule_value) || _.isNumber(rule_value)){
                                        (debug)?console.log('model_value='+model_value+' rule_value='+rule_value):null;
                                        if(model_value == rule_value){
                                            (debug)?console.info('rule_value non array, output hidden field['+prop+']=='):null;
                                            controls.push(
                                                this.callControlRouter(model, prop)
                                            );
                                        }
                                    }
                                }
                            }
                        }else{
                            //have hidden_fields, but this is not that one
                            if(typeof model.view_only[prop]!='undefined'){

                                //nothing...
                            }else{
                                controls.push(
                                    this.callControlRouter(model, prop)
                                );
                            }
                        }
                    }else{
                        //does not have hidden_fields in model
                        controls.push(
                            this.callControlRouter(model, prop)
                        );
                    }
                }

                if(controls.length == 0){
                    EventBus.trigger('error', 'Ошибка', 'Не найдено ни одного контрола');
                    return(<ErrorMsg msg="Не найдено ни одного контрола" />);
                }
                var edit_box = [];
                edit_box.push(<form role="form" className="ControlsBox">{controls}</form>);

                return(
                    <div className="item">
                        {edit_box}
                    </div>
                    )
            }
        });

        var MainItemEdit = React. createClass({
            getInitialState: function() {
                return {
                    item: []
                }
            },
            callback: function(callback){
                this.props.callback(callback);
            },
            render: function(){
                if(debug){
                    console.log('MainItemEdit, this.props.model:');
                    console.log(this.props.model);
                }
                return(
                    <div>
                        <ItemEditBox model={this.props.model} callback={this.callback} />
                        <div className="modal_window"></div>
                    </div>
                    );
            }

        });

        return MainItemEdit;
    }
);

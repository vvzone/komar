define(
    'views/react/item_edit',
    [
        'underscore',
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'event_bus',
        'views/react/controls/controls_config',
        'jsx!views/react/controls/controls_router'
    ],function(_, $, React, BootstrapModal, EventBus, ControlsConfig, ControlsRouter){

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
                console.info('item to save');
                console.info(this.state.model);
                console.warn('this');
                console.warn(this);
                var mySelf = this;

                this.state.model.save(null, {
                    success:  function(model, response){
                        console.info('item_edit -> save success!');
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
                console.info('itemUpdate');
                var current_item = this.state.model;
                console.log('property:');
                console.log(property);

                for (var key in property) {
                    console.log('property[key], key='+key);
                    console.log(property[key]);
                    console.log('current_item['+key+'] old:');
                    console.log(current_item.attributes[key]);
                    current_item.attributes[key] = property[key];
                    console.log('current_item['+key+'] now:');
                    console.log(current_item.attributes[key]);
                }
                //current_item[property.db_prop_name] = property.value;
                //current_item[property.db_prop_name] = property.value;
                //this.setState({model: current_item}); не нужно так как обновляется модель
            },
            itemUpdateDependency: function(e){
                alert('Dependency Update');
                console.log(e);
            },
            controlRouterCall: function(model, prop){
                return <ControlsRouter
                type={ControlsConfig[prop]}
                value={model.attributes[prop]}
                name={prop}
                russian_name={model.attr_rus_names[prop]}
                callback={this.itemUpdate} key={prop} />;
            },
            componentWillMount: function () {
                window.addEventListener("saveButtonClick", this.saveForm, true);
                var self = this;
                for(var prop in this.props.model.attr_rus_names){
                    console.log('mounting, prop: '+prop);
                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        console.warn(prop+' have dependency from ['+this.props.model.attr_dependencies[prop] +']');

                        console.log('loading models/'+this.props.model.attr_dependencies[prop]+'_collection');
                        require([
                            'models/'+this.props.model.attr_dependencies[prop]+'_collection'
                        ], function(DependencyCollectionClass){
                                console.info('loading dependency module...');
                                console.info(self.props.model.collection.collection_name);
                                //var dependency_array = {};
                                var DependencyCollection = new DependencyCollectionClass;
                                var dependency_array= self.state.dependency_array;
                                console.info('dependency_array before fetch:');
                                console.info(dependency_array);
                                DependencyCollection.fetch({
                                    error: function(obj, response){
                                        console.warn('error, response: '+response);
                                        EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                                    },
                                    success: function(){
                                        console.info('success & Current collection:');
                                        console.info(DependencyCollection.toJSON());
                                        var current_dependency = DependencyCollection.toJSON();
                                        dependency_array[DependencyCollection.collection_name] = current_dependency; //this why field name in model, and dependency should be equivalent BAD! Decision, but required for require Js use
                                        console.info('current_dependency after fetch:');
                                        console.info(current_dependency);
                                        console.info('dependency array:');
                                        console.info(dependency_array);
                                        self.setState({
                                            dependency_array: dependency_array
                                        });
                                    }
                                });

                           }
                        );
                    }
                }

                this.setState({
                    model: this.props.model
                });
            },
            componentWillUnmount: function () {
                window.removeEventListener("saveButtonClick", this.saveForm, true);
            },
            render: function () {
                //var editable = this.props.prototype.editable_properties;
                var model = this.state.model;
                console.info('ItemEditBox -> RENDER');
                console.log('ItemEditBox, model:');
                console.log(model);
                console.log('ItemEditBox, this.state:');
                console.log(this.state);

                var controls = [];
                var counter = 0;
                var dependencies_by_place = {};

                for(var prop in model.attr_rus_names){
                    console.log('ControlsConfig['+prop+']='+ControlsConfig[prop]);
                    console.log('model.attributes['+prop+']='+model.attributes[prop]);

                    //Выводить скрытые поля для Добавления Нового

                    if(typeof model.hidden_fields != 'undefined'){
                        console.log('had hidden fields...');
                        if(typeof model.hidden_fields[prop] != 'undefined'){
                            console.info('hidden field['+prop+']! search for rules of output!');
                            console.log(model.hidden_fields[prop]);
                            var rule_obj = model.hidden_fields[prop];
                            if(rule_obj){
                                for(var field in rule_obj){
                                    var rule_value = rule_obj[field];
                                    var model_value = model.get(field);
                                    console.log('model_value='+model_value+' rule_value='+rule_value);
                                    if(_.isArray(rule_value)){
                                        console.log('rule_value IsArray, output hidden field==');
                                        //search in array
                                        var check_array = _.indexOf(rule_value, model_value) > -1;
                                        if(check_array === true){
                                            console.info('had in array, render control...');
                                            controls.push(
                                                this.controlRouterCall(model, prop)
                                            );
                                        }
                                    }
                                    if(_.isString(rule_value) || _.isNumber(rule_value)){
                                        if(model_value == rule_value){
                                            console.info('rule_value non array, output hidden field==');
                                            controls.push(
                                                this.controlRouterCall(model, prop)
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        //non-complex field
                        if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                            console.log('this.props.model.attr_dependencies['+prop+']='+this.props.model.attr_dependencies[prop]);
                            if(this.state.dependency_array != null){
                                //if(this.state.dependency_array['prop']!=null){
                                console.warn('call to ControlRouter');
                                console.log('this.state.dependency_array['+prop+']');
                                console.log(this.state.dependency_array[prop]);
                                controls.push(
                                    <ControlsRouter
                                    type={ControlsConfig[prop]}
                                    value={model.attributes[prop]}
                                    dependency_array = {this.state.dependency_array[prop]}
                                    name={prop}
                                    russian_name={model.attr_rus_names[prop]}
                                    callback={this.itemUpdate} key={prop} />);
                                //}
                            }
                        }else{
                            controls.push(
                                <ControlsRouter
                                type={ControlsConfig[prop]}
                                value={model.attributes[prop]}
                                name={prop}
                                russian_name={model.attr_rus_names[prop]}
                                callback={this.itemUpdate} key={prop} />
                            );
                        }
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
                //<ItemEditBox item={this.props.model} />
                console.log('MainItemEdit, this.props.model:');
                console.log(this.props.model);
                return(
                    <div>
                        <ItemEditBox model={this.props.model} callback={this.callback} />
                    </div>
                    );
            }

        });

        return MainItemEdit;
    }
);

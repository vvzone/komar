define(
    'views/react/item_open',
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

        var ItemOpenBox = React.createClass({
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
                console.info('saveForm-> item to save:');
                console.info(this.state.model);
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
                    if(property[key] == "true" || property[key] == "false"){
                        if(property[key] == "true"){
                            current_item.attributes[key] = true;
                        }else{
                            current_item.attributes[key] = false;
                        }
                    }else{
                        current_item.attributes[key] = property[key];
                    }
                    console.log('current_item['+key+'] now:');
                    console.log(current_item.attributes[key]);
                }
                //current_item[property.db_prop_name] = property.value;
                //current_item[property.db_prop_name] = property.value;
                this.setState({model: current_item}); //не нужно так как обновляется модель - не факт ибо нет ре-рендера
            },
            itemUpdateDependency: function(e){
                alert('Dependency Update');
                console.log(e);
            },
            callControlRouter: function(model, prop){
                // Коллекция может быть еще не получена и тогда это приведет к неправильному Контролл-Роуту
                // коллекция ведь зависит от State
                // а может и нет - хз

                console.warn('-> callControlRouter');
                if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                    console.log('this.props.model.attr_dependencies['+prop+']='+this.props.model.attr_dependencies[prop]);
                    if(this.state.dependency_array != null){
                        console.error('call to ControlRouter -> this.controlRouterCallWithDependency');
                        console.log('this.state.dependency_array['+prop+']');
                        console.log(this.state.dependency_array[prop]);
                            return this.controlRouterCallWithDependency(model, prop);
                    }
                }
                return this.controlRouterCall(model, prop);
            },
            controlRouterCallWithDependency: function(model, prop){
                console.info('controlRouterCallWithDependency');
                console.info('this.state.dependency_array['+prop+']');
                console.info(this.state.dependency_array[prop]);
                console.info('model.attributes['+prop+']');
                console.info(model.attributes[prop]);
                return <ControlsRouter
                type={ControlsConfig[prop]}
                value={model.attributes[prop]}
                dependency_array = {this.state.dependency_array[prop]}
                name={prop}
                russian_name={model.attr_rus_names[prop]}
                callback={this.itemUpdate} key={prop} />;
            },
            controlRouterCall: function(model, prop){
                console.info('controlRouterCall-> model.attributes['+prop+']');
                console.info(model.attributes[prop]);
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
                console.warn('=====================cur_node========================');
                console.warn(cur_node);
                cur_node.on('saveButtonClick', this.saveForm);
            },
            componentWillMount: function () {
                var self = this;
                for(var prop in this.props.model.attr_rus_names){
                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        if(this.props.model.attr_dependencies[prop]!='constant'){
                            require([
                                'models/'+this.props.model.attr_dependencies[prop]+'_collection'
                            ], function(DependencyCollectionClass){
                                    var DependencyCollection = new DependencyCollectionClass;
                                    var dependency_array= self.state.dependency_array;
                                    DependencyCollection.fetch({
                                        error: function(obj, response){
                                            console.warn('error, response: '+response);
                                            EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                                        },
                                        success: function(){
                                            var current_dependency = DependencyCollection.toJSON();
                                            dependency_array[DependencyCollection.collection_name] = current_dependency; //this why field name in model, and dependency should be equivalent BAD! Decision, but required for require Js use
                                            self.setState({
                                                dependency_array: dependency_array
                                            });
                                        }
                                    });

                                }
                            );
                        }else{
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
                console.info('ItemOpenBox -> RENDER, model:');
                console.log(model);

                var controls = [];
                var counter = 0;
                var dependencies_by_place = {};


                var attributes_box = [];
                console.info('model.get(document_attributes)');
                console.info(model.get('document_attributes'));
                //for(var attribute in model.get('document_attributes')){

                var attributes = model.get('document_attributes');
                _.each(attributes, function(num, key){
                    attributes_box.push(<div className={num.type}>{num.data}</div>);
                });

                var output_document = [];
                output_document.push(<div className="document_output">{attributes_box}</div>);

                for(var prop in model.attr_rus_names){
                    if(model.edit_only){
                        if(typeof model.edit_only[prop] != 'undefined'){
                            console.info('model.edit_only[prop]');
                            console.info(model.edit_only[prop]);
                            //hide!
                        }else{
                            console.log('ControlsConfig['+prop+']='+ControlsConfig[prop]);
                            console.log('model.attributes['+prop+']='+model.attributes[prop]);
                            console.info('model.edit_only['+prop+']');
                            console.info(model.edit_only[prop]);
                            controls.push(
                                <li>
                                    <div className="name">{model.attr_rus_names[prop]}:</div>
                                    <div className="data">{model.attributes[prop]}</div>
                                </li>
                            );
                        }
                    }
                }

                if(controls.length == 0){
                    EventBus.trigger('error', 'Ошибка', 'Не найдено ни одного контрола');
                    return(<ErrorMsg msg="Не найдено ни одного контрола" />);
                }
                var info_box = [];
                info_box.push(<form role="form" className="ControlsBox"><div className="annotation">Аннотация</div><ul className="info_box">{controls}</ul></form>);


                return(
                    <div className="item">
                        {output_document}
                        {info_box}
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
                        <ItemOpenBox model={this.props.model} callback={this.callback} />
                        <div className="modal_window"></div>
                    </div>
                    );
            }

        });

        return MainItemEdit;
    }
);

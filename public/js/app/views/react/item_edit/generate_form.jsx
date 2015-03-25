/** @jsx React.DOM */

define(
    'views/react/item_edit/generate_form',
        [
        'underscore','jquery', 'backbone', 'react',
        'config','event_bus', 'app_registry',

        'jsx!views/react/modals/bootstrap_modal_mixin',

        'views/react/controls/controls_config', 'models/constants',

        'jsx!views/react/item_edit/save_form',
        'jsx!views/react/item_edit/update_item',
        'jsx!views/react/item_edit/call_control_router',
        'jsx!views/react/item_edit/get_dependency',
        'jsx!views/react/item_edit/process_hidden_field'
    ],function(
        _, $, Backbone, React,
        Config, EventBus, app_registry,
        BootstrapModal,
        ControlsConfig, Constants,
        SaveFormMixin, UpdateItemMixin, CallControlRouterMixin, GetDependencyMixin, ProcessHiddenFieldMixin
        ){

        var debug = (Config['debug'] && Config['debug']['debug_item_edit'])? 1:null;

        var Form = React.createClass({
            mixins: [SaveFormMixin, UpdateItemMixin, CallControlRouterMixin, GetDependencyMixin, ProcessHiddenFieldMixin],
            getInitialState: function () {
                return {
                    model: [],
                    dependency_array: {}
                }
            },
            componentDidMount: function(){
                var cur_node = $(this.getDOMNode())[0];
                _.extend(cur_node, Backbone.Events);
                cur_node.on('saveButtonClick', this.saveForm);
            },
            componentWillMount: function () {
                var self = this;
                for(var prop in this.props.model.attr_rus_names){
                    //check if he have sub-model to output
                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        (debug)?console.log('prop w dependency: '+prop):null;

                        if(this.props.model.attr_dependencies[prop]!='constant'){
                            this.getDependency(prop);
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
            render: function () {
                console.warn('generate_form.jsx -> render');
                //var model = this.state.model;
                console.info(['this.props.model', this.props.model]);
                var model = this.props.model;
                var controls = [];
                if(this.state.dependency_array!=null){
                    if (model.dependency_values_fields != null) {
                        for (var dependency in model.dependency_values_fields) {

                            var target_field = model.dependency_values_fields[dependency];
                            var dependency_array = this.state.dependency_array;

                            _.each(dependency_array, function (dep_obj, key) {
                                model.set('document_' + target_field, dep_obj[0][target_field]);
                            });

                        }
                    }
                }

                for(var prop in model.attr_rus_names){
                    //Выводить скрытые поля для Добавления Нового
                    if(typeof model.hidden_fields != 'undefined' && model.hidden_fields != null){
                        if(typeof model.hidden_fields[prop] != 'undefined'){
                            controls.push(
                                this.processHiddenFiled(model, prop)
                            );
                        }else{
                            //have hidden_fields, but this is not that one
                            controls.push(
                                this.callControlRouter(model, prop)
                            );
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
                var form_box = [];

                if(this.props.sub_form){
                    form_box.push(<div className="sub_form">{controls}</div>); //can't nest form to form???
                }else{
                    form_box.push(<form role="form" className="ControlsBox">{controls}</form>); //can't nest form to form???
                }

                return(
                    <div className="item">
                        {form_box}
                        {this.getInterfaceButtons()}
                    </div>
                );
            },
            getInterfaceButtons: function(){
                if(this.props.interface){
                    return (
                        <div className="buttons">
                            <button type="button" className="btn btn-success" onClick={this.saveForm}>Сохранить</button>
                            <button type="button" className="btn btn-default" onClick={this.routeToCollection}>Отменить</button>
                        </div>
                    );
                }
            },
            routeToCollection: function(){
                var collection_name = this.props.model.model_name+'s';
                var new_route = 'admin/'+collection_name;
                (debug)?console.info(['new_route', new_route]):null;
                app_registry.router.navigate(new_route, true);

            },
            getSubForm: function(prop, values){
                (debug)?console.info(['getSubForm(prop, values)', prop, values]):null;
                var model = {};
                model = this.props.model.get(prop);

                return (<Form model={model} sub_form="true" />);
            }
        });

        return Form;
    }
);
/** @jsx React.DOM */

define(
    'views/react/item_edit/generate_form',
    [
        'underscore','jquery', 'backbone', 'react',
        'config','event_bus',

        'jsx!views/react/modals/bootstrap_modal_mixin',

        'views/react/controls/controls_config', 'models/constants',

        'jsx!views/react/item_edit/save_form',
        'jsx!views/react/item_edit/update_item',
        'jsx!views/react/item_edit/call_control_router',
        'jsx!views/react/item_edit/get_dependency',
        'jsx!views/react/item_edit/process_hidden_field',
        'jsx!views/react/item_edit/test'
    ],function(
        _, $, Backbone, React,
        Config, EventBus,
        BootstrapModal,
        ControlsConfig, Constants,
        SaveFormMixin, UpdateItemMixin, CallControlRouterMixin, GetDependencyMixin, ProcessHiddenFieldMixin, TestMixin
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
                var self, context = this;
                for(var prop in this.props.model.attr_rus_names){
                    //check if he have sub-model to output
                    if(this.props.model.attr_dependencies!=null && typeof(this.props.model.attr_dependencies[prop])!='undefined'){
                        (debug)?console.log('prop w dependency: '+prop):null;

                        if(this.props.model.attr_dependencies[prop]!='constant'){
                            this.getDependency(prop, context);
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
                var model = this.state.model;
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
                        console.info(['model, prop', model, prop]);
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

        return Form;
    }
);
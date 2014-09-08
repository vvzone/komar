define(
    'views/react/item_edit',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'event_bus',
        'views/react/controls/controls_config',
        'jsx!views/react/controls/controls'
    ],function($, React, BootstrapModal, EventBus, ControlsConfig, ControlRouter){

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
                    item_dependencies: []
                }
            },
            saveForm: function () {
                //this.props.model.save;
                console.info('item to save');
                console.info(this.state.model);
                this.state.model.save();
            },
            itemUpdate: function (property) {
                console.info('itemUpdate');
                var current_item = this.state.model;
                console.log('property:');
                console.log(property);

                for (var key in property) {
                    console.log('property[key]');
                    console.log(property[key]);
                    console.log('current_item[key] old='+current_item.attributes[key]);
                    current_item.attributes[key] = property[key];
                    console.log('current_item[key] now='+current_item.attributes[key]);
                }
                //current_item[property.db_prop_name] = property.value;
                //current_item[property.db_prop_name] = property.value;
                //this.setState({model: current_item}); не нужно так как обновляется модель
            },
            itemUpdateDependency: function(e){
                alert('Dependency Update');
                console.log(e);
            },
            componentWillMount: function () {
                window.addEventListener("saveButtonClick", this.saveForm, true);
                this.setState({model: this.props.model});
            },
            componentWillUnmount: function () {
                window.removeEventListener("saveButtonClick", this.saveForm, true);
            },
            render: function () {
                //var editable = this.props.prototype.editable_properties;
                var model = this.state.model;
                console.log('ItemEditBox -> model:');
                console.log(model);

                var controls = [];
                var counter = 0;
                var dependencies_by_place = {};


                for(var prop in model.attr_rus_names){
                    console.log('prop='+prop);
                    console.log('ControlsConfig[prop]='+ControlsConfig[prop]);
                    console.log('model.attributes[prop]='+model.attributes[prop]);
                    if(typeof(model.attr_dependencies[prop])!='undefined'){
                        console.warn('dependency from ['+model.attr_dependencies[prop] +']');
                        controls.push(

                        );
                    }else{
                        controls.push(
                            <ControlRouter
                            type={ControlsConfig[prop]}
                            value={model.attributes[prop]}
                            name={prop}
                            russian_name={model.attr_rus_names[prop]}
                            callback={this.itemUpdate} key={prop} />
                        );
                    }
                }

                // 2-do: //fix this
                // dependencies arrays are nightmare
               /* var dependencies = {};
                dependencies = model.attr_dependencies;
                //console.info('Object.prototype.toString.call(dependencies)='+Object.prototype.toString.call(dependencies));
                //console.info('typeof(dependencies)'+typeof(dependencies));
                if (typeof(dependencies) == 'object') {
                    for(var key in dependencies){
                        var place_key = dependencies[key].place;
                        console.info('place_key= '+place_key);
                        dependencies_by_place[place_key] = dependencies[key];
                    }
                }*/

                console.log('Editable');
                /*
                var self = this;
                for (var prop in editable) { // старое item - ошибочно так как выводило только не undefined поля текущего экземпляра обьекта
                    if (typeof(dependencies) == 'object') {
                        if (typeof dependencies_by_place[counter] != 'undefined' && typeof dependencies_by_place[counter].place != 'undefined') {
                            if (counter == dependencies_by_place[counter].place) {
                                controls.push(<EntityBlock
                                entity_name={dependencies_by_place[counter].class_name}
                                db_prop_name={dependencies_by_place[counter].db_prop_name}
                                item={item}
                                current_id={this.props.item[dependencies_by_place[counter].db_prop_name]}
                                callback={self.itemUpdateDependency} />);
                            }
                        }
                    }
                    if (editable[prop]) {
                        var type = prop;
                        controls.push(
                            <ControlRouter type={properties_types[type]} value={item[prop]} name={type} russian_name={editable[prop]} callback={this.itemUpdate} key={editable[prop]} />
                        );
                    }
                    counter++;
                }*/

                /*if(controls.length == 0){
                    EventBus.trigger('error', 'Ошибка', 'Не найдено ни одного контрола');
                    return(<ErrorMsg msg="Не найдено ни одного контрола" />);
                }*/

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
            render: function(){
                //<ItemEditBox item={this.props.model} />
                console.log('MainItemEdit, this.props.model:');
                console.log(this.props.model);
                return(
                    <div>
                        <ItemEditBox model={this.props.model} />
                    </div>
                    );
            }

        });

        return MainItemEdit;
    }
);

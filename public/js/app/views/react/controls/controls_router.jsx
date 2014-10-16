/** @jsx React.DOM */

define(
    'views/react/controls/controls_router',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',

        'jsx!views/react/controls/tiny_text',
        'jsx!views/react/controls/small_text',
        'jsx!views/react/controls/bool_select',

        'jsx!views/react/controls/list_box',
        'jsx!views/react/controls/simple_select',
        'jsx!views/react/controls/simple_list'
    ],function($, React, ControlsMixin,
               ControlTinyText, ControlSmallText, ControlBoolSelect,
               ListBox, SimpleSelect, SimpleList){

        /* Controls: text, selector, search */


        var ControlsRouter = React.createClass({
            /* Router  fix this as soon as some free time ;)
             * ---
             * props: value, type (route)
             *
             * */
            getInitialState: function() {
                return {
                    value: '',
                    discard: false
                };
            },
            componentWillMount: function(){
                console.log('ControlRouter -> '+this.props.name+'->'+this.props.type);
            },
            componentWillReceiveProps: function(prop){
                this.setState({discard: prop.discard});
            },
            callBack: function(property){
                this.props.callback(property);
            },
            render: function () {
                var type = this.props.type;
                var value = this.props.value;
                var name = this.props.name;
                var russian_name = this.props.russian_name;
                var discard = this.props.discard;
                var self = this;
                var dependency_array = this.props.dependency_array;
                switch (type) {
                    case('tiny_text'):
                        return(<ControlTinyText value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('small_text'):
                        return(<ControlSmallText value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('bool_select'):
                        return(<ControlBoolSelect value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('simple_select'):
                        console.info('control_router->simple_select, this.props:');
                        console.info(this.props);
                        return(<SimpleSelect options={this.props.dependency_array} selected={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('list_box'):
                        console.log('control_router->list_box');
                        return(<ListBox items_left={value} items_right={dependency_array}
                        name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('simple_list'):
                        console.log('control_router->simple_list');
                        console.info(this.props);
                        return(
                            <SimpleList collection={value} callback={self.callBack} />
                            );
                        break;
                }

                return(<div></div>)
            }
        });

        return ControlsRouter;
    }
);


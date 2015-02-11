/** @jsx React.DOM */

define(
    'views/react/controls/controls_router',
    [
        'jquery',
        'react',
        'config',
        'jsx!views/react/controls/controls_mixin',

        'jsx!views/react/controls/tiny_text',
        'jsx!views/react/controls/small_text',
        'jsx!views/react/controls/bool_select',

        'jsx!views/react/controls/list_box',
        'jsx!views/react/controls/simple_select',
        'jsx!views/react/controls/simple_list',
        'jsx!views/react/controls/levels',
        'jsx!views/react/controls/document_attributes',

        'models/node_levels_collection' //Убрать это отсюда к ебени матери как только время будет
    ],function($, React, Config, ControlsMixin,
               ControlTinyText, ControlSmallText, ControlBoolSelect,
               ListBox, SimpleSelect, SimpleList,
               NodeLevels,
               DocumentAttributes,
               NodeLevelsCollection
        ){

        console.log('controls_router loaded...');
        /* Controls: text, selector, search */

        var debug = (Config['debug'] && (Config['debug']['debug_control_router'] || Config['debug']['debug_controls_router']))? 1:null;

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
                (debug)?console.log('ControlRouter -> '+this.props.name+'->'+this.props.type):null;
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
                    case('icon_select'):
                        return(<div>Icon's Select</div>)
                        break;
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
                        return(<SimpleSelect options={this.props.dependency_array} selected={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('list_box'):
                        console.log('control_router->list_box');
                        return(<ListBox items_left={value} items_right={dependency_array}
                        name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                        break;
                    case('simple_list'):
                        if(debug){
                            console.log('control_router->simple_list');
                            console.info(this.props);
                        }
                        return(
                            <SimpleList collection={value} callback={self.callBack} />
                            );
                    break;
                    case('node_levels'):
                        if(debug){
                            console.log('control_router -> node_levels');
                            console.info(this.props);
                        }
                        return(
                          <NodeLevels collection={new NodeLevelsCollection(value)} callback={self.callBack}/>
                        );
                    break;
                    case('document_attribute_types'):
                        if(debug){
                            console.log('control_router -> document_attribute_types');
                            console.info(this.props);
                        }
                        return(
                            <DocumentAttributes attributes={value} callback={self.callBack}/>
                        );
                    break;
                }

                return(<div></div>)
            }
        });

        return ControlsRouter;
    }
);


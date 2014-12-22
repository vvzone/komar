/** @jsx React.DOM */

define(
    'views/react/controls/document_attributes',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/base/info_msg',
        'event_bus',

        'views/react/controls/controls_config',
        'jsx!views/react/controls/controls_router',
        'models/constants',

        'jsx!views/react/controls/tiny_text',
        'jsx!views/react/controls/small_text'
    ],function($, React, ControlsMixin, ButtonAdd, ButtonEdit, ButtonDelete, ErrorMsg, InfoMsg, EventBus,
               ControlsConfig, ControlsRouter, Constants,
               ControlTinyText, ControlSmallText
        ){

        /* Select */

        var DocumentAttributesList = React.createClass({
            render: function(){
                var attribute_box = [];
                console.info(this.props.attributes);
//ControlsConfig[attribute['machine_name']]
/*
*                         type="tiny_text"
 value={null}
 name={attribute['machine_name']}
 russian_name={attribute['name']}
 callback={this.itemUpdate} key={attribute['machine_name']}
* */

                _.map(this.props.attributes, function(attribute){
                    console.info('attribute');
                    console.info(attribute);
                    attribute_box.push(
                        //Заменить на контрол-роутер с конфигом
                         <ControlSmallText  value={null} name={attribute['machine_name']} russian_name={attribute['name']} />
                    );
                });
                /*
                 for(var attribute in this.props.attributes){
                    console.info('attribute');
                    console.info(attribute);
                    attribute_box.push(
                        <ControlSmallText  value={null} name={attribute['machine_name']} russian_name={attribute['name']} />
                    );
                }*/

                /*
                *                         <ControlsRouter
                 type={ControlsConfig[attribute['machine_name']]}
                 value={null}
                 name={attribute['machine_name']}
                 russian_name={attribute['name']}
                 callback={this.itemUpdate} key={attribute['machine_name']} />
                * */
                return(
                    <div className="document_attributes">
                        <div>{attribute_box}</div>
                    </div>
                );
            }
        });

        return DocumentAttributesList;
    }
);

define(
    'views/react/template/control_adapter/list_box',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/template/control_adapter/control_getters',

        'jsx!views/react/controls/list_box'
    ],
    function(
            $, _, Backbone, React, ControlGetters,
            ListBox
        ){
        var ControlAdapter = React.createClass({
            mixins: [ControlGetters],
            render: function(){
                return(
                    <ListBox items_left={this.getValue()} items_right={this.getDependencyArray()} name={this.getName()} russian_name={this.getRussianName()} callback={this.getCallBack} />
                )
            }
        });

        return ControlAdapter;
    }
);
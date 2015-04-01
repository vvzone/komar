define(
    'views/react/template/control_adapter/tiny_text',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/template/control_adapter/control_getters',

        'jsx!views/react/controls/tiny_text'
    ],
    function(
            $, _, Backbone, React, ControlGetters,
            TinyText
        ){
        var ControlAdapter = React.createClass({
            mixins: [ControlGetters],
            render: function(){
                return(
                    <TinyText value={this.getValue()} name={this.getName()} russian_name={this.getRussianName()} callback={this.getCallBack} error={this.getValidationError()} />
                )
            }
        });

        return ControlAdapter;
    }
);
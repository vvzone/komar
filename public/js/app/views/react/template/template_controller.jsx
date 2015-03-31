define(
    'views/react/template/template_controller',
    [
        'jquery','underscore', 'backbone', 'react',

        'jsx!views/react/template/form/person'
    ],
    function(
        $, _, Backbone, React,
        /* ---- FORM ---- */
        PersonForm

        /* --- OUTPUT ---*/
        ){
        var TemplateController = React.createClass({
            render: function(){
                console.info(['TEMPLATE this.props.template', this.props.template]);
                switch(this.props.template){
                    case('form/person'):
                        return(<PersonForm model={this.props.model} dependency_array={this.props.dependency_array} />);
                    break;
                }

                return(
                    <div>Default</div>
                )
            }
        });

        return TemplateController;
    }
);
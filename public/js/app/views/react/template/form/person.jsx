define(
    'views/react/template/form/person',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'
    ],
    function($, _, Backbone, React){
        var Template = React.createClass({
            render: function(){
                console.info(['TEMPLATE this.props', this.props]);
                return(
                    <div>TemplateTest</div>
                )
            }
        });

        return Template;
    }
);
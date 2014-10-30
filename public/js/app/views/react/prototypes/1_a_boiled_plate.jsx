/** @jsx React.DOM */

define(
    'views/react/prototypes/1_a_boiled_plate',
    [
        'jquery',
        'react'
    ],function($, React){

        var Component = React.createClass({
            getInitialState: function() {
                return {
                    item: null
                };
            },
            componentDidMount: function() {
                console.log('React-> ->DidMount');
            },
            render: function () {
                var output = '';
                return(
                    <div className="component">{output}</div>
                );
            }
        });

        return Component;
    }
);
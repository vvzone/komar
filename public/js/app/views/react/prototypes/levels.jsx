/** @jsx React.DOM */

define(
    'views/react/prototypes/levels',
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
                var output = 'LEVELS';
                return(
                    <div className="component">{output}</div>
                );
            }
        });

        return Component;
    }
);
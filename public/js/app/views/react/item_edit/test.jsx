/** @jsx React.DOM */

define(
    'views/react/item_edit/test',
    [
        'jquery',
        'bootstrap',
        'react'
    ], function($, Bootstrap, React){

        var TestMixin = function(){
            var test_value = 0;
            return{
                testFunction: function(){
                    console.log('test complete!');
                }
            }
        }();

        var TestComponent = React.createClass({
            render: function(){
                return <div>TestComponent</div>;
            }
        });

        //return TestMixin

        return TestComponent;
    }
);
/** @jsx React.DOM */

define(
    'views/react/item_edit/test',
    [], function(){

        var TestMixin = function(){
            var test_value = 0;
            return{
                testFunction: function(){
                    console.log('test complete!');
                }
            }
        }();

        return TestMixin
    }
);
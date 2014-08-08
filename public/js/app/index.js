/** @jsx React.DOM */

/*
 var React  = require('react');

 var TestEntityBlock = require('./test_entity.jsx');

 var TestEntity = React.createClass({
 getInitialState: function() {
 return {
 entity: function(){
 }
 }
 },
 entityRouter: function(obj, componentName){

 componentName = '<'+componentName+' />';

 React.renderComponent(componentName,
 document.getElementById('main_main'));
 },
 render: function(){
 var obj = this.props.entity_name;
 //var entity = this.entityRouter(obj, this.props.entity_name);

 var Component = this.props.entity_name;
 return(
 <div>{Component}></div>
 );
 }
 });

 var FunctionName = React.createClass({
 render: function(){
 return(<div>Done!</div>)
 }
 });
 */

React.renderComponent(
    CatScreen({cat: "base"}),
    document.getElementById('left_panel')
);


React.renderComponent(
    MainWindow({screen_name: "ranks"}), //screen_name="doc_kinds"
    document.getElementById('main_main')
);

/*
 React.renderComponent(
 <TestEntity entity_name="FunctionName" />,
 document.getElementById('main_main')
 );
 */




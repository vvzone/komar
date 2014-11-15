/** @jsx React.DOM */

define(
    'views/react/prototypes/levels_drag_and_drop_mixin',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'
    ],function($, _, Backbone, React){

        var storage = {};
        var LEFT_BUTTON = 0;
        var DRAG_THRESHOLD = 3;

        var DragAndDropClassMixin = function () {
            return{
                onMouseDown: function(event){
                    console.log('DragAndDropClassMixin -> onMouseDown');
                    if(event.button == LEFT_BUTTON){
                        event.stopPropagation();
                    }
                    this.addEvents();

                    var pageOffset = this.getDOMNode().getBoundingClientRect();

                    this.setState({
                        mouseDown: true,
                        originX: event.pageX,
                        originY: event.pageY,
                        elementX: pageOffset.left,
                        elementY:pageOffset.top
                    });
                },
                onMouseMove: function(event){
                    console.info('DragAndDropClassMixin -> onMouseMove ');
                    var deltaX = event.pageX - this.state.originX;
                    var deltaY = event.pageY - this.state.originY;
                    var distance = Math.abs(deltaX) + Math.abs(deltaY);

                    /*if(this.state.dragging == false && distance > DRAG_THRESHOLD ){
                        this.setState({
                            dragging: true
                        });
                        console.log('onMouseMove -> this.props.onDragStart call...');
                        this.props.onDragStart(this.props.dragData(this.props.node));
                    }
                    if(this.state.dragging){
                        this.setState({
                            left: this.state.elementX + deltaX + document.body.scrollLeft,
                            top: this.state.elementY + deltaY + document.body.scrollTop
                        });
                    }*/
                },
                onMouseUp: function(){
                    console.info('DragAndDropClassMixin -> onMouseUp');
                    this.removeEvents();
                    if(this.state.dragging){
                        this.props.onDragStop();
                        this.setState({
                            dragging: false
                        });
                    }
                },
                addEvents: function(){
                    //listeners for mouse_up, mouse_move
                    console.info('addEvents...');
                    document.addEventListener('mousemove', this.onMouseMove);
                    document.addEventListener('mouseup', this.onMouseUp);
                },
                removeEvents: function(){
                    //listeners for mouse_up, mouse_move
                    console.info('removeEvents...');
                    document.removeEventListener('mousemove', this.onMouseMove);
                    document.removeEventListener('mouseup', this.onMouseUp);
                }
            }
        }()

        return DragAndDropClassMixin;
    }
);
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
        var DragAndDropClassMixin = function () {
            return{
                dragStart: function(e) {
                    this.dragged = e.currentTarget;
                    e.dataTransfer.effectAllowed = 'move';
                    // Firefox requires dataTransfer data to be set
                    e.dataTransfer.setData("text/html", e.currentTarget);

                    var data = {id: e.currentTarget.id,
                        model: this.props.model};
                    console.log('dragStart -> data:');
                    console.log(data);
                    storage['dragged'] = data;
                    console.log('trying to save to storage... storage[dragged]:');
                    console.log(storage['dragged']);
                },
                dragOver: function(e) {
                    e.preventDefault(); // necessary!
                    this.over = e.currentTarget;
                    if(this.over == this.dragged){
                        return;
                    }
                    $(this.over).addClass('over_node');
                },
                dragLeave: function(e){
                    e.preventDefault(); // necessary!
                    $(this.over).removeClass('over_node');
                },
                dragEnd: function(e) {
                    e.preventDefault(); // necessary!
                    $(this.over).removeClass('over_node');
                },
                drop: function(e){
                    e.preventDefault();
                    console.warn('DROP');
                    $(this.over).removeClass('over_node');
                    var droppedOn = e.currentTarget;
                    if(droppedOn.id == storage['dragged']['id']){ //add same parent check
                        console.warn('stop');
                        return
                    }
                    var movedNode = {
                        dragged: storage['dragged'],
                        droppedOn_id: droppedOn.id
                    };
                    console.log('movedNode');
                    console.log(movedNode);
                    console.log('Mixin -> Props:');
                    console.log(this.props);
                    this.props.move(movedNode);
                }
            }
        }()

        return DragAndDropClassMixin;
    }
);
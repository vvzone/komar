/** @jsx React.DOM */

define(
    'views/react/controls/tree_mixin',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'

    ],function($, _, Backbone, React){
        var TreeClassMixin = function () {
            return{
                dragStart: function(e) {
                    this.dragged = e.currentTarget;
                    e.dataTransfer.effectAllowed = 'move';
                    // Firefox requires dataTransfer data to be set
                    e.dataTransfer.setData("text/html", e.currentTarget);
                    var data = {id: e.currentTarget.id,
                        node: this.state.node};
                    storage['dragged'] = data;
                },
                dragOver: function(e) {
                    e.preventDefault(); // necessary!
                    this.over = e.currentTarget;
                    if(this.over == this.dragged){
                        return;
                    }
                    $(this.over).addClass('tree_over_node');
                },
                dragLeave: function(e){
                    e.preventDefault(); // necessary!
                    $(this.over).removeClass('tree_over_node');
                },
                dragEnd: function(e) {
                    e.preventDefault(); // necessary!
                    $(this.over).removeClass('tree_over_node');
                },
                drop: function(e){
                    e.preventDefault();
                    console.warn('DROP');
                    $(this.over).removeClass('tree_over_node');
                    var droppedOn = e.currentTarget;

                    if(droppedOn.id == storage['dragged']['id']){ //add same parent check
                        console.warn('stop');
                        return
                    }
                    var movedNode = {
                        dragged: storage['dragged'],
                        droppedOn_id: droppedOn.id
                    };
                    var customEvent = new CustomEvent("TreeNodeMove",  {
                        detail: {movedNode: movedNode},
                        bubbles: true
                    });
                    this.getDOMNode().dispatchEvent(customEvent);
                }
            }
        }()

        return TreeClassMixin;
    }
);

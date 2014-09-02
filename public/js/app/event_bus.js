/**
 * Created by Victor on 29.08.14.
 */


define(
    'event_bus',
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function($, _, Backbone){

        var EventBus = {
        };
        _.extend(EventBus, Backbone.Events);

        return EventBus;
    }
);

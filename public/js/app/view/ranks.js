define(
    'views/ranks',
    [
        'jquery',
        'underscore',
        'backbone',
        'react'
    ],function($, _, Backbone, React){

        var RankView = Backbone.View.extend({
            el: "#main_main",
            template: _.template($("#template-movie").html()),

            initialize: function() {
                this.model.on("change", this.render);
            },
            render: function() {
                //console.log("MovieView render; Movie Title: " + this.model.get("title"));
                var htmlOutput = this.template(this.model.toJSON());
                this.$el.html(htmlOutput);
                return this;
            }
        });

        return RankView;
    }
);
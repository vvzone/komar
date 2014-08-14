// List of API URLs.


var URLs = {
    ranks: function() {
        return "/api/ranks";
    },
    rank: function(id) {
        return "/api/ranks/"+ id;
    },
    positions: function() {
        return "/api/positions";
    },
    position: function(id) {
        return "/api/positions/"+ id;
    }
    /*subscriptions: function(userId, id) {
     return "/api/users/"+ userId +"/subscriptions/" + id;
     }*/
};

//apiUrl добавить
var apiUrl = function(type) {
    return URLs[type] ?
        URLs[type].apply(this, [].slice.call(arguments, 1)) :
        undefined;
};

var Rank = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        order: null
    },
    url: function() {
        return apiUrl('rank', this.id);
    }
});

var Ranks = Backbone.Collection.extend({
    model: Rank,
    url: function() {
        return apiUrl('ranks');
    }
});

var Position = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        description: null,
        order: null
        //ranks: null //PositionRanks model
    },
    url: function() {
        return apiUrl('position', this.id);
    },
    initialize: function() {
        //var position_ranks = new Ranks(this.ranks); // -> view??
        //this.name.on("reset", this.updateCounts);
    }
});

var Positions = Backbone.Collection.extend({
    model: Position,
    url: function() {
        return apiUrl('positions');
    }
});

var PositionView = Backbone.View.extend({
    initialize: function() {
        this.ranks = new Ranks(
            this.get('ranks'), {url: apiUrl('position ranks', this.id)}
        );
    },
    render: function(){

    }
});


var PositionRanks = Backbone.Model.extend({
    /*
     * server-side
     *
     * no need this in client side
     * */
    defaults:{
        id: null,
        name: null, //Ranks model
        order: null
    },
    initialize: function() {
        //this.name = new Rank;
        //this.name.url = '/position/' + this.id+'/ranks/' ;
        //this.name.on("reset", this.updateCounts);
    }
});

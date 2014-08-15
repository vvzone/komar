define(
    'views/ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'models'
    ],function($, _, Backbone, React){

        var RanksCollection = new Backbone.CollectionView( {
            el : $( "ul#demoSingleSelectionList" ),
            selectable : true,
            collection : employeeCollection,
            modelView : EmployeeView
        } );

        return{

        };
    }
);
define('service/documentate' ,[
    // These are path alias that we configured in our bootstrap
    'jquery',     // ../
    'underscore', // ../
    'backbone'    // ../
], function($, _, Backbone){
    // Above we have passed in jQuery, Underscore and Backbone
    // They will not be accessible in the global scope
    console.log('service/documentate module loaded...');
    var collection_folder = '/js/app/models/';
    var file_extension = ".js";
    var restricted = ["_collection.js", "_router.js"];
    var exceptions = ['models/constants'];

    $.ajax({
        url: collection_folder,
        success: function(data){
            console.info('Directory '+collection_folder+':');
            console.info(data);

            var files = [];

            $(data).find("a[href$='"+file_extension+"']").not("a[href$='"+restricted[0]+"']").not("a[href$='"+restricted[1]+"']").each(function () {
                var filename = this.href.replace(window.location.host, "").replace("http:///", "");
                var model_name = filename.slice(0, filename.length - file_extension.length);
                files.push(model_name);
            });

            var files_ul_content = [];

            var output = [];
            output.push('<h1>Документация</h1>'); //class="object_documentation"

            $("#main_main").append('<h1>Документация объектов api/object</h1>');


            var test_func = function (Model) {
                var Model = new Model;
                var attr = Model.attributes;
                console.log(Model.model_name + ', attr:');
                console.log(attr);

                var table_header = '<tr><th colspan="2">'+Model.model_name+' / '+Model.model_rus_name+'</th></tr>';

                var attributes = [];
                _.each(attr, function(value, key){
                    if(typeof Model.attr_rus_names != 'undefined'){
                      if(typeof Model.attr_description != 'undefined'){
                        //check description
                          if(typeof Model.attr_description[key] != 'undefined'){
                              var attr_output_line =
                                  "<tr><td data-field='key'>"+key+"</td><td data-field='value'>"+Model.attr_description[key]+"</td></tr>";
                          }else{
                              //check rus_names
                              if(typeof Model.attr_rus_names[key] != 'undefined'){
                                  var attr_output_line =
                                      "<tr><td data-field='key'>"+key+"</td><td data-field='value'>"+Model.attr_rus_names[key]+"</td></tr>";
                              }else{
                                  var attr_output_line = "<tr><td>"+key+"</td><td></td></tr>";
                              }
                          }
                      }else{
                          //check rus_names
                          if(typeof Model.attr_rus_names[key] != 'undefined'){
                              var attr_output_line =
                                  "<tr><td data-field='key'>"+key+"</td><td data-field='value'>"+Model.attr_rus_names[key]+"</td></tr>";
                          }else{
                              var attr_output_line = "<tr><td>"+key+"</td><td></td></tr>";
                          }
                      }
                    }else{
                        var attr_output_line = "<tr><td>"+key+"</td><td></td></tr>";
                    }
                    attributes.push(attr_output_line);
                });

                var attributes_stroke = attributes.join("");
                console.info(attributes_stroke);
                if(Model.model_description){
                    table_header = table_header + '<tr><th colspan="2">'+Model.model_description+'</th></tr>';
                }
                var table = '<table class="object_documentation table table-striped table-bordered table-condensed">'+table_header+attributes_stroke+'</table>';
                $("#main_main").append(table);
            };

            files_ul_content = files.map(function(model_name){
                var item_output = model_name;
                var model_name = 'models/'+model_name;
                var Model = require([model_name], function(Model){
                    if(_.indexOf(exceptions, model_name)==-1){
                        return test_func(Model);
                    }
                });
            });



            //$("ul.documentate").html(files_ul_content);

        }
    });
    return {};
    // What we return here will be used by other modules
});

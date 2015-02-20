/** @jsx React.DOM */

define(
    'views/react/controls/paginator/paginator',
    [
        'jquery',
        'backbone',
        'react',
        'underscore',
        'app_registry'
    ],function($, Backbone, React, _, app_registry){
        var Paginator = React.createClass({
            getInitialState: function(){
                return {
                    page_count: null, // кол-во страниц
                    page_active: null, // активная страница
                    page_show: 5 //
                }
            },
            componentWillMount: function(){
                var page_count = this.props.pagination.total_pages;
                var page_active = this.props.pagination.current_page;
                this.setState({
                    page_count: page_count,
                    page_active: page_active
                });
            },
            render: function(){

                var current_page = this.props.pagination.active;
                var total_pages = this.props.pagination.total_pages;
                var per_page = this.props.pagination.records_per_page;

                var begin_and_end = this.calculateVisibleBlock();
                var begin = begin_and_end[0];
                var end = begin_and_end[1];

                var left_dots = this.leftDots(begin, end);
                var right_dots = this.leftDots(begin, end);

                console.info(['paginator', this.props.pagination]);
                console.info(['calc', begin_and_end, begin, end, left_dots, right_dots]);

                console.info(['app_registry', app_registry]);
                console.info(['router', app_registry.router]);
                console.info(['Backbone.history.fragment', Backbone.history.fragment]);
                var current_url = Backbone.history.fragment;
                console.info(current_url.indexOf("?"));
                var where_params_start = current_url.indexOf("?");
                where_params_start = where_params_start +'';
                if(where_params_start == -1){
                    where_params_start = current_url.length;
                }
                var new_url = 'admin#'+current_url.substring(0, where_params_start);
                console.info(['new_url', new_url]);

                var pages= [];
                var url =new_url;
                for(var i=1; i<total_pages+1; i++){
                    url = new_url + '?page='+i+'&limit='+per_page;
                    pages.push(
                        <span><a href={url}>{i}</a></span>
                    );
                }
                return (
                    <div className="paginator">
                        {pages}
                    </div>
                );
            },
            setLimitTen:function(){

            },
            setLimitTwenty: function(){

            },
            calculateVisibleBlock: function(){
                var range = Math.floor(this.state.page_show / 2);
                var nav_begin = this.state.page_active - range;
                if (this.state.page_show % 2 == 0) { // Если четное кол-во
                    nav_begin++;
                }
                var nav_end = this.state.page_active + range;

                return [nav_begin, nav_end]
            },
            leftDots: function(nav_begin, nav_end){
                var left_dots = true;
                if (nav_begin <= 2) {
                    nav_end = this.state.page_show;
                    if (nav_begin == 2) {
                        nav_end++;
                    }
                    nav_begin = 1;
                    left_dots = false;
                }
                return left_dots;
            },
            rightDots: function(nav_begin, nav_end){
                var right_dots = true;
                if (nav_end >= this.state.page_count - 1 ) {
                    nav_begin = this.state.page_count - this.page_show + 1;
                    if (nav_end == this.state.page_count - 1) {
                        nav_begin--;
                    }
                    nav_end = this.state.page_count;
                    right_dots = false;
                }
                return right_dots;
            }
        });

        return Paginator;
    }
);
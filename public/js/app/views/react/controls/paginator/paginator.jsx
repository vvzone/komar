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

        var Config = app_registry.config;
        var debug = (Config['debug'] && Config['debug']['debug_paginator'])? 1:null;

        var Paginator = React.createClass({
            getInitialState: function(){
                return {
                    page_count: null, // кол-во страниц
                    //page_active: null, // активная страница
                    page_show: 5 //
                }
            },
            componentWillMount: function(){

                //if(Config){

                    this.setState({
                        page_show: 5
                    });
                //}

                var page_count = this.props.pagination.total_pages;
                /*var page_active = this.props.pagination.current_page;
                this.setState({
                    page_count: page_count,
                    page_active: page_active
                });
                */
            },
            render: function(){
                var total_pages = this.props.pagination.total_pages;
                (debug)?console.info(['paginator', this.props.pagination]):null;
                (debug)?console.info(['app_registry.router', app_registry.router]):null;
                (debug)?console.info(['Backbone.history.fragment', Backbone.history.fragment]):null;

                /*
                var cash = 2.8388;
                var inflation = 0.035;
                var period = 20;

                for(var i=10; i<period; i++){
                    cash = cash + (cash*inflation);
                }
                console.log('cash', cash);
                */

                return (
                    <div className="paginator">
                        <ul className="pages">{this.getPagesBlock()}</ul>
                    </div>
                );
            },
            getPagesBlock: function(){
                var per_page = this.props.pagination.records_per_page;

                var begin_and_end = this.calculateVisibleBlock();
                var begin = begin_and_end[0];
                var end = begin_and_end[1];

                var left_dots = this.leftDots(begin, end);
                console.log(['leftDots(begin, end)', this.leftDots(begin, end),begin, end]);
                var right_dots = this.leftDots(begin, end);

                var current_page = this.props.pagination.current_page;

                var current_url = Backbone.history.fragment;

                (debug)?console.info(current_url.indexOf("?")):null;
                var where_params_start = current_url.indexOf("?");
                where_params_start = where_params_start +'';
                if(where_params_start == -1){
                    where_params_start = current_url.length;
                }
                var new_url = 'admin#'+current_url.substring(0, where_params_start);
                (debug)?console.info(['new_url', new_url]):null;

                var pages= [];
                (left_dots)?pages.push(<li><span className="previous">...</span></li>):null;
                var url =new_url;
                for(var i=begin; i<end+1; i++){
                    url = new_url + '?page='+i+'&limit='+per_page;
                    console.info(['current_page', current_page]);
                    if(i == current_page){
                        pages.push(
                            <li><span className="current_page">{i}</span></li>
                        );
                    }else{
                        pages.push(
                            <li><span><a href={url}>{i}</a></span></li>
                        );
                    }
                }
                (right_dots)?pages.push(<li><span className="next">...</span></li>):null;
                return pages;
            },
            setLimitTen:function(){

            },
            setLimitTwenty: function(){

            },
            calculateVisibleBlock: function(){
                var range = Math.floor(this.state.page_show / 2);
                var nav_begin = this.props.pagination.current_page - range;
                var zero_less = 0;
                if(nav_begin<=0){
                    zero_less = Math.abs(nav_begin)+1;
                    nav_begin = 1;
                }
                if (this.state.page_show % 2 == 0) { // Если четное кол-во
                    nav_begin++;
                }
                var nav_end = this.props.pagination.current_page + range + zero_less;
                return [nav_begin, nav_end];
            },
            leftDots: function(nav_begin, nav_end){
                var left_dots = true;
                if (nav_begin <= 1) {
                    nav_end = this.state.page_show;
                    if (nav_begin == 1) {
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
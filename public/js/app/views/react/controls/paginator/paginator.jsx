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

                var button_previous = this.leftDots(begin, end);
                console.log(['leftDots(begin, end)', this.leftDots(begin, end),begin, end]);
                var button_next = this.rightDots(begin, end);

                var current_page = this.props.pagination.current_page;


                var pages= [];
                pages.push(button_previous);
                var url = this.getUrl();
                for(var i=begin; i<end+1; i++){
                    url = this.makeUrl(i);
                    console.info(['current_page', current_page]);
                    if(i == current_page){
                        pages.push(
                            <li className="current_page">{i}</li>
                        );
                    }else{
                        pages.push(
                            <li><a href={url}>{i}</a></li>
                        );
                    }
                }
                pages.push(button_next);
                return pages;
            },
            getUrl: function(){
                var current_url = Backbone.history.fragment;
                var where_params_start = current_url.indexOf("?");
                (debug)?console.info(current_url.indexOf("?")):null;
                where_params_start = where_params_start +'';
                if(where_params_start == -1){
                    where_params_start = current_url.length;
                }
                var url = 'admin#'+current_url.substring(0, where_params_start);
                (debug)?console.info(['current_url, w/o params', url]):null;
                return url;
            },
            makeUrl: function(page){
                var per_page = this.props.pagination.records_per_page;
                var new_url = this.getUrl() + '?page='+page+'&limit='+per_page;
                return new_url;
            },
            getPrevButton: function(page){
                return (
                    <li className="paginator_control">
                        <a href={this.makeUrl(page)}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                        </a>
                    </li>);
            },
            getNextButton: function(page){
                return(
                    <li className="paginator_control">
                        <a href={this.makeUrl(page)}>
                            <span className="glyphicon glyphicon-chevron-right"></span>
                        </a>
                    </li>);
            },
            calculateVisibleBlock: function(){
                var range = Math.floor(this.state.page_show / 2);
                var nav_begin = this.props.pagination.current_page - range;
                var total  = this.props.pagination.total_pages
                var zero_less = 0;
                if(nav_begin<=0){
                    zero_less = Math.abs(nav_begin)+1;
                    nav_begin = 1;
                }
                if (this.state.page_show % 2 == 0) { // Если четное кол-во
                    nav_begin++;
                }
                console.info(['this.props.pagination.current_page + range + zero_less', this.props.pagination.current_page,range,zero_less]);

                var nav_end = this.props.pagination.current_page + range + zero_less;

                if(nav_end > total){
                    var delta = nav_end - total;
                    nav_end = total;
                    if(nav_begin+1 > delta){
                        nav_begin  = nav_begin-delta;
                    }
                }
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
                    return left_dots = false;
                }

                var previous_page = nav_begin-1;
                return this.getPrevButton(previous_page);
            },
            rightDots: function(nav_begin, nav_end){
                console.info(['rightDots: nav_begin, nav_end', nav_begin, nav_end]);
                var right_dots = true;
                var total  = this.props.pagination.total_pages;
                console.info(['total', total]);

                if (nav_end > total - 1 ) {
                    nav_begin = total - this.page_show + 1;
                    if (nav_end == total - 1) {
                        nav_begin--;
                    }
                    nav_end = total;
                    right_dots = false;
                }

                var next_page = nav_end+1;
                return (right_dots)?this.getNextButton(next_page):false;
            }
        });

        return Paginator;
    }
);
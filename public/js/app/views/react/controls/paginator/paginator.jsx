/** @jsx React.DOM */

define(
    'views/react/controls/paginator/paginator',
    [
        'jquery',
        'backbone',
        'react',
        'underscore',
        'app_registry',
        'config'
    ],function($, Backbone, React, _, app_registry, Config){

        //var Config = app_registry.config;
        var debug = (Config['debug'] && Config['debug']['debug_paginator'])? 1:null;

        var Paginator = React.createClass({
            getInitialState: function(){
                return {
                    page_count: null, // кол-во страниц
                    //page_active: null, // активная страница
                    page_show: 9,
                    per_page: 10,
                    current_url: null,
                    //current_page: null,
                    total_records: null,
                    total_pages: null
                }
            },
            componentWillMount: function(){
                if(Config){
                    this.setState({
                        page_show: Config.paginator.default_raginator_range
                    });
                }
                this.setState({
                    page_count: this.props.pagination.total_pages,
                    per_page: this.props.pagination.records_per_page,
                    total_records: this.props.pagination.total_records,
                    total_pages: this.props.pagination.total_pages,
                    current_url: this.getUrl(),
                    current_page: this.props.pagination.current_page //- будет обновлять карент только единожды
                });
            },
            render: function(){
                var total_pages = this.props.pagination.total_pages;
                (debug)?console.info(['paginator', this.props.pagination]):null;
                (debug)?console.info(['app_registry.router', app_registry.router]):null;
                (debug)?console.info(['Backbone.history.fragment', Backbone.history.fragment]):null;
                return (
                    <div className="paginator">
                        <ul className="pages">{this.getPagesBlock()}</ul>
                        <div className="limit"><label for="options_block">Выводить по:</label>{this.getLimitBlock()}</div>
                    </div>
                );
            },
            getNewLimitUrl: function(new_limit){
                var current_page = this.props.pagination.current_page;
                var current_limit = this.props.pagination.records_per_page;
                var total_records = this.props.pagination.total_records;
                var total_pages = this.props.pagination.total_pages

                var current_first = (current_limit*(current_page-1))+1;
                var new_page = Math.ceil(current_first/new_limit);

                var new_url = this.getUrl() + '?page='+new_page+'&limit='+new_limit;
                return new_url;
            },
            getLimitBlock: function(){
                var limits = [];
                if(Config['paginator']['per_page_options']){
                    limits = Config['paginator']['per_page_options'];
                }else{
                    limits = [10, 20, 50];
                }
                var options = [];
                for(var i=0; i<limits.length; i++){
                    options.push(
                        <li><a href={this.getNewLimitUrl(limits[i])}>{limits[i]}</a></li> //
                    );
                }
                var output = [];
                output.push(<ul className="options_block">{options}</ul>);
                return output;
            },
            getPagesBlock: function(){
                var per_page = this.props.pagination.records_per_page;
                if(this.props.pagination.total_pages==1){
                    return false;
                }
                var begin_and_end = this.calculateVisibleBlock();
                var begin = begin_and_end[0];
                var end = begin_and_end[1];

                var button_previous = this.leftDots(begin, end);
                (debug)?console.log(['leftDots(begin, end)', this.leftDots(begin, end),begin, end]):null;
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
                    (debug)?console.info(['calculating current_url']):null;
                    var current_url = Backbone.history.fragment;
                    var where_params_start = current_url.indexOf("?");
                    (debug)?console.info(current_url.indexOf("?")):null;
                    where_params_start = where_params_start +'';
                    if(where_params_start == -1){
                        where_params_start = current_url.length;
                    }
                    var url = 'admin#'+current_url.substring(0, where_params_start);
                    (debug)?console.info(['current_url, w/o params', url]):null;
                    this.setState({
                        current_url: url
                    });
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
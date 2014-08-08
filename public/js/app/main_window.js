/** @jsx React.DOM */

var MainWindow = React.createClass({displayName: 'MainWindow',
    getInitialState: function() {
        return {
            screen_name: ''
        };
    },
    handleCatLinkClick: function(e) {
        this.setState({screen_name: e.detail.screen_name});
    },
    componentWillMount: function() {
        if(this.props.screen_name!=null){
            this.setState({screen_name: this.props.screen_name});
        }
        window.addEventListener("catLinkClick", this.handleCatLinkClick, true);
    },
    componentWillUnmount: function() {
        window.removeEventListener("catLinkClick", this.handleCatLinkClick, true);
    },
    render: function(){
        return(
            React.DOM.div(null,
                BaseScreen({screen_name: this.state.screen_name}),
                ModalWindowRouter(null)
            ))
    }
});

var BaseScreen = React. createClass({displayName: 'BaseScreen',
    getInitialState: function() {
        return {
            screen_name: '',
            entities: []
        };
    },
    componentWillMount: function() {
        if(this.props.screen_name==null){
            this.setState({screen_name: 'welcome'})
        }
        this.setState({screen_name: this.props.screen_name});
        var entities = screen_entities;
        this.setState({entities: entities});
    },
    render: function(){
        var render_entities = [];

        /* Вывод множественных сущностей для одного экрана. Пока хз зачем */
        if(Object.prototype.toString.call(this.state.entities[this.props.screen_name]) === '[object Array]'){
            console.info('yes');
            render_entities =this.state.entities[this.props.screen_name].map(function(ent){
                return(EntityBlock({entity_name: ent, key: ent}));
            });
        }else{
            /*  пробовать найти класс все равно*/
            return(EntityBlock({entity_name: this.props.screen_name, key: this.props.screen_name}));
        }
        return(React.DOM.div(null, render_entities))
    }
});

var ModalWindowRouter = React.createClass({displayName: 'ModalWindowRouter',
    getInitialState: function() {
        return {
            action: '',
            entity: '',
            current_id: '',
            item: ''
        };
    },
    modalOpen: function(event) {
        this.setState({
            action: event.detail.action,
            entity: event.detail.entity,
            current_id: event.detail.current_id,
            item: event.detail.item
        });
        console.log('event.detail');
        console.log(event.detail);
    },
    modalClose: function(){
        this.setState({
            action: '',
            entity: '',
            current_id: '',
            item: ''
        });
    },
    componentWillMount: function() {
        window.addEventListener("modalWindowOpen", this.modalOpen, true);
        window.addEventListener("modalWindowClose", this.modalClose, true);
    },
    componentWillUnmount: function() {
        window.removeEventListener("modalWindowOpen", this.modalOpen, true);
        window.addEventListener("modalWindowClose", this.modalClose, true);
    },
    render: function(){
        console.log('action and state:' + this.state.action);
        console.log(this.state.current_id);
        switch(this.state.action){
            case 'add':
                return(ModalWindowAdd({entity: this.state.entity, host: this.state.item}));
                break;
            case 'edit':
                return(ModalWindowEdit({entity: this.state.entity, current_id: this.state.current_id}));
                break;
            case 'delete':
                return(ModalWindowDelete({entity: this.state.entity, current_id: this.state.current_id, item: this.state.item}));
                break;
            case 'save':
                return(ModalWindowSave(null));
                break;
        }
        return(React.DOM.div(null, " "));
    }
});


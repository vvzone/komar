/** @jsx React.DOM */

var InterestRow = React.createClass({
    render: function() {
        return (
            <div>
                <label>{this.props.interest.name}</label>
                <input type="checkbox" ref={this.props.key} value={this.props.key} />
            </div>
        )
   }
});

var InterestPanel = React.createClass({
    var interestPanel = this;
    var rows = [];

    render: function() {
        var rows = [];
        var i = 0;

        _(this.props.interests).each(function (interest) {
            rows.push(<InterestRow interest={interest} key={interest.value} />);
        });

        return (
            <form>{rows}</form>
        )
    }
});

var CategoryRow = React.createClass({
    render: function() {
        return (
            <li onClick={this.props.handleClick.bind(null, this.props.interests)}>{this.props.category}</li>
        )
    }
});

var CategoriesPanel = React.createClass({
render: function() {
    var categoriesPanel = this;
    var rows = [];
    var categories = [];
    var interests = [];
    var interestSet = [];
    var missedSet = [];
    var lastCategory = null;
    var category;
    var interest;
    var i = 0;

    _.each(categoriesPanel.props.data, function (datum) {
        name = datum.name;
        value = datum.targeting_value;
        category = name.split('/')[0];
        interest = {name: name.split('/')[1], value: value}

        if (_.contains(interest.name.toLowerCase(), categoriesPanel.props.searchText.toLowerCase())) {
            if (category !== lastCategory) {
                if (interestSet.length > 0) {
                    interests.push(interestSet.concat(missedSet));
                }

                lastCategory = category;
                categories.push(category);
                interestSet = [];
                interestSet.push(interest);
                missedSet = [];
            } else {
                if (!_.contains(categories, category)) {
                    categories.push(category);
                    interestSet.push(interest);
                } else {
                    interestSet.push(interest);
                }
            }
        } else {
            if (category !== lastCategory) {
                if (interestSet.length > 0) {
                    interests.push(interestSet.concat(missedSet));
                }

                lastCategory = category;
                interestSet = [];
                missedSet = [];
                missedSet.push(interest);
            } else {
                missedSet.push(interest);
            }
        }
    });

    if (interestSet.length > 0) {
        interests.push(interestSet.concat(missedSet));
    }

    var interestsObject = _.zipObject(categories, interests);

    _.each(interestsObject, function (interestSet, category) {
        i++;
        rows.push(<CategoryRow category={category} key={i} interests={interestSet} handleClick={categoriesPanel.props.handleClick} />)
    });

    return (
        <div>
            <ul>{rows}</ul>
        </div>
    )
}
});

var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.searchTextInput.getDOMNode().value
        )
    },
    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Search Interests..."
                    value={this.props.searchText}
                    ref="searchTextInput"
                    onChange={this.handleChange}
                />
            </form>
        );
     }
});

var InterestsTable = React.createClass({
loadDataFromTwitter: function() {
    $.ajax({
        url: this.props.url,
        dataType: 'json',
        success: function(data) {
            this.setProps({data: data});
        }.bind(this)
    });
},
getInitialState: function() {
   return {
       searchText: ''
   }
},
getDefaultProps: function() {
   return {
       data: [],
       interests: []
   }
},
componentWillMount: function() {
    this.loadDataFromTwitter();
},
handleUserInput: function(searchText) {
   this.setState({
       searchText: searchText
   });
},
handleCategoryRowClick: function(interests) {
    this.setProps({
        interests: interests
    });
},
render: function() {
    return (
        <div>
            <SearchBar
                searchText={this.state.searchText}
                onUserInput={this.handleUserInput}
            />
            <CategoriesPanel
                data={this.props.data}
                searchText={this.state.searchText}
                handleClick={this.handleCategoryRowClick}
            />
            <InterestsPanel
                interests={this.props.interests}
                searchText={this.state.searchText}
            />
        </div>
    );
}
});

React.renderComponent(
     <InterestsTable url="/api/interests" />,
    document.getElementById('content')
);
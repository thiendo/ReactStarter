var React = require('react');
var ReactDOM = require('react-dom');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var Header = require('./header');
var List = require('./list');
var rootURL = 'https://my-first-react-84bfa.firebaseio.com/';

var Hello = React.createClass({
  // allow to create one-way data binding from our Firebase database to our component's this.state variable
  // mixins copy object from component
  // if remove mixins then bindAsObject cannot continue
  mixins: [ ReactFire ],
  getInitialState: function() {
    return {
      items: {},
      loaded: false
    }
  },
  componentWillMount: function() {
    // Look for data - items where data is stored
    // bindAsObject bind ReactFire - bind Firebase data
    this.fb = new Firebase(rootURL + 'items/');
    this.bindAsObject(this.fb, 'items');
    // this.state.items => {}
    this.fb.on('value', this.handleDataLoaded);
  },
  handleDataLoaded: function () {
    this.setState({loaded: true});
  },
  render: function() {
    console.log(this.state);

    return <div className="row panel panel-default">
      <div className="col-md-8 col-md-offset-2">
        <h2 className="text-center">
          To-Do List
        </h2>
        <Header itemsStore={this.firebaseRefs.items} />
        <hr />
        <div className={"content " + (this.state.loaded ? 'loaded' : '')}>
          <List items={this.state.items} />
          {this.deleteButton()}
        </div>
      </div>
    </div>
  },
  deleteButton: function() {
    if(!this.state.loaded) {
      return
    } else {
      return <div className="text-center clear-complete">
        <hr />
        <button
          type="button"
          onClick={this.onDeleteDoneClick}
          className="btn btn-default">
          Clear Complete
        </button>
      </div>
    }
  },
  onDeleteDoneClick: function() {
    for(var key in this.state.items) {
      if(this.state.items[key].done === true) {
        this.fb.child(key).remove();
      }
    }
  }
});

var element = React.createElement(Hello, {});
ReactDOM.render(element, document.querySelector('.container'));

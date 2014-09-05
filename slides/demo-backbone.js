/**
 * @jsx React.DOM
 */
// API Keys
var pubnub = PUBNUB.init({
    subscribe_key : 'demo',
    publish_key   : 'demo'
});


var MutationReporter = React.createClass({
  getInitialState: function(){
    return {
      observer: null,
      adds: 0,
      removes: 0,
      texts: 0,
      attrs: 0
    }
  },

  componentDidMount: function() {
    var callback = this._handleMutation;
    this.state.observer = new MutationObserver(function(records) {
      records.forEach(callback);
    });

    this.state.observer.observe(this.props.target, {
      childList : true,
      characterData : true,
      attributes: true,
      subtree : true,
      attributeOldValue: true
    });
  },

  _getTagName: function(elt) {
    if (!elt) {
      return '';
    }
    return elt.tagName;
  },

  _handleMutation: function(mutation) {
    switch (mutation.type) {
     case 'childList':
       if (mutation.addedNodes[0] && mutation.addedNodes[0].wholeText) {
        this.setState({texts: this.state.texts + 1});
         console.log('Changed Text ---> '+ mutation.addedNodes[0].wholeText);
       } else {
        this.setState({adds: this.state.adds + mutation.addedNodes.length});
        this.setState({removes: this.state.adds + mutation.removedNodes.length});
        console.log('Added '+ mutation.addedNodes.length + ' ' + this._getTagName(mutation.addedNodes[0]) + ', removed '+ mutation.removedNodes.length + ' ' + this._getTagName(mutation.removedNodes[0]));
       }
       break;
     case 'attributes':
      this.setState({attrs: this.state.attrs + 1});
      console.log('Attr '+ mutation.attributeName + ' changed from '+ mutation.oldValue + ' to ' + mutation.target.getAttribute(mutation.attributeName));
      break;
     case 'characterData':
       console.log('Text '+ mutation.attributeName + ' changed from '+ mutation.oldValue);
       break;
    }
  },

  render: function() {
    return (
      <table>
        <tr>
          <td>Added</td>
          <td>Removed</td>
          <td>Text</td>
          <td>Attrs</td>
        </tr>
        <tr>
          <td>{this.state.adds}</td>
          <td>{this.state.removes}</td>
          <td>{this.state.texts}</td>
          <td>{this.state.attrs}</td>
        </tr>
      </table>
     );
  }
});



// Backbone

var Transaction = Backbone.Model.extend({});
var Transactions = Backbone.Collection.extend({
  model: Transaction
});

// var AppView = Backbone.View.extend({
//   events: {
//     'click .start': this._start,
//     'click .stop': this._stop
//   },
  
//   _start: function() {
//     alert('start');
//   },
// });

var TransactionView = Backbone.View.extend({
  tagName: 'ul',
  tpl: _.template("<li class='<%= (perc < 0) ? 'loss' : 'gain' %>'><%=time%>: <%=ticker%> <%=price%> (<%=perc%>)</li>"),
  
  initialize: function() {
    this.listenTo(this.collection, 'add', this.render.bind(this));
  },
  
  render: function() {
    this.$el.html('');
    var _this = this;
    this.collection.each(function(trx) {
      var node = _this.tpl(trx.toJSON());
      _this.$el.append(node);
    });
    return this;
  }
});

var collection = new Transactions();

pubnub.subscribe({
  channel : ['GOOG', 'AAPL', 'FB'],
  message : function(data, raw, symbol) {
    data.ticker = symbol;
    collection.push(data);
    if (collection.length >= 10) {
      collection.shift();
    }
  }
});

setTimeout(function(){
  pubnub.unsubscribe({channel : ['GOOG', 'AAPL', 'FB']});
}, 10000);

var view = new TransactionView({
  collection: collection
});


var scoreboard = document.getElementById('scoreboard');
var main = document.getElementById('main');

$(main).append(view.render().$el);

React.renderComponent(<MutationReporter target={main} />, scoreboard);
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



// React Component

var Transactions = React.createClass({

  getInitialState: function(){
    return {
      trx: [],
      symbols: ['GOOG', 'AAPL', 'FB'],
      running: false
    }
  },

  _handleNew: function(data, raw, symbol) {
    data.ticker = symbol;
    data.key = data.time+data.ticker+data.price;
    data.category = data.perc < 0 ? 'loss' : 'gain';
    var updated = this.state.trx.concat(data);
    if (updated.length > 10) {
      updated = updated.slice(1, updated.length);
    }
    this.setState({trx: updated});
  },

  _startTicker: function() {
    pubnub.subscribe({
      channel : this.state.symbols,
      message : this._handleNew
    });
    this.setState({running: true});
    setTimeout(this._stopTicker.bind(this), 10000);
  },

  _stopTicker: function() {
    pubnub.unsubscribe({
      channel : this.state.symbols
    });
    this.setState({running: false});
  },

  _toggle: function() {
    if (this.state.running) {
      this._stopTicker()
    } else {
      this._startTicker()
    }
  },

  _clear: function() {
    this.setState({trx: []});
  },

  componentDidMount: function() {
    this._toggle();
  },

  componentWillUnmount: function() {
    this._stopTicker();
  },

  render: function() {
    return (
      <div>
        <ul>
          {this.state.trx.map(function(trx) {
            return (
              <li key={trx.key} className={trx.category}>
                {trx.time}: {trx.ticker} {trx.price} ({trx.perc})
              </li>
             )
          })}
        </ul>
        <button onClick={this._toggle}>{this.state.running ? 'Stop' : 'Start/Resume'}</button>
        <button onClick={this._clear}>Reset</button>
      </div>
    );
  }
});

var scoreboard = document.getElementById('scoreboard');
var main = document.getElementById('main');

React.renderComponent(<Transactions />, main);
React.renderComponent(<MutationReporter target={main} />, scoreboard);

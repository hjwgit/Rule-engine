var d = require('durable');
var request = require('request');

/** publish warning message (close valve) to deviceshadow
 * @param did
 * @param msg
 */
var sendWarning = function () {
  // TODO : should check database first
  // or this part in run action will be set completely in ruleset

};




var sendReq = function () {

  var body = {
    water: 45,
  };

  var options = { method: 'POST',
    url: 'http://localhost:5000/stateValve/events',
    headers: { 'content-type': 'application/json' },
    body: body,
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    console.log(body);
  });
};
var a = 'cccc';
var act =  function () {
  console.log('intofn');
  console.log(arguments);
  console.log(a);
};
var val = 100;

var m = d.m;
d.statechart('stateValve', {

  // initial state 'init' with two triggers
  init: [{
    to: 'safe',
    whenAll: m.water.lt(val),
    run: function (c) {
      console.log(c);
      console.log('has one post: ' + c.m.water);
      act();
    }
  },{
    to: 'dangerous',
    whenAll: m.water.gte(val),
    run: function (c) {
      console.log('be dangerous: ' + c.m.water);
    }
  }],

  // state 'safe'
  safe: [{
    to: 'safe',
    whenAll: m.water.lt(val),
    run: function (c) {
      console.log('still safe: ');
      console.log(c.m.water);
      act();
    }
  },{
    to: 'dangerous',
    whenAll: m.water.gte(val),
    run: function (c) {
      console.log('to dangerous: ');
      console.log(c.m.water);
      act();
    }
  }],

  // state 'dangerous'
  dangerous: [{
    to: 'safe',
    whenAll: m.water.lt(val),
    run: function (c) {
      console.log('leave out of danger');
      // TODO: clear the database of all events
    }
  },{

    to: 'dangerous',
    whenAll: m.water.gte(val),
    count: 3,
    run: function (c) {
      console.log('still dangerous for 3 times' + c.m.length + JSON.stringify(m));

      //TODO: publish warning
    }
  }
  ],

});

d.runAll();

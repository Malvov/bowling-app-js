require('neon');
require('neon/stdlib');
require('fluorine');
var fs = require('fs');
var util = require('util');
var path = require('path');


Class('GameRunner')({
    prototype: {
	id: null,
	gamesPath: '',
	gamePath: '',
        init: function init(config) {
	    if (typeof config === 'undefined') {
	        return this;
	    }
	    Object.keys(config).forEach(function(propertyName) {
	        this[propertyName] = config[propertyName];
	    }, this);
	    this.id = this.id || uid();
	    this.gamePath = path.join(this.gamesPath, this.id + '.json');
	},
	createGameFolder: function createGameFolder(callback) {
	    fs.writeFile(this.gamePath, JSON.stringify({ frames: [] }), function (error) {
	          if (error) {
		      console.log(error);
		      callback(error);
		  }

		  console.log('File created');
		  callback(null);
	    });
	},
	readGameFolder: function readGameFolder(callback) {
	    fs.readFile(this.gamesPath, function(error, data) {
	        if (error) {
		    console.log(error);
		    callback(error);
		    return;
		}

		try {
		    var gameData = JSON.parse(data);
		    callback(null, gameData);
		    return;
		} catch (e) {
		    console.log(e);
		    callback(e);
		}
	    });
	},
	validateFramesLength: function validateFramesLength(gameData) {
	    var frames = gameData.frames;
	    return frames.lengtth >= 10;
	}
    }
});

Class('Game')({
     newGame: function newGame(request, response) {
         var gameRunner = new GameRunner(CONFIG);
	 var flow = new Flow({ name: 'create game flow' });
	 flow.bind('reject', function (event) {
	     flow.unbind('reject');
	     var node = event.node;
	     console.log(util.inspect(node));
	     flow.destroy();
	     return response.status(500).send({ error: node });
	 });

	 flow.step('createGameFolder')(function (step) {
	     gameRunner.createGameFolder(function (error) {
	         if (error) {
		     step.fail(error)
		     return;
		 }
	     });

	     step.success();
	 });

	 flow.step('respond').dependsOn('createGameFolder')(function (step) {
	     step.success();
	     flow.destroy();
	     return response.status(201).send({ gameId: gameRunner.id });
	 });
     },
     validateGame: function validateGame(request, response) {
          var gameId = request.body.gameId;
	  CONFIG.id = gameId;
	  var gameRunner = new GameRunner(CONFIG);
	  var flow = new Flow({ name: 'validate game flow' });
	  flow.bind('reject', function (event) {
	      flow.unbind('reject');
	      flow.destroy();
	      var node = event.data.node;
	      console.log(util.inspect(node));
	      return response.status(500).send({ error: node });
	  });

	  flow.step('validateGameExists')(function (step) {
	  });
     }
});

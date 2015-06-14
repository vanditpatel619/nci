'use strict';

var Steppy = require('twostep').Steppy,
	_ = require('underscore'),
	db = require('../db');

module.exports = function(app) {
	var resource = app.dataio.resource('builds');

	resource.use('readAll', function(req, res) {
		Steppy(
			function() {
				var findParams = _(req.data).pick('offset', 'limit');
				findParams.limit = findParams.limit || 20;
				findParams.start = {descCreateDate: ''};

				db.builds.find(findParams, this.slot());
			},
			function(err, builds) {
				res.send(builds);
			},
			function(err) {
				console.log(err.stack || err)
			}
		);
	});

	resource.use('read', function(req, res) {
		Steppy(
			function() {
				var findParams = {};
				findParams.start = _(req.data).pick('id');
				db.builds.find(findParams, this.slot());
			},
			function(err, build) {
				res.send(build[0]);
			},
			function(err) {
				console.log(err.stack || err)
			}
		);
	});

	return resource;
};
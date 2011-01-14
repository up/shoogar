/*
shoogar - a minimalistic framework for Node.js
Version: 0.1.0

Copyright (c) 2010 Uli Preuss <me@ulipreuss.eu>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*jslint white: true, onevar: true, undef: true, newcap: true, 
  bitwise: true, strict: true, regexp: true  */

/*global require: false, exports: false, process: false, console: false, setTimeout: false */

(function () {

	"use strict";

	/* Module dependencies */
	var http = require("http"),
		url = require("url"),
		path = require("path"),
		fs = require("fs"),
		async = require("async"),

	shoogar = {
		routes: [],
		routelength: 0,
		services: [],
		port: 8000,
		base: '',
		document: '',
		ext: {
			fragments: [
			  "inc",          // Include file
			  "tpl", "tmpl",  // Template file
			  "fhtm", "fhtml" // HTML Fragment file
			  ],
			staticfiles: [
			  "htm", "html"
			]
		},
		html: {
			top: '',
			bottom: ''
		},
		tmpl: {
			top: '',
			bottom: '',
			E403: 'Error 403',
			E404: 'Error 404'
		},
		errormsg: false,
		scaffold: {
			enabled: true,
			top: '<html><head><title>Shoogar works!</title></head><body>',
			bottom: '</body></html>',
			route: [
			  '/', 
			  '<h3 style="text-align:center;padding: 30px">' + 
			  '  It works! The Shoogar HTTP server is running ..' + 
			  '</h3>'
			]
		}
	};

	/* Enable error messages*/
	exports.errorMessages = function errorMessages(val) {
		shoogar.errormsg = (val === true) ? true : false;
	};

	/* Enable scaffolding 
	exports.scaffold = function scaffold(val) {
		console.log(val);
	};
	*/

	/* Set port */
	exports.setPort = function port(newport) {
		shoogar.port = newport;
	};

	/* Set route */
	exports.setRoute = function setRoute(route) {
		shoogar.routes.push([route[0], route[1]]);
	};

	/* Set routes */
	exports.setRoutes = function setRoutes(routes) {

		shoogar.scaffold.enabled = false;

		var route, newroute, asterix;
		for (route in routes) {
			if (route !== undefined) {
				shoogar.routelength++;
				newroute = route;
				asterix = route.match(/\*$/gi);
				if (asterix) {
					newroute = route.substring(0, route.length - 2);
					shoogar.services.push(newroute);
				}
				shoogar.routes.push([newroute, routes[route]]);
			}
		}
	};

	/* Set template */
	exports.setTemplates = function setTemplates(templates) {

		var dir = (templates.dir) ? templates.dir : '';

		if (templates.top) {
			shoogar.tmpl.top = dir + templates.top;
		}
		if (templates.bottom) {
			shoogar.tmpl.bottom = dir + templates.bottom;
		}
		if (templates.E403) {
			shoogar.tmpl.E403 = dir + templates.E403;
		}
		if (templates.E404) {
			shoogar.tmpl.E404 = dir + templates.E404;
		}

	};

	exports.start = function start() {

		var filename, content, router, create, get, set, load, ext, server, isInArray;

		if (shoogar.routelength === 0) {
			// Add route for scaffolding
			shoogar.routes.push(shoogar.scaffold.route);
		}

		/* Init router */
		router = function (response, uri) {

			var isRegisteredRoute = isInArray(uri, shoogar.routes, true),
				service = "/" + uri.split('\/')[1],
				parameter = uri.split('\/')[2] || '',
				isRegisteredService = isInArray(service, shoogar.services);

			if (isRegisteredService !== false) {
				isRegisteredRoute = isInArray(service, shoogar.routes, true);
				if (typeof shoogar.routes[isRegisteredRoute][1] === 'function') {
					create(
					  response, 
					  '<script type="text/javascript">\n' + 
					  '(' + shoogar.routes[isRegisteredRoute][1] + '("' + parameter + '"));\n' + 
					  '</script>'
					);
				}
			} else if (isRegisteredRoute !== false) {
				create(response, shoogar.routes[isRegisteredRoute][1]);
			} else {

				filename = path.join(process.cwd(), uri);

				path.exists(filename, function (exists) {

					if (!exists) {
						content = shoogar.tmpl.E404;
						create(response, content);
						return;
					}

					var stats = fs.statSync(filename);
					if (stats.isDirectory()) {
						content = shoogar.tmpl.E403;
						create(response, content);
						return;
					} else if (stats.isFile()) {
						load(response, filename);
						return;
					}

				});
			}

		};

		/* Get extension */
		ext = function (str) {
		  var index = str.lastIndexOf(".") + 1;
			return str.substring(index);
		};

		/* Create document */
		create = function (response, content) {

			if (typeof content !== 'function') {
				if (isInArray(ext(content), shoogar.ext.staticfiles)) {
					load(response, content);
					return;
				}
			}

			shoogar.document = '';

			async.series([
			function (callback) {

				// Get HTML top part
				if (shoogar.html.top === '') {
					if (shoogar.tmpl.top !== '') {
						if (isInArray(ext(shoogar.tmpl.top), shoogar.ext.fragments)) {
							get('top', callback);
						} else {
							shoogar.html.top = shoogar.tmpl.top;
							callback(null);
						}
					} else {
						// Scaffolding view
						if (shoogar.scaffold.enabled) {
							shoogar.html.top = shoogar.scaffold.top;
							callback(null);
						} else if (isInArray(ext(shoogar.tmpl.top), shoogar.ext.fragments)) {
							get('top', callback);
						}
					}
				} else {
					callback(null);
				}
			},
			function (callback) {

				// Set HTML Top
				shoogar.document += shoogar.html.top;
				callback(null);

			},
			function (callback) {

				// Set HTML Content
				if (isInArray(ext(content), shoogar.ext.fragments)) {
				  // .. from template file
					set(content, callback);
				} else {
				  // .. from string
					shoogar.document += '\n\n' + content + '\n\n';
					callback(null);
				}
			},
			function (callback) {
				// Get HTML bottom part
				if (shoogar.html.bottom === '') {
					if (shoogar.tmpl.bottom !== '') {
						if (isInArray(ext(shoogar.tmpl.bottom), shoogar.ext.fragments)) {
							get('bottom', callback);
						} else {
							shoogar.html.bottom = shoogar.tmpl.bottom;
							callback(null);
						}
					} else {
						// Scaffolding view
						if (shoogar.scaffold.enabled) {
							shoogar.html.bottom = shoogar.scaffold.bottom;
							callback(null);
						} else if (isInArray(ext(shoogar.tmpl.bottom), shoogar.ext.fragments)) {
							get('bottom', callback);
						}
					}
				} else {
					callback(null);
				}
			},
			function (callback) {
				// Set HTML Bottom
				shoogar.document += shoogar.html.bottom;
				callback(null);
			},
			function (callback) {
				// Output
				response.writeHead(200);
				response.write(shoogar.document);
				response.end();
			}]);

		};

		/* Get content from template */
		get = function (part, callback) {
			var template = fs.createReadStream(shoogar.tmpl[part]);
			template.setEncoding('ascii');
			template.on('data', function (data) {
				data = data.replace(/<\/title\>/, '</title>\n\t<base href="' + shoogar.base + '" />');
				shoogar.html[part] = data;
				return callback(null);
			});
			template.on('error', function (err) {
				shoogar.html[part] = err.message;
				return callback(null);
			});
		};

		/* Set content from template */
		set = function (tmpl, callback) {
			var template = fs.createReadStream(tmpl);
			template.setEncoding('ascii');
			template.on('data', function (data) {
				data = data.replace(/<\/title\>/, '</title>\n\t<base href="' + shoogar.base + '" />');
				shoogar.document += data;
				return callback(null);
			});
			template.on('error', function (err) {
				shoogar.document += err.message;
				return callback(null);
			});
		};

		/* Load static file */
		load = function (response, filename) {
			fs.readFile(filename, "binary", function (err, file) {

				if (err) {
					if (shoogar.errormsg) {
						content = err.message;
					} else {
						content = shoogar.html.E404;
					}
					create(response, content);
					return;
				}

				response.writeHead(200);
				response.write(file, "binary");
				response.end();

			});
		};

		/* Array Helper */
		isInArray = function (elem, arr, key) {
			var i;
			for (i = 0; i < arr.length; i++) {
				if (key && arr[i][0] === elem) {
					return i;
				} else if (arr[i] === elem) {
					return true;
				}
			}
			return false;
		};

		/* Start server */
		server = http.createServer();
		server.on("request", function (request, response) {
			var uri = url.parse(request.url).pathname;
			if (shoogar.base === '') {
				shoogar.base = "http://" + request.headers.host;
			}
			router(response, uri);

		}).listen(process.env.PORT || shoogar.port, function () {
			console.log('>> Shoogar started .. ');
			setTimeout(function () {
				console.log('>> Listening on port ' + shoogar.port);
			},
			500);
		});

	};

}());

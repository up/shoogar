# Documentation

**shoogar** is a minimalistic framework for **Node.js** that makes building web-application very simple.


## Why yet another framework?

There are a lot of interesting web-frameworks for Node.js (see **[node frameworks][]**). Most of them are (H)MVC-based and inspired by popular  frameworks like `Rails`, `Sinatra`, `Grails`, `Django`, `CodeIgniter` or `Kohana`. Great for Back-End Experts, but no special framework for Font-End Developers.

**So here comes shoogar!** The main goal was 'Front-End Developer friendly' and shoogar should ..

* work as a simple http static file server
* generate applications quickly
* use strings and static HTML fragments for views
* have a simple and robust router mechanism
* offer a simple scaffolding mechanism
* include a basic template mechanism
* be a single script module 
* not use controller!
* and last but not least, well documented


### What is planned for the next release?

* DOM manipulation with 'jsdom'
* installation via npm

## Modules

Shoogar requires 'async', available for download from <a href="http://github.com/caolan/async/downloads">GitHub</a>. Alternatively, you can install using Node Package Manager (npm):

	npm install async

Copy the shoogar.js file in the same directory as your root script (eg. `server.js`) or a directory below and require it with a relative path:

    var server = require('./lib/shoogar');
  
Or you can copy `shoogar.js` to somewhere in your `require.paths` array. Then you can use a global require like:

    var server = require('shoogar');
    
See the **[node docs][]** for more details.


## Server

The command for starting the server is: 

	server.start();
	
The complete `server.js`:

	var server = require('./lib/shoogar');
	// All other parts here
	server.start();
	
Now open a terminal window in the same directory as your `server.js` script and type:

	$ node server.js
	
That' all, and you can see the `shoogar-started`-message: 

	$ node server.js
	>> shoogar started .. 
	>> Listening on port 8000
	
Go in your browser to http://0.0.0.0:8000 and you should see the 'It works!' message - otherweise you have a problem.

<h3 style="text-align:center;">It works! The shoogar HTTP server is running ..</h3>

Nice, but what's going on?

## Scaffolding

Scaffolding (known from Rails, Grails, etc.) allows you to auto-generate an application including:

1. Controller actions for create/read/update/delete (CRUD) operations
2. The necessary views

The shoogar Scaffolding mechanism by contrast is very simple:

1. generates a route for the root document, normally something like index.html (see 'Routes' below)
2. generates 3 HTML fragments. The top and bottom of an rudimentary HTML document and also the 'It works!' message.

The HTML-Top-Fragment:

	<html>
	  <head>
	    <title>shoogar works!</title>
	  </head>
	  <body>

The HTML-Bottom-Fragment:

	  </body>
	</html>

The message:

	<h3 style="text-align:center;padding: 30px">
		It works! The Shoogar HTTP server is running .. 
	</h3>

Note: The Scaffolding mechanism is enabled by default. 



## Views
	
If you want to override the scaffold view, you can create a new HTML-Top-Fragment from a string:

	server.setTemplates({
	  top : 
		'<!DOCTYPE HTML>'
	    '<html>' + 
	    '  <head>' +
	    '    <title>My template</title>' +
	    '    <style>' +
	    '    body { background: #000; color: #FFF; }' +
	    '    </style>' +
	    '  </head>' +
	    '<body>'
	});	
	
Or you can put the HTML in a Template file:

	<!DOCTYPE HTML>
	<html> 
	  <head>
	    <title>My template</title>
	    <style>
	    body { background: #000; color: #FFF; }
	    </style>
	  </head>
	<body>

and include it:

	server.setTemplates({
	  top : 'templates/header.tmpl'
	});
	
If you need another HTML-Bottom-Fragment, you can do it in the same way:

	server.setTemplates({
	  bottom : 'templates/footer.tmpl'
	});

Allowed file extensions for HTML fragments:

* '.inc' (include files)
* '.tpl' or '.tmpl' (template files)
* '.fhtm' or '.fhtml' (HTML fragment file)

## Routes

In shoogar is a route an URL matching pattern paired with a content type in the form:

	URL-PATTERN : CONTENT-TYPE

The content type can be a:

<table>
    <tr>
        <th style="text-align:left">Matching pattern</th>
        <th>Content type</th>
    </tr>
    <tr>
        <td>String that ends with '.inc', '.tpl'. '.tmpl', '.fhtm' or '.fhtml'</td>
        <td>Relative path to an HTML fragment</td>
    </tr>
    <tr>
        <td>String that ends with '.htm' or '.html'</td>
        <td>Relative path to an HTML document</td>
    </tr>
    <tr>
        <td>String that ends without one of the above extensions</td>
        <td>Pur text or an HTML fragment</td>
    </tr>
    <tr>
        <td>Function</td>
        <td>Function for client side action</td>
    </tr>
</table>


The shoogar scaffolding mechanism auto-generates a route for the root URL pattern '/' and the default page content - the 'It works!' message.

To override this route, do something like this:

	server.setRoutes({
	  '/' : '<h1>Welcome!</h1>'	
	});

Working with strings is not convenient. Better put it in a file and define here the path to the fragment file:

	'/' : 'views/welcome.tmpl'

You can also define a static file:

	'/contact' : 'static/contact.htm'

You like bizarre URLs? Not a problem:

	'/phone/0/129/40/55/333' : 'views/phone.tmpl'

And yo can do it a little RESTfully:

	'/hello/*' : function(){
	  document.write(
	    '<h1>Hello ' + (arguments[0] || ' World') + '!</h1>' +
	  );
	}
	// Example: /hello/Steve => <h1>Hello Steve!</h1>
	
	
## Port

You can define a specific port: 

	server.setPort(8001);

Note: this is optional. The default port is 8000.


## Error messages

You can show internal error messages (from Node.js) on page: 

	server.errorMessages(true);

Note: this is optional, disabled per default.


[node docs]: http://nodejs.org/api.html#_modules
[node frameworks]: https://github.com/ry/node/wiki/modules


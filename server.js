
var server = require('./lib/shoogar');

server.setPort(8001);                       // default: 8000

//server.errorMessages(true);               // default: false

/*
server.setTemplates({
  //top : 'application/templates/header.tmpl'
  top : 
    '<html>' + 
    '  <head>' +
    '    <title>My template</title>' +
    '    <style>' +
    '    body { background: #000; color: #FFF; }' +
    '    </style>' +
    '  </head>' +
    '<body>'
});
*/

server.setTemplates({
  dir         : 'application/templates/',   // optional: default is ''
  top         : 'header.tmpl',              // required
  bottom      : 'footer.tmpl',              // required
  E403        : '403.tmpl',                 // optional: default is 'Error 403' (string)
  E404        : '404.tmpl'                  // optional: default is 'Error 404' (string)
});


var awesome = '' +
'<h1>Node.js is totally awesome!</h1>' +
'<h4>Load content from string</h4>' +
'<h5>Route:</h5>' +
'<pre>"/awesome" : "&lt;h1>Node.js is totally awesome!&lt;/h1>"</pre>';

/*
server.setRoutes({
  "/" : "index.htm"	
});
*/

server.setRoutes({
  '/'                      : 'application/views/index.inc', 
  '/awesome'               : awesome,
  '/template'              : 'application/views/template.inc',
  '/changelog'             : 'application/views/changelog.inc',
  '/static'                : 'application/views/static/static.htm',
  '/docs'                  : 'application/views/docs.inc',
  '/phone/0/129/40/55/333' : 'application/views/phone.inc',
  '/hello/*'               : function(){

    var hello = '' +
    '<h4>RESTful URL example</h4>' +
    '<p>Add your name to the Url (eg. /hello/Mike) and press "enter".</p>' +
    '<h5>Route:</h5>' +
    '<pre>"/hello/*" : function(){\n' +
    '  document.write(\n' +
    '    "&lt;h1>Hello " + (arguments[0] || " World") + "!"&lt;/h1>"\n' +
    '  );\n' +
    '}</pre>';

    document.write(
      '<h1>Hello ' + (arguments[0] || ' World') + '!</h1>' +
      hello
    );
  }
});


server.start();


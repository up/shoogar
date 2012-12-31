<div>
	<p>
		Meanwhile, there are a number of useful frameworks for Node.js. Most of them are (H)MVC-based and inspired by popular 
		frameworks like Rails, Sinatra, Grails, Django, CodeIgniter or Kohana. Great for Back-End Experts, but no specifically 
		framework for Font-End Developers and other people who do not like to deal with controllers. 
		So here comes <strong>shoogar</strong>!
	</p>

	<h3>Features</h3>
	<ul>
		<li>simple http static file server</li>
		<li>simple and robust router mechanism</li>
		<li>simple scaffolding mechanism</li>
		<li>basic template mechanism</li>
		<li>strings and static HTML fragments for views</li>
		<li>single script module</li>
		<li>.. and no controller!</li>
		
	</ul>

	<p>Check shoogar installation:</p>

	<pre>
var server = require('./lib/shoogar');
server.start();</pre>

	<p>Create an HTTP static file server:</p>
	
	<pre>
var server = require('./lib/shoogar');
server.setRoutes({
  "/" : "index.htm"	
});
server.start();</pre>

	<p>Simple, right? For more details see <a href="docs">Documentation</a></p>

</div>



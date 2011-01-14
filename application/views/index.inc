<div>
	<p>
		There are a lot of interesting web-frameworks for Node.js. Most of them are (H)MVC-based and inspired by popular 
		frameworks like Rails, Sinatra, Grails, Django, CodeIgniter or Kohana. Great for Back-End Experts, 
		but no special framwork for Font-End Developer. So here comes <strong>shoogar</strong>!
	</p>

	<h3>Features</h3>

	<ul>
		<li>works as a simple HTTP static file server</li>
		<li>generate applications quickly</li>
		<li>use strings and static HTML fragments for views</li>
		<li>have a simple and robust router mechanism</li>
		<li>offer a simple scaffolding mechanism</li>
		<li>include a basic template mechanism</li>
		<li>be a single script module</li>
		<li>not use controller!!!</li>
	</ul>

	<p>Example 1: Check shoogar installation:</p>

	<pre>
var server = require('./modules/shoogar');
server.start();</pre>

	<p>Example 2: Create HTTP static file server:</p>
	
	<pre>
var server = require('./modules/shoogar');
server.setRoutes({
  "/" : "index.htm"	
});
server.start();</pre>

	<p>Simple, right? For more details see <a href="docs">Documentation</a></p>

</div>



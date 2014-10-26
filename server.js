/**
 * A horribly-basic Express server just to get you running.
 */
var express = require('express');
var app = express();
var port = process.env.PORT || 3030;
app.use(express.static(__dirname + '/public_html'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.listen(port);
console.log( 'Server running on http://localhost:' + port );

var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.static('public'));

app.get('/', function(req, res){
   res.render("index");
});

app.get('/first_template', function(req, res){
   res.render('index');
});

app.listen(3000);

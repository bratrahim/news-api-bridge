var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var articlesRouter = require('./routes/articles');
var tweetsRouter = require('./routes/tweets');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', require('cors')());
app.use(tweetsRouter);
app.use(articlesRouter);



module.exports = app;

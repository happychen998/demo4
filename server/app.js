'use strict';

var express = require('express');
var port = 3000;
var app = express();

// 将首页路由处理改为从数据库读取
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carShop');
mongoose.set('debug', true);

var path = require('path');

var morgan = require('morgan');

app.locals.appTitle = '汽车商城';

app.locals.pretty = true;

app.use(morgan('dev'));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  name: 'carshopsession',
  secret: 'carshopkey',
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge:3 * 24 * 60 * 60 * 1000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  })
}));

app.use(express.static(path.join(__dirname, '../client')));

// JavaScript 日期处理类库
app.locals.moment = require('moment');

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'jade');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

var routes = require('./routes');
routes(app);

// 上面的两个语句可以简写为下面的语句：
// require('routes')(app);

app.listen(port);

console.log('汽车商城网站服务已启动,监听端口号:' + port);


if (process.env.NODE_ENV === 'development') {
  // 增加mongoose的debug模式
  mongoose.set('debug', true);
  // 错误处理中间件
  var errorhandler = require('errorhandler');
  app.use(errorhandler);

  // 启用'express-debug'
  require('express-debug')(app, {
    depth: 4,
    panels: ['locals', 'request', 'session', 'template', 'software_info', 'nav']
  });
}

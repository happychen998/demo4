'use strict';

var express = require('express');
var port = 4000;
var app = express();

app.listen(port);
console.log('路由测试服务已启动,监听端口号:' + port);

function showRoute(req,res){
  console.log('================');
  console.log('当前生效的路由规则:');
  console.log(req.route.path);
  console.log('');

  console.log('req.route.methods');
  console.log(req.route.methods);
  console.log(''); 

  console.log('req.originalUrl');
  console.log(req.originalUrl);
  console.log(''); 

  console.log('req.body');
  console.log(req.body);
  console.log('');   

  console.log('req.cookies');
  console.log(req.cookies);
  console.log(''); 


  console.log('req.hostname');
  console.log(req.hostname);
  console.log(''); 


  console.log('req.ip');
  console.log(req.ip);
  console.log(''); 


  console.log('req.params');
  console.log(req.params
);
  console.log(''); 

  console.log('req.path');
  console.log(req.path);
  console.log(''); 

  console.log('req.protocol');
  console.log(req.protocol);
  console.log(''); 

  console.log('req.query');
  console.log(req.query);
  console.log(''); 

  res.sendStatus(200);
 

}

app.get('/',showRoute);
app.get('/user/:id/xyz/:name',showRoute);
app.get('/user/:id/:name',showRoute);
app.get('/user/:id/xyz/:name',showRoute);
app.get('/user/:id/:name',showRoute);

app.get('/user/:id::name',showRoute);
app.get('/user/:id,:name',showRoute);
app.get('/user/:id;:name',showRoute);

app.get('/user/:id&:name',showRoute);
app.get('/user/:id-:name',showRoute);
app.get('/user/:id=:name',showRoute);
app.get('/user/:id,:name?',showRoute);
app.get('/user/:id,:name+',showRoute);
app.get('/user/:id,:name*',showRoute);
app.get('/user/:id?',showRoute);

app.get('/user/:id|:name',showRoute);
app.get('/user/:id+:name',showRoute);
app.get('/user/:id?:name',showRoute);
app.get('/user/:id*:name',showRoute);



app.get('/*',showRoute);
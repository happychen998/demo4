'use strict';

var indexController = require('./controllers/index');

var carController = require('./controllers/car');

var userController = require('./controllers/user');

var commentController = require('./controllers/comment');


module.exports = function(app) {
  // err,req, res, next四个参数
  app.use(function(req, res, next) {
    res.locals.loginuser = req.session.loginuser;
    next();
  });

  app.get('/', indexController.index);

  app.get('/car/:id', carController.showDetail);

  app.get('/admin/car/list', userController.requireSignin, userController.requireAdmin, carController.showCarList);

  app.get('/admin/car/new', userController.requireSignin, userController.requireAdmin, carController.addCar);

  app.get('/admin/car/update/:id', userController.requireSignin, userController.requireAdmin, carController.modifyCar);

  app.post('/admin/car', userController.requireSignin, userController.requireAdmin, carController.saveCar);

  // /admin/list?id=xxxxx
  app.delete('/admin/car/list', carController.deleteCar);

  app.get('/signup', userController.showSignup);

  app.post('/signup', userController.postSignup);

  app.get('/signin', userController.showSignin);

  app.post('/signin', userController.postSignin);

  app.get('/logout', userController.logout);

  app.get('/admin/user/list', userController.requireSignin, userController.requireSupperAdmin, userController.showUserList);

  // /admin/list?id=xxxxx
  app.delete('/admin/user/list', userController.deleteUser);

  app.post('/car/comment',commentController.post);
};

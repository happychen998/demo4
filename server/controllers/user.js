'use strict';

var ModelUser = require('../models/user');

var _ = require('underscore');

module.exports.showSignup = function(req, res, next) {
  res.render('signup', {
    title: '用户注册',
    user: {}
  });
};

module.exports.postSignup = function(req, res, next) {
  var userObj = req.body.user;
  if (!userObj) {
    return res.status(400).send('找不到合法数据。');
  }
  var docUser = new ModelUser(userObj);

  docUser.save(function(err, _user) {
    if (err) {
      res.locals.syserrmsg = '要注册的用户已经存在，请选择其他用户名...';
      return module.exports.showSignup(req, res, next);
    }
    req.session.loginuser = _user;
    return res.redirect('/');
  });
};

module.exports.showSignin = function(req, res, next) {
  res.render('signin', {
    title: '用户登录',
    user: null
  });
};

module.exports.postSignin = function(req, res, next) {
  var userObj = req.body.user;
  if (!userObj) {
    return res.status(400).send('找不到合法数据。');
  }
  var name = userObj.name;
  var inputpw = userObj.password;

  ModelUser.findOne({
    name: name
  }, function(err, _user) {
    if (err) {
      console.log(err);
      return res.redirect('/signup');
    }
    if (!_user) {
      res.locals.syserrmsg = '用户名不存在...';
      return module.exports.showSignin(req, res, next);
    }
    _user.comparePassword(inputpw, function(err, isMatch) {
      if (err) {
        console.log(err);
        return res.redirect('/signin');
      }
      if (isMatch) {
        console.log('用户: %s 登录验证成功.', name);

        req.session.loginuser = _user;
        var id = _user.id;

        ModelUser.findOneAndUpdate({
          _id: id
        }, {
          $set: {
            lastSigninDate: Date.now()
          }
        }, function(err, _user) {
          if (err) {
            console.log(err);
            return res.redirect('/signin');
          }
          return res.redirect('/');

        });
      } else {
        res.locals.syserrmsg = '密码不正确，请重新输入...';
        return module.exports.showSignin(req, res, next);
      }
    });
  });
};

module.exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    return res.redirect('/');
  });
};

module.exports.requireSignin = function(req, res, next) {
  var loginuser = req.session.loginuser;
  if (!loginuser) {
    res.locals.syserrmsg = '请登录后再操作...';
    return module.exports.showSignin(req, res, next);
  }
  next();
};

module.exports.requireAdmin = function(req, res, next) {
  var loginuser = req.session.loginuser;
  if (!loginuser) {
    return res.redirect('/signin');
  }
  if (!loginuser.level) {
    res.locals.syserrmsg = '您的权限级别不够，请使用更高级别的用户名登录...';
    return module.exports.showSignin(req, res, next);
  }
  if (loginuser.level < 900) {
    res.locals.syserrmsg = '您的权限级别不够，请使用更高级别的用户名登录...';
    return module.exports.showSignin(req, res, next);
  }
  next();
};

module.exports.requireSupperAdmin = function(req, res, next) {
  var loginuser = req.session.loginuser;
  if (!loginuser) {
    return res.redirect('/signin');
  }
  if (!loginuser.level) {
    res.locals.syserrmsg = '您的权限级别不够，请使用<strong>更高级别</strong>的用户名登录...';
    return module.exports.showSignin(req, res, next);
  }
  if (loginuser.level < 999) {
    res.locals.syserrmsg = '您的权限级别不够，请使用<strong>更高级别</strong>的用户名登录...';
    return module.exports.showSignin(req, res, next);
  }
  next();
};

module.exports.showUserList = function(req, res, next) {
  ModelUser.fetch(function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('user_list', {
      title: '汽车商城 注册用户列表页',
      users: users
    });
  });
};

module.exports.deleteUser = function(req, res, next) {
  var id = req.query.id;
  if (id) {
    ModelUser.findByIdAndRemove(id, function(err, _user) {
      // body...
      if (err) {
        res.status(500).json({
          ok: 0
        });
        return next(err);
      } else {
        res.json({
          ok: 1
        });
      }
    });
  }
};

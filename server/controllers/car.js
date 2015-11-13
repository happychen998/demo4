'use strict';

var ModelCar = require('../models/car');

var ModelComment = require('../models/comment');

var _ = require('underscore');

module.exports.showDetail = function(req, res, next) {
  ModelCar.findById(req.params.id, function(err, car) {
    if (err) {
      return next(err);
    }
    var carId = car._id;

    ModelComment.fetchByCarID(carId, function(err, comments) {
      if (err) {
        return next(err);
      }

      res.render('car_detail', {
        title: '商品详情',
        car: car,
        comments: comments
      });
    });
  });
};

module.exports.showCarList = function(req, res, next) {
  var size = 2;

  ModelCar.getCount(function(err, totalsize) {
    var page = 1;
    var pagetotal = Math.ceil(totalsize / size);

    ModelCar.findByPage(page, size, function(err, cars) {
      ModelCar.fetch(function(err, cars) {
        if (err) {
          return next(err);
        }
        res.render('car_list', {
          title: '汽车商城 列表页',
          cars: cars
        });
      });
    });
  });
};

module.exports.addCar = function(req, res, next) {
  res.render('car_admin', {
    title: '汽车商城 后台新增页',
    car: {}
  });
};

module.exports.modifyCar = function(req, res, next) {
  ModelCar.findById(req.params.id, function(err, car) {
    if (err) {
      return next(err);
    }
    res.render('car_admin', {
      title: '汽车商城 后台修改页',
      car: car
    });
  });
};

module.exports.saveCar = function(req, res, next) {
  var carObj = req.body.car;
  if (!carObj) {
    return res.status(400).send('找不到合法数据！');
  }
  var id = carObj._id;
  if (!id) {
    // 新增
    var docCar = new ModelCar(carObj);
    docCar.save(function(err, _car) {
      if (err) {
        return next(err);
      }
      return res.redirect('/car/' + _car._id);
    });
  } else {
    // 修改
    ModelCar.findById(id, function(err, docCar) {
      // body...
      if (err) {
        return next(err);
      }
      docCar = _.extend(docCar, carObj);
      docCar.save(function(err, _car) {
        if (err) {
          return next(err);
        }
        return res.redirect('/car/' + _car._id);
      });
    });
  }
};

module.exports.deleteCar = function(req, res, next) {
  var id = req.query.id;
  if (id) {
    ModelCar.findByIdAndRemove(id, function(err, _car) {
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

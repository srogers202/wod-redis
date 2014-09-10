'use strict';

var _ = require('lodash'),
  q = require('q');

var WODLISTKEY = "wodgen-wodList",
    REDIS_EXP = 120;

// Get list of things
exports.list = function(req, res) {
  getWodList().then(function(data) {
    res.json(
      data
    );
  });
};

exports.add = function(req, res) {
  addWodToList(req.body);
  res.json(
    {'status': 1}
  );
};

function getWodList() {
  var deferred = q.defer(),
    wodRedis = new WodRedis();

  wodRedis.list.then(function(val) {
    if (val) {
      // List was saved in redis
      deferred.resolve(JSON.parse(val));

    } else {
      // Retrieve list from DB and save in cache
      var wodDb = new WodDB();
      var wodList = wodDb.list;
      wodRedis.setList(wodList);
      deferred.resolve(wodList);
    }
  });

  return deferred.promise;
}

function addWodToList(wod) {
  var wodRedis = new WodRedis();
  wodRedis.add(wod);
}

// Wod object for cache
// .list, .setList(list)
var WodRedis = function() {

  var redis = require('redis'),
    client = redis.createClient();

  var getList = function() {
    var deffered = q.defer();

    client.get(WODLISTKEY, function(err, val) {
      if (err)
        console.log(err);
      deffered.resolve(val);
    });

    return deffered.promise;
  };

  var setList = function(wodList) {
    client.set(WODLISTKEY, JSON.stringify(wodList));
    client.expire(WODLISTKEY, REDIS_EXP);
  };

  var addWodToList = function(wod) {
    getList().then(function(wodList) {
      var jsonWodList = JSON.parse(wodList);
      jsonWodList.push(wod);
      setList(jsonWodList);
    });
  };

  return {
    list: getList(),
    setList: setList,
    add: addWodToList
  };

};

//Wod object for DB (in this case a JSON file)
// .list
var WodDB = function() {

  var getList = function() {
    return require('./wod.store.json');
  };

  return {
    list: getList()
  };
};
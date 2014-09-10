'use strict';

var express = require('express');
var controller = require('./wod.controller');

var router = express.Router();

router.get('/', controller.list);
router.post('/add', controller.add);

module.exports = router;
const express = require('express');
const router = express.Router();
const config = require("./config");
router.use(function authenticate(req, res, next) {
    
    next();
  });
  
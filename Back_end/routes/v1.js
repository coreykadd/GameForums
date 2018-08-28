const express = require('express');
const router = express.Router();

const RoleController = require('./../controllers/role.controller');

const customMiddleware = require('./../middleware/custom.middleware');
const tokenMiddleware = require('./../middleware/token.middleware');
const roleMiddleware = require('./../middleware/role.middleware');
const userMiddleware = require('./../middleware/user.middleware');

module.exports = router;
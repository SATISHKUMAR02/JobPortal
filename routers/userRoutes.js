const express = require('express')
const router = express.Router()
const usercontroller = require('../controllers/userController')
router.get('/users',usercontroller.updateUser);

module.exports = router;
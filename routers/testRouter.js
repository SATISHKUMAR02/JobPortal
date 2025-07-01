const express = require('express')
const testGetController = require('../controllers/testController')
const router = express.Router()

router.get('/test-post',testGetController.testGet);

module.exports = router;
const express = require('express')
const profileController = require('../controller/user/profile')
const { checkAuthenticate } = require('../middleware/authenticated')
const router = express.Router()

router.route('/').put(checkAuthenticate, profileController.createProfile)

module.exports = router 
const express = require('express')
const authController = require('../controller/auth')
const adminController = require('../controller/admin/user')
const { checkPermission, checkAuthenticate } = require('../middleware/authenticated')
const router = express.Router()

router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)
router.route('/requestpasswordChange').post(authController.requestResetPassword)
router.route('/resetpassword').post(authController.resetPassword)

router.route('/user/active').put(checkAuthenticate ,checkPermission('deactive_user') , adminController.deActivateOrActivateUser)

module.exports = router 
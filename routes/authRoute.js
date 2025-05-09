const express = require('express');
const {registerController,loginController,forgotPasswordController, updateProfileController} = require('../controllers/authController.js');
const {requireSignIn, isAdmin} = require('../middlewares/authMiddleware.js');

const router = express.Router();


router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.put('/update-profile', requireSignIn, updateProfileController);


//user protected routes
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
});


//admin protected routes
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
});

module.exports = router;
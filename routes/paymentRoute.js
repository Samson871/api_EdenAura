const express = require('express');
const { createOrderController,paymentStatusController } = require('../controllers/paymentController.js');
const { requireSignIn } = require('../middlewares/authMiddleware.js');


const router = express.Router();


router.post('/create-order', requireSignIn, createOrderController);
router.post('/status', requireSignIn, paymentStatusController);


module.exports = router;
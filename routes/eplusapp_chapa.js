var express = require("express");
var router = express.Router();

var paymentController = require("../controller/eplusapp_chapa");

router.post("/create", paymentController.createPayment);

//router.get("/:tx_ref", paymentController.getSingleTransaction);
// Expose User Router
router.get("/:id",paymentController.getUserStocks);
module.exports = router;

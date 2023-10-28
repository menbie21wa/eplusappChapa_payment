var express = require("express");
var router = express.Router();

var transactionController = require("../controller/transaction");

router.post("/create", transactionController.createPayment);

module.exports = router;

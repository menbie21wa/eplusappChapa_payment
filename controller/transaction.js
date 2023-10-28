const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const express = require("express");
const axios = require("axios");
var transactionDal = require("../dal/transaction");
let URL = `http://localhost:11219/EplusappPayment-API/payment/create`;
exports.createPayment = (req, res, next) => {
        let transactionData = req.body;
        console.log("incoming data : ", transactionData);
        const newtransactionData = {
        stock_id: transactionData.stock_id,
        user_id: transactionData.user_id,
        amount: transactionData.amount,
        unitprice: transactionData.unitprice,
        total_price: transactionData.total_price,
        Status: transactionData.Status,
    };
    if (!transactionData.amount) {
      return res
        .status(400)
        .json({ message: "amount is not given" });
    } 
    transactionDal.create(transactionData, (err, data) => {
        if (err) {
          return res.status(500).json({
            message: "server error",
          });
        }
        else 
        {
       axios
      .post(URL,transactionData.amount,{
        headers: {
          Authorization: `Bearer CHASECK_TEST-LGc7GrVmx0P3cn3cxu6l93wDD2zIMISR`,
        }})
      .then((response) => {
        if (response.status == 200 && response.data !== "") {
            console.log("succesfully added to payment")
        } else {
          console.error(response.data.message);
        }
      })
      .catch((err) => console.log(err));
        }

      });
    } 
  
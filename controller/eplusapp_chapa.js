const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const express = require("express");
const axios = require("axios");
var paymentDal = require("../dal/eplusapp_chapa");
const CHAPA_AUTH = "CHASECK_TEST-c8Dyvrl1ie5bCS4HwvZiVoVgSg5SPB4U";
const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";
const CALLBACK_URL = "https://example.com/callbackurl";
const RETURN_URL = "http://localhost:3000/invoicer";
const public_key = "CHAPUBK_TEST-raEL3m1wAje2bpBtKQjcTJxTUWcBaNN9";
const TEXT_REF = "eplusapp-chapa-" + Date.now();
const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`,
  },
};

exports.createPayment = (req, res, next) => {
  let paymentData = req.body;
  console.log("incoming data : ", paymentData);
  const newPaymentData = {
    amount: paymentData.amount,
    currency: "ETB",
    first_name: "eplusapp",
    email: "eplusapp88@gmail.com",
    phone_number: "0912345678",
    paymentMethod: "chapa",
    paymentType: "stock",
    public_key: public_key,
    tx_ref: paymentData.tx_ref,
    callback_url: CALLBACK_URL,
    return_url: RETURN_URL,
    status: "pending",
  };
  if (!paymentData.amount) {
    return res
      .status(400)
      .json({ message: "please enter initial bidding amount" });
  } else {
    axios
      .post(CHAPA_URL, newPaymentData, config)
      .then((response) => {
        if (response.status == 200 && response.data !== "") {
          //res.redirect(response.data.data.checkout_url);
          console.log("response", response.data);
          const callback_data = response.data.data.checkout_url;
          let tempPaymentData = {
            stock_id: paymentData.stock_id,
            user_id: paymentData.user_id,
            unitprice: paymentData.unitprice,
            amount: paymentData.amount,
            currency: paymentData.currency,
            first_name: paymentData.firstName,
            email: paymentData.email,
            phone_number: paymentData.phone_number,
            paymentMethod: "chapa",
            paymentType: paymentData.paymentType,
            public_key: public_key,
            tx_ref: paymentData.tx_ref,
            callback_url: callback_data,
            return_url: RETURN_URL,
            status: "pending",
          };

          paymentDal.create(tempPaymentData, (err, data) => {
            if (err) {
              return res.status(500).json({
                message: "server error",
              });
            }

            res.status(200).json(data);
          });
        } else {
          console.error(response.data.message);
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.getSingleTransaction = (req, res, next) => {
 
  let { tx_ref } = req.body;
  console.log(req.body);
  paymentDal.getByPk(tx_ref, (err, payid) => {
    if (err) {
      res.status(500).json({
        message: "ሰርቨሩ እየሰራ አይደለም",
        status: 500,
      });
      return;
    }
    if (payid && Object.keys(payid).length > 0) {
      res.status(200).json(payid);
    } else {
      res.status(400).json({
        message: "በዚህ መለያ የተመዘገበ ጨረታ የለም",
      }); 
      return;
    }
  });
};
// axios
// .get(
//   "https://api.chapa.co/v1/transaction/verify/" + "eplusapp-ty-345600",
//   config
// )
// .then((response) => {
//   console.log("Payment was successfully verified", response.data);
// })
// .catch((err) => console.log("Payment can't be verfied", err));

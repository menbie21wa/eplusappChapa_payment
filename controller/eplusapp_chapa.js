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
exports.getUserStocks = (req, res) => {
  let { id } = req.params;

  paymentDal.getByUserId(id, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Server error"+err,
      });
    }
    if (Array.isArray(data)) {
      // Create an array to store the promises
      const promises = data.map(element => {
        return axios.get(`http://localhost:11214/stockapi/stocks/${element.stock_id}`)
          .then(response => response.data)
          .catch(error => {
            // Handle any errors that occur during the request
            console.error(`Error fetching data for stock_id ${element.stock_id}:`, error);
            return null; // or handle the error in an appropriate way
          });
      });
    
      // Wait for all the promises to resolve
      Promise.all(promises)
        .then(output => {
          const result = {data,output}
          res.status(200).json(result);
        })
        .catch(error => {
          // Handle any errors that occur during Promise.all()
          console.error('Error retrieving stock data:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    }
    else if(typeof data ==='object')
    {
      axios.get(`http://localhost:11214/stockapi/stocks/${data.stock_id}`)
        .then(response => {
          res.status(200).json(response.data);
        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error(`Error fetching data for stock_id ${data.stock_id}:`, error);
          res.status(500).json({ error: 'Internal server error' });
        });
    } else {
      res.status(400).json({ error: 'Invalid data type' });
    }
    //  let config2 = {
    //   method: 'get',
    //   maxBodyLength: Infinity,
    //   url: `http://localhost:11214/stockapi/stocks/10`,
    //   headers: { }
    // };

    // axios.request(config2)
    // .then((response) => {
    //  // res.status(200).json(response);
    //  const responseData = response.data;

    //   // Send the extracted data as the response
    //   res.status(200).json(data);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
    
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

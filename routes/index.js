const paymentRouter = require("./eplusapp_chapa");
module.exports = (app) => {
  app.use("/EplusappPayment-API/payment", paymentRouter);
};

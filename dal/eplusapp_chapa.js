const { query } = require("express");
const Model = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const EplusappPayment = Model.eplusapp_chapa;

exports.create = async (paymentData, cb) => {
  try {
    const paymentChapa = await EplusappPayment.create(paymentData);
    return cb(null, paymentChapa?.dataValues);
  } catch (err) {
    return cb(err.message);
  }
};
exports.getByPk = async (query, cb) => {
  try {
    const payid = await EplusappPayment.findByPk(query);
    return cb(null, payid?.dataValues);
  } catch (err) {
    return cb(err);
  }
};
exports.getByUserId = async (userId, cb) => {
  try {
    const payments = await EplusappPayment.findAll({
      where: { user_id: userId },
    });
    
    return cb(null, payments);
  } catch (err) {
    return cb(err);
  }
};

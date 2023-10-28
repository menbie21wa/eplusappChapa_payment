const { query } = require("express");
const Model = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const transaction = Model.transaction;

exports.create = async (transactionData, cb) => {
  try {
    const transact = await transaction.create(transactionData);
    return cb(null, transact?.dataValues);
  } catch (err) {
    return cb(err.message);
  }
};
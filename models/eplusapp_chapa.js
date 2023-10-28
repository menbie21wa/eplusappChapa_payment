"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class eplusapp_chapa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  eplusapp_chapa.init(
    {
      transaction_id:{ 
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:true
                },
      stock_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      currency: DataTypes.STRING,
      first_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      paymentType: DataTypes.STRING,
      unitprice: DataTypes.DECIMAL,
      public_key: DataTypes.STRING,
      return_url: DataTypes.STRING,
      callback_url: DataTypes.STRING,
      tx_ref: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "eplusapp_chapa",
    }
  );
  return eplusapp_chapa;
};

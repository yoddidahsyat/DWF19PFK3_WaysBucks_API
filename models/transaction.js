'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Transaction.belongsTo(models.User, { as: "user" })
            Transaction.hasMany(models.TransactionProduct, { as: "transactionProducts" })
        }
    };
    Transaction.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.TEXT,
        postCode: DataTypes.STRING,
        attachment: DataTypes.STRING,
        status: DataTypes.STRING,
        income: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Transaction',
    });
    return Transaction;
};
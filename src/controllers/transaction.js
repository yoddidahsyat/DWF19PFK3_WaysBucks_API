const { Transaction, TransactionProduct, TransactionTopping, User, Product, Topping } = require('../../models');

const statusSuccess = "SUCCESS";
const statusFailed = "FAILED";
const messageSuccess = (type) => { return `Transaction successfully ${type}` }
const messageSuccessSingle = (id, type) => { return `Transaction with id: ${id} successfully ${type}` }
const messageFailedSingle = (id) => { return `Transaction with id: ${id} does not exist` };
const messageEmpty = "Data Empty";
const errorResponse = (err, res) => {
    console.log(err);
    res.status(500).send({ error: { message: "Server Error" } })
}

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId", "UserId"],
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["password", "createdAt", "updatedAt", "deletedAt", "userId", "UserId"],
                    },
                },
                {
                    model: TransactionProduct,
                    as: "transactionProduct",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "productId", "ProductId", "transactionId", "TransactionId", ],
                    },
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "ProductId"]
                            }
                        },
                        {
                            model: TransactionTopping,
                            as: "transactionTopping",
                            attributes: {
                                exclude: ["transactionProductId", "createdAt", "updatedAt", "TransactionProductId", "ToppingId", "toppingId"],
                            },
                            include: [
                                {
                                    model: Topping,
                                    as: "topping",
                                    attributes: {
                                        exclude: ["createdAt", "updatedAt"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if(transactions.length === 0) {
            return res.send({
                status: statusFailed,
                message: messageEmpty,
                data: {
                    transactions: []
                }
            })
        }

        res.send({
            status: statusSuccess,
            message: messageSuccess("get"),
            data: {
                transactions
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId", "UserId"],
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["password", "createdAt", "updatedAt", "deletedAt", "userId", "UserId"],
                    },
                },
                {
                    model: TransactionProduct,
                    as: "transactionProduct",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "productId", "ProductId", "transactionId", "TransactionId", ],
                    },
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "ProductId"]
                            }
                        },
                        {
                            model: TransactionTopping,
                            as: "transactionTopping",
                            attributes: {
                                exclude: ["transactionProductId", "createdAt", "updatedAt", "TransactionProductId", "ToppingId", "toppingId"],
                            },
                            include: [
                                {
                                    model: Topping,
                                    as: "topping",
                                    attributes: {
                                        exclude: ["createdAt", "updatedAt", "ToppingId"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if(!transaction) {
            return res.status(400).send({
                status: statusFailed,
                message: messageFailedSingle(id),
                data: {
                    transaction: []
                }
            })
        }

        res.send({
            status: statusSuccess,
            message: messageSuccessSingle(id, "get"),
            data: {
                transaction
            }
        })
    } catch (err) {
        errorResponse(err,res);
    }
}


exports.addTransaction = async (req, res) => {
    try {
        const { body, user } = req;
        const userId = user.id;
        const transactionData = {
            ...body,
            userId,
            attachment: null
        }
        console.log(transactionData);
        
        const transaction = await Transaction.create(transactionData, {
            include: [{
                association: "transactionProduct",
                include: [{
                    association: "transactionTopping"
                }]
            }]
        });
        res.send({
            status: statusSuccess,
            message: messageSuccess("created"),
            data: {
                transaction
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}


exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { body: transactionData } = req;
        console.log(id, transactionData);

        const isTransactionExist = await Transaction.findOne({
            where: {
                id
            }
        });
        if (!isTransactionExist) {
            return res.status(400).send({
                status: statusFailed,
                message: messageFailedSingle(id),
                data: {
                    transaction: []
                }
            })
        }

        await Transaction.update(transactionData, {
            where: {
                id
            }
        });

        const newTransaction = await Transaction.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        });

        res.send({
            status: statusSuccess,
            message: messageSuccessSingle(id, "updated"),
            data: {
                transaction: newTransaction
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}

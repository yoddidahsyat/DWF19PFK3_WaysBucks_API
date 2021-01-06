const { User, Transaction, TransactionProduct, TransactionTopping, Product, Topping} = require('../../models/');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "password"]
            }
        });

        if(users.length === 0) {
            return res.status(400).send({
                status: "USERS DATA EMPTY",
                data: {
                    users: []
                }
            })
        }

        res.send({
            status: "GET USERS SUCCESS",
            data: {
                users
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: {
                message: "Server Error"
            }
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "password"]
            },
            include: {
                model: Transaction,
                as: 'transactions',
                attributes: {
                    exclude: ["createdAt", "updatedAt", "userId", "UserId"]
                },
                include: {
                    model: TransactionProduct,
                    as: "transactionProduct",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "productId", "ProductId", "transactionId", "TransactionId" ],
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
                                exclude: ["createdAt", "updatedAt", "transactionProductId", "TransactionProductId", "ToppingId", "toppingId"],
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
            }
        });

        if(!user) {
            return res.status(400).send({
                status: `USER WITH ID:${id} DOES NOT EXIST`,
                data: {
                    user: []
                }
            })
        }

        res.send({
            status: "GET USER SUCCESS",
            data: {
                user
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: {
                message: "Server Error"
            }
        })
    }
}
// softdelete
exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;

        const isUserExist = await User.findOne({
            where: {
                id
            }
        });
        if (!isUserExist) {
            return res.status(400).send({
                status: `USER WITH ID:${id} DOES NOT EXIST`,
                data: {
                    user: []
                }
            })
        }

        await User.destroy({
            where: {
                id
            }
        });
        res.send({
            status: `DELETE USER WITH ID:${id} SUCCESS`,
            data: {
                user: null
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}

// restore
exports.restoreUser = async (req, res) => {
    try {
        const {id} = req.params;

        await User.restore({
            where: {
                id
            }
        });

        user = await User.findOne({
            where: {
                id
            }
        })

        res.send({
            status: `RESTORE USER WITH ID:${id} SUCCESS`,
            data: {
                user
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}
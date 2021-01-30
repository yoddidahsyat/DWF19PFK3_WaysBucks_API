const { Topping } = require('../../models/');

const statusSuccess = "SUCCESS";
const statusFailed = "FAILED";
const messageSuccess = (type) => { return `Topping successfully ${type}` }
const messageSuccessSingle = (id, type) => { return `Topping with id: ${id} successfully ${type}` }
const messageFailedSingle = (id) => { return `Topping with id: ${id} does not exist` };
const messageEmpty = "Data Empty";
const errorResponse = (err, res) => {
    console.log(err);
    res.status(500).send({ error: { message: "Server Error" } })
}

exports.getToppings = async (req, res) => {
    try {
        const toppings = await Topping.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if(toppings.length < 1) {
            return res.send({
                status: statusFailed,
                message: messageEmpty,
                data: {
                    topppings: []
                }
            })
        }

        res.send({
            status: statusSuccess,
            message: messageSuccess('get'),
            data: {
                toppings
            }
        })
    } catch (err) {
        return errorResponse(err, res)
    }
}

exports.getTopping = async (req, res) => {
    try {
        const {id} = req.params;
        const topping = await Topping.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if(!topping) {
            return res.send({
                status: statusFailed,
                message: messageEmpty,
                data: {
                    topping: []
                }
            })
        }

        res.send({
            status: statusSuccess,
            message: messageSuccess('get'),
            data: {
                topping
            }
        })
    } catch (err) {
        return errorResponse(err, res)
    }
}

exports.addTopping = async (req, res) => {
    try {
        const { body, file } = req;
        const toppingData = {
            ...body,
            image: file.path
        }
        const topping = await Topping.create(toppingData);
        res.send({
            status: statusSuccess,
            message: messageSuccess('added'),
            data: {
                topping
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}

exports.updateTopping = async (req, res) => {
    try {
        const {id} = req.params;
        const { body: toppingData } = req;

        const isToppingExist = await Topping.findOne({
            where: {
                id
            }
        });
        if (!isToppingExist) {
            return res.status(400).send({
                status: statusFailed,
                message: messageFailedSingle(id),
                data: {
                    topping: []
                }
            })
        }

        await Topping.update(toppingData, {
            where: {
                id
            }
        });

        const newTopping = await Topping.findOne({
            where: {
                id
            }
        });

        res.send({
            status: statusSuccess,
            message: messageSuccess('updated'),
            data: {
                topping: newTopping
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}

exports.deleteTopping = async (req, res) => {
    try {
        const {id} = req.params;

        const isToppingExist = await Topping.findOne({
            where: {
                id
            }
        });
        if (!isToppingExist) {
            return res.status(400).send({
                status: statusFailed,
                message: messageFailedSingle(id),
                data: {
                    topping: []
                }
            })
        }

        await Topping.destroy({
            where: {
                id
            }
        });
        res.send({
            status: statusSuccess,
            message: messageSuccessSingle(id, 'deleted'),
            data: {
                topping: null
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}
const { Topping } = require('../../models/');

const errorResponse = (err, res) => {
    console.log(err)
    return res.status(500).send({
        error: {
            message: "Server Error"
        }
    })
}

exports.getToppings = async (req, res) => {
    try {
        const toppings = await Topping.findAll();

        if(!toppings) {
            return res.status(400).send({
                status: "DATA TOPPINGS EMPTY",
                data: []
            })
        }

        res.send({
            status: "GET TOPPINGS SUCCESS",
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
            }
        });

        if(!topping) {
            return res.status(400).send({
                status: `TOPPING WITH ID:${id} DOES NOT EXIST`,
                data: {
                    topping: []
                }
            })
        }

        res.send({
            status: "GET TOPPING SUCCESS",
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
        const { body: toppingData } = req;
        const topping = await Topping.create(toppingData);
        res.send({
            status: "ADD TOPPING SUCCESS",
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
                status: `TOPPING WITH ID:${id} DOES NOT EXIST`,
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
            status: "UPDATE TOPPING SUCCESS",
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
                status: `TOPPING WITH ID:${id} DOES NOT EXIST`,
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
            status: "DELETE TOPPING SUCCESS",
            data: {
                topping: null
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}
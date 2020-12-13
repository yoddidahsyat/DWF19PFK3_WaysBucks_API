const { Topping } = require('../../models/');

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
        console.log(err)
        return res.status(500).send({
            error: {
                message: "Server Error"
            }
        })
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
                data: []
            })
        }

        res.send({
            status: "GET TOPPING SUCCESS",
            data: {
                topping
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
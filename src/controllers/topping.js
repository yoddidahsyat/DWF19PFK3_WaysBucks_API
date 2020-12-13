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
        const topping = await Topping.findAll({
            where: {
                id
            }
        });

        if(topping.length === 0) {
            return res.status(400).send({
                status: "TOPPING IS NOT EXIST",
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
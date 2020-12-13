const { Product } = require('../../models/');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        if(products.lengt === 0) {
            return res.status(400).send({
                status: "PRODUCTS DATA EMPTY",
                data: []
            })
        }

        res.send({
            status: "GET PRODUCTS SUCCESS",
            data: {
                products
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

exports.getProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findAll({
            where: {
                id
            }
        });

        if(product.length === 0) {
            return res.status(400).send({
                status: "PRODUCT IS NOT EXIST",
                data: []
            })
        }

        res.send({
            status: "GET PRODUCT SUCCESS",
            data: {
                product
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
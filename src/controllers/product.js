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
        const product = await Product.findOne({
            where: {
                id
            }
        });

        if(!product) {
            return res.status(400).send({
                status: `PRODUCT WITH ID:${id} DOES NOT EXIST`,
                data: {
                    product: []
                }
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
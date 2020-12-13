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

exports.addProduct = async (req, res) => {
    try {
        const { body: productData } = req;
        const product = await Product.create(productData);

        res.send({
            status: "ADD PRODUCT SUCCESS",
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

exports.updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const { body: productData } = req;

        const isProductExist = await Product.findOne({
            where: {
                id
            }
        });
        if (!isProductExist) {
            return res.status(400).send({
                status: `PRODUCT WITH ID:${id} DOES NOT EXIST`,
                data: {
                    product: []
                }
            })
        }

        const product = await Product.update(productData, {
            where: {
                id
            }
        });

        const newProduct = await Product.findOne({
            where: {
                id
            }
        });

        res.send({
            status: "UPDATE PRODUCT SUCCESS",
            data: {
                product: newProduct
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
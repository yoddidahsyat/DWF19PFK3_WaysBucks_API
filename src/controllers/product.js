const { Product } = require('../../models/');

const errorResponse = (err, res) => {
    console.log(err);
    res.status(500).send({ error: { message: "Server Error" } })
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        if(products.length === 0) {
            return res.status(400).send({
                status: "PRODUCTS DATA EMPTY",
                data: {
                    product: []
                }
            })
        }

        res.send({
            status: "GET PRODUCTS SUCCESS",
            data: {
                products
            }
        })
    } catch (err) {
        return errorResponse(err, res);
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
        return errorResponse(err, res);
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
        return errorResponse(err, res);
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

        await Product.update(productData, {
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
        return errorResponse(err, res);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;

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

        await Product.destroy({
            where: {
                id
            }
        });
        res.send({
            status: "DELETE PRODUCT SUCCESS",
            data: {
                product: null
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}
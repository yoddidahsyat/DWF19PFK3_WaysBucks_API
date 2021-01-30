const { Product } = require('../../models/');

const statusSuccess = "SUCCESS";
const statusFailed = "FAILED";
const messageSuccess = (type) => { return `Product successfully ${type}` }
const messageSuccessSingle = (id, type) => { return `Product with id: ${id} successfully ${type}` }
const messageFailedSingle = (id) => { return `Product with id: ${id} does not exist` };
const messageEmpty = "Data Empty";
const errorResponse = (err, res) => {
    console.log(err);
    res.status(500).send({ error: { message: "Server Error" } })
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if(products.length < 1) {
            return res.send({
                status: statusFailed,
                message: messageEmpty,
                data: {
                    product: []
                }
            })
        }

        res.send({
            status: statusSuccess,
            message: messageSuccess('get'),
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
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if(!product) {
            return res.status(400).send({
                status: statusFailed,
                message: messageFailedSingle(id),
                data: {
                    product: []
                }
            })
        }

        res.send({
            status: statusSuccess,
            message: messageSuccessSingle(id, 'get'),
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
        const { body, file } = req;
        const productData = {
            ...body,
            image: file.path
        }
        const product = await Product.create(productData);
        res.send({
            status: statusSuccess,
            message: messageSuccess('added'),
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
                status: statusFailed,
                message: messageFailedSingle(id),
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
            status: statusSuccess,
            message: messageSuccessSingle(id, 'updated'),
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
                status: statusFailed,
                message: messageFailedSingle(id),
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
            status: statusSuccess,
            message: messageSuccessSingle(id, 'deleted'),
            data: {
                product: null
            }
        })
    } catch (err) {
        return errorResponse(err, res);
    }
}
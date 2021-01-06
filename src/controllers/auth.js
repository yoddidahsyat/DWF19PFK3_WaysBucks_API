const { User } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_PRIVATE_KEY;
const statusSuccess = "SUCCESS";
const statusFailed = "FAILED";
const errorResponse = (err, res) => {
    console.log(err);
    res.status(500).send({ error: { message: "Server Error" } })
}

// ------------------------------  REGISTER ----------------------------------- //

exports.register = async (req, res) => {
    try {
        const { body } = req;
        const role = 'user';
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate({ ...body }, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                status: statusFailed,
                message: "Failed to register",
                errors: error.details.map((detail) => detail.message),
            });
        }

        const { email, password } = body;

        const checkEmail = await User.findOne({
            where: {
                email,
            },
        });

        if (checkEmail) {
            return res.status(400).json({
                status: statusFailed,
                message: "This email has already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...body,
            password: hashedPassword,
            role
        });

        const payload = { id: user.id };
        const token = jwt.sign(payload, privateKey);

        res.send({
            status: statusSuccess,
            message: "You have successfully registered",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            },
        });
    } catch (err) {
        errorResponse(err, res);
    }
};


// -------------------------------- LOGIN ----------------------------------- //

exports.login = async (req, res) => {
    try {
        const { body } = req;
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate({ ...body }, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                status: statusFailed,
                message: "Your email or password is invalid",
                errors: error.details.map((detail) => detail.message),
            });
        }

        const { email, password } = body;

        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).json({
                status: statusFailed,
                message: "Your email or password is invalid",
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                status: statusFailed,
                message: "Your email or password is invalid",
            });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, privateKey);

        res.send({
            status: statusSuccess,
            message: "You have successfully login",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            },
        });
    } catch (err) {
        errorResponse(err, res);
    }
};

exports.checkAuth = async(req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findOne({
            where: {
                id
            }
        })

        res.send({
            status: statusSuccess,
            message: "You are already logged in",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (err) {
        errorResponse(err, res);
    }
}
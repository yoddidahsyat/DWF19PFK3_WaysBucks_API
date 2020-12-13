const { User } = require('../../models/');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if(users.length === 0) {
            return res.status(400).send({
                status: "USERS DATA EMPTY",
                data: []
            })
        }

        res.send({
            status: "GET USERS SUCCESS",
            data: {
                users
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

exports.getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findAll({
            where: {
                id
            }
        });

        if(user.length === 0) {
            return res.status(400).send({
                status: "USER IS NOT EXIST",
                data: []
            })
        }

        res.send({
            status: "GET USER SUCCESS",
            data: {
                user
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

// exports.deleteUser = async (req, res) => {
//     try {
//         const {id} = req.params
//         users = users.filter((user) => user.id != id);
//         res.send({
//             status: "DELETE DATA SUCCESS",
//             data: users
//         })
//     } catch (err) {
//         console.log(err)
//         return res.status(500).send({
//             error: {
//                 message: "Server Error"
//             }
//         })
//     }
// }
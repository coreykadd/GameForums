const Role = require('../models').Role;

let getRole = async function (req, res, next) {
    let role_id, err, user;
    role_id = req.params.role_id;

    [err, role] = await to(Role.findOne({
        where: {
            id: role_id
        }
    }))
    if (err) return ReE(res, "err finding role: " + err.message, 500);

    if (!role) return ReE(res, "role not found with id: " + role_id, 404);

    req.role = role;

    next();
}
module.exports.getRole = getRole;
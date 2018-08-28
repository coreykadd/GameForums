const Role = require('../models').Role;
const roleService = require('./../services/RoleService');
const Log = require('../models').Log;


const get = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let role = req.role;

    return ReS(res, {
        role: role.toWeb()
    });
}
module.exports.get = get;



const update = async function (req, res) {
    let err, role, data
    role = req.role;
    data = req.body;
    role.set(data);

    [err, role] = await to(role.save());
    if (err) {
        if (err) return ReE(res, "Error updating role: " + err.message, 500);
    }

    Log.create({
        action: 'updated',
        item: 'Role',
        itemId: role.id,
        UserId: req.activeUser
    });

    return ReS(res, {
        message: 'Updated role: ' + role.id
    });
}
module.exports.update = update;



const remove = async function (req, res) {
    let role, err;
    role = req.role;

    [err, role] = await to(role.destroy());
    if (err) return ReE(res, 'error occured trying to delete role: ' + err.message, 500);

    Log.create({
        action: 'deleted',
        item: 'Role',
        itemId: role.id,
        UserId: req.activeUser
    });

    return ReS(res, {
        message: 'Deleted role'
    }, 200);
}
module.exports.remove = remove;




const getMany = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let err, roles;

    [err, roles] = await to(Role.findAll());
    if (err) {
        return ReE(res, "err finding roles: " + err.message, 500)
    };

    if (!roles) return ReE(res, "Nothing found", 404);

    return ReS(res, {
        roles: roles
    });
}
module.exports.getMany = getMany;



const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;

    let err, role;

    [err, role] = await to(roleService.createRole(body));

    if (err) return ReE(res, "error creating Role: " + err.message, 500);

    Log.create({
        action: 'created',
        item: 'Role',
        itemId: role.id,
        UserId: req.activeUser
    });

    return ReS(res, {
        message: 'Successfully created new role.',
        role: role.toWeb()
    }, 201);
}
module.exports.create = create;





const removeRoleFromUser = async function (req, res) {
    let user, role, err;
    user = req.user;
    role = req.role;

    [err, res] = await to(user.removeRole([role.id]));
    if (err) return ReE(res, 'error occured trying remove role from user: ' + err.message, 500);

    Log.create({
        action: 'removed association',
        item: 'User',
        itemId: user.id,
        association: 'Role',
        associationId: role.id,
        UserId: req.activeUser
    });

    return ReS(res, {
        message: 'Deleted user_role'
    }, 200);
}
module.exports.removeRoleFromUser = removeRoleFromUser;
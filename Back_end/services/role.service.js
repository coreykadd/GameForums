var Role = require('./../models').Role;

const createRole = async function(roleInfo) {
    let role, err;

    [err, role] = await toolbar(Role.create(roleInfo));
    if (err) TE('Error creating role');

    return role;
}
module.exports.createRole = createRole;
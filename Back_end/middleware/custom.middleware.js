'use strict'

// var Company = require('./../models').Company;
var multer = require('multer');
var upload = multer({
    dest: './tmp/'
}).any('thumbs');

/*let company = async function (req, res, next) {
    let company_id, err, company;
    company_id = req.params.company_id;

    [err, company] = await to(Company.findOne({where:{id:company_id}}));
    if(err) return ReE(res, "err finding company");

    if(!company) return ReE(res, "Company not found with id: "+company_id);
    let user, users_array, users;
    user = req.user;
    [err, users] = await to(company.getUsers());

    users_array = users.map(obj=>String(obj.user));

    if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+app_id);

    req.company = company;
    next();
}
module.exports.company = company;*/

let hasRole = function (rolesArr) {
    return async function (req, res, next) {
        var userRoles = req.user.tokenRoles;
        var hasCommonElements = hasCommon(rolesArr, userRoles);
        if (hasCommonElements == false)
            return ReE(res, "User does not have permission to preform action", 403);

        next();
    }
}
module.exports.hasRole = hasRole;

var hasCommon = function (arr1, arr2) {
    for (let i in arr1) {
        for (let j in arr2) {
            if (arr1[i] == arr2[j]) {
                return true;
            }
        }
    }
    return false;
}


let getBody = async function (req, res, next) {
    console.log('\n\n', req.body, '\n\n')
    next();
}
module.exports.getBody = getBody;


let manageFiles = async function (req, res, next) {
    // upload to tmp
    upload(req, res, function (err) {
        if (err) return ReE(res, err);
        next();
    })
}
module.exports.manageFiles = manageFiles;
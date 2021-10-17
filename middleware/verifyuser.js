const crypto = require('crypto');
const { User } = require('../models/users');

function hasAuthValidFields(req, res, next) {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).json({ errors: errors.join(',') });
        } else {
            return next();
        }
    } else {
        return res.status(400).json({ errors: 'Missing email and password fields' });
    }
};



async function isPasswordAndUserMatch(req, res, next) {


    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send('Invalid email or password');


    let passwordFields = user.password.split('$');
    let salt = passwordFields[0];

    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    if (hash === passwordFields[1]) {
        req.auth = {
            _id: user._id,
            email: user.email,
           // permissionLevel: user[0].permissionLevel,
            name: user.name,
        };
        return next();
    } else {
        return res.status(400).send({ errors: ['Invalid e-mail or password'] });
    }
}

module.exports = { isPasswordAndUserMatch, hasAuthValidFields }
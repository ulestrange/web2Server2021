const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const credentials = require('../config')

const router = express.Router();


const { User } = require('../models/users');

const secret = credentials.jwtsecretkey // would normally import this from a config file


router.post('/', async (req, res) => {

    // check that the body contains an email and a password.

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
        }
    } else {
        return res.status(400).json({ errors: 'Missing email and password fields' });
    }

    // get the user information from the database 

    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send('Invalid email or password');

    // get the stored salt from the stored passport field

    let passwordFields = user.password.split('$');
    let salt = passwordFields[0];

    // encrypt the received password using the stored salt and compare it to
    // stored password.

    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    if (hash !== passwordFields[1]) {
        return res.status(400).send({ errors: ['Invalid e-mail or password'] });
    }

    // here we know the received password is the same as the one stored.

    // set the payload for the jwt.
    let payload = {};
    payload._id = user._id;
    payload.email = user.email;
    payload.firstName = user.firstName;
    payload.lastName = user.lastName;

    // sign the jwt and return it in the body of the request. 
    // expiry is in 2 mintues (60 * 2 )      

    let token = jwt.sign(payload, secret, { expiresIn: 60 * 2 });

    let refreshToken = createRefreshToken();

    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    })

    res.status(201).json({
        accessToken: token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    });
    console.log('login success');


}
);

/// this is returning a 404 error need to fix this tomorrow
// Una

router.get('/refresh:/id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // compare the stored refresh token to the one received in the cookie.
            // if they match then create a new JWT and return.
            // otherwise give an error

            // set the payload for the jwt.
            let payload = {};
            payload._id = user._id;
            payload.email = user.email;
            payload.firstName = user.firstName;
            payload.lastName = user.lastName;

            // sign the jwt and return it in the body of the request. 
            // expiry is in 2 mintues (60 * 2 )      

            let token = jwt.sign(payload, secret, { expiresIn: 60 * 2 });

            res.status(201).json({
                accessToken: token,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
            console.log('refresh success');
        }
        else {
            res.status(404).json('Not found');
        }
    }
    catch {
        res.status(404).json('Not found: id is weird');
    }

})


const createRefreshToken = () => {
    return 'this is a dummy refresh token';
}

module.exports = router;









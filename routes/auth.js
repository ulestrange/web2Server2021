const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const router = express.Router();


const { User } = require('../models/users');
const { hasAuthValidFields, isPasswordAndUserMatch } = require('../middleware/verifyuser');


const secret = 'unasverySecretSecret' // would normally import this from a config file


router.post('/', isPasswordAndUserMatch, async (req, res) => {

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
        payload.name = user.name;

 // sign the jwt and return it in the body of the request.       

        let token = jwt.sign(payload, secret, {expiresIn : 60});
        res.status(201).json({ accessToken: token });
        console.log('login success');

}
);



module.exports = router;









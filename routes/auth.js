const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const router = express.Router();


const { User } = require('../models/users');
const { hasAuthValidFields, isPasswordAndUserMatch } = require('../middleware/verifyuser');


const secret = 'unasverySecretSecret' // would normally import this from a config file


router.post('/', hasAuthValidFields, isPasswordAndUserMatch, async (req, res) => {

    try {
        let refreshId = req.auth._id + secret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.auth.refreshKey = salt;
        let token = jwt.sign(req.auth, secret);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({ accessToken: token, refreshToken: refresh_token });
        console.log('login success');
    } catch (err) {
        res.status(500).send({ errors: err });
    }

}
);


module.exports = router;









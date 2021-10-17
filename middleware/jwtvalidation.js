
   
const jwt = require('jsonwebtoken');

const  crypto = require( 'crypto');


let secret =  'unasverySecretSecret' // would normally import this from a config file

function verifyRefreshBodyField (req, res, next) {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    }
};

function validRefreshNeeded  (req, res, next)  {
   
    let refresh_token = req.body.refresh_token;
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
    
    let b = Buffer.from(hash);
    let token = b.toString('base64');
    if (token === refresh_token) {
        req.auth = req.jwt;
        return next();
    } else {
        return res.status(400).send({error: 'Invalid refresh token'});
    }
};


// this 
// a) checks that there is a Bearer token in the authorization header
// b) the token is valid using the signature

function validJWTNeeded (req, res, next) {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], secret);
                return next();
            }

        } catch (err) {
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
};

module.exports = { validRefreshNeeded, validJWTNeeded, verifyRefreshBodyField}



const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
       // permissionLevel: Number  // for later athorization
        },
);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
    return schema.validate(user);
}


const User = mongoose.model('User', userSchema);



exports.User = User;
exports.validate = validateUser;

const joi = require('joi');

const loginValidation = joi.object({
    username: joi.string().required(),
    password: joi.string().min(8).required()
});

const registerValidation = joi.object({
    username: joi.string().required(),
    password: joi.string().min(8).required(),
    repeat: joi.ref('password')
});


module.exports = {
    loginValidation,
    registerValidation
}
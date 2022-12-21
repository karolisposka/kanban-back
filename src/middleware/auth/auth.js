const jwt = require('jsonwebtoken');
const {jwt_secret} = require('../../config');

const checkIfLoggedIn = async(req,res,next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        req.user = await jwt.verify(token, jwt_secret);
        return next();
    }catch(err){
        res.status(500).send({err:'Not authorized!'});
    }
}

module.exports = checkIfLoggedIn;
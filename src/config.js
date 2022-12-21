require('dotenv').config();


module.exports= {
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    mongodb: process.env.CONNECTION_STRING,
}
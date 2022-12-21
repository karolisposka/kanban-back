require('dotenv').config();


module.exports= {
    port: process.env.PORT,
    jwt_secret: process.env.jwt_secret,
    mongodb: process.env.CONNECTION_STRING,
}
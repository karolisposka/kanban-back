const express = require('express');
const { loginValidation, registerValidation } = require('../../middleware/validation/validationSchemas/usersValidation');
const validation = require('../../middleware/validation/validation');
const { jwt_secret } = require('../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {getDb} = require('../../controllers/database');
const router = express.Router();


router.post("/register", validation(registerValidation), async (req, res) => {
    try {
      const db = getDb();
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const data = await db.collection('users').insertOne({username: `${req.body.username}`, password: `${hashedPassword}`});
      if (!data.insertedId) {
        return res.status(500).send({err: "something wrong with the server. Please try again later"});
      } else {
        return res.send({ msg: "registration completed" });
      }
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        return res.send({ err: "user already exists" });
      }
      return res.status(500).send({ err: "something wrong with the server. Please try again later" });
    }
  });


router.post("/login", validation(loginValidation),  async (req, res) => {
    try {
        const db = getDb();
        const data = await db.collection('users').findOne({username: `${req.body.username}`});
        if (!data) {
            return res.status(400).send({ err: "user does not exist" });
        }
        const checkedPassword = bcrypt.compareSync(
            req.body.password,
            data.password
        );
        if (!checkedPassword) {
            return res.status(500).send({ err: "wrong password" });
        }
        const token = jwt.sign(data._id.toString(), jwt_secret);
        return res.send({ msg: "Successfully logged in", token });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: "something wrong with the server. Please try again later" });
    }
  });

module.exports = router;
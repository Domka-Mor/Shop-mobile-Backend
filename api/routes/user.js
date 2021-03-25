const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');


const User = require("../models/user");
const Order = require("../models/order");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              role: req.body.role,
              name: req.body.name,
              surname: req.body.surname,
              adress: req.body.adress,
              country: req.body.country
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            userId: user[0]._id,
            cart: user[0].cart,
            role: user[0].role,
            favourite: user[0].favourite
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", checkAuth, (req, res, next) => {
  Order.find({ user: req.params.userId })
  Order.deleteMany({ user: req.params.userId })
    .exec()
    .then(order => {                 
      User.remove({ _id: req.params.userId })
      .then(result => {
        res.status(201).json({
          message: "User and user's orders were deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });              
    });
});


router.delete("/admin/:userId", checkAuth, (req, res, next) => {
  Order.find({ user: req.params.userId })
  Order.deleteMany({ user: req.params.userId })
    .exec()
    .then(order => {                 
      User.remove({ _id: req.params.userId })
      .then(result => {
        res.status(201).json({
          message: "User and user's orders were deleted by admin"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });              
    });
});


router.get("/admin", checkAuth, (req, res, next) => {
  User.find()
    .select("role email _id name surname adress country")
    .exec()
    .then(docs => {
      res.status(200).json({
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            role: doc.role,
            name: doc.name,
            surname: doc.surname,
            adress: doc.adress,
            country: doc.country
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


router.get("/:userId", checkAuth, (req, res, next) => {
  User.findById(req.params.userId)
    .select("name email _id surname adress country cart")
    .exec()
    .then(doc => {
      res.status(200).json({
        user: doc
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


router.put("/:userId", checkAuth, (req, res, next) => {
  const id = req.params.userId;
  const name = req.body.name;
  const surname = req.body.surname;
  const adress = req.body.adress;
  const country = req.body.country;
  User.update({ _id: id }, { name: name, surname: surname, adress: adress, country: country})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Adress updated by user'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.put("/orders/:userId", checkAuth, (req, res, next) => {
  const id = req.params.userId;
  const cart = req.body.cart;
  User.update({ _id: id }, {cart: cart})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Order stored'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.put("/cart/:userId", checkAuth, (req, res, next) => {
  const id = req.params.userId;
  const cart = req.body.cart;
  User.update({ _id: id }, { cart: cart})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Cart updated by user'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;
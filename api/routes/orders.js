const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");


router.get("/admin", checkAuth, (req, res, next) => {
  Order.find()
    .select("_id user subtotal tax total date orders status")
    .populate('user', '_id email name surname adress country')
    .exec()
    .then(docs => {
      res.status(200).json({
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            subtotal: doc.subtotal,
            tax: doc.tax,
            total: doc.total,
            date: doc.date,
            orders: doc.orders,
            status: doc.status,
            user: doc.user
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

// Handle incoming GET requests to /orders
router.get("/:userId", checkAuth, (req, res, next) => {
  Order.find()
    .populate('user', "name email surname adress country")
    .exec()
    .then(orders => {
      res.status(200).json({   
        orders: orders.filter(order => order.user._id == req.params.userId),       
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/:userId", checkAuth, (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        orders: req.body.orders,
        total: req.body.total,
        subtotal: req.body.subtotal,
        tax: req.body.tax,
        user: user,
        date: req.body.date
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          orders: result.orders,
          total: result.total,
          subtotal: result.subtotal,
          tax: result.tax,
          user: result.user,
          status: result.status,
          date: result.date
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/user/:orderId", checkAuth, (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('user')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.put("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  const count = req.body.count;
 const total = req.body.total;
  Order.update({ _id: id }, { count: count, total: total})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Order updated by user'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.put("/admin/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  const status = req.body.status;
  Order.update({ _id: id }, { status: status})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Order updated by user'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


router.delete("/admin/:orderId", checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted by admin"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Product = require("../models/product");
const multer = require('multer');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
   cb(null, Date.now() + file.originalname); 
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id company info productImage featured featuredInfo")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            productImage: doc.productImage,
            price: doc.price,
            _id: doc._id,
            company: doc.company,
            info: doc.info,
            featured: doc.featured,
            featuredInfo: doc.featuredInfo          
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/admin", upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  // pridaj potom auth
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    productImage: req.file.path,
    price: req.body.price,
    company: req.body.company,
    info: req.body.info,
    featured: req.body.featured,
    featuredInfo: req.body.featuredInfo
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully by admin",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            company: result.company,
            info: result.info,
            productImage: result.productImage,
            featured: result.featured,
            featuredInfo: result.featuredInfo
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


router.put("/admin/img/", upload.array("productImage",5), (req, res, next) => {
  const id = req.body.productId;
  const product = req.files;
  const productImage = [...new Set(product.map(it => it.path))];
  Product.update({ _id: id }, { productImage: productImage})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Image updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/admin/name/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const name = req.body.name;
  Product.update({ _id: id }, { name: name})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Name updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/admin/featured/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const featured = req.body.featured;
  Product.update({ _id: id }, { featured: featured})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Featured updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/admin/featuredInfo/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const featuredInfo = req.body.featuredInfo;
  Product.update({ _id: id }, { featuredInfo: featuredInfo})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'FeaturedInfo updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/admin/price/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const price = req.body.price;
  Product.update({ _id: id }, { price: price})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Price updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/admin/company/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const company = req.body.company;
  Product.update({ _id: id }, { company: company})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Company updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.put("/admin/info/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const info = req.body.info;
  Product.update({ _id: id }, { info: info})
    .exec()
    .then(result => {
      res.status(200).json({
         result:result,
          message: 'Info updated by admin'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/admin/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted by admin'
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
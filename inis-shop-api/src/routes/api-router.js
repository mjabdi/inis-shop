const express = require('express');
const router = express.Router();

const postService = require('../services/post-service');
const categoryService = require('../services/category-service');
const productService = require('../services/product-service');


router.use('/posts', postService);
router.use('/categories', categoryService);
router.use('/products', productService);



router.use('/*' , (req,res,next) => {

  res.status(404).send('invalid endpoint');
  res.end();

});



module.exports = router;

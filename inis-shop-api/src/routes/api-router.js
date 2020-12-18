const express = require('express');
const router = express.Router();

const feedService = require('./../services/feed-service');


router.use('/feed', feedService);



router.use('/' , (req,res,next) => {

  res.status(404).send('invalid endpoint');
  res.end();

});



module.exports = router;

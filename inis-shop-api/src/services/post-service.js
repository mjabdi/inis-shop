const express = require('express');
const router = express.Router();
const  {Post} = require('../models/Post');

router.get('/getshopposts', async function(req, res, next) {
    
    const shop_id = req.query.shop_id;
    let page_size = parseInt(req.query.page_size || 12);
    const after = parseInt(req.query.after || 0);


    if (page_size > 50 || page_size <= 0)
    {
        page_size = 50;
    }
    
    if (!shop_id)
    {
        res.status(400).send({status:'FAILED' , error: 'shop_id is missing'});
        return;
    }

    try{
        const posts = await Post.find({shopId: shop_id}).sort({postTimeStamp : -1}).skip(after).limit(page_size).exec();
        res.status(200).send({status:'OK' , count: posts.length, end_cursor: (posts.length === page_size) ? after + posts.length : null ,posts: posts});
        console.log(`Success Result : ${posts} `);

    }catch(err)
    {
        console.error(err);
        res.status(500).send({status:'FAILED' , error: err.message });
        return;
    }  
})


module.exports = router;
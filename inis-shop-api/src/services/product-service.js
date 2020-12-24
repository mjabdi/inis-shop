const express = require('express');
const router = express.Router();
const  {Product} = require('../models/Product');
const  {Shop} = require('../models/Shop');
const  {Post} = require('../models/Post');
const  {Category} = require('../models/Category');
const mongoose = require('mongoose');

router.get('/getallproducts', async function(req, res, next) {
    try{
        let page_size = parseInt(req.query.page_size || 12);
        const after = parseInt(req.query.after || 0);

        if (page_size > 50 || page_size <= 0)
        {
            page_size = 50;
        }
        const products = await Product.find({deleted : {$ne : true}}).sort({timeStamp: -1}).skip(after).limit(page_size).exec();
        res.status(200).send({status: 'OK' , count: products.length, end_cursor: (products.length === page_size) ? after + products.length : null, products: products});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status: 'FAILED', error: err.message});
    }
})

router.get('/getshopproducts', async function(req, res, next) {
    try{
        const shop_id = req.query.shop_id;
        let page_size = parseInt(req.query.page_size || 12);
        const after = parseInt(req.query.after || 0);

        if (!shop_id)
        {
            res.status(400).send({status: 'FAILED' , error: 'shop_id is missing'});
            return; 
        }

        if (page_size > 50 || page_size <= 0)
        {
            page_size = 50;
        }

        const products = await Product.find({shopId: shop_id, deleted: {$ne : true}}).sort({timeStamp: -1}).skip(after).limit(page_size).exec();
        res.status(200).send({status: 'OK' , count: products.length, end_cursor: (products.length === page_size) ? after + products.length : null, products: products});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status: 'FAILED', error: err.message});
    }
})

router.post('/addproduct', async function(req, res, next) {
   
   try
   {
        await ValidateProduct(req.body);
   }
   catch(err)
   {
        res.status(400).send({status: 'FAILED' , error: err.message});
        return; 
   }
   
    try{
        const product = new Product({
            timeStamp : new Date(),
            lastUpdate: new Date(),
            ...req.body
        });
        const result = await product.save();
        res.status(201).send({status: 'OK' , result: result});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status: 'FAILED', error: err.message});
    }
})

router.post('/editproduct', async function(req, res, next) {
   
    if (!req.query.product_id)
    {
        res.status(400).send({status: 'FAILED' , error: 'product_id is missing in query'});
        return;  
    }

    try
    {
         await ValidateProduct(req.body,true);
    }
    catch(err)
    {
         res.status(400).send({status: 'FAILED' , error: err.message});
         return; 
    }
    
     try{

        const product_id = mongoose.Types.ObjectId(req.query.product_id);
        const found = await Product.findOne({_id: product_id , deleted : {$ne: true}});
        if (!found)
        {
            res.status(400).send({status: 'FAILED' , error: 'cannot find the product'});
            return;     
        }

        const {history, timeStamp, ...oldRecord} =  found._doc;
        const newHistory = [...found.history, JSON.stringify(oldRecord)];
    
       
         const result = await Product.updateOne({_id: product_id}, {lastUpdate: new Date(), history: newHistory  , ...req.body});
         res.status(200).send({status: 'OK' , result: result});
     }
     catch(err)
     {
         console.error(err);
         res.status(500).send({status: 'FAILED', error: err.message});
     }
 })

 router.post('/deleteproduct', async function(req, res, next) {
   
    if (!req.query.product_id)
    {
        res.status(400).send({status: 'FAILED' , error: 'product_id is missing in query'});
        return;  
    }
    
     try{

        const product_id = mongoose.Types.ObjectId(req.query.product_id);
        const found = await Product.findOne({_id: product_id});
        if (!found)
        {
            res.status(400).send({status: 'FAILED' , error: 'cannot find the product'});
            return;     
        }
       
         const result = await Product.updateOne({_id: product_id}, {deleted: true});
         res.status(200).send({status: 'OK' , result: result});
     }
     catch(err)
     {
         console.error(err);
         res.status(500).send({status: 'FAILED', error: err.message});
     }
 })


async function ValidateProduct(body, editMode)
{
    if (!body.shopId)
    {
        throw new Error('shopId is missing');
    }
    const shop = await Shop.findOne({id: body.shopId});
    if (!shop)
    {
        throw new Error('shopId is invalid');
    }

    if (!body.postId)
    {
        throw new Error('postId is missing');
    }

    if (!body.title)
    {
        throw new Error('title is missing');
    }

    const post = await Post.findOne({id: body.postId, shopId: body.shopId});
    if (!post)
    {
        throw new Error('postId is invalid');
    }

    if (!body.price)
    {
        throw new Error('price is missing');
    }

    body.price = parseInt(body.price);

    if (!body.categoryId)
    {
        throw new Error('categoryId is missing');
    }

    const cat = await Category.findOne({_id : mongoose.Types.ObjectId(body.categoryId)});

    if (!cat)
    {
        throw new Error('categoryId is invalid');
    }

    body.categoryId = mongoose.Types.ObjectId(body.categoryId);

    if (!body.variant)
    {
        body.variant = null;
    }

    if (!editMode)
    {   
        const found = await Product.findOne({postId : body.postId, title: body.title, variant: body.variant, deleted : {$ne: true}});
        if (found)
        {
            throw new Error('product is already exists');
        }
    }
}

module.exports = router;
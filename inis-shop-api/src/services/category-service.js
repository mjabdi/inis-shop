const express = require('express');
const router = express.Router();
const  {Category} = require('../models/Category');
const mongoose = require('mongoose');

router.get('/getallcategories', async function(req, res, next) {
    
    try{
        const categories = await Category.find().sort({title: 1}).exec();
        res.status(200).send({status: 'OK' , categories: categories});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status: 'FAILED', error: err.message});
    }
})

router.post('/addcategory', async function(req, res, next) {
    
    if (!req.body.title)
    {
        res.status(400).send({status: 'FAILED' , error: 'title is missing'});
        return;
    }

    const parentId = req.body.parentId ? mongoose.Types.ObjectId(req.body.parentId) : null;

    const found = await Category.findOne({title: req.body.title, parentId: parentId}).exec();
    if (found)
    {
        res.status(400).send({status: 'FAILED' , error: `${req.body.title} is already exists`});
        return;
    }

    try{
        const category = new Category({
            timeStamp : new Date(),
            title: req.body.title,
            description : req.body.description || '',
            parentId: parentId
        });
        const result = await category.save();
        res.status(201).send({status: 'OK' , result: result});
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send({status: 'FAILED', error: err.message});
    }
})



module.exports = router;
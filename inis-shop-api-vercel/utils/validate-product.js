import dbConnect from './mongodb'
import Post from '../models/Post'
import Product from '../models/Product'
import Category from '../models/Category'
import Shop from '../models/Shop'
import mongoose from 'mongoose'

export default async function ValidateProduct(body, editMode)
{
    await dbConnect()

    if (!body.shopId)
    {
        throw new Error('shopId is missing')
    }
    const shop = await Shop.findOne({id: body.shopId})
    if (!shop)
    {
        throw new Error('shopId is invalid')
    }

    if (!body.postId)
    {
        throw new Error('postId is missing')
    }

    if (!body.title)
    {
        throw new Error('title is missing')
    }

    const post = await Post.findOne({id: body.postId, shopId: body.shopId})
    if (!post)
    {
        throw new Error('postId is invalid')
    }

    if (!body.price)
    {
        throw new Error('price is missing')
    }

    body.price = parseInt(body.price)

    // if (!body.categoryId)
    // {
    //     throw new Error('categoryId is missing')
    // }

    

    // const cat = await Category.findOne({_id : mongoose.Types.ObjectId(body.categoryId)})

    // if (!cat)
    // {
    //     throw new Error('categoryId is invalid')
    // }

    // body.categoryId = mongoose.Types.ObjectId(body.categoryId)

    if (!body.variant)
    {
        body.variant = null;
    }

    if (!editMode)
    {   
        const found = await Product.findOne({postId : body.postId, title: body.title, variant: body.variant, deleted : {$ne: true}});
        if (found)
        {
            throw new Error('product is already exists')
        }
    }
}
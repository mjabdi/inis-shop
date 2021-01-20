import dbConnect from './mongodb'
import Product from '../models/Product'
import Shop from '../models/Shop'
import mongoose from 'mongoose'

export default async function ValidateOrder(body)
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

    if (!body.customerId)
    {
        throw new Error('customerId is missing')
    }

    if (!body.shippingAddress)
    {
        throw new Error('shippingAddress is missing')
    }

    if (!body.shippingMethod)
    {
        throw new Error('shippingMethod is missing')
    }

    if (!body.paymentMethod)
    {
        throw new Error('paymentMethod is missing')
    }

    if (!body.shippingPrice)
    {
        throw new Error('shippingPrice is missing')
    }

    if (!body.orderProducts)
    {
        throw new Error('orderProducts is missing')
    }

    if (body.orderProducts.length < 1)
    {
        throw new Error('orderProducts should be an array')
    }

    body.orderProducts.forEach(element => {
        if (!element.productId || !element.variant || !element.price || !element.count)
        {
            throw new Error('orderProducts is invalid')
        }
    });
}
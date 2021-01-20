import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import Product from '../../models/Product'
import Order from '../../models/Order'
import OrderDetail from '../../models/OrderDetail'
import ValidateOrder from '../../utils/validate-order'
import allowCors from '../../utils/allow-cors'

const handler = async (req, res) => {
 
    if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          try {
            await ValidateOrder(req.body);
          } catch (err) {
            res.status(200).send({ status: "FAILED", error: err.message });
            console.log(err);
            return;
          }

          await dbConnect();     

          const {
              shopId,
              customerId,
              shippingAddress,
              shippingMethod,
              paymentMethod,
              shippingPrice,
              orderProducts
          } = req.body

          const orderId = await createOrderId()

          const order = new Order(
              {
                 timeStamp : new Date(),
                 shopId: shopId,
                 orderId: orderId,
                 customerId: customerId,
                 status: paymentMethod === 'online' ? 'awaitingPayment' : 'awaitingCustomerConfirmation',
                 shippingAddress: shippingAddress,
                 shippingMethod: shippingMethod,
                 paymentMethod: paymentMethod,
                 orderTotalPrice: calcOrderTotalPrice(orderProducts),
                 shippingPrice: shippingPrice,
              }
          )

          await order.save()

          for (var i=0 ; i<orderProducts.length; i++)
          {
              const orderDetail = new OrderDetail({
                  timeStamp: new Date(),
                  shopId: shopId,
                  orderId: orderId,
                  productId: orderProducts[i].productId,
                  variant: JSON.stringify(orderProducts[i].variant),
                  price: orderProducts[i].price,
                  count: orderProducts[i].count
              })
              await orderDetail.save()
          }
   
          res.status(201).send({ status: "OK", orderId: orderId });
        } catch (err) {
          res.status(200).json({ status: "FAILED", error: err.message });
        }
        break;
      default:
        res.status(404).send("invalid endpoint");
        break;
    }
  }
}

async function createOrderId()
{
    return '00001'
}

function calcOrderTotalPrice (orderProducts) {
    let sum = 0
    orderProducts.forEach(element => {
        sum += element.price
    });
    return sum
} 

module.exports = allowCors(handler)

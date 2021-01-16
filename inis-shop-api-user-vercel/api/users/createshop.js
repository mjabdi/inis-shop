import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import User from "../../models/User";
import Shop from "../../models/Shop";
import UserShop from "../../models/UserShop";
import allowCors from "../../utils/allow-cors";

const MAX_ALLOWED_SHOPS = 3

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          await dbConnect();
          const {authToken, shopName, shopPersianName, shopDescription} = req.body
          const user = await User.findOne({authToken: authToken})
          if (!user)
          {
              res.status(200).send({status:'FAILED', error: 'مدت زمان ورود شما منقضی شده است، لطفا دوباره وارد شوید'})
              return  
          }
  
          if (!user.isActive)
          {
              res.status(200).send({status:'FAILED', error: 'اکانت شما غیرفعال می باشد'})
              return 
          }
  
          if (user.isLocked)
          {
              res.status(200).send({status:'FAILED', error: 'اکانت شما به دلایل امنیتی مسدود شده است، لطفا با مدیر سیستم تماس بگیرید'})
              return     
          }

          const userShops = await UserShop.find({userId: userId, isOwner: true}).sort({timeStamp:-1}).exec();
          if (userShops && userShops.length >= MAX_ALLOWED_SHOPS)
          {
            res.status(200).send({status:'FAILED', error: "سقف تعداد فروشگاه های مجاز شما به اتمام رسیده است"});
            return
          }

          const shopFound = await Shop.findOne({name: shopName})
          if (shopFound)
          {
            res.status(200).send({status:'FAILED', error: "این فروشگاه قبلا در سیستم ثبت شده است"});
            return     
          }

          const shop = new Shop(
              {
                  timeStamp: new Date(),
                  disabled: true,
                  isUpdating: false,
                  name: shopName,
                  persianName: shopPersianName,
                  description: shopDescription,
                  id: null,
              }
          )

          await shop.save()

          const userShop = new UserShop({
             timeStamp: new Date(),
             userId: user.userId,
             shopId: shop._id,
             isOwner: true  
          })

          await userShop.save()

          res.status(200).send({status:'OK'});

        } catch (err) {
          res.status(200).json({ status: "FAILED", error: err.message });
        }
        break;
      default:
        res.status(404).send("invalid endpoint");
        break;
    }
  }
};



module.exports = allowCors(handler);

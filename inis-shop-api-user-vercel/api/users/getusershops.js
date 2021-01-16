import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import User from "../../models/User";
import Shop from "../../models/Shop";
import UserShop from "../../models/UserShop";
import allowCors from "../../utils/allow-cors";

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          await dbConnect();
          const {authToken} = req.body
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

          const userShops = await UserShop.find({userId: userId}).sort({timeStamp:-1}).exec();
          if (!userShops || userShops.length === 0)
          {
            res.status(200).send({status:'OK', shops: []});
            return
          }

          const shops = []
          for (var i=0; i < userShops.length; i++)
          {
               shops.push({... await Shop.findOne({_id: userShops[i].shopId}) , isOwner: userShops[i].isOwner , accessList: userShops[i].accessList })
          }

          res.status(200).send({status:'OK', shops: shops});

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

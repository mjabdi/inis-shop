import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import User from "../../models/User";
import allowCors from "../../utils/allow-cors";
import redis from "../../utils/redis";
import uuid from 'uuid-random';
import TokenExpired from '../../utils/TokenExpired'

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          await dbConnect();
          const {userId, password} = req.body
          const user = await User.findOne({userId: userId})
          if (!user)
          {
              res.status(200).send({status:'FAILED', error: 'نام کاربری یا رمز عبور اشتباه می باشد'})
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
  
         
  
          const isMatch = await user.comparePassword(password)
          if (!isMatch)
          {
              res.status(200).send({status:'FAILED', error: 'نام کاربری یا رمز عبور اشتباه می باشد'})
              return  
          }

          let authToken = null
          let authTokenTimeStamp = null
          if (user.authToken && !TokenExpired(user.authTokenTimeStamp))
          {
            authToken = user.authToken
            authTokenTimeStamp = user.authTokenTimeStamp
          }else
          {
              authToken = uuid()
              authTokenTimeStamp = new Date()
          }
          
          await User.updateOne({_id: user._id}, {authToken: authToken, authTokenTimeStamp: authTokenTimeStamp, lastLoginTimeStamp: new Date()})

          res.status(200).send({status: 'OK', token: authToken }) 
  
   
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

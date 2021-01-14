import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import User from '../../models/User'
import allowCors from '../../utils/allow-cors'
import CreateRandomVerificationCode from '../../utils/verfication-code'
import uuid from 'uuid-random'
import redis from '../../utils/redis'

const TIMEOUT = 2 * 60 //seconds

const handler = async (req, res) => {
 
    if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
         
          const {forename, surname, userId, password} = req.body
          await dbConnect();

          const found = await User.findOne({userId: userId})
          if (found)
          {
              res.status(200).send({status:'FAILED', error: 'این شماره تلفن قبلا در سیستم ثبت شده است، اگر رمز عبور خود را فراموش کرده اید از گزینه فراموشی رمز عبور استفاده نمائید'})
              return
          }

          const verficationCode = CreateRandomVerificationCode()

          console.log(verficationCode)

          const result = redis.SETEX(verficationCode,TIMEOUT,userId)
          console.log(result)
          
          res.status(200).send({status:'OK', code: verficationCode})

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

module.exports = allowCors(handler)

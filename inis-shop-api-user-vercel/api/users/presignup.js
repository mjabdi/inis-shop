import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import User from '../../models/User'
import allowCors from '../../utils/allow-cors'
import CreateRandomVerificationCode from '../../utils/verfication-code'
import redis from '../../utils/redis'



const handler = async (req, res) => {

   const TIMEOUT = 2 * 60 //seconds
 
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

          const value =  {forename, surname, password, userId, verficationCode}
          redis.SETEX(userId, TIMEOUT, JSON.stringify(value))

          res.status(200).send({status:'OK'})

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

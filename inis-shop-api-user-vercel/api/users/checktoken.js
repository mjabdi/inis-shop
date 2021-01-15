import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import User from "../../models/User";
import allowCors from "../../utils/allow-cors";
import redis from "../../utils/redis";
import uuid from 'uuid-random';

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          await dbConnect();
          const {token} = req.body
          const user = await User.findOne({authToken: token})
          if (!user)
          {
              res.status(200).send({status:'FAILED', error: 'INVALID-TOKEN'}) 
              return
          }
  
          res.status(200).send({status:'OK', userId: user.userId, forename: user.forename, surname: user.surname})
            
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

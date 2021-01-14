import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import User from "../../models/User";
import allowCors from "../../utils/allow-cors";
import redis from "../../utils/redis";

const handler = async (req, res) => {

  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          await dbConnect();
          const { userId, verficationCode, password } = req.body;
          const user = await User.findOne({ userId: userId });
          if (!user) {
            res
              .status(200)
              .send({
                status: "FAILED",
                error: "این شماره تلفن در سیستم ثبت نشده است",
              });
            return;
          }

          const record = redis.get(userId, async (err, record) => {
            if (!record) {
              res.status(200).send({
                status: "FAILED",
                error:
                  "expired!" +
                  "کد تائید شما منقضی شده است، لطفا ارسال کد جدید را کلیک نمائید",
              });
              return;
            }
            record = JSON.parse(record);

            if (record.verficationCode !== verficationCode) {
              res.status(200).send({
                status: "FAILED",
                error: "کد تائید نادرست می باشد، لطفا مجددا تلاش نمائید.",
              });
              return;
            }

            user.password = password;

            await user.save();

            res.status(200).send({ status: "OK" });
          });
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

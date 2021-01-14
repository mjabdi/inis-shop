import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import User from "../../models/User";
import allowCors from "../../utils/allow-cors";
import CreateRandomVerificationCode from "../../utils/verfication-code";
import uuid from "uuid-random";
import redis from "../../utils/redis";

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          await dbConnect();

          const { userId, verficationCode } = req.body;
          const found = await User.findOne({ userId: userId });
          if (found) {
            res
              .status(200)
              .send({
                status: "FAILED",
                error:
                  "این شماره تلفن قبلا در سیستم ثبت شده است، اگر رمز عبور خود را فراموش کرده اید از گزینه فراموشی رمز عبور استفاده نمائید",
              });
            return;
          }

          const record = redis.get(userId, async (err, record) => {
            if (!record) {
              res.status(200).send({
                status: "FAILED",
                error:
                  "Verification Code has been expired! Please click the RESEND NEW CODE button to recieve the new code.",
              });
              return;
            }

            record = JSON.parse(record);

            if (record.verficationCode !== verficationCode) {
              res.status(200).send({
                status: "FAILED",
                error: "Invalid Verification Code! Please try again.",
              });
              return;
            }

            const user = new User({
              timeStamp: new Date(),
              forename: record.forename,
              surname: record.surname,
              userId: record.userId,
              password: record.password,
              isActive: true,
            });

            await user.save();

            res.status(201).send({ status: "OK" });
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

import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import Product from "../../models/Product";
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          if (!req.query.product_id) {
            res
              .status(400)
              .send({
                status: "FAILED",
                error: "product_id is missing in query",
              });
            return;
          }

          const product_id = mongoose.Types.ObjectId(req.query.product_id);

          await dbConnect();

          const found = await Product.findOne({ _id: product_id });
          if (!found) {
            res
              .status(400)
              .send({ status: "FAILED", error: "cannot find the product" });
            return;
          }

          const result = await Product.updateOne(
            { _id: product_id },
            { deleted: true }
          );
          res.status(200).send({ status: "OK", result: result });
        } catch (err) {
          res.status(500).json({ status: "FAILED", error: err.message });
        }
        break;
      default:
        res.status(404).send("invalid endpoint");
        break;
    }
  }
}

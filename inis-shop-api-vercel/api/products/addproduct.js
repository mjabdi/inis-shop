import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import Category from "../../models/Category";
import Product from "../../models/Product";
import Shop from "../../models/Shop";
import Post from "../../models/Post";
import ValidateProduct from "../../utils/validate-product";

export default async function handler(req, res) {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {
          try {
            await ValidateProduct(req.body);
          } catch (err) {
            res.status(400).send({ status: "FAILED", error: err.message });
            return;
          }

          await dbConnect();

          const product = new Product({
            timeStamp: new Date(),
            lastUpdate: new Date(),
            ...req.body,
          });
          const result = await product.save();
          res.status(201).send({ status: "OK", result: result });
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

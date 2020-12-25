import checkToken from "../../utils/check-token";
import dbConnect from "../../utils/mongodb";
import Product from "../../models/Product";


export default async function handler(req, res) {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "GET":
        try {
          let page_size = parseInt(req.query.page_size || 12);
          const after = parseInt(req.query.after || 0);

          if (page_size > 50 || page_size <= 0) {
            page_size = 50;
          }

          await dbConnect();
          const products = await Product.find({ deleted: { $ne: true } })
            .sort({ timeStamp: -1 })
            .skip(after)
            .limit(page_size)
            .exec();

          res.status(200).send({
            status: "OK",
            count: products.length,
            end_cursor:
              products.length === page_size ? after + products.length : null,
            products: products,
          });
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

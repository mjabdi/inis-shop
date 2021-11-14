import checkToken from "../../utils/check-token";
import allowCors from "../../utils/allow-cors";
import axios from "axios";

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "GET":

        try {

          const result = await axios
          .get('https://api.pinksale.finance/api/v1/trending/top?chain_id=56');
  
          res.status(200).send({status: result.status, data: result.data})
            
        } catch (err) {
          res.status(400).send({ status: "FAILED", error: err.message });
        }
        break;
      default:
        res.status(404).send("invalid endpoint");
        break;
    }
  }
};

module.exports = allowCors(handler);

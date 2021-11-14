import checkToken from "../../utils/check-token";
import allowCors from "../../utils/allow-cors";
import axios from "axios";

const handler = async (req, res) => {
  if (checkToken(req, res)) {
    const { method } = req;

    switch (method) {
      case "POST":
        try {

          const result = await axios
          .post('https://api.pinksale.Finance/api/v1/view', {chain_id: 56, "pool_address": "0xB6B7DDA15543cCC4792616fdADE52f7220558d5A"}
          );


  
          res.status(200).send({status: result.status})
            
        } catch (err) {
          res.status(400).json({ status: "FAILED", error: err.message });
        }
        break;
      default:
        res.status(404).send("invalid endpoint");
        break;
    }
  }
};

module.exports = allowCors(handler);

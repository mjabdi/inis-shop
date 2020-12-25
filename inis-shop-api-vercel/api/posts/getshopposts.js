export default async function handler(req, res) {
    // Get data from your database


    res.status(200).json({status:'OK', posts :[]});
  }
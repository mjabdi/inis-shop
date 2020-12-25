import checkToken from '../../utils/check-token'

export default async function handler(req, res) {
    // Get data from your database

    if (checkToken(req,res))
    {
        res.status(200).json({status:'OK', posts :[]})
    }
}
  
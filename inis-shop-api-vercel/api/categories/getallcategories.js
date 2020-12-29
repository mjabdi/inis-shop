import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import Category from '../../models/Category'
import allowCors from '../../utils/allow-cors'

const handler = async (req, res) => {

    if (checkToken(req,res))
    {
        const { method } = req
        
        switch (method) {

            case 'GET':
                try
                {
                    await dbConnect()
                    const categories = await Category.find().sort({title: 1}).exec()
                    res.status(200).send({status: 'OK' , categories: categories})
                }
                catch(err)
                {
                    res.status(500).json({status:'FAILED', error : err.message})
                }
                break
            default:
                res.status(404).send('invalid endpoint')
                break
        }
    }
}
  
module.exports = allowCors(handler)
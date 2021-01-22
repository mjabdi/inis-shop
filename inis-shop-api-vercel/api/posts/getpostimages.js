import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import PostImage from '../../models/PostImage'
import allowCors from '../../utils/allow-cors';

const handler = async (req, res) => {
  
    if (checkToken(req,res))
    {
        const { method } = req
        
        switch (method) {

            case 'GET':
                try
                {
                    const post_id = req.query.post_id
                    if (!post_id)
                    {
                        res.status(400).send({status:'FAILED' , error: 'post_id is missing'});
                        return;
                    }
                    await dbConnect()
                    const postImages = await PostImage.find({parentId: post_id}).sort({timeStamp : -1}).exec()
               
                    res.status(200).send({status:'OK' , postImages: postImages})
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
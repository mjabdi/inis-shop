import checkToken from '../../utils/check-token'
import dbConnect from '../../utils/mongodb'
import Post from '../../models/Post'
import allowCors from '../../utils/allow-cors'

const handler = async (req, res) => {
  
    if (checkToken(req,res))
    {
        const { method } = req
        
        switch (method) {

            case 'GET':
                try
                {
                    const shop_id = req.query.shop_id
                    let page_size = parseInt(req.query.page_size || 12)
                    const after = parseInt(req.query.after || 0)
                    if (page_size > 50 || page_size <= 0)
                    {
                        page_size = 50
                    }
                    if (!shop_id)
                    {
                        res.status(400).send({status:'FAILED' , error: 'shop_id is missing'});
                        return;
                    }

                    await dbConnect()
                    const posts = await Post.find({shopId: shop_id}).sort({postTimeStamp : -1}).skip(after).limit(page_size).exec()
               
                    res.status(200).send({status:'OK' , count: posts.length, end_cursor: (posts.length === page_size) ? after + posts.length : null ,posts: posts})
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